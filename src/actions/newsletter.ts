'use server'

import crypto from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './books'

export async function subscribeToNewsletter(emailInput: string): Promise<ActionResult> {
  const email = emailInput.trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email address' }
  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_subscribers').upsert({ id: crypto.randomUUID(), email, status: 'active' }, { onConflict: 'email', ignoreDuplicates: false })
  if (error) return { error: error.message }
  revalidatePath('/admin/newsletter')
  return { success: true }
}

export async function updateNewsletterStatus(id: string, status: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_subscribers').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/newsletter')
  return { success: true }
}

export async function deleteNewsletterSubscriber(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/newsletter')
  return { success: true }
}
