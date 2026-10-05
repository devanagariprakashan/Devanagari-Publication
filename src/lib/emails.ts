// HTML bodies for the transactional emails. Inline styles only — email clients ignore stylesheets.

const BRAND = '#C61821'

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const money = (n: number) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`

function layout(title: string, body: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f5f4;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e4;">
        <tr><td style="background:${BRAND};padding:18px 28px;color:#ffffff;font-size:18px;font-weight:bold;">Devanagari Publications</td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:#1c1917;">${escapeHtml(title)}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#fafaf9;color:#78716c;font-size:12px;">
          This is an automated message from Devanagari Publications. Please don't reply to this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function otpEmail(code: string, purpose: 'signup' | 'reset', name?: string) {
  const signup = purpose === 'signup'
  const subject = signup ? 'Verify your email - Devanagari Publications' : 'Reset your password - Devanagari Publications'
  const intro = signup
    ? `Hi${name ? ` ${escapeHtml(name.split(' ')[0])}` : ''}, use this code to verify your email and finish creating your account.`
    : 'Use this code to reset your password.'
  const html = layout(
    signup ? 'Verify your email' : 'Reset your password',
    `<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#44403c;">${intro}</p>
     <div style="text-align:center;margin:0 0 20px;">
       <span style="display:inline-block;padding:14px 28px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;font-size:32px;letter-spacing:8px;font-weight:bold;color:${BRAND};">${escapeHtml(code)}</span>
     </div>
     <p style="margin:0 0 8px;font-size:13px;color:#57534e;">This code is valid for 10 minutes and can be used once.</p>
     <p style="margin:0;font-size:13px;color:#78716c;">If you didn't ask for this, you can safely ignore this email.</p>`,
  )
  const text = `${signup ? 'Your verification code' : 'Your password reset code'} is ${code}. It is valid for 10 minutes. If you didn't request it, ignore this email.`
  return { subject, html, text }
}

export type OrderEmailData = {
  order_number: string
  customer_name: string | null
  total_amount: number
  subtotal_amount: number | null
  discount_amount: number | null
  shipping_charge: number | null
  cod_fee: number | null
  coupon_code: string | null
  payment_method: string | null
  payment_status: string | null
  shipping_method: string | null
  shipping_address: string | null
  landmark: string | null
  city: string | null
  state: string | null
  pincode: string | null
  created_at: string
  items: { product_name: string; quantity: number; unit_price: number }[]
}

export function orderConfirmationEmail(order: OrderEmailData, siteUrl: string) {
  const isCod = order.payment_method === 'cod'
  const firstName = (order.customer_name || 'there').split(' ')[0]
  const address = [order.shipping_address, order.landmark, order.city, [order.state, order.pincode].filter(Boolean).join(' - ')]
    .filter(Boolean)
    .join(', ')

  const rows = order.items
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f5f5f4;font-size:14px;color:#1c1917;">${escapeHtml(item.product_name)}<br><span style="font-size:12px;color:#78716c;">Qty ${item.quantity} x ${money(item.unit_price)}</span></td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #f5f5f4;font-size:14px;font-weight:bold;color:#1c1917;">${money(item.unit_price * item.quantity)}</td>
      </tr>`,
    )
    .join('')

  const line = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;font-size:${strong ? 15 : 13}px;color:${strong ? '#1c1917' : '#57534e'};${strong ? 'font-weight:bold;' : ''}">${label}</td><td align="right" style="padding:4px 0;font-size:${strong ? 15 : 13}px;color:#1c1917;${strong ? 'font-weight:bold;' : ''}">${value}</td></tr>`

  const totals = [
    order.subtotal_amount != null ? line('Subtotal', money(order.subtotal_amount)) : '',
    Number(order.discount_amount) > 0 ? line(`Discount${order.coupon_code ? ` (${escapeHtml(order.coupon_code)})` : ''}`, `-${money(Number(order.discount_amount))}`) : '',
    line('Shipping', Number(order.shipping_charge) > 0 ? money(Number(order.shipping_charge)) : 'Free'),
    Number(order.cod_fee) > 0 ? line('Cash on Delivery fee', money(Number(order.cod_fee))) : '',
    line(isCod ? 'Amount to pay on delivery' : 'Total paid', money(order.total_amount), true),
  ].join('')

  const html = layout(
    'Thank you for your order',
    `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#44403c;">Hi ${escapeHtml(firstName)}, we've received your order and it is being prepared. Here are the details.</p>
     <div style="margin:0 0 20px;padding:12px 16px;background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;font-size:13px;color:#57534e;">
       Order number <strong style="color:#1c1917;">${escapeHtml(order.order_number)}</strong><br>
       Placed on ${escapeHtml(new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))}<br>
       Payment: <strong style="color:#1c1917;">${isCod ? 'Cash on Delivery' : order.payment_status === 'paid' ? 'Paid online' : 'Online'}</strong>
     </div>
     <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">${totals}</table>
     <p style="margin:20px 0 4px;font-size:13px;font-weight:bold;color:#1c1917;">Delivering to</p>
     <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#57534e;">${escapeHtml(order.customer_name)}<br>${escapeHtml(address)}</p>
     <div style="text-align:center;margin:24px 0 8px;">
       <a href="${escapeHtml(siteUrl)}/account" style="display:inline-block;padding:12px 28px;background:${BRAND};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Track your order</a>
     </div>
     <p style="margin:12px 0 0;font-size:12px;color:#78716c;text-align:center;">Log in to My Orders to see live shipment tracking once your parcel is dispatched.</p>`,
  )

  const text = [
    `Thank you for your order, ${firstName}!`,
    `Order ${order.order_number}`,
    ...order.items.map((i) => `${i.product_name} x ${i.quantity} - ${money(i.unit_price * i.quantity)}`),
    `${isCod ? 'Amount to pay on delivery' : 'Total paid'}: ${money(order.total_amount)}`,
    `Delivering to: ${address}`,
    `Track your order: ${siteUrl}/account`,
  ].join('\n')

  return { subject: `Order confirmed - ${order.order_number}`, html, text }
}
