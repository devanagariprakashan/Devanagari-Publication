const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

export type SendEmailArgs = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export type SendEmailResult = { ok: true; messageId?: string } | { ok: false; error: string }

export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || senderEmail

  if (!apiKey) return { ok: false, error: 'BREVO_API_KEY is not set' }
  if (!senderEmail) return { ok: false, error: 'BREVO_SENDER_EMAIL is not set' }

  const recipients = (Array.isArray(args.to) ? args.to : [args.to]).map((email) => ({ email }))

  const res = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: recipients,
      subject: args.subject,
      htmlContent: args.html,
      ...(args.text ? { textContent: args.text } : {}),
      ...(args.replyTo ? { replyTo: { email: args.replyTo } } : {}),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, error: `Brevo ${res.status}: ${body.slice(0, 300)}` }
  }

  const data = (await res.json().catch(() => ({}))) as { messageId?: string }
  return { ok: true, messageId: data.messageId }
}
