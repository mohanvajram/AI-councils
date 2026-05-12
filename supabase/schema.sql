-- AI Council Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sessions table: one row per discussion session
create table if not exists sessions (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  question    text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Messages table: each AI's response in a session
create table if not exists messages (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid references sessions(id) on delete cascade,
  ai_name     text not null,          -- 'ChatGPT', 'Gemini', 'Claude'
  ai_model    text not null,          -- 'gpt-4o', 'gemini-1.5-flash', etc.
  content     text not null,
  order_index integer not null,
  created_at  timestamptz default now()
);

-- Synthesis table: final synthesized answer per session
create table if not exists syntheses (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid references sessions(id) on delete cascade unique,
  content     text not null,
  created_at  timestamptz default now()
);

-- API keys table: store user-provided keys (encrypted at rest by Supabase)
create table if not exists api_keys (
  id              uuid primary key default uuid_generate_v4(),
  user_identifier text not null unique,   -- e.g. session browser fingerprint or user id
  openai_key      text,
  gemini_key      text,
  anthropic_key   text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_messages_session_id on messages(session_id);
create index if not exists idx_sessions_created_at on sessions(created_at desc);

-- Row Level Security (enable for production)
alter table sessions  enable row level security;
alter table messages  enable row level security;
alter table syntheses enable row level security;
alter table api_keys  enable row level security;

-- Policies: allow all for service role (backend uses service key)
create policy "service_all_sessions"  on sessions  for all using (true);
create policy "service_all_messages"  on messages  for all using (true);
create policy "service_all_syntheses" on syntheses for all using (true);
create policy "service_all_api_keys"  on api_keys  for all using (true);
