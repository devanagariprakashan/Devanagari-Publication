'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/brevo'
import { otpEmail } from '@/lib/emails'
import { checkOtp, discardOtp, issueOtp } from '@/lib/otp'

export type CustomerSession = { name: string; email: string; phone: string }
export type CustomerAuthResult = { error: string } | { user: CustomerSession }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const digits = (value: string) => value.replace(/\D/g, '')
// Phones are stored as the bare 10-digit number so "+91 98765 43210" and "9876543210" are the same account.
const normalizePhone = (value: string) => digits(value).slice(-10)

type RegisterInput = { fullName: string; email: string; phone: string; password: string }

// Shared by "send code" and "create account" so both reject the same bad input and duplicates.
async function validateRegistration(input: RegisterInput): Promise<{ error: string } | null> {
  const fullName = input.fullName.trim()
  const email = input.email.trim().toLowerCase()
  if (!fullName) return { error: 'Please enter your full name' }
  if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address' }
  if (digits(input.phone).length < 10) return { error: 'Please enter a valid phone number' }
  if (input.password.length < 6) return { error: 'Password should be at least 6 characters long' }

  const admin = createAdminClient()
  const { data: emailOwner } = await admin.from('profiles').select('id').eq('email', email).limit(1)
  if (emailOwner?.length) return { error: 'An account with this email already exists. Please log in.' }
  const { data: phoneOwner } = await admin.from('profiles').select('id').eq('phone', normalizePhone(input.phone)).limit(1)
  if (phoneOwner?.length) return { error: 'An account with this phone number already exists. Please log in.' }
  return null
}

/** Step 1 of signup: checks the details and emails a 6-digit code. Nothing is created yet. */
export async function requestSignupOtp(input: RegisterInput): Promise<{ error: string } | { success: true }> {
  const problem = await validateRegistration(input)
  if (problem) return problem
  const email = input.email.trim().toLowerCase()

  const issued = await issueOtp(email, 'signup')
  if ('error' in issued) return issued
  const mail = otpEmail(issued.code, 'signup', input.fullName.trim())
  const sent = await sendEmail({ to: email, ...mail })
  if (!sent.ok) {
    console.error('Signup OTP email failed', sent.error)
    await discardOtp(email, 'signup')
    return { error: 'We could not send the verification email. Please check the address and try again.' }
  }
  return { success: true }
}

/** Step 2 of signup: the emailed code proves the address is theirs, then the account is created and signed in. */
export async function customerRegister(input: RegisterInput & { code: string }): Promise<CustomerAuthResult> {
  const fullName = input.fullName.trim()
  const email = input.email.trim().toLowerCase()
  const phone = input.phone.trim()
  const problem = await validateRegistration(input)
  if (problem) return problem
  // A page opened before the OTP step existed still calls this without a code; treat that as "no code" rather than crashing.
  const code = typeof input.code === 'string' ? input.code.trim() : ''
  if (!/^\d{6}$/.test(code)) return { error: 'Please enter the 6-digit code from your email. If this page was open for a while, refresh it and register again.' }

  const verified = await checkOtp(email, 'signup', code)
  if (!verified.ok) return { error: verified.error }

  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (createError || !created.user) {
    const exists = /already|registered|exists/i.test(createError?.message ?? '')
    return { error: exists ? 'An account with this email already exists. Please log in.' : 'Could not create your account. Please try again.' }
  }

  const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: created.user.id, email, full_name: fullName, phone: normalizePhone(phone), role: 'customer' })
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id)
    return { error: 'Could not create your account. Please try again.' }
  }

  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: input.password })
  if (signInError) return { error: 'Account created, but sign-in failed. Please log in.' }
  return { user: { name: fullName, email, phone } }
}

export async function customerLogin(input: { identifier: string; password: string }): Promise<CustomerAuthResult> {
  const email = input.identifier.trim().toLowerCase()
  if (!email) return { error: 'Please enter your email address' }
  if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address' }
  if (!input.password) return { error: 'Please enter your password' }

  const admin = createAdminClient()
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: input.password })
  if (error || !data.user) {
    // Tell the visitor which part is wrong: an unregistered email should be pointed to Register, not told the password is bad.
    const { data: known } = await admin.from('profiles').select('id').eq('email', email).limit(1)
    return { error: known?.length ? 'Incorrect password. Please try again.' : 'No account found with this email. Please register first.' }
  }

  const { data: profile } = await admin.from('profiles').select('full_name, phone, is_active').eq('id', data.user.id).maybeSingle()
  if (profile && profile.is_active === false) {
    await supabase.auth.signOut()
    return { error: 'This account has been deactivated. Please contact support.' }
  }
  return {
    user: {
      name: profile?.full_name || (data.user.user_metadata?.full_name as string) || email.split('@')[0],
      email,
      phone: profile?.phone || '',
    },
  }
}

/** Emails a reset code. The answer is the same whether or not the email has an account, so it can't be used to probe. */
export async function requestPasswordReset(emailInput: string): Promise<{ error: string } | { success: true }> {
  const email = emailInput.trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address' }

  const admin = createAdminClient()
  // Admin accounts are not reset from the storefront.
  const { data: profile } = await admin.from('profiles').select('full_name, role').eq('email', email).maybeSingle()
  if (profile && profile.role === 'customer') {
    const issued = await issueOtp(email, 'reset')
    if ('error' in issued) return issued
    const sent = await sendEmail({ to: email, ...otpEmail(issued.code, 'reset', profile.full_name ?? undefined) })
    if (!sent.ok) {
      console.error('Password reset email failed', sent.error)
      await discardOtp(email, 'reset')
      return { error: 'We could not send the email right now. Please try again in a moment.' }
    }
  }
  return { success: true }
}

export async function resetPassword(input: { email: string; code: string; password: string }): Promise<{ error: string } | { success: true }> {
  const email = input.email.trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address' }
  const code = typeof input.code === 'string' ? input.code.trim() : ''
  if (!/^\d{6}$/.test(code)) return { error: 'Please enter the 6-digit code from your email' }
  if (input.password.length < 6) return { error: 'Password should be at least 6 characters long' }

  const verified = await checkOtp(email, 'reset', code)
  if (!verified.ok) return { error: verified.error }

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('id, role').eq('email', email).maybeSingle()
  if (!profile || profile.role !== 'customer') return { error: 'Could not reset the password. Please try again.' }
  const { error } = await admin.auth.admin.updateUserById(profile.id, { password: input.password })
  if (error) return { error: 'Could not reset the password. Please try again.' }
  return { success: true }
}

export async function customerLogout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

/** The signed-in customer according to the server session (not browser storage), or null. */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user?.email) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('full_name, phone').eq('id', user.id).maybeSingle()
  return {
    name: profile?.full_name || (user.user_metadata?.full_name as string) || user.email.split('@')[0],
    email: user.email,
    phone: profile?.phone || '',
  }
}
