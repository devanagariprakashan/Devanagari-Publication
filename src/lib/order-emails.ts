import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/brevo'
import { orderConfirmationEmail, type OrderEmailData } from '@/lib/emails'

/** Public site address for links inside emails: NEXT_PUBLIC_SITE_URL if set, otherwise the address the request came in on. */
export function siteUrlFrom(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')
  return configured || new URL(request.url).origin
}

/**
 * Sends the order confirmation once per order. The flag is claimed atomically first, so the PayU callback and
 * webhook (which both fire for one payment) can't double-send. A failed send releases the claim.
 */
export async function sendOrderConfirmation(orderId: string, siteUrl: string): Promise<void> {
  const admin = createAdminClient()
  try {
    const { data: claimed } = await admin
      .from('orders')
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq('id', orderId)
      .is('confirmation_email_sent_at', null)
      .select(
        'order_number, customer_name, customer_email, total_amount, subtotal_amount, discount_amount, shipping_charge, cod_fee, coupon_code, payment_method, payment_status, shipping_method, shipping_address, landmark, city, state, pincode, created_at',
      )
      .maybeSingle()
    if (!claimed?.customer_email) return

    const { data: items } = await admin
      .from('order_items')
      .select('product_name, quantity, unit_price')
      .eq('order_id', orderId)

    const { customer_email, ...order } = claimed
    const mail = orderConfirmationEmail({ ...(order as Omit<OrderEmailData, 'items'>), items: items ?? [] }, siteUrl)
    const result = await sendEmail({ to: customer_email, ...mail })
    if (!result.ok) {
      console.error('Order confirmation email failed', result.error)
      await admin.from('orders').update({ confirmation_email_sent_at: null }).eq('id', orderId)
    }
  } catch (error) {
    console.error('Order confirmation email failed', error)
    await admin.from('orders').update({ confirmation_email_sent_at: null }).eq('id', orderId)
  }
}
