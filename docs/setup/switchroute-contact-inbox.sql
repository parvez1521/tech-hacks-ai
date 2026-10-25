-- SwitchRoute contact inbox
-- Run once against the dedicated SwitchRoute Supabase project.
-- Public roles can neither read nor insert messages; the Vercel server uses the
-- server-side Supabase secret key. Keep that key out of all browser bundles.
begin;

create table if not exists public.switchroute_contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null check (subject in (
    'general', 'tool-suggestion', 'pricing-correction', 'bug-report',
    'copyright', 'privacy', 'security', 'other'
  )),
  message text not null check (char_length(message) between 15 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'resolved', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.switchroute_contact_messages enable row level security;
revoke all on table public.switchroute_contact_messages from public, anon, authenticated;
grant select, insert, update, delete on table public.switchroute_contact_messages to service_role;

comment on table public.switchroute_contact_messages is
  'Private SwitchRoute contact inbox. Access only from trusted server-side code; no public RLS policies.';
comment on column public.switchroute_contact_messages.email is
  'Sender-provided reply address. Do not use for marketing without separate consent.';

commit;
