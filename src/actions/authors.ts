'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from './books'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function createAuthor(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const name = (formData.get('name') as string) || ''
  if (!name) return { error: 'Name is required' }

  const { error } = await supabase.from('authors').insert({
    id: `${slugify(name)}-${crypto.randomUUID()}`,
    name,
    role: (formData.get('role') as string) || null,
    short_role: (formData.get('short_role') as string) || null,
    bio: (formData.get('bio') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    youtube_url: (formData.get('youtube_url') as string) || null,
    linkedin_url: (formData.get('linkedin_url') as string) || null,
    twitter_url: (formData.get('twitter_url') as string) || null,
    instagram_url: (formData.get('instagram_url') as string) || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/authors')
  redirect('/admin/authors')
}

export async function updateAuthor(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Author id is required' }

  const name = (formData.get('name') as string) || ''
  if (!name) return { error: 'Name is required' }

  const { error } = await supabase.from('authors').update({
    name,
    role: (formData.get('role') as string) || null,
    short_role: (formData.get('short_role') as string) || null,
    bio: (formData.get('bio') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    youtube_url: (formData.get('youtube_url') as string) || null,
    linkedin_url: (formData.get('linkedin_url') as string) || null,
    twitter_url: (formData.get('twitter_url') as string) || null,
    instagram_url: (formData.get('instagram_url') as string) || null,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/authors')
  redirect('/admin/authors')
}

export async function deleteAuthor(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('authors').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/authors')
  return { success: true }
}
