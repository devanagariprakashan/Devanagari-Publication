import { createHmac, randomInt, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export type OtpPurpose = 'signup' | 'reset'

const TTL_MS = 10 * 60 * 1000
const RESEND_MS = 45 * 1000
const MAX_ATTEMPTS = 5

// Only a keyed hash of the code is stored, so a database leak doesn't expose live codes.
function hashCode(email: string, purpose: OtpPurpose, code: string) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-only-key'
  return createHmac('sha256', key).update(`${purpose}:${email}:${code}`).digest('hex')
}

export async function issueOtp(email: string, purpose: OtpPurpose): Promise<{ code: string } | { error: string }> {
  const admin = createAdminClient()
  const { data: latest } = await admin
    .from('email_otps')
    .select('created_at')
    .eq('email', email)
    .eq('purpose', purpose)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (latest && Date.now() - new Date(latest.created_at).getTime() < RESEND_MS) {
    return { error: 'Please wait a few seconds before requesting another code.' }
  }

  await admin.from('email_otps').delete().eq('email', email).eq('purpose', purpose)
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  const { error } = await admin.from('email_otps').insert({
    email,
    purpose,
    code_hash: hashCode(email, purpose, code),
    expires_at: new Date(Date.now() + TTL_MS).toISOString(),
  })
  if (error) return { error: 'Could not generate a verification code. Please try again.' }
  return { code }
}

export async function discardOtp(email: string, purpose: OtpPurpose) {
  await createAdminClient().from('email_otps').delete().eq('email', email).eq('purpose', purpose)
}

/** Checks a code. A correct code is consumed, so it can only be used once. */
export async function checkOtp(email: string, purpose: OtpPurpose, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient()
  const { data: row } = await admin
    .from('email_otps')
    .select('id, code_hash, attempts, expires_at')
    .eq('email', email)
    .eq('purpose', purpose)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!row) return { ok: false, error: 'No active code for this email. Please request a new one.' }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await admin.from('email_otps').delete().eq('id', row.id)
    return { ok: false, error: 'This code has expired. Please request a new one.' }
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await admin.from('email_otps').delete().eq('id', row.id)
    return { ok: false, error: 'Too many wrong attempts. Please request a new code.' }
  }

  const given = Buffer.from(hashCode(email, purpose, code.trim()))
  const stored = Buffer.from(row.code_hash)
  if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
    await admin.from('email_otps').update({ attempts: row.attempts + 1 }).eq('id', row.id)
    const left = MAX_ATTEMPTS - row.attempts - 1
    return { ok: false, error: left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.` : 'Too many wrong attempts. Please request a new code.' }
  }

  await admin.from('email_otps').delete().eq('id', row.id)
  return { ok: true }
}
