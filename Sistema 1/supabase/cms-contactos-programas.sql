-- INTIWO | Contactos independientes para EDUCAME y Matricula.
-- Ejecutar despues de tabla-footer-cms.sql. Candidato local; no ejecutar sin
-- instruccion expresa del Instituto.

alter table public.footer_cms
	add column if not exists email text;

create table if not exists public.educame_cms (
	id smallint primary key default 1 check (id = 1),
	whatsapp text not null default '+503 7754-5899',
	email text not null default 'oficina.educame@inti.edu.sv',
	updated_by uuid references public.perfiles (id) on delete set null,
	updated_at timestamptz not null default now()
);

create table if not exists public.matricula_cms (
	id smallint primary key default 1 check (id = 1),
	whatsapp_principal text not null default '+503 7441-1075',
	whatsapp_alterno text not null default '+503 6674-3159',
	email text,
	formulario_url text not null default 'https://docs.google.com/forms/d/e/1FAIpQLSchOv93fiyvoxF2z_mahlUcUhzbt5FyxfZTupLeODpdBcJjhw/viewform',
	updated_by uuid references public.perfiles (id) on delete set null,
	updated_at timestamptz not null default now(),
	constraint matricula_cms_formulario_https check (formulario_url ~ '^https://')
);

comment on table public.educame_cms is 'Fila unica de contactos EDUCAME; independiente del Footer y Matricula.';
comment on table public.matricula_cms is 'Fila unica de contactos y formulario de Matricula; independiente del Footer y EDUCAME.';

create or replace function public.intiwo_programa_cms_antes()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
begin
	new.id := 1;
	new.updated_at := now();
	if (select auth.uid()) is not null then
		new.updated_by := (select auth.uid());
	end if;
	return new;
end;
$$;

revoke all on function public.intiwo_programa_cms_antes() from public;

drop trigger if exists educame_cms_antes on public.educame_cms;
create trigger educame_cms_antes
	before insert or update on public.educame_cms
	for each row execute function public.intiwo_programa_cms_antes();

drop trigger if exists matricula_cms_antes on public.matricula_cms;
create trigger matricula_cms_antes
	before insert or update on public.matricula_cms
	for each row execute function public.intiwo_programa_cms_antes();

insert into public.educame_cms (id)
values (1)
on conflict (id) do nothing;

insert into public.matricula_cms (id)
values (1)
on conflict (id) do nothing;

alter table public.educame_cms enable row level security;
alter table public.matricula_cms enable row level security;

revoke all on table public.educame_cms from public, anon, authenticated;
revoke all on table public.matricula_cms from public, anon, authenticated;
grant select on table public.educame_cms to anon, authenticated;
grant select on table public.matricula_cms to anon, authenticated;
grant insert, update on table public.educame_cms to authenticated;
grant insert, update on table public.matricula_cms to authenticated;

drop policy if exists educame_cms_select_publico on public.educame_cms;
create policy educame_cms_select_publico
	on public.educame_cms for select
	to anon, authenticated
	using (true);

drop policy if exists educame_cms_insert_admin on public.educame_cms;
create policy educame_cms_insert_admin
	on public.educame_cms for insert
	to authenticated
	with check (public.intiwo_es_admin());

drop policy if exists educame_cms_update_admin on public.educame_cms;
create policy educame_cms_update_admin
	on public.educame_cms for update
	to authenticated
	using (public.intiwo_es_admin())
	with check (public.intiwo_es_admin());

drop policy if exists matricula_cms_select_publico on public.matricula_cms;
create policy matricula_cms_select_publico
	on public.matricula_cms for select
	to anon, authenticated
	using (true);

drop policy if exists matricula_cms_insert_admin on public.matricula_cms;
create policy matricula_cms_insert_admin
	on public.matricula_cms for insert
	to authenticated
	with check (public.intiwo_es_admin());

drop policy if exists matricula_cms_update_admin on public.matricula_cms;
create policy matricula_cms_update_admin
	on public.matricula_cms for update
	to authenticated
	using (public.intiwo_es_admin())
	with check (public.intiwo_es_admin());
