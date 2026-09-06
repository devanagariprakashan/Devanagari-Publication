'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ActionResult = { error?: string; success?: boolean }

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function boolFromForm(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on'
}

export async function createBook(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const title = (formData.get('title') as string) || ''
  if (!title) return { error: 'Title is required' }

  const price = parseFloat((formData.get('price') as string) || '0') || 0
  const original_price = (formData.get('original_price') as string) || null
  const discount_percent = parseInt((formData.get('discount_percent') as string) || '0', 10) || 0
  const rating = parseFloat((formData.get('rating') as string) || '0') || 0
  const reviews_count = parseInt((formData.get('reviews_count') as string) || '0', 10) || 0
  const pages = (formData.get('pages') as string) || null

  const { error } = await supabase.from('books').insert({
    id: crypto.randomUUID(),
    slug: slugify(title),
    title,
    hindi_title: (formData.get('hindi_title') as string) || null,
    subtitle: (formData.get('subtitle') as string) || null,
    author: (formData.get('author') as string) || null,
    category_id: (formData.get('category_id') as string) || null,
    isbn: (formData.get('isbn') as string) || null,
    edition: (formData.get('edition') as string) || null,
    language: (formData.get('language') as string) || null,
    exam: (formData.get('exam') as string) || null,
    format: (formData.get('format') as string) || null,
    price,
    original_price: original_price ? parseFloat(original_price) : null,
    discount_percent,
    rating,
    reviews_count,
    badge: (formData.get('badge') as string) || null,
    badge_color: (formData.get('badge_color') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    description: (formData.get('description') as string) || null,
    highlights: (formData.get('highlights') as string) ? JSON.parse(formData.get('highlights') as string) : null,
    pages: pages ? parseInt(pages, 10) : null,
    publication: (formData.get('publication') as string) || null,
    binding: (formData.get('binding') as string) || null,
    in_stock: boolFromForm(formData, 'in_stock'),
    is_bestseller: boolFromForm(formData, 'is_bestseller'),
    is_new_release: boolFromForm(formData, 'is_new_release'),
    is_featured: boolFromForm(formData, 'is_featured'),
    show_in_hero: boolFromForm(formData, 'show_in_hero'),
    is_active: boolFromForm(formData, 'is_active'),
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/books')
  redirect('/admin/books')
}

export async function updateBook(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Book id is required' }

  const title = (formData.get('title') as string) || ''
  if (!title) return { error: 'Title is required' }

  const price = parseFloat((formData.get('price') as string) || '0') || 0
  const original_price = (formData.get('original_price') as string) || null
  const discount_percent = parseInt((formData.get('discount_percent') as string) || '0', 10) || 0
  const rating = parseFloat((formData.get('rating') as string) || '0') || 0
  const reviews_count = parseInt((formData.get('reviews_count') as string) || '0', 10) || 0
  const pages = (formData.get('pages') as string) || null

  const { error } = await supabase.from('books').update({
    slug: slugify(title),
    title,
    hindi_title: (formData.get('hindi_title') as string) || null,
    subtitle: (formData.get('subtitle') as string) || null,
    author: (formData.get('author') as string) || null,
    category_id: (formData.get('category_id') as string) || null,
    isbn: (formData.get('isbn') as string) || null,
    edition: (formData.get('edition') as string) || null,
    language: (formData.get('language') as string) || null,
    exam: (formData.get('exam') as string) || null,
    format: (formData.get('format') as string) || null,
    price,
    original_price: original_price ? parseFloat(original_price) : null,
    discount_percent,
    rating,
    reviews_count,
    badge: (formData.get('badge') as string) || null,
    badge_color: (formData.get('badge_color') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    description: (formData.get('description') as string) || null,
    highlights: (formData.get('highlights') as string) ? JSON.parse(formData.get('highlights') as string) : null,
    pages: pages ? parseInt(pages, 10) : null,
    publication: (formData.get('publication') as string) || null,
    binding: (formData.get('binding') as string) || null,
    in_stock: boolFromForm(formData, 'in_stock'),
    is_bestseller: boolFromForm(formData, 'is_bestseller'),
    is_new_release: boolFromForm(formData, 'is_new_release'),
    is_featured: boolFromForm(formData, 'is_featured'),
    show_in_hero: boolFromForm(formData, 'show_in_hero'),
    is_active: boolFromForm(formData, 'is_active'),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/books')
  redirect('/admin/books')
}

export async function deleteBook(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/books')
  return { success: true }
}
