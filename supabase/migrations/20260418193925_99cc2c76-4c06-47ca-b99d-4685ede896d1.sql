create table public.portfolio (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  category_color text default '#7B3415',
  client text,
  country text,
  flag text,
  year text,
  services text[] default '{}',
  stack text[] default '{}',
  challenge text,
  solution text,
  results text[] default '{}',
  color text default '#7B3415',
  image_url text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  icon text not null,
  color text default '#7B3415',
  badge text,
  title text not null,
  short_desc text,
  full_desc text,
  features text[] default '{}',
  sectors text[] default '{}',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org text,
  country text,
  text text not null,
  rating integer not null default 5,
  avatar text,
  color text default '#7B3415',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  category text default 'Technologie',
  tags text[] default '{}',
  author text default 'LUBAMA Jean Chrysostome ZACEI',
  published boolean not null default false,
  views integer not null default 0,
  read_time integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  organization text,
  subject text,
  budget text,
  message text not null,
  email text,
  phone text,
  status text not null default 'unread',
  replied boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.stats (
  id uuid primary key default gen_random_uuid(),
  value integer not null,
  suffix text default '',
  label text not null,
  sort_order integer not null default 0
);

create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.portfolio enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.stats enable row level security;
alter table public.site_settings enable row level security;

create policy "Public read portfolio" on public.portfolio for select using (published = true);
create policy "Public read services" on public.services for select using (published = true);
create policy "Public read testimonials" on public.testimonials for select using (published = true);
create policy "Public read posts" on public.posts for select using (published = true);
create policy "Public read stats" on public.stats for select using (true);
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Public insert contact_messages" on public.contact_messages for insert with check (true);

create policy "Admin all portfolio" on public.portfolio for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all services" on public.services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all testimonials" on public.testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all posts" on public.posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all stats" on public.stats for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all site_settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create index portfolio_sort_idx on public.portfolio (sort_order, created_at desc);
create index services_sort_idx on public.services (sort_order, created_at desc);
create index posts_published_idx on public.posts (published, published_at desc);
create index contact_messages_status_idx on public.contact_messages (status, created_at desc);

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolio_set_updated_at
  before update on public.portfolio
  for each row execute function public.tg_set_updated_at();

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.tg_set_updated_at();

insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Admin upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Admin update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Admin delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');