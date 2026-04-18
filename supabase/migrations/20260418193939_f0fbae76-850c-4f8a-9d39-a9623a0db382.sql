-- Fix function search_path
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tighten media bucket: keep public read by URL but disallow listing
-- The bucket stays "public" so getPublicUrl works, but we narrow SELECT
drop policy if exists "Public read media" on storage.objects;
-- No SELECT policy for anon = no listing; public URLs still work via the public file endpoint.
