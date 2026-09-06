'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export type AuthResult = { error?: string; success?: boolean }

export async function adminLogin(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  const email = (formData.get('email') as string) || ''
  const password = (formData.get('password') as string) || ''
  if (!email || !password) return { error: 'Email and password are required' }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@devanagari.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

  const signInRes = await supabase.auth.signInWithPassword({ email, password })
  let data = signInRes.data
  let error = signInRes.error

  // Auto-seed admin user on first login when env credentials match.
  if (error && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = createAdminClient()
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { role: 'admin', full_name: 'Admin' }
      })
      if (!createError && newUser?.user) {
        const retry = await supabase.auth.signInWithPassword({ email, password })
        data = retry.data
        error = retry.error
      }
    } catch {}
  }

  if (error || !data?.user) return { error: error?.message || 'Invalid credentials' }

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle()
  if (email.toLowerCase() === adminEmail.toLowerCase()) {
    if (!profile) {
      const { data: np, error: ie } = await supabase.from('profiles')
        .insert({ id: data.user.id, email: email.toLowerCase(), full_name: 'Admin', role: 'admin' })
        .select('*').single()
      if (!ie) profile = np
    } else if (profile.role !== 'admin') {
      const { data: up, error: ue } = await supabase.from('profiles')
        .update({ role: 'admin' }).eq('id', data.user.id).select('*').single()
      if (!ue) profile = up
    }
  }

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'You do not have admin access' }
  }

  const cookieStore = await cookies()
  cookieStore.set('devanagari-user-session', JSON.stringify({
    id: data.user.id, email: data.user.email, full_name: profile.full_name || 'Admin', role: 'admin'
  }), { path: '/', httpOnly: false, secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 })

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}
