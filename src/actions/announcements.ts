'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from './books'

export async function createAnnouncement(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const text = (formData.get('text') as string) || ''
  if (!text) return { error: 'Text is required' }

  const { error } = await supabase.from('announcements').insert({ id: crypto.randomUUID(), text })
  if (error) return { error: error.message }
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function updateAnnouncement(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Announcement id is required' }

  const text = (formData.get('text') as string) || ''
  if (!text) return { error: 'Text is required' }

  const { error } = await supabase.from('announcements').update({ text }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/announcements')
  return { success: true }
}
