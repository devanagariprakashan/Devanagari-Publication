'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SITE_DEFAULTS } from '@/lib/site-settings'
import type { ActionResult } from './books'

/** Shows or hides the homepage "What's New" section without touching any other store setting. */
export async function setWhatsNewVisible(visible: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: existing, error: readError } = await supabase.from('site_settings').select('id').eq('id', 1).maybeSingle()
  if (readError) return { error: readError.message }

  // With no settings row yet, create it from the defaults so the other values aren't left empty.
  const { error } = existing
    ? await supabase.from('site_settings').update({ whats_new_enabled: visible }).eq('id', 1)
    : await supabase.from('site_settings').insert({ ...SITE_DEFAULTS, id: 1, whats_new_enabled: visible })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/settings')
  revalidatePath('/admin/hero')
  revalidatePath('/admin/whats-new')
  return { success: true }
}
