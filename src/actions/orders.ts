'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './books'

const STATUS_TIMESTAMP_COLUMN: Record<string, string> = {
  confirmed: 'confirmed_at',
  shipped: 'shipped_at',
  delivered: 'delivered_at',
  cancelled: 'cancelled_at',
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  const supabase = await createClient()
  const updates: Record<string, unknown> = { order_status: status }

  // Stamp the moment this status was first reached, so the fulfillment timeline can show a real
  // time instead of generic text — but never overwrite one that's already recorded (e.g. an admin
  // re-selecting "Shipped" after briefly switching status shouldn't reset the original ship time).
  const column = STATUS_TIMESTAMP_COLUMN[status]
  if (column) {
    const { data: existing } = await supabase.from('orders').select(column).eq('id', orderId).maybeSingle()
    if (existing && !(existing as unknown as Record<string, unknown>)[column]) {
      updates[column] = new Date().toISOString()
    }
  }

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}
