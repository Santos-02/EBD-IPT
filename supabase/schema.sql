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
  document text,
  status boolean not null default true,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Acesso à tabela via Data API: apenas usuários autenticados
revoke all on table public.users from anon;
revoke all on table public.users from public;
grant select, insert, update, delete on table public.users to authenticated;

-- -----------------------------------------------------------------------------
-- Helper (SECURITY DEFINER) que verifica se o usuário autenticado é "master".
-- Mantido num schema não exposto pela Data API e com verificação de auth.uid().
-- A tabela public.users precisa existir antes desta função (a validação em
-- funções LANGUAGE SQL acontece na criação).
-- -----------------------------------------------------------------------------
create schema if not exists internal;

create or replace function internal.is_master()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users u
    where u.id = (select auth.uid())
      and u.role = 'master'
  )
$$;

revoke all on function internal.is_master() from public;
grant execute on function internal.is_master() to authenticated;

-- -----------------------------------------------------------------------------
-- Políticas RLS da tabela users
-- -----------------------------------------------------------------------------
-- usuário lê o próprio perfil
drop policy if exists "users_read_own" on public.users;
create policy "users_read_own" on public.users
  for select to authenticated
  using ( (select auth.uid()) = id );

-- master lê todos os usuários (listagem /usuarios)
drop policy if exists "users_read_all_for_master" on public.users;
create policy "users_read_all_for_master" on public.users
  for select to authenticated
  using ( internal.is_master() );

-- criação do perfil no cadastro (signUp) - usa o id do auth.users
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert to authenticated
  with check ( (select auth.uid()) = id );

-- usuário edita o próprio perfil
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- master edita qualquer usuário (inativar/ativar, editar)
drop policy if exists "users_update_all_for_master" on public.users;
create policy "users_update_all_for_master" on public.users
  for update to authenticated
  using ( internal.is_master() )
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
  u.document,
  u.status,
  u.role,
  u.created_at,
  unaccent(lower(u.name)) as name_ascii,
  unaccent(lower(u.email)) as email_ascii
from public.users u;

revoke all on public.users_ascii from anon;
revoke all on public.users_ascii from public;
grant select on public.users_ascii to authenticated;

-- -----------------------------------------------------------------------------
-- Tabela members
-- -----------------------------------------------------------------------------
create table if not exists public.members (
  id bigint generated always as identity primary key,
  name text not null,
  society text,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

revoke all on table public.members from anon;
revoke all on table public.members from public;
grant select, insert, update, delete on table public.members to authenticated;

-- app interno: qualquer usuário autenticado gerencia os membros
drop policy if exists "members_all_authenticated" on public.members;
create policy "members_all_authenticated" on public.members
  for all to authenticated
  using ( true )
  with check ( true );

-- -----------------------------------------------------------------------------
-- Migração: cria o perfil dos usuários que já existem em auth.users.
-- Todos entram como "master" para o app funcionar; ajuste depois se quiser.
-- -----------------------------------------------------------------------------
insert into public.users (id, name, email, role)
select u.id,
       coalesce(u.raw_user_meta_data ->> 'name', u.email),
       u.email,
       'master'
from auth.users u
on conflict (id) do nothing;

-- Obs.: se "Confirm email" estiver habilitado no Authentication, o cadastro
-- público (signUp) não terá sessão no momento do INSERT na tabela users.
-- Nesse caso confirme o e-mail antes de cadastrar, ou crie o perfil via trigger.