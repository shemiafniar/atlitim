-- Atlitim initial schema. Run in the Supabase SQL editor or via the Supabase CLI.
-- Public users can read active catalog data and submit requests.
-- They cannot publish or edit businesses. Admin writes use the service role on the server.

create extension if not exists pgcrypto;

create table if not exists public.localities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint localities_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'Store',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  constraint subcategories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  constraint tags_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid not null references public.localities(id),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  phone text,
  whatsapp text,
  email text,
  website text,
  instagram text,
  facebook text,
  address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  show_exact_address boolean not null default false,
  logo_url text,
  cover_image_url text,
  is_home_business boolean not null default false,
  provides_delivery boolean not null default false,
  provides_home_service boolean not null default false,
  accessibility boolean not null default false,
  kosher boolean not null default false,
  verified boolean not null default false,
  active boolean not null default true,
  featured boolean not null default false,
  is_demo boolean not null default false,
  recommendation_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.business_categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  subcategory_id uuid references public.subcategories(id) on delete restrict
);

create unique index if not exists business_categories_unique
  on public.business_categories (business_id, category_id, coalesce(subcategory_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table if not exists public.business_tags (
  business_id uuid not null references public.businesses(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (business_id, tag_id)
);

create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  open_time time not null,
  close_time time not null,
  check (open_time <> close_time)
);

create table if not exists public.business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  display_order integer not null default 0
);

create table if not exists public.business_submissions (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category_id uuid not null references public.categories(id),
  subcategory_id uuid references public.subcategories(id),
  description text not null,
  phone text not null,
  whatsapp text,
  contact_person text not null,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text,
  created_business_id uuid references public.businesses(id),
  created_at timestamptz not null default now()
);

create table if not exists public.business_claims (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  claimant_name text not null,
  phone text not null,
  email text not null,
  message text not null,
  claimant_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_reports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  reason text not null check (reason in ('wrong_phone', 'incorrect_hours', 'business_closed', 'wrong_address', 'other')),
  details text,
  contact text,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  resident_key text not null check (char_length(resident_key) between 16 and 80),
  created_at timestamptz not null default now(),
  unique (business_id, resident_key)
);

create table if not exists public.business_owners (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists businesses_locality_idx on public.businesses (locality_id);
create index if not exists businesses_active_idx on public.businesses (active);
create index if not exists business_hours_business_idx on public.business_hours (business_id);
create index if not exists submissions_status_idx on public.business_submissions (status);
create index if not exists claims_status_idx on public.business_claims (status);
create index if not exists reports_status_idx on public.business_reports (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

create or replace function public.bump_recommendation_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.businesses
  set recommendation_count = recommendation_count + 1
  where id = new.business_id;
  return new;
end;
$$;

drop trigger if exists recommendations_bump on public.recommendations;
create trigger recommendations_bump
after insert on public.recommendations
for each row execute function public.bump_recommendation_count();

create or replace function public.update_owned_business(
  target_id uuid,
  new_short text,
  new_description text,
  new_phone text,
  new_whatsapp text,
  new_address text,
  new_show_address boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.business_owners
    where business_id = target_id and user_id = auth.uid()
  ) then
    raise exception 'forbidden';
  end if;
  update public.businesses
  set short_description = left(coalesce(new_short, ''), 160),
      description = left(coalesce(new_description, ''), 2000),
      phone = nullif(left(coalesce(new_phone, ''), 30), ''),
      whatsapp = nullif(left(coalesce(new_whatsapp, ''), 30), ''),
      address = nullif(left(coalesce(new_address, ''), 180), ''),
      show_exact_address = coalesce(new_show_address, false),
      updated_at = now()
  where id = target_id;
end;
$$;

create or replace function public.replace_owned_hours(target_id uuid, new_hours jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.business_owners
    where business_id = target_id and user_id = auth.uid()
  ) then
    raise exception 'forbidden';
  end if;
  delete from public.business_hours where business_id = target_id;
  insert into public.business_hours (business_id, day_of_week, open_time, close_time)
  select target_id,
         (item->>'day_of_week')::int,
         (item->>'open_time')::time,
         (item->>'close_time')::time
  from jsonb_array_elements(coalesce(new_hours, '[]'::jsonb)) item
  where (item->>'day_of_week')::int between 0 and 6
    and (item->>'open_time') is not null
    and (item->>'close_time') is not null
    and (item->>'open_time')::time <> (item->>'close_time')::time;
end;
$$;

revoke all on function public.update_owned_business(uuid, text, text, text, text, text, boolean) from public, anon;
revoke all on function public.replace_owned_hours(uuid, jsonb) from public, anon;
grant execute on function public.update_owned_business(uuid, text, text, text, text, text, boolean) to authenticated;
grant execute on function public.replace_owned_hours(uuid, jsonb) to authenticated;

alter table public.localities enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.tags enable row level security;
alter table public.businesses enable row level security;
alter table public.business_categories enable row level security;
alter table public.business_tags enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_images enable row level security;
alter table public.business_submissions enable row level security;
alter table public.business_claims enable row level security;
alter table public.business_reports enable row level security;
alter table public.recommendations enable row level security;
alter table public.business_owners enable row level security;

drop policy if exists "public read localities" on public.localities;
create policy "public read localities" on public.localities for select using (is_active);

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (is_active);

drop policy if exists "public read subcategories" on public.subcategories;
create policy "public read subcategories" on public.subcategories for select using (is_active);

drop policy if exists "public read tags" on public.tags;
create policy "public read tags" on public.tags for select using (true);

drop policy if exists "public read active businesses" on public.businesses;
create policy "public read active businesses" on public.businesses for select using (active = true);

drop policy if exists "owners read own businesses" on public.businesses;
create policy "owners read own businesses" on public.businesses for select to authenticated using (
  exists (select 1 from public.business_owners o where o.business_id = businesses.id and o.user_id = auth.uid())
);

drop policy if exists "public read business categories" on public.business_categories;
create policy "public read business categories" on public.business_categories for select using (true);

drop policy if exists "public read business tags" on public.business_tags;
create policy "public read business tags" on public.business_tags for select using (true);

drop policy if exists "public read hours" on public.business_hours;
create policy "public read hours" on public.business_hours for select using (true);

drop policy if exists "public read images" on public.business_images;
create policy "public read images" on public.business_images for select using (true);

drop policy if exists "public insert submissions" on public.business_submissions;
create policy "public insert submissions" on public.business_submissions
for insert to anon, authenticated
with check (
  status = 'pending'
  and char_length(business_name) between 2 and 80
  and char_length(description) between 8 and 500
  and char_length(phone) between 9 and 30
  and char_length(contact_person) between 2 and 80
);

drop policy if exists "public insert claims" on public.business_claims;
create policy "public insert claims" on public.business_claims
for insert to anon, authenticated
with check (
  status = 'pending'
  and char_length(claimant_name) between 2 and 80
  and char_length(phone) between 9 and 30
  and char_length(email) between 5 and 120
  and char_length(message) between 4 and 500
);

drop policy if exists "public insert reports" on public.business_reports;
create policy "public insert reports" on public.business_reports
for insert to anon, authenticated
with check (status = 'pending' and reason in ('wrong_phone', 'incorrect_hours', 'business_closed', 'wrong_address', 'other'));

drop policy if exists "public insert recommendations" on public.recommendations;
create policy "public insert recommendations" on public.recommendations
for insert to anon, authenticated
with check (char_length(resident_key) between 16 and 80);

drop policy if exists "owners read own links" on public.business_owners;
create policy "owners read own links" on public.business_owners
for select to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('business-images', 'business-images', true)
on conflict (id) do nothing;

drop policy if exists "public read business images" on storage.objects;
create policy "public read business images" on storage.objects
for select using (bucket_id = 'business-images');

-- Future "צריך משהו?" lead requests are intentionally not created yet.
-- Planned columns: locality_id, category_id, subcategory_id, request_text,
-- preferred_timing, contact_name, contact_phone, status (open/sent/closed), created_at.
-- Searches must keep prioritizing the primary locality (Atlit).
