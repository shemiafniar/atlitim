-- Production reference data and admin safety follow-ups.
-- Safe to run more than once. Does not insert businesses.
-- Do not run supabase/seed.sql in production: that file is the fictional demo catalog.

insert into public.localities (name, slug, is_primary, is_active)
values ('עתלית', 'atlit', true, true)
on conflict (slug) do update
set name = excluded.name,
    is_primary = true,
    is_active = true;

update public.localities
set is_primary = (slug = 'atlit');

insert into public.categories (name, slug, icon, display_order, is_active)
values
  ('אוכל ומשלוחים', 'food', 'UtensilsCrossed', 1, true),
  ('בעלי מקצוע', 'trades', 'Wrench', 2, true),
  ('טיפוח ויופי', 'beauty', 'Sparkles', 3, true),
  ('ילדים וחוגים', 'kids', 'Baby', 4, true),
  ('בריאות וגוף', 'health', 'HeartPulse', 5, true),
  ('בעלי חיים', 'pets', 'PawPrint', 6, true),
  ('רכב', 'auto', 'Car', 7, true),
  ('לבית ולגינה', 'home', 'House', 8, true),
  ('לימודים', 'studies', 'GraduationCap', 9, true),
  ('אירועים ופנאי', 'events', 'PartyPopper', 10, true),
  ('שירותים מקצועיים', 'professional', 'Briefcase', 11, true),
  ('קניות', 'shopping', 'ShoppingBag', 12, true)
on conflict (slug) do update
set name = excluded.name,
    icon = excluded.icon,
    display_order = excluded.display_order,
    is_active = true;

-- Keep recommendation_count aligned with the recommendations table.
create or replace function public.sync_recommendation_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.businesses
    set recommendation_count = recommendation_count + 1
    where id = new.business_id;
    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.businesses
    set recommendation_count = greatest(recommendation_count - 1, 0)
    where id = old.business_id;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists recommendations_bump on public.recommendations;
drop trigger if exists recommendations_count on public.recommendations;
create trigger recommendations_count
after insert or delete on public.recommendations
for each row execute function public.sync_recommendation_count();

update public.businesses as business
set recommendation_count = (
  select count(*)::integer
  from public.recommendations as recommendation
  where recommendation.business_id = business.id
);

-- Owners still cannot change publish/verify/feature flags.
-- Hiding the exact address also clears stored coordinates.
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
      latitude = case when coalesce(new_show_address, false) then latitude else null end,
      longitude = case when coalesce(new_show_address, false) then longitude else null end,
      updated_at = now()
  where id = target_id;
end;
$$;

-- A public claim may name only the signed-in user, never an arbitrary account.
drop policy if exists "public insert claims" on public.business_claims;
create policy "public insert claims" on public.business_claims
for insert to anon, authenticated
with check (
  status = 'pending'
  and char_length(claimant_name) between 2 and 80
  and char_length(phone) between 9 and 30
  and char_length(email) between 5 and 120
  and char_length(message) between 4 and 500
  and (claimant_user_id is null or claimant_user_id = auth.uid())
);
