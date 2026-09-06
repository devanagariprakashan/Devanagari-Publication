'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from './books'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
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
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}
