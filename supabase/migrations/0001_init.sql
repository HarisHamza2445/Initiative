-- The Shubmaan Initiative — initial schema. Run in Supabase SQL editor (or `supabase db push`).

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
-- After creating the owner's account in Auth → Users, run:
--   insert into public.admins (user_id) select id from auth.users where email = 'OWNER_EMAIL';

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
grant execute on function public.is_admin() to anon, authenticated;

-- Editable site content (one JSON document, merged over built-in defaults)
create table if not exists public.site_content (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.site_content enable row level security;
create policy "site_content public read" on public.site_content for select using (true);
create policy "site_content admin insert" on public.site_content for insert to authenticated with check (public.is_admin());
create policy "site_content admin update" on public.site_content for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Signed volunteer applications (written by the /api/volunteer route with the service role)
create table if not exists public.volunteer_applications (
  id text primary key,                       -- e.g. VOL-LX3K9A
  name text not null, email text not null, phone text not null, city text not null,
  interests text[] not null, skills text not null, availability text[] not null,
  why text not null, extra text not null default '',
  consent_agreed boolean not null, consent_text text not null, terms text[] not null,
  signature_method text not null check (signature_method in ('draw','type')),
  signature_typed_name text not null default '',
  signature_path text not null,               -- object in the private `signatures` bucket
  signed_at timestamptz not null,
  submitted_at timestamptz not null default now(),
  email_sent boolean not null default false
);
alter table public.volunteer_applications enable row level security;
create policy "volunteers admin read" on public.volunteer_applications for select to authenticated using (public.is_admin());

-- Donation pledges — never treated as paid until an admin verifies the UTR
create table if not exists public.pledges (
  id uuid primary key default gen_random_uuid(),
  amount integer not null check (amount > 0 and amount <= 10000000),
  currency text not null default '₹',
  purpose text not null, purpose_other text not null default '',
  donor_name text not null default '',
  status text not null default 'awaiting_verification'
    check (status in ('awaiting_verification','verified','not_received','superseded')),
  utr text not null default '', admin_note text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.pledges enable row level security;
create policy "pledges admin read" on public.pledges for select to authenticated using (public.is_admin());
create policy "pledges admin update" on public.pledges for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage: public `media` (gallery, updates, logo, QR) + private `signatures`
insert into storage.buckets (id, name, public) values ('media','media',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('signatures','signatures',false) on conflict (id) do nothing;
create policy "media admin write" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "signatures admin read" on storage.objects for select to authenticated using (bucket_id = 'signatures' and public.is_admin());
