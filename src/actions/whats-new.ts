'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from './books'

const MAX_ACTIVE_SLIDES = 4
const MAX_ACTIVE_UPDATES = 8

async function countActive(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: 'whats_new_slides' | 'latest_updates',
  excludeId?: string
): Promise<number> {
  let query = supabase.from(table).select('id', { count: 'exact', head: true }).eq('is_active', true)
  if (excludeId) query = query.neq('id', excludeId)
  const { count } = await query
  return count ?? 0
}

export async function createSlide(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Title is required' }

  const is_active = formData.get('is_active') === 'on'
  if (is_active) {
    // ponytail: app-level cap, add a SQL trigger if abuse ever matters
    if ((await countActive(supabase, 'whats_new_slides')) >= MAX_ACTIVE_SLIDES) {
      return { error: 'Maximum 4 active slides. Deactivate one first.' }
    }
  }

  const { error } = await supabase.from('whats_new_slides').insert({
    id: `slide-${crypto.randomUUID()}`,
    badge: (formData.get('badge') as string) || null,
    kicker: (formData.get('kicker') as string) || null,
    title,
    subtitle: (formData.get('subtitle') as string) || null,
    cta: (formData.get('cta') as string) || null,
    href: (formData.get('href') as string) || null,
    cover: (formData.get('cover') as string) || null,
    sort: Number(formData.get('sort')) || 0,
    is_active,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/whats-new')
  revalidatePath('/')
  redirect('/admin/whats-new')
}

export async function updateSlide(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Slide id is required' }

  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Title is required' }

  const is_active = formData.get('is_active') === 'on'
  if (is_active) {
    // ponytail: app-level cap, add a SQL trigger if abuse ever matters
    if ((await countActive(supabase, 'whats_new_slides', id)) >= MAX_ACTIVE_SLIDES) {
      return { error: 'Maximum 4 active slides. Deactivate one first.' }
    }
  }

  const { error } = await supabase
    .from('whats_new_slides')
    .update({
      badge: (formData.get('badge') as string) || null,
      kicker: (formData.get('kicker') as string) || null,
      title,
      subtitle: (formData.get('subtitle') as string) || null,
      cta: (formData.get('cta') as string) || null,
      href: (formData.get('href') as string) || null,
      cover: (formData.get('cover') as string) || null,
      sort: Number(formData.get('sort')) || 0,
      is_active,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/whats-new')
  revalidatePath('/')
  redirect('/admin/whats-new')
}

export async function deleteSlide(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('whats_new_slides').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/whats-new')
  revalidatePath('/')
  return { success: true }
}

export async function createUpdate(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Title is required' }

  const is_active = formData.get('is_active') === 'on'
  if (is_active) {
    // ponytail: app-level cap, add a SQL trigger if abuse ever matters
    if ((await countActive(supabase, 'latest_updates')) >= MAX_ACTIVE_UPDATES) {
      return { error: 'Maximum 8 active updates. Deactivate one first.' }
    }
  }

  const { error } = await supabase.from('latest_updates').insert({
    id: `update-${crypto.randomUUID()}`,
    title,
    note: (formData.get('note') as string) || null,
    date_text: (formData.get('date_text') as string) || null,
    image: (formData.get('image') as string) || null,
    href: (formData.get('href') as string) || null,
    sort: Number(formData.get('sort')) || 0,
    is_active,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/whats-new')
  revalidatePath('/')
  redirect('/admin/whats-new')
}

export async function updateUpdate(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Update id is required' }

  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Title is required' }

  const is_active = formData.get('is_active') === 'on'
  if (is_active) {
    // ponytail: app-level cap, add a SQL trigger if abuse ever matters
    if ((await countActive(supabase, 'latest_updates', id)) >= MAX_ACTIVE_UPDATES) {
      return { error: 'Maximum 8 active updates. Deactivate one first.' }
    }
  }

  const { error } = await supabase
    .from('latest_updates')
    .update({
      title,
      note: (formData.get('note') as string) || null,
      date_text: (formData.get('date_text') as string) || null,
      image: (formData.get('image') as string) || null,
      href: (formData.get('href') as string) || null,
      sort: Number(formData.get('sort')) || 0,
      is_active,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/whats-new')
  revalidatePath('/')
  redirect('/admin/whats-new')
}

export async function deleteUpdate(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('latest_updates').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/whats-new')
  revalidatePath('/')
  return { success: true }
}
