import { sendEmail } from '../src/lib/brevo.ts'

const to = process.argv[2]
if (!to) {
  console.error('usage: node --env-file=.env scripts/test-brevo.ts <email>')
  process.exit(1)
}

const result = await sendEmail({
  to,
  subject: 'Brevo setup test',
  html: '<p>Brevo is configured and sending correctly.</p>',
  text: 'Brevo is configured and sending correctly.',
})

console.log(result)
if (!result.ok) process.exit(1)
