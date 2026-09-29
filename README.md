# Atlitim

Atlitim is a community directory for local businesses and services in Atlit, Israel.

Residents can search without an account. Businesses are published only after a person reviews the submission.

Hebrew, RTL, mobile first.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- A local demo catalog only when Supabase is not configured and the app is not running in production

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo admin, local development only: [http://localhost:3000/admin](http://localhost:3000/admin)

Default demo password while `npm run dev` is running without Supabase: `atlitim-demo` (or `DEMO_ADMIN_PASSWORD`). Production ignores this password.

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata and the sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | For live data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live data | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For admin writes | Server-only service role key |
| `ADMIN_EMAILS` | For live admin | Comma-separated allowlist |
| `ADMIN_SESSION_SECRET` | Local demo only | Signs the local demo admin cookie |
| `DEMO_ADMIN_PASSWORD` | Local demo only | Ignored in production |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No | Any non-empty value enables event posting |
| `ANALYTICS_WEBHOOK_URL` | No | Where allowed events are forwarded |

If the Supabase URL or anon key is missing during `npm run dev`, the app runs in **demo mode**.

In production, missing Supabase configuration is an error. The site does not fall back to fictional businesses. A failed Supabase request is logged on the server and shown as an error, not as demo data.

## Demo mode

- Catalog, hours, tags and sample moderation queues come from `data/seed.ts`.
- Recommendations, submissions, claims, reports and admin edits are stored in `.data/store.json` on the server.
- Uploaded images are stored in `.data/uploads` and served from `/api/media/...`.
- This storage is not production persistence. It is isolated from Supabase.
- The businesses are fictional. They are not real Atlit businesses.
- The footer says so while demo mode is on.

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/migrations/0001_init.sql` if it has not already been applied.
3. Run `supabase/migrations/0002_production_reference.sql`. It is safe to run again. It adds עתלית and the 12 categories, and it does not add businesses.
4. Do **not** run `supabase/seed.sql` on production. That file is the fictional demo catalog.
5. In Storage, confirm the public bucket `business-images` exists. `0001_init.sql` creates it. Uploads are JPG, PNG or WEBP, up to 2MB, and go through the server service role.
6. Put the project URL, anon key and service role key in the host environment. The service role key must stay server-only.
7. Set `ADMIN_EMAILS` to the email addresses allowed to manage the site.
8. In Supabase Auth, create those users (email + password). `DEMO_ADMIN_PASSWORD` is not used.
9. Turn off public sign-up if you do not want open registration.
10. Redeploy.

After that, public pages read from Postgres. An empty business table is valid: the public pages show an empty state. Admin changes use the service role on the server only after the signed-in email is on the allowlist. Public clients cannot insert into `businesses`.

The first real business should be created in `/admin/businesses/new`, not in a migration.

Row Level Security:

- Anyone can read active businesses, categories, hours and images.
- Anyone can insert a pending submission, claim, report or recommendation.
- Nobody except the service role can update a business directly.
- Owners can update a limited set of fields through `update_owned_business` and `replace_owned_hours` after a claim is approved and linked to their user.

## Admin authorization

- **Local demo:** password gate. Cookie is HTTP-only and signed. It is accepted only while Supabase is not configured and `NODE_ENV` is not `production`.
- **Production:** email/password through Supabase Auth. The signed-in email must appear in `ADMIN_EMAILS`. Other accounts are signed out. Privileged writes check that session again before using the service role.

Admin links are not in the public header. The path is `/admin`.

## Owner accounts

`business_owners` links a Supabase user to a business.

Approving a claim links ownership only when a Supabase Auth user exists with the same email as the claim. A user id sent with the claim is ignored unless that account's email matches. If no account matches, the claim can still be approved and no owner row is created.

`/my-business` lets that user edit the description, phone, WhatsApp, address visibility and hours. It does not let them verify, feature or publish the business.

In demo mode the page explains that this connects after Supabase is configured.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Deployment

The app is a standard Next.js server app. It needs a Node server (not a fully static export) because admin actions, demo storage and Supabase writes run on the server.

1. Set the environment variables in the host.
2. Set `NEXT_PUBLIC_SITE_URL` to the public origin.
3. Do not rely on `DEMO_ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` in production. Admin login is Supabase Auth plus `ADMIN_EMAILS`.
4. Run `0001_init.sql` once, then `0002_production_reference.sql`. Do not run `supabase/seed.sql`.
5. `npm run build` then `npm start`, or deploy to a host that builds Next.js the same way.

## Product rules already in the data model

- Normal search only returns businesses in the primary locality (Atlit). Nearby places must not replace them.
- A submission stays `pending` until an admin approves or rejects it. Approval creates a real business row and does not publish it until the business is marked active.
- Recommendations are one per resident key per business. There are no star ratings.
- Open/closed uses `Asia/Jerusalem`.

## Not built yet

- **השכנים של עתלית:** the page and `localities` table are ready. Search does not mix in other towns.
- **צריך משהו?:** a future request a resident could send (category, text, timing, contact) for participating businesses. No AI. Not implemented. The shape is noted on `FutureLeadRequest` in `types/index.ts` and in the migration comments.
- Holiday hours.
- A larger owner dashboard (photos, categories, team logins).

## Routes

- `/` home
- `/search` search and filters
- `/categories` and `/category/[slug]`
- `/business/[slug]`
- `/add-business`
- `/neighbors`
- `/my-business`
- `/admin`
