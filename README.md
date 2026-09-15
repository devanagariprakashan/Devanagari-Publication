This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Team and Blog content

Run `page-content-migration.sql` in the Supabase SQL editor before saving content from `/admin/team` or `/admin/blog`. Existing page content remains the default until the first save. The editors support page text, section buttons, entries, banner colours, and display order. Only admins can save; public visitors can read published content.

The homepage carousel is managed at `/admin/hero` (Hero Section). For an existing installation, run `hero-content-migration.sql` to allow the new content entry. Use existing product IDs for working product links. An empty carousel list hides all moving books.

Run `book-media-migration.sql` before saving books with the new demo fields. Manage Demo File and Demo Video under Admin > Books > Edit > Book demos. PDF links open in a new tab; existing sample pages are used when no demo file is set. Video links open separately. The Demo Video button stays disabled until a video link is supplied.

## PayU payments

Run `payu-migration.sql` in Supabase before accepting online payments. Copy `payu-env.example` into the local environment and set the PayU test key and salt. The checkout creates the transaction and hash on the server, posts to PayU, and verifies the signed callback before marking an order paid. The PayU payment webhook endpoint is `https://www.devanagripublications.com/api/payu/webhook`; configure it for successful and failed payment events in the PayU dashboard. The webhook validates the PayU hash, transaction ID, amount, and safely ignores duplicate notifications. Use `https://test.payu.in/_payment` for testing and switch both the endpoint and credentials together for production.

## iThink Logistics

Run `ithink-migration.sql` in Supabase before enabling shipment creation. Add the values from `ithink-env.example` to the server environment. The application stores order items and creates an iThink shipment after a confirmed PayU payment when all iThink values are configured. Missing iThink credentials leave the payment flow working without creating a shipment.
