'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './books'

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
