# The Shubmaan Initiative — website

Next.js (App Router) + TypeScript, with Supabase for content, auth, storage and form data. Styles live in `src/app/globals.css`; animations use Framer Motion + GSAP and respect `prefers-reduced-motion`.

## Pages
| URL | What |
| --- | --- |
| `/` | Home (hero, about, founder, story, what we do, impact, ways to help, journey, gallery preview, donate, contact) |
| `/gallery` | Full gallery with filters + lightbox |
| `/updates` | Work and donation-use updates |
| `/volunteer` | 3-step signed volunteer application |
| `/admin` | Admin portal (login required) |

Older links such as `/#gallery` redirect to `/gallery` automatically.

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```
Without Supabase keys the site still runs and shows the built-in content from `src/lib/site-defaults.ts`; the forms report that they can't submit, and `/admin` says it isn't connected.

## Set up Supabase (one time)
1. Create a project at supabase.com.
2. **SQL editor** → paste and run `supabase/migrations/0001_init.sql`, then `supabase/migrations/0002_grants.sql`. These create the tables, the storage buckets (`media` public, `signatures` private), the access rules and the table privileges.
3. **Authentication → Users → Add user**: create the owner's login (email + password). Under Authentication → Providers you can turn off public sign-ups.
4. Make that user an admin (SQL editor):
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'OWNER_EMAIL';
   ```
5. **Settings → API**: copy the Project URL, the anon/publishable key and the service-role key into `.env.local` (and into Vercel, below).

## Email notifications (Resend)
Each new volunteer application is emailed to `NOTIFY_EMAIL_TO`, with the signature attached. Create a free account at resend.com, add an API key as `RESEND_API_KEY`, and set `NOTIFY_EMAIL_FROM` to an address on a domain you've verified there (`onboarding@resend.dev` works for testing). If email isn't configured the application is still saved; `email_sent` stays `false`.

## Deploy to Vercel
1. Push this folder to a GitHub repository and import it in Vercel (framework: Next.js, no extra settings).
2. Add the environment variables from `.env.example` in Vercel → Settings → Environment Variables.
3. Deploy. Content edits from `/admin` go live immediately (the save triggers a revalidation).

## Where the data goes
- **Site content**: table `site_content` (one JSON row, merged over `src/lib/site-defaults.ts`). Edited in `/admin`.
- **Photos, logo, QR**: storage bucket `media` (uploads are resized to max 1600px in the browser first).
- **Volunteer applications**: table `volunteer_applications` (every field, consent text + terms as agreed, signature method, timestamp) and the signature PNG in the private `signatures` bucket. Written only by `/api/volunteer` with the service-role key.
- **Donation pledges**: table `pledges`. Recorded when a donor clicks "Continue to payment" (amount, purpose, optional name) with status `awaiting_verification`. This is **not** a payment: the site never confirms a payment. Change `status` to `verified` once the UTR is matched. A Razorpay integration can replace this later.

For now, applications and pledges are viewed in the Supabase dashboard (Table editor).

## Code map
```
src/app/                 routes (+ api/volunteer, api/pledge, api/revalidate)
src/components/home/     one component per home section
src/components/gallery/  GalleryGrid, Lightbox
src/components/updates/  UpdatesList
src/components/volunteer/VolunteerForm, SignaturePad
src/components/admin/    AdminPortal (login), AdminEditor, fields
src/components/layout/   Header, Footer, page helpers
src/components/ui/       Icon, Photo, Brand, Magnetic, SmartLink, Line
src/lib/                 defaults, content loading, Supabase clients, GSAP hook, validation, email
```

Reminder: get parents'/guardians' consent before showing children's faces publicly.
