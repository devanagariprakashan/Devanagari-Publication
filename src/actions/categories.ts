'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from './books'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const NAV_GROUPS = ['exams', 'academic', 'leisure']

function navFields(formData: FormData) {
  const navGroup = (formData.get('nav_group') as string) || ''
  const sortOrder = Number((formData.get('sort_order') as string) || 0)
  return {
    hindi_name: (formData.get('hindi_name') as string) || null,
    nav_group: NAV_GROUPS.includes(navGroup) ? navGroup : null,
    nav_icon: (formData.get('nav_icon') as string) || null,
    nav_badge: (formData.get('nav_badge') as string) || null,
    nav_color: (formData.get('nav_color') as string) || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  }
}

export async function createCategory(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const name = (formData.get('name') as string) || ''
  if (!name) return { error: 'Name is required' }

  const { error } = await supabase.from('categories').insert({
    id: crypto.randomUUID(),
    name,
    slug: slugify(name),
    description: (formData.get('description') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    ...navFields(formData),
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategory(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Category id is required' }

  const name = (formData.get('name') as string) || ''
  if (!name) return { error: 'Name is required' }

  const { error } = await supabase.from('categories').update({
    name,
    slug: slugify(name),
    description: (formData.get('description') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    ...navFields(formData),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  // Books referencing this category would block the delete (foreign key) — uncategorize them instead of deleting them.
  const { error: unlinkError } = await supabase.from('books').update({ category_id: null }).eq('category_id', id)
  if (unlinkError) return { error: unlinkError.message }
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  return { success: true }
}
