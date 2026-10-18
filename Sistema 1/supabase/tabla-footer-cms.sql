-- INTIWO | 42/135: una fila footer_cms. Visitante lee; solo administrador escribe.
-- Correr UNA vez. Valores iniciales: WhatsApp canonico 7441-1075 y respaldo 6674-3159.

create table if not exists public.footer_cms (
	id smallint primary key default 1 check (id = 1),
	whatsapp_principal text not null default '+503 7441-1075',
	whatsapp_alterno text not null default '+503 6674-3159',
	email text,
	facebook_url text not null default 'https://www.facebook.com/tecnicosinti/?locale=es_LA',
	instagram_url text not null default 'https://www.instagram.com/inti.edu.sv/',
	tiktok_url text not null default 'https://www.tiktok.com/@inti.edu.sv',
	updated_by uuid references public.perfiles (id) on delete set null,
	updated_at timestamptz not null default now()
);

alter table public.footer_cms
	add column if not exists email text;

comment on table public.footer_cms is 'Fila unica del pie. SELECT publico; INSERT/UPDATE solo administrador.';

create or replace function public.intiwo_footer_cms_antes()
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

drop trigger if exists footer_cms_antes on public.footer_cms;
create trigger footer_cms_antes
	before insert or update on public.footer_cms
	for each row execute function public.intiwo_footer_cms_antes();

insert into public.footer_cms (id)
values (1)
on conflict (id) do nothing;

alter table public.footer_cms enable row level security;

revoke all on table public.footer_cms from public, anon, authenticated;
grant select on table public.footer_cms to anon, authenticated;
grant insert, update on table public.footer_cms to authenticated;

drop policy if exists footer_cms_select_publico on public.footer_cms;
create policy footer_cms_select_publico
	on public.footer_cms for select
	to anon, authenticated
	using (true);

drop policy if exists footer_cms_insert_admin on public.footer_cms;
create policy footer_cms_insert_admin
	on public.footer_cms for insert
	to authenticated
	with check (public.intiwo_es_admin());

drop policy if exists footer_cms_update_admin on public.footer_cms;
create policy footer_cms_update_admin
	on public.footer_cms for update
	to authenticated
	using (public.intiwo_es_admin())
	with check (public.intiwo_es_admin());
