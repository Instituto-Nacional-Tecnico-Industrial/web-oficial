-- INTIWO | minimo para login + altas desde el sitio | correr UNA vez en SQL Editor
-- Requiere: tabla perfiles ya creada y la fila admin de la semilla.
-- NO ejecuta especialidades/codigos/proyectos. Editor se da de alta sin codigo (se vincula despues).

alter table public.perfiles
	add column if not exists nie text;

create unique index if not exists perfiles_nie_uq
	on public.perfiles (nie)
	where nie is not null;

create table if not exists public.invitaciones_correo (
	id uuid primary key default gen_random_uuid(),
	email text not null check (email = lower(btrim(email))),
	rol_destino text not null check (rol_destino in ('administrador', 'docente', 'editor', 'academico')),
	codigo_id uuid,
	nombre text,
	n_lista integer check (n_lista is null or n_lista > 0),
	invitado_por uuid references public.perfiles (id) on delete restrict,
	created_at timestamptz not null default now(),
	usado_en timestamptz,
	usado_por uuid references auth.users (id) on delete restrict,
	revocado_en timestamptz,
	constraint invitacion_consumo_coherente check (
		(usado_en is null and usado_por is null)
		or (usado_en is not null and usado_por is not null)
	)
);

create unique index if not exists invitaciones_pendientes_email_uq
	on public.invitaciones_correo (email)
	where usado_en is null and revocado_en is null;

create or replace function public.intiwo_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_email text;
	v_role text;
	v_role_count bigint;
	v_nombre text;
	v_nie text;
	v_local text;
	v_es_primer_admin boolean := false;
begin
	if new.email is null then
		return new;
	end if;

	v_email := lower(btrim(new.email));

	if exists (select 1 from public.perfiles p where p.id = new.id) then
		return new;
	end if;

	if v_email = 'intiwo11543@gmail.com'
		 and not exists (
			 select 1 from public.perfiles p
			 where p.rol = 'administrador' and p.desactivado_en is null
		 ) then
		v_role := 'administrador';
		v_nombre := nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '');
		v_es_primer_admin := true;
	else
		select count(distinct i.rol_destino), min(i.rol_destino), max(i.nombre)
			into v_role_count, v_role, v_nombre
		from public.invitaciones_correo i
		where i.email = v_email
			and i.usado_en is null
			and i.revocado_en is null;

		if v_role_count = 0 then
			raise exception using
				errcode = 'P0001',
				message = 'Tu docente aun no te ha dado de alta.';
		end if;

		if v_role_count > 1 then
			raise exception 'Las invitaciones activas de este correo tienen roles incompatibles';
		end if;
	end if;

	v_local := split_part(v_email, '@', 1);
	if v_role = 'editor' then
		if v_local !~ '^[0-9]+$' then
			raise exception 'El correo de editor debe tener el NIE como parte local';
		end if;
		v_nie := v_local;
	end if;

	insert into public.perfiles (id, rol, nombre, nie)
	values (
		new.id,
		v_role,
		coalesce(v_nombre, nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '')),
		v_nie
	);

	if not v_es_primer_admin then
		update public.invitaciones_correo
		set usado_en = now(),
				usado_por = new.id
		where email = v_email
			and rol_destino = v_role
			and usado_en is null
			and revocado_en is null;
	end if;

	return new;
end;
$$;

revoke all on function public.intiwo_handle_new_auth_user() from public, anon, authenticated;

drop trigger if exists intiwo_auth_user_profile on auth.users;
create trigger intiwo_auth_user_profile
after insert on auth.users
for each row execute function public.intiwo_handle_new_auth_user();

create or replace function public.intiwo_rol_actual()
returns text
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select p.rol
	from public.perfiles p
	where p.id = (select auth.uid())
		and p.desactivado_en is null
$$;

create or replace function public.intiwo_es_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select coalesce(public.intiwo_rol_actual() = 'administrador', false)
$$;

revoke all on function public.intiwo_rol_actual() from public, anon;
revoke all on function public.intiwo_es_admin() from public, anon;
grant execute on function public.intiwo_rol_actual() to authenticated;
grant execute on function public.intiwo_es_admin() to authenticated;

alter table public.perfiles enable row level security;
alter table public.invitaciones_correo enable row level security;

revoke all on table public.perfiles from anon, authenticated;
grant select (id, rol, nombre, nombres, apellidos, tema, desactivado_en, created_at, updated_at)
	on table public.perfiles to authenticated;
grant update (tema) on table public.perfiles to authenticated;

drop policy if exists perfiles_select_propios_o_admin on public.perfiles;
create policy perfiles_select_propios_o_admin
	on public.perfiles for select to authenticated
	using (id = (select auth.uid()) or public.intiwo_es_admin());

drop policy if exists perfiles_update_tema_propio on public.perfiles;
create policy perfiles_update_tema_propio
	on public.perfiles for update to authenticated
	using (id = (select auth.uid()) and desactivado_en is null)
	with check (id = (select auth.uid()) and desactivado_en is null);

revoke all on table public.invitaciones_correo from anon, authenticated;
grant select, insert on table public.invitaciones_correo to authenticated;
grant update (revocado_en) on table public.invitaciones_correo to authenticated;

drop policy if exists invitaciones_select_admin_invitador on public.invitaciones_correo;
create policy invitaciones_select_admin_invitador
	on public.invitaciones_correo for select to authenticated
	using (public.intiwo_es_admin() or invitado_por = (select auth.uid()));

drop policy if exists invitaciones_insert_admin on public.invitaciones_correo;
create policy invitaciones_insert_admin
	on public.invitaciones_correo for insert to authenticated
	with check (
		public.intiwo_es_admin()
		and invitado_por = (select auth.uid())
		and (
			rol_destino in ('docente', 'editor', 'academico')
			or (rol_destino = 'administrador' and lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'intiwo11543@gmail.com')
		)
	);

drop policy if exists invitaciones_revocar_admin on public.invitaciones_correo;
create policy invitaciones_revocar_admin
	on public.invitaciones_correo for update to authenticated
	using (public.intiwo_es_admin() or invitado_por = (select auth.uid()))
	with check (public.intiwo_es_admin() or invitado_por = (select auth.uid()));
