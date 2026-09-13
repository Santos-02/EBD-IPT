-- =============================================================================
-- EBD-IPT - Schema do banco (tabelas em inglês)
-- Execute este script inteiro no Supabase SQL Editor (Dashboard > SQL Editor).
-- O script é idempotente: pode ser reexecutado sem erros.
-- =============================================================================

create extension if not exists unaccent;

-- -----------------------------------------------------------------------------
-- Tabela users (perfil do usuário, ligada a auth.users)
-- -----------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Acesso à tabela via Data API: apenas usuários autenticados
revoke all on table public.users from anon;
revoke all on table public.users from public;
grant select, insert, update, delete on table public.users to authenticated;

-- -----------------------------------------------------------------------------
-- Políticas RLS da tabela users
-- -----------------------------------------------------------------------------
-- remove políticas antigas (algumas citavam colunas que deixaram de existir)
drop policy if exists "users_read_own" on public.users;
drop policy if exists "users_read_all_for_master" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_update_all_for_master" on public.users;

-- leitura: qualquer usuário autenticado pode listar perfis (/usuarios)
drop policy if exists "users_read_all_authenticated" on public.users;
create policy "users_read_all_authenticated" on public.users
  for select to authenticated
  using ( true );

-- criação do perfil no cadastro (signUp) - usa o id do auth.users
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert to authenticated
  with check ( (select auth.uid()) = id );

-- edição de perfil: sem roles, qualquer autenticado pode editar perfis
drop policy if exists "users_update_authenticated" on public.users;
create policy "users_update_authenticated" on public.users
  for update to authenticated
  using ( true )
  with check ( true );

-- -----------------------------------------------------------------------------
-- View users_ascii - busca de usuários ignorando acentos (listagem /usuarios).
-- security_invoker = true: a view respeita o RLS da tabela users.
-- -----------------------------------------------------------------------------
drop view if exists public.users_ascii;

create view public.users_ascii
with (security_invoker = true)
as
select
  u.id,
  u.name,
  u.phone,
  u.email,
  u.created_at,
  unaccent(lower(u.name)) as name_ascii,
  unaccent(lower(u.email)) as email_ascii
from public.users u;

revoke all on public.users_ascii from anon;
revoke all on public.users_ascii from public;
grant select on public.users_ascii to authenticated;

-- -----------------------------------------------------------------------------
-- Limpeza de dependências legadas + colunas removidas da tabela users
-- (A view users_ascii acima já foi recriada sem essas colunas, então a remoção
--  das colunas acontece sem quebrar dependências.)
-- -----------------------------------------------------------------------------
drop function if exists internal.is_master();
drop schema if exists internal;

alter table public.users drop column if exists document;
alter table public.users drop column if exists status;
alter table public.users drop column if exists role;

-- -----------------------------------------------------------------------------
-- Tabela member (membros)
-- -----------------------------------------------------------------------------
create table if not exists public.member (
  id bigint generated always as identity primary key,
  name text not null,
  society text,
  created_at timestamptz not null default now()
);

alter table public.member enable row level security;

revoke all on table public.member from anon;
revoke all on table public.member from public;
grant select, insert, update, delete on table public.member to authenticated;

-- app interno: qualquer usuário autenticado gerencia os membros
drop policy if exists "member_all_authenticated" on public.member;
create policy "member_all_authenticated" on public.member
  for all to authenticated
  using ( true )
  with check ( true );

-- -----------------------------------------------------------------------------
-- Tabela presences (controle de presença dominical)
-- Uma linha por membro presente em cada data de culto.
-- -----------------------------------------------------------------------------
create table if not exists public.presences (
  id bigint generated always as identity primary key,
  member_id bigint not null references public.member(id) on delete cascade,
  date date not null,
  society text,
  created_at timestamptz not null default now(),
  unique (member_id, date)
);

create index if not exists presences_society_date_idx
  on public.presences (society, date);

alter table public.presences enable row level security;

revoke all on table public.presences from anon;
revoke all on table public.presences from public;
grant select, insert, update, delete on table public.presences to authenticated;

-- app interno: qualquer usuário autenticado gerencia as presenças
drop policy if exists "presences_all_authenticated" on public.presences;
create policy "presences_all_authenticated" on public.presences
  for all to authenticated
  using ( true )
  with check ( true );

-- Reparo idempotente: garante a FK de presences apontando para public.member
alter table public.presences drop constraint if exists "presences_member_id_fkey";
alter table public.presences add constraint "presences_member_id_fkey"
  foreign key (member_id) references public.member(id) on delete cascade;

-- -----------------------------------------------------------------------------
-- Migração: cria o perfil dos usuários que já existem em auth.users.
-- -----------------------------------------------------------------------------
insert into public.users (id, name, email)
select u.id,
       coalesce(u.raw_user_meta_data ->> 'name', u.email),
       u.email
from auth.users u
on conflict (id) do nothing;

-- Obs.: se "Confirm email" estiver habilitado no Authentication, o cadastro
-- público (signUp) não terá sessão no momento do INSERT na tabela users.
-- Nesse caso confirme o e-mail antes de cadastrar, ou crie o perfil via trigger.

-- -----------------------------------------------------------------------------
-- Backfill: corrige perfis antigos onde "name" caiu para o e-mail (criados
-- antes de o signUp enviar o nome no metadata). Rode novamente após cadastros.
-- -----------------------------------------------------------------------------
update public.users u
set name = coalesce(a.raw_user_meta_data ->> 'name', u.name)
from auth.users a
where u.id = a.id
  and u.name = u.email
  and nullif(a.raw_user_meta_data ->> 'name', '') is not null;