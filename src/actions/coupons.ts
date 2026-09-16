'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from './books'

function parseCoupon(formData: FormData) {
  const code = ((formData.get('code') as string) || '').trim().toUpperCase()
  const title = ((formData.get('title') as string) || '').trim() || null
  const discount_type = (formData.get('discount_type') as string) === 'fixed' ? 'fixed' : 'percent'
  const discount_value = Number(formData.get('discount_value') || 0)
  const min_amount = Number(formData.get('min_amount') || 0)
  const is_active = formData.get('is_active') === 'on'
  const is_featured = formData.get('is_featured') === 'on'
  return { code, title, discount_type, discount_value, min_amount, is_active, is_featured }
}

export async function createCoupon(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const fields = parseCoupon(formData)
  if (!fields.code) return { error: 'Code is required' }
  if (!Number.isFinite(fields.discount_value) || fields.discount_value < 0) return { error: 'Discount value must be 0 or more' }
  if (!Number.isFinite(fields.min_amount) || fields.min_amount < 0) return { error: 'Minimum amount must be 0 or more' }

  const id = crypto.randomUUID()
  if (fields.is_featured) {
    const { error } = await supabase.from('coupons').update({ is_featured: false }).neq('id', id)
    if (error) return { error: error.message }
  }

  const { error } = await supabase.from('coupons').insert({ id, ...fields })
  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  redirect('/admin/coupons')
}

export async function updateCoupon(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = (formData.get('id') as string) || ''
  if (!id) return { error: 'Coupon id is required' }

  const fields = parseCoupon(formData)
  if (!fields.code) return { error: 'Code is required' }
  if (!Number.isFinite(fields.discount_value) || fields.discount_value < 0) return { error: 'Discount value must be 0 or more' }
  if (!Number.isFinite(fields.min_amount) || fields.min_amount < 0) return { error: 'Minimum amount must be 0 or more' }

  if (fields.is_featured) {
    const { error } = await supabase.from('coupons').update({ is_featured: false }).neq('id', id)
    if (error) return { error: error.message }
  }

  const { error } = await supabase.from('coupons').update(fields).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  redirect('/admin/coupons')
}

export async function updateCouponStatus(id: string, status: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('coupons').update({ is_active: status === 'active' }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}
