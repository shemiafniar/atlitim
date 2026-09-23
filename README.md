# Atlitim

Atlitim is a community directory for local businesses and services in Atlit, Israel.

Residents can search without an account. Businesses are published only after a person reviews the submission.

Hebrew, RTL, mobile first.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- A local demo catalog when Supabase is not configured

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Default demo password: `atlitim-demo` (or `DEMO_ADMIN_PASSWORD`).

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata and the sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | For live data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live data | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For admin writes | Server-only service role key |
| `ADMIN_EMAILS` | For live admin | Comma-separated allowlist |
| `ADMIN_SESSION_SECRET` | Recommended | Signs the demo admin cookie |
| `DEMO_ADMIN_PASSWORD` | Demo only | Admin password when Supabase is off |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No | Any non-empty value enables event posting |
| `ANALYTICS_WEBHOOK_URL` | No | Where allowed events are forwarded |

If the Supabase URL or anon key is missing, the app runs in **demo mode**.

## Demo mode

- Catalog, hours, tags and sample moderation queues come from `data/seed.ts`.
- Recommendations, submissions, claims, reports and admin edits are stored in `.data/store.json` on the server.
- Uploaded images are stored in `.data/uploads` and served from `/api/media/...`.
- This storage is not production persistence. It is isolated from Supabase.
- The businesses are fictional. They are not real Atlit businesses.
- The footer says so while demo mode is on.

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`.
3. Optionally run `supabase/seed.sql` to load the same fictional catalog.
   Regenerate that file with `npx tsx scripts/generate-seed.ts` after catalog changes.
4. In Storage, confirm the public bucket `business-images` exists. The migration creates it.
5. Put the project URL, anon key and service role key in `.env.local`.
6. Set `ADMIN_EMAILS` to the email addresses allowed to manage the site.
7. In Supabase Auth, create those users (email + password) and turn off public sign-up if you do not want open registration.
8. Restart `npm run dev`.

After that, public pages read from Postgres. Admin changes, uploads and owner edits use the service role on the server, after the allowlist check. Public clients cannot insert into `businesses`.

Row Level Security:

- Anyone can read active businesses, categories, hours and images.
- Anyone can insert a pending submission, claim, report or recommendation.
- Nobody except the service role can update a business directly.
- Owners can update a limited set of fields through `update_owned_business` and `replace_owned_hours` after a claim is approved and linked to their user.

## Admin authorization

- **Demo mode:** password gate. Cookie is HTTP-only and signed. It is accepted only while Supabase is not configured.
- **Supabase mode:** email/password through Supabase Auth. The signed-in email must appear in `ADMIN_EMAILS`. Other accounts are signed out.

Admin links are not in the public header. The path is `/admin`.

## Owner accounts

`business_owners` links a Supabase user to a business.

Approving a claim links the user automatically when:

- the claimant was signed in and the claim stored their user id, or
- a Supabase user already exists with the same email.

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
3. Set a long `ADMIN_SESSION_SECRET` even if you use Supabase.
4. Do not set a public demo password on a production host. Prefer Supabase Auth.
5. Run the migration before the first boot against that project.
6. `npm run build` then `npm start`, or deploy to a host that builds Next.js the same way.

## Product rules already in the data model

- Normal search only returns businesses in the primary locality (Atlit). Nearby places must not replace them.
- A submission stays `pending` until an admin publishes it.
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
