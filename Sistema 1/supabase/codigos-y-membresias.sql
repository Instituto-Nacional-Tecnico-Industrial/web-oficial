-- INTIWO | 184 + 33: especialidades tecnicas (sin GE), codigos, miembro_codigo, membresia al aceptar invitacion
-- Correr UNA vez en SQL Editor. No repetir politicas-rls.sql ni semilla matriz.

create table if not exists public.especialidades (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	nombre text not null,
	nombre_corto text not null,
	prefijo text not null unique check (prefijo ~ '^[A-Z]{2}$'),
	color_hex text,
	tipo text not null check (tipo in ('tecnica', 'academico')),
	orden smallint not null unique,
	created_at timestamptz not null default now(),
	constraint especialidades_hex_valido check (color_hex is null or color_hex ~ '^#[0-9A-Fa-f]{6}$')
);

insert into public.especialidades (slug, nombre, nombre_corto, prefijo, color_hex, tipo, orden)
values
	('automotriz', 'Mantenimiento Automotriz', 'Automotriz', 'MA', '#166534', 'tecnica', 1),
	('mecanica-industrial', 'Mecanica Industrial', 'Mecanica', 'MI', '#EAB308', 'tecnica', 2),
	('desarrollo-software', 'Desarrollo de Software', 'Software', 'DS', '#EA580C', 'tecnica', 3),
	('electronica', 'Electronica', 'Electronica', 'EL', '#0000FF', 'tecnica', 4),
	('infraestructura-tecnologica', 'Infraestructura Tecnologica y Servicios Informaticos', 'ITSI', 'IT', '#64748B', 'tecnica', 5),
	('sistemas-electricos', 'Sistemas Electricos y Energia Renovable', 'Electricos', 'SE', '#E61010', 'tecnica', 6)
on conflict (slug) do nothing;

delete from public.especialidades where prefijo = 'GE' or slug = 'general';

create table if not exists public.codigos (
	id uuid primary key default gen_random_uuid(),
	clave text not null check (clave ~ '^[A-Z]{2}[123][A-Z]$'),
	especialidad_id uuid not null references public.especialidades (id) on delete restrict,
	nivel smallint not null check (nivel between 1 and 3),
	seccion text not null check (seccion ~ '^[A-Z]$'),
	docente_id uuid not null references public.perfiles (id) on delete restrict,
	anio_lectivo smallint not null check (anio_lectivo >= 2026),
	desactivado_en timestamptz,
	created_at timestamptz not null default now(),
	unique (clave, anio_lectivo),
	unique (especialidad_id, nivel, seccion, anio_lectivo)
);

alter table public.codigos drop constraint if exists codigos_clave_key;
create unique index if not exists codigos_clave_anio_uq on public.codigos (clave, anio_lectivo);
create unique index if not exists codigos_grupo_anio_uq on public.codigos (especialidad_id, nivel, seccion, anio_lectivo);

create table if not exists public.miembro_codigo (
	perfil_id uuid not null references public.perfiles (id) on delete restrict,
	codigo_id uuid not null references public.codigos (id) on delete restrict,
	agregado_por uuid not null references public.perfiles (id) on delete restrict,
	n_lista integer check (n_lista is null or n_lista > 0),
	desactivado_en timestamptz,
	created_at timestamptz not null default now(),
	primary key (perfil_id, codigo_id)
);

create index if not exists codigos_docente_activos_idx
	on public.codigos (docente_id, anio_lectivo)
	where desactivado_en is null;

create index if not exists miembro_codigo_codigo_activo_idx
	on public.miembro_codigo (codigo_id, perfil_id)
	where desactivado_en is null;

alter table public.invitaciones_correo
	drop constraint if exists invitaciones_correo_codigo_id_fkey;

alter table public.invitaciones_correo
	add constraint invitaciones_correo_codigo_id_fkey
	foreign key (codigo_id) references public.codigos (id) on delete restrict;

drop index if exists public.invitaciones_pendientes_email_uq;

create unique index if not exists invitaciones_editor_pendientes_email_codigo_uq
	on public.invitaciones_correo (email, codigo_id)
	where rol_destino = 'editor' and usado_en is null and revocado_en is null;

create unique index if not exists invitaciones_staff_pendientes_email_uq
	on public.invitaciones_correo (email)
	where rol_destino <> 'editor' and usado_en is null and revocado_en is null;

create or replace function public.intiwo_es_docente_codigo(p_codigo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select exists (
		select 1
		from public.codigos c
		where c.id = p_codigo_id
			and c.docente_id = (select auth.uid())
			and c.desactivado_en is null
			and public.intiwo_rol_actual() = 'docente'
	)
$$;

revoke all on function public.intiwo_es_docente_codigo(uuid) from public, anon;
grant execute on function public.intiwo_es_docente_codigo(uuid) to authenticated;

alter table public.especialidades enable row level security;
alter table public.codigos enable row level security;
alter table public.miembro_codigo enable row level security;

revoke all on table public.especialidades from anon, authenticated;
grant select on table public.especialidades to anon, authenticated;

revoke all on table public.codigos from anon, authenticated;
grant select on table public.codigos to authenticated;
grant insert, update on table public.codigos to authenticated;

revoke all on table public.miembro_codigo from anon, authenticated;
grant select on table public.miembro_codigo to authenticated;
grant insert on table public.miembro_codigo to authenticated;
grant update (n_lista, desactivado_en) on table public.miembro_codigo to authenticated;

drop policy if exists especialidades_select_publico on public.especialidades;
create policy especialidades_select_publico
	on public.especialidades for select to anon, authenticated
	using (true);

drop policy if exists codigos_select_autenticado on public.codigos;
create policy codigos_select_autenticado
	on public.codigos for select to authenticated
	using (
		public.intiwo_es_admin()
		or docente_id = (select auth.uid())
		or exists (
			select 1 from public.miembro_codigo m
			where m.codigo_id = public.codigos.id
				and m.perfil_id = (select auth.uid())
				and m.desactivado_en is null
		)
	);

drop policy if exists codigos_docente_admin_insert on public.codigos;
create policy codigos_docente_admin_insert
	on public.codigos for insert to authenticated
	with check (
		public.intiwo_es_admin()
		or (public.intiwo_rol_actual() = 'docente' and docente_id = (select auth.uid()))
	);

drop policy if exists miembros_select_propios_docente_admin on public.miembro_codigo;
create policy miembros_select_propios_docente_admin
	on public.miembro_codigo for select to authenticated
	using (
		perfil_id = (select auth.uid())
		or public.intiwo_es_admin()
		or public.intiwo_es_docente_codigo(codigo_id)
	);

drop policy if exists invitaciones_insert_docente_editor on public.invitaciones_correo;
create policy invitaciones_insert_docente_editor
	on public.invitaciones_correo for insert to authenticated
	with check (
		public.intiwo_rol_actual() = 'docente'
		and invitado_por = (select auth.uid())
		and rol_destino = 'editor'
		and codigo_id is not null
		and public.intiwo_es_docente_codigo(codigo_id)
	);

grant update (revocado_en, nombres, apellidos, nombre, rol_destino, codigo_id)
	on public.invitaciones_correo to authenticated;

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
	v_nombres text;
	v_apellidos text;
	v_nie text;
	v_local text;
	v_es_primer_admin boolean := false;
	v_invitation record;
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
		v_es_primer_admin := true;
	else
		select count(distinct i.rol_destino), min(i.rol_destino),
					 max(i.nombre), max(i.nombres), max(i.apellidos)
			into v_role_count, v_role, v_nombre, v_nombres, v_apellidos
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

	v_nombre := coalesce(
		nullif(btrim(concat_ws(' ', v_nombres, v_apellidos)), ''),
		v_nombre,
		nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '')
	);

	insert into public.perfiles (id, rol, nombre, nombres, apellidos, nie)
	values (new.id, v_role, v_nombre, v_nombres, v_apellidos, v_nie);

	if not v_es_primer_admin and v_role = 'editor' then
		for v_invitation in
			select i.codigo_id, i.invitado_por, i.n_lista
			from public.invitaciones_correo i
			where i.email = v_email
				and i.rol_destino = 'editor'
				and i.usado_en is null
				and i.revocado_en is null
				and i.codigo_id is not null
			order by i.created_at, i.id
			for update
		loop
			insert into public.miembro_codigo (perfil_id, codigo_id, agregado_por, n_lista)
			values (new.id, v_invitation.codigo_id, v_invitation.invitado_por, v_invitation.n_lista)
			on conflict (perfil_id, codigo_id) do nothing;
		end loop;
	end if;

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
