'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './books'

export async function deleteReview(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/reviews')
  return { success: true }
}
