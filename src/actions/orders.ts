'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { syncOrderStatusesFromIthink } from '@/lib/ithink-sync'
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

// Orders aren't publicly readable, so this runs with the service role — but only ever for the email of the
// signed-in session, never for an email supplied by the browser.
export async function getAccountOrders() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const cleanEmail = auth.user?.email?.trim().toLowerCase() ?? ''
  if (!cleanEmail) return []
  // Pull the latest courier status first so the customer sees "Shipped"/"Delivered" without waiting for the admin (throttled).
  await syncOrderStatusesFromIthink({ email: cleanEmail }).catch(() => undefined)
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('orders')
    .select('*, order_items(id, book_id, quantity, product_name, product_sku, unit_price, books(image_url, author))')
    .eq('customer_email', cleanEmail)
    .order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export async function getInvoiceOrder(orderId: string) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const sessionEmail = auth.user?.email?.toLowerCase()
  if (!sessionEmail) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('orders')
    .select('*, order_items(id, product_name, quantity, unit_price)')
    .eq('id', orderId)
    .maybeSingle()
  if (!data) return null
  // Customers may only open their own invoices; admins can open any.
  if ((data.customer_email ?? '').toLowerCase() === sessionEmail) return data
  const { data: profile } = await admin.from('profiles').select('role').eq('id', auth.user!.id).maybeSingle()
  return profile?.role === 'admin' ? data : null
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}
