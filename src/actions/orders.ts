'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './books'

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', orderId)
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
