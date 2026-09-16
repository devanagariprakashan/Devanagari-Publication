'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './books'

export async function submitInquiry(input: { name: string; phone: string; email?: string; subject?: string; message: string }): Promise<ActionResult> {
  const name = input.name.trim()
  const phone = input.phone.trim()
  const email = input.email?.trim().toLowerCase() || null
  const message = `${input.subject?.trim() ? `Subject: ${input.subject.trim()}\n` : ''}${input.message.trim()}`
  if (!name || !phone || !input.message.trim()) return { error: 'Name, phone, and message are required' }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email address' }
  const supabase = await createClient()
  const { error } = await supabase.from('inquiries').insert({
    id: crypto.randomUUID(), name, phone, email, message, status: 'unread',
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/inquiries')
  return { success: true }
}

export async function updateInquiryStatus(id: string, status: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/inquiries')
  return { success: true }
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('inquiries').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/inquiries')
  return { success: true }
}
