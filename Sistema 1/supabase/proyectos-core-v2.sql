-- INTIWO | Contrato base de proyectos y sus permisos.
-- Candidato para revision; no ejecutar hasta cerrar las megatareas y recibir
-- instruccion expresa del Instituto. No reemplaza SQL de Auth/invitaciones.

begin;

create table if not exists public.ciclos_lectivos (
	anio smallint primary key check (anio >= 2026),
	es_actual boolean not null default false,
	abierto_por uuid references public.perfiles (id) on delete set null,
	abierto_en timestamptz not null default now()
);

insert into public.ciclos_lectivos (anio, es_actual)
values (2026, true)
on conflict (anio) do nothing;

create unique index if not exists ciclos_lectivos_un_actual
	on public.ciclos_lectivos ((es_actual))
	where es_actual;

create table if not exists public.proyectos (
	id uuid primary key default gen_random_uuid(),
	tipo text not null check (tipo in ('tecnico', 'academico')),
	codigo_id uuid references public.codigos (id) on delete restrict,
	anio_lectivo smallint not null references public.ciclos_lectivos (anio) on delete restrict,
	asignatura_id uuid references public.especialidades (id) on delete restrict,
	creado_por uuid not null references public.perfiles (id) on delete restrict,
	docente_nombre text not null default '',
	titulo text not null default '',
	descripcion text not null default '',
	cuerpo text not null default '',
	integrantes jsonb not null default '[]'::jsonb check (jsonb_typeof(integrantes) = 'array'),
	urls jsonb not null default '[]'::jsonb check (jsonb_typeof(urls) = 'array'),
	publicado boolean not null default false,
	edicion_bloqueada boolean not null default false,
	archivado_en timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint proyectos_tipo_contexto_check check (
		(tipo = 'tecnico' and codigo_id is not null and asignatura_id is null)
		or (tipo = 'academico' and codigo_id is null and asignatura_id is not null)
	)
);

create table if not exists public.proyecto_editores (
	id uuid primary key default gen_random_uuid(),
	proyecto_id uuid not null references public.proyectos (id) on delete restrict,
	editor_id uuid not null references public.perfiles (id) on delete restrict,
	asignado_por uuid not null references public.perfiles (id) on delete restrict,
	asignado_en timestamptz not null default now(),
	revocado_en timestamptz
);

create table if not exists public.proyecto_docente (
	proyecto_id uuid not null references public.proyectos (id) on delete restrict,
	docente_id uuid not null references public.perfiles (id) on delete restrict,
	asignado_por uuid not null references public.perfiles (id) on delete restrict,
	created_at timestamptz not null default now(),
	primary key (proyecto_id, docente_id)
);

create table if not exists public.proyecto_codigo_mano_obra (
	proyecto_id uuid not null references public.proyectos (id) on delete restrict,
	codigo_id uuid not null references public.codigos (id) on delete restrict,
	created_at timestamptz not null default now(),
	primary key (proyecto_id, codigo_id)
);

create table if not exists public.etiquetas (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	nombre text not null,
	familia text not null,
	created_at timestamptz not null default now()
);

create table if not exists public.especialidad_nombres (
	especialidad_id uuid not null references public.especialidades (id) on delete restrict,
	anio_lectivo smallint not null references public.ciclos_lectivos (anio) on delete restrict,
	nombre text not null check (length(btrim(nombre)) between 2 and 160),
	nombre_corto text not null check (length(btrim(nombre_corto)) between 2 and 80),
	actualizado_por uuid references public.perfiles (id) on delete set null,
	actualizado_en timestamptz not null default now(),
	primary key (especialidad_id, anio_lectivo)
);

insert into public.especialidad_nombres (
	especialidad_id, anio_lectivo, nombre, nombre_corto
)
select e.id, c.anio, e.nombre, e.nombre_corto
from public.especialidades e
cross join public.ciclos_lectivos c
where c.anio = 2026
on conflict (especialidad_id, anio_lectivo) do nothing;

create table if not exists public.proyecto_etiqueta (
	proyecto_id uuid not null references public.proyectos (id) on delete restrict,
	etiqueta_id uuid not null references public.etiquetas (id) on delete restrict,
	agregado_por uuid not null references public.perfiles (id) on delete restrict,
	created_at timestamptz not null default now(),
	primary key (proyecto_id, etiqueta_id)
);

create index if not exists proyectos_codigo_ciclo_idx on public.proyectos (codigo_id, anio_lectivo);
create index if not exists proyectos_asignatura_ciclo_idx on public.proyectos (asignatura_id, anio_lectivo);
create index if not exists proyectos_editor_activo_idx on public.proyecto_editores (editor_id, proyecto_id) where revocado_en is null;
create unique index if not exists proyecto_editores_activo_uq
	on public.proyecto_editores (proyecto_id, editor_id)
	where revocado_en is null;
create index if not exists proyectos_docente_idx on public.proyecto_docente (docente_id, proyecto_id);
create index if not exists proyecto_etiqueta_etiqueta_idx on public.proyecto_etiqueta (etiqueta_id, proyecto_id);
create unique index if not exists proyectos_titulo_unico_activo
	on public.proyectos (lower(btrim(titulo)))
	where archivado_en is null and length(btrim(titulo)) > 0;

create or replace function public.intiwo_proyecto_actualizar_fecha()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
	new.updated_at := now();
	return new;
end;
$$;

drop trigger if exists proyectos_actualizar_fecha on public.proyectos;
create trigger proyectos_actualizar_fecha
before update on public.proyectos
for each row execute function public.intiwo_proyecto_actualizar_fecha();

create or replace function public.intiwo_proyecto_validar_contexto()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
	if new.tipo = 'tecnico' and not exists (
		select 1
		from public.codigos c
		join public.especialidades e on e.id = c.especialidad_id
		where c.id = new.codigo_id
			and c.anio_lectivo = new.anio_lectivo
			and e.tipo = 'tecnica'
	) then
		raise exception 'El proyecto técnico debe usar un código técnico del mismo ciclo.'
			using errcode = '23514';
	end if;

	if new.tipo = 'academico' and not exists (
		select 1
		from public.especialidades e
		where e.id = new.asignatura_id
			and e.tipo = 'academico'
	) then
		raise exception 'El proyecto académico debe vincularse a una asignatura académica.'
			using errcode = '23514';
	end if;

	return new;
end;
$$;
revoke all on function public.intiwo_proyecto_validar_contexto() from public, anon, authenticated;

drop trigger if exists proyectos_validar_contexto on public.proyectos;
create trigger proyectos_validar_contexto
before insert or update of tipo, codigo_id, anio_lectivo, asignatura_id on public.proyectos
for each row execute function public.intiwo_proyecto_validar_contexto();

create or replace function public.intiwo_proyecto_puede_gestionar(p_proyecto_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select coalesce(public.intiwo_es_admin(), false)
		or exists (
			select 1
			from public.proyectos p
			left join public.codigos c on c.id = p.codigo_id
			where p.id = p_proyecto_id
				and (
					(
						p.tipo = 'tecnico'
						and c.docente_id = (select auth.uid())
						and public.intiwo_rol_actual() = 'docente'
					)
					or (
						p.tipo = 'academico'
						and public.intiwo_rol_actual() in ('docente', 'academico')
						and (
							p.creado_por = (select auth.uid())
							or exists (
								select 1 from public.proyecto_docente pd
								where pd.proyecto_id = p.id
									and pd.docente_id = (select auth.uid())
							)
						)
					)
				)
		)
$$;

create or replace function public.intiwo_editor_proyecto_activo(p_proyecto_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select public.intiwo_rol_actual() = 'editor'
		and exists (
			select 1
			from public.proyecto_editores pe
			join public.perfiles e on e.id = pe.editor_id
			join public.proyectos p on p.id = pe.proyecto_id
			where pe.proyecto_id = p_proyecto_id
				and p.tipo = 'tecnico'
				and pe.editor_id = (select auth.uid())
				and pe.revocado_en is null
				and e.desactivado_en is null
				and p.archivado_en is null
				and not p.edicion_bloqueada
		)
$$;

create or replace function public.intiwo_proyecto_visible(p_proyecto_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select exists (
		select 1
		from public.proyectos p
		where p.id = p_proyecto_id
			and (
				(p.publicado and p.archivado_en is null)
				or public.intiwo_es_admin()
				or public.intiwo_proyecto_puede_gestionar(p.id)
				or exists (
					select 1 from public.proyecto_editores pe
					join public.perfiles e on e.id = pe.editor_id
					where pe.proyecto_id = p.id
						and pe.editor_id = (select auth.uid())
						and pe.revocado_en is null
						and e.desactivado_en is null
				)
			)
	)
$$;

create or replace function public.intiwo_gestionar_estado_proyecto(
	p_proyecto_id uuid,
	p_publicado boolean,
	p_edicion_bloqueada boolean,
	p_archivado boolean
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
	v_rol text := public.intiwo_rol_actual();
	v_edicion_bloqueada boolean;
begin
	if not (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(p_proyecto_id)) then
	raise exception 'No tienes permiso para cambiar el estado de este proyecto.'
		using errcode = '42501';
	end if;

	select edicion_bloqueada into v_edicion_bloqueada
	from public.proyectos
	where id = p_proyecto_id
	for update;
	if not found then
		raise exception 'El proyecto no existe.' using errcode = 'P0002';
	end if;
	if v_rol = 'academico' and p_edicion_bloqueada is distinct from v_edicion_bloqueada then
		raise exception 'El rol Académico no puede bloquear ni habilitar la edición.'
			using errcode = '42501';
	end if;

	update public.proyectos
	set publicado = p_publicado,
	edicion_bloqueada = p_edicion_bloqueada,
	archivado_en = case when p_archivado then coalesce(archivado_en, now()) else null end
	where id = p_proyecto_id;
end;
$$;

create or replace function public.intiwo_gestionar_editores_proyecto(
	p_proyecto_id uuid,
	p_editor_ids uuid[] default '{}'
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_tipo text;
	v_codigo_id uuid;
	v_editor_ids uuid[];
begin
	select tipo, codigo_id into v_tipo, v_codigo_id
	from public.proyectos
	where id = p_proyecto_id
	for update;
	if not found then
		raise exception 'El proyecto no existe.' using errcode = 'P0002';
	end if;

	if not (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(p_proyecto_id)) then
		raise exception 'No tienes permiso para gestionar este proyecto.'
			using errcode = '42501';
	end if;

	select coalesce(array_agg(distinct ids.editor_id), '{}'::uuid[])
	into v_editor_ids
	from unnest(coalesce(p_editor_ids, '{}'::uuid[])) ids(editor_id)
	where ids.editor_id is not null;

	if exists (
		select 1
		from unnest(v_editor_ids) ids(editor_id)
		left join public.perfiles e on e.id = ids.editor_id
		left join public.miembro_codigo m
			on m.perfil_id = ids.editor_id
			and m.codigo_id = v_codigo_id
			and m.desactivado_en is null
		where e.id is null
			or e.rol <> 'editor'
			or e.desactivado_en is not null
			or (v_tipo = 'tecnico' and m.perfil_id is null)
	) then
		raise exception 'Cada Editor debe estar activo y pertenecer al código del proyecto técnico.'
			using errcode = '23514';
	end if;

	update public.proyecto_editores
	set revocado_en = now()
	where proyecto_id = p_proyecto_id
		and revocado_en is null
		and not (editor_id = any(v_editor_ids));

	insert into public.proyecto_editores (proyecto_id, editor_id, asignado_por)
	select p_proyecto_id, ids.editor_id, (select auth.uid())
	from unnest(v_editor_ids) ids(editor_id)
	where not exists (
		select 1
		from public.proyecto_editores pe
		where pe.proyecto_id = p_proyecto_id
			and pe.editor_id = ids.editor_id
			and pe.revocado_en is null
	);
end;
$$;

create or replace function public.intiwo_crear_proyecto_tecnico(
	p_codigo_id uuid,
	p_editor_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_proyecto_id uuid;
	v_anio smallint;
	v_docente_nombre text;
begin
	select c.anio_lectivo,
		coalesce(
			nullif(btrim(concat_ws(' ', p.nombres, p.apellidos)), ''),
			p.nombre,
			''
		)
	into v_anio, v_docente_nombre
	from public.codigos c
	join public.perfiles p on p.id = c.docente_id
	where c.id = p_codigo_id
	and c.desactivado_en is null
	and (
		public.intiwo_es_admin()
		or (c.docente_id = (select auth.uid()) and public.intiwo_rol_actual() = 'docente')
	);

	if v_anio is null then
	raise exception 'No tienes permiso para crear proyectos en este código o el código no está activo.'
		using errcode = '42501';
	end if;

	if exists (
	select 1
	from unnest(coalesce(p_editor_ids, '{}'::uuid[])) ids(editor_id)
	left join public.perfiles e on e.id = ids.editor_id
	left join public.miembro_codigo m
		on m.perfil_id = ids.editor_id
		and m.codigo_id = p_codigo_id
		and m.desactivado_en is null
	where e.id is null
		or e.rol <> 'editor'
		or e.desactivado_en is not null
		or m.perfil_id is null
	) then
	raise exception 'Cada Editor asignado debe tener cuenta activa y pertenecer al mismo código.'
		using errcode = '23514';
	end if;

	insert into public.proyectos (
	tipo, codigo_id, anio_lectivo, creado_por, docente_nombre
	) values (
	'tecnico', p_codigo_id, v_anio, (select auth.uid()), v_docente_nombre
	)
	returning id into v_proyecto_id;

	insert into public.proyecto_editores (proyecto_id, editor_id, asignado_por)
	select v_proyecto_id, ids.editor_id, (select auth.uid())
	from (
	select distinct unnest(coalesce(p_editor_ids, '{}'::uuid[])) as editor_id
	) ids;

	return v_proyecto_id;
end;
$$;

create or replace function public.intiwo_listar_docentes_academicos()
returns table (perfil_id uuid, nombre_visible text)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
begin
	if coalesce(public.intiwo_rol_actual(), '') not in ('docente', 'academico', 'administrador') then
		raise exception 'Solo Docentes, Académicos y Administradores pueden consultar autores académicos.'
			using errcode = '42501';
	end if;

	return query
	select p.id,
		coalesce(nullif(btrim(concat_ws(' ', p.nombres, p.apellidos)), ''), p.nombre, 'Docente')
	from public.perfiles p
	where p.rol in ('docente', 'academico')
		and p.desactivado_en is null
	order by 2;
end;
$$;

create or replace function public.intiwo_crear_proyecto_academico(
	p_asignatura_id uuid,
	p_anio_lectivo smallint,
	p_docente_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_proyecto_id uuid;
	v_rol text := public.intiwo_rol_actual();
	v_docente_ids uuid[];
begin
	if coalesce(v_rol, '') not in ('docente', 'academico', 'administrador') then
		raise exception 'Solo Docentes, Académicos y Administradores pueden crear proyectos académicos.'
			using errcode = '42501';
	end if;

	if not exists (
		select 1 from public.ciclos_lectivos c where c.anio = p_anio_lectivo
	) then
		raise exception 'El año lectivo seleccionado no existe.'
			using errcode = '23503';
	end if;

	if not exists (
		select 1 from public.especialidades e
		where e.id = p_asignatura_id and e.tipo = 'academico'
	) then
		raise exception 'La asignatura seleccionada no existe o no es académica.'
			using errcode = '23514';
	end if;

	select coalesce(array_agg(distinct ids.docente_id), '{}'::uuid[])
	into v_docente_ids
	from unnest(coalesce(p_docente_ids, '{}'::uuid[])) ids(docente_id)
	where ids.docente_id is not null;

	if v_rol in ('docente', 'academico')
		and not ((select auth.uid()) = any(v_docente_ids)) then
		v_docente_ids := array_append(v_docente_ids, (select auth.uid()));
	end if;

	if cardinality(v_docente_ids) = 0 then
		raise exception 'Asigna al menos un Docente autor al proyecto académico.'
			using errcode = '23514';
	end if;

	if exists (
		select 1
		from unnest(v_docente_ids) ids(docente_id)
		left join public.perfiles p on p.id = ids.docente_id
		where p.id is null or p.rol not in ('docente', 'academico') or p.desactivado_en is not null
	) then
		raise exception 'Cada autor debe ser un Docente o Académico activo.'
			using errcode = '23514';
	end if;

	insert into public.proyectos (
		tipo, codigo_id, anio_lectivo, asignatura_id, creado_por
	) values (
		'academico', null, p_anio_lectivo, p_asignatura_id, (select auth.uid())
	)
	returning id into v_proyecto_id;

	insert into public.proyecto_docente (proyecto_id, docente_id, asignado_por)
	select v_proyecto_id, ids.docente_id, (select auth.uid())
	from unnest(v_docente_ids) ids(docente_id);

	return v_proyecto_id;
end;
$$;

create or replace function public.intiwo_gestionar_docentes_proyecto(
	p_proyecto_id uuid,
	p_docente_ids uuid[] default '{}'
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_tipo text;
	v_creado_por uuid;
	v_rol text := public.intiwo_rol_actual();
	v_docente_ids uuid[];
begin
	select tipo, creado_por into v_tipo, v_creado_por
	from public.proyectos
	where id = p_proyecto_id
	for update;
	if not found then
		raise exception 'El proyecto no existe.' using errcode = 'P0002';
	end if;
	if v_tipo <> 'academico' then
		raise exception 'La autoría por Docentes solo aplica a proyectos académicos.'
			using errcode = '23514';
	end if;
	if not (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(p_proyecto_id)) then
		raise exception 'No tienes permiso para gestionar la autoría de este proyecto.'
			using errcode = '42501';
	end if;

	select coalesce(array_agg(distinct ids.docente_id), '{}'::uuid[])
	into v_docente_ids
	from unnest(coalesce(p_docente_ids, '{}'::uuid[])) ids(docente_id)
	where ids.docente_id is not null;

	if cardinality(v_docente_ids) = 0 then
		raise exception 'Asigna al menos un Docente o Académico autor al proyecto académico.'
			using errcode = '23514';
	end if;
	if exists (
		select 1 from public.perfiles creador
		where creador.id = v_creado_por
			and creador.rol in ('docente', 'academico')
	)
		and not (v_creado_por = any(v_docente_ids)) then
		raise exception 'El Docente o Académico que creó el proyecto debe conservar su autoría.'
			using errcode = '42501';
	end if;
	if exists (
		select 1
		from unnest(v_docente_ids) ids(docente_id)
		left join public.perfiles p on p.id = ids.docente_id
		where p.id is null or p.rol not in ('docente', 'academico') or p.desactivado_en is not null
	) then
		raise exception 'Cada autor debe ser un Docente o Académico activo.'
			using errcode = '23514';
	end if;

	delete from public.proyecto_docente where proyecto_id = p_proyecto_id;
	insert into public.proyecto_docente (proyecto_id, docente_id, asignado_por)
	select p_proyecto_id, ids.docente_id, (select auth.uid())
	from unnest(v_docente_ids) ids(docente_id);
end;
$$;

create or replace function public.intiwo_listar_codigos_mano_obra(p_anio_lectivo smallint)
returns table (codigo_id uuid, clave text, nivel smallint, especialidad text)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
begin
	if coalesce(public.intiwo_rol_actual(), '') not in ('academico', 'docente', 'administrador') then
		raise exception 'Solo Académicos, Docentes y Administradores pueden consultar códigos de mano de obra.'
			using errcode = '42501';
	end if;

	return query
	select c.id, c.clave, c.nivel, e.nombre_corto
	from public.codigos c
	join public.especialidades e on e.id = c.especialidad_id
	where c.anio_lectivo = p_anio_lectivo
		and c.nivel in (1, 2)
		and c.desactivado_en is null
		and e.tipo = 'tecnica'
	order by c.clave;
end;
$$;

create or replace function public.intiwo_gestionar_codigos_mano_obra(
	p_proyecto_id uuid,
	p_codigo_ids uuid[] default '{}'
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_anio smallint;
	v_tipo text;
	v_codigo_ids uuid[];
begin
	select tipo, anio_lectivo into v_tipo, v_anio
	from public.proyectos
	where id = p_proyecto_id
	for update;
	if not found then
		raise exception 'El proyecto no existe.' using errcode = 'P0002';
	end if;
	if v_tipo <> 'academico' then
		raise exception 'Los códigos de mano de obra solo se asignan a proyectos académicos.'
			using errcode = '23514';
	end if;
	if not (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(p_proyecto_id)) then
		raise exception 'No tienes permiso para gestionar este proyecto.'
			using errcode = '42501';
	end if;

	select coalesce(array_agg(distinct ids.codigo_id), '{}'::uuid[])
	into v_codigo_ids
	from unnest(coalesce(p_codigo_ids, '{}'::uuid[])) ids(codigo_id)
	where ids.codigo_id is not null;

	if exists (
		select 1
		from unnest(v_codigo_ids) ids(codigo_id)
		left join public.codigos c on c.id = ids.codigo_id
		left join public.especialidades e on e.id = c.especialidad_id
		where c.id is null
			or c.anio_lectivo <> v_anio
			or c.nivel not in (1, 2)
			or c.desactivado_en is not null
			or e.tipo <> 'tecnica'
	) then
		raise exception 'Cada código debe ser técnico, activo y de nivel 1 o 2 en el mismo ciclo del proyecto.'
			using errcode = '23514';
	end if;

	delete from public.proyecto_codigo_mano_obra
	where proyecto_id = p_proyecto_id
		and not (codigo_id = any(v_codigo_ids));

	insert into public.proyecto_codigo_mano_obra (proyecto_id, codigo_id)
	select p_proyecto_id, ids.codigo_id
	from unnest(v_codigo_ids) ids(codigo_id)
	on conflict (proyecto_id, codigo_id) do nothing;
end;
$$;

create or replace function public.intiwo_proyecto_codigos_mano_obra(p_proyecto_id uuid)
returns table (clave text)
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select c.clave
	from public.proyecto_codigo_mano_obra pcm
	join public.codigos c on c.id = pcm.codigo_id
	join public.proyectos p on p.id = pcm.proyecto_id
	where pcm.proyecto_id = p_proyecto_id
		and p.tipo = 'academico'
		and public.intiwo_proyecto_visible(p.id)
	order by c.clave
$$;

create or replace function public.intiwo_proyecto_autores_publicos(p_proyecto_id uuid)
returns table (nombre_visible text)
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select coalesce(nullif(btrim(concat_ws(' ', p.nombres, p.apellidos)), ''), p.nombre, 'Docente')
	from public.proyecto_docente pd
	join public.proyectos pr on pr.id = pd.proyecto_id
	join public.perfiles p on p.id = pd.docente_id
	where pd.proyecto_id = p_proyecto_id
		and pr.tipo = 'academico'
		and public.intiwo_proyecto_visible(pr.id)
	order by 2
$$;

create or replace function public.intiwo_puede_gestionar_etiquetas(p_proyecto_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select coalesce(
		public.intiwo_es_admin()
		or (
			public.intiwo_proyecto_puede_gestionar(p_proyecto_id)
			and (
				public.intiwo_rol_actual() <> 'academico'
				or exists (
					select 1 from public.proyectos p
					where p.id = p_proyecto_id
						and p.archivado_en is null
						and not p.edicion_bloqueada
				)
			)
		)
		or public.intiwo_editor_proyecto_activo(p_proyecto_id),
		false
	)
$$;

create or replace function public.intiwo_gestionar_etiquetas_proyecto(
	p_proyecto_id uuid,
	p_etiqueta_ids uuid[] default '{}'
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_etiqueta_ids uuid[];
	v_cantidad_validada integer;
begin
	if not public.intiwo_puede_gestionar_etiquetas(p_proyecto_id) then
		raise exception 'No tienes permiso para cambiar las etiquetas de este proyecto.'
			using errcode = '42501';
	end if;

	perform 1 from public.proyectos where id = p_proyecto_id for update;
	if not found then
		raise exception 'El proyecto no existe.' using errcode = '23503';
	end if;

	select coalesce(array_agg(distinct ids.etiqueta_id), '{}'::uuid[])
	into v_etiqueta_ids
	from unnest(coalesce(p_etiqueta_ids, '{}'::uuid[])) ids(etiqueta_id)
	where ids.etiqueta_id is not null;

	select count(*) into v_cantidad_validada
	from public.etiquetas e
	where e.id = any(v_etiqueta_ids);
	if v_cantidad_validada <> cardinality(v_etiqueta_ids) then
		raise exception 'Una o más etiquetas no pertenecen al catálogo permitido.'
			using errcode = '23514';
	end if;

	delete from public.proyecto_etiqueta pe
	where pe.proyecto_id = p_proyecto_id
		and not (pe.etiqueta_id = any(v_etiqueta_ids));

	insert into public.proyecto_etiqueta (proyecto_id, etiqueta_id, agregado_por)
	select p_proyecto_id, ids.etiqueta_id, (select auth.uid())
	from unnest(v_etiqueta_ids) ids(etiqueta_id)
	on conflict (proyecto_id, etiqueta_id) do nothing;
end;
$$;

create or replace function public.intiwo_admin_guardar_nombre_especialidad_ciclo(
	p_especialidad_id uuid,
	p_anio_lectivo smallint,
	p_nombre text,
	p_nombre_corto text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
begin
	if not public.intiwo_es_admin() then
		raise exception 'Solo un Administrador puede cambiar los nombres por ciclo.'
			using errcode = '42501';
	end if;
	if length(btrim(coalesce(p_nombre, ''))) not between 2 and 160
		or length(btrim(coalesce(p_nombre_corto, ''))) not between 2 and 80 then
		raise exception 'El nombre debe tener entre 2 y 160 caracteres y el nombre corto entre 2 y 80.'
			using errcode = '22023';
	end if;
	if not exists (select 1 from public.especialidades where id = p_especialidad_id) then
		raise exception 'La especialidad no existe.' using errcode = '23503';
	end if;
	if not exists (select 1 from public.ciclos_lectivos where anio = p_anio_lectivo) then
		raise exception 'El ciclo lectivo no existe.' using errcode = '23503';
	end if;

	insert into public.especialidad_nombres (
		especialidad_id, anio_lectivo, nombre, nombre_corto, actualizado_por, actualizado_en
	) values (
		p_especialidad_id, p_anio_lectivo, btrim(p_nombre), btrim(p_nombre_corto),
		(select auth.uid()), now()
	)
	on conflict (especialidad_id, anio_lectivo) do update
	set nombre = excluded.nombre,
		nombre_corto = excluded.nombre_corto,
		actualizado_por = excluded.actualizado_por,
		actualizado_en = excluded.actualizado_en;
end;
$$;

create or replace function public.intiwo_admin_crear_ciclo(p_anio_lectivo smallint)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_ultimo_anio smallint;
begin
	if not public.intiwo_es_admin() then
		raise exception 'Solo un Administrador puede incorporar un ciclo lectivo.'
			using errcode = '42501';
	end if;

	perform pg_advisory_xact_lock(20261018, 7);
	select max(anio) into v_ultimo_anio from public.ciclos_lectivos;
	if p_anio_lectivo <> v_ultimo_anio + 1 then
		raise exception 'Solo se puede incorporar el siguiente ciclo lectivo (%).', v_ultimo_anio + 1
			using errcode = '22023';
	end if;

	insert into public.ciclos_lectivos (anio, es_actual, abierto_por)
	values (p_anio_lectivo, false, (select auth.uid()));

	insert into public.especialidad_nombres (
		especialidad_id, anio_lectivo, nombre, nombre_corto
	)
	select e.id, p_anio_lectivo,
		coalesce(anterior.nombre, e.nombre),
		coalesce(anterior.nombre_corto, e.nombre_corto)
	from public.especialidades e
	left join public.especialidad_nombres anterior
		on anterior.especialidad_id = e.id
		and anterior.anio_lectivo = v_ultimo_anio;

	update public.ciclos_lectivos set es_actual = false where es_actual;
	update public.ciclos_lectivos
	set es_actual = true
	where anio = p_anio_lectivo;
end;
$$;

create or replace function public.intiwo_admin_establecer_ciclo_actual(p_anio_lectivo smallint)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
begin
	if not public.intiwo_es_admin() then
		raise exception 'Solo un Administrador puede cambiar el ciclo lectivo actual.'
			using errcode = '42501';
	end if;
	if not exists (select 1 from public.ciclos_lectivos where anio = p_anio_lectivo) then
		raise exception 'El ciclo lectivo no existe.' using errcode = '23503';
	end if;

	update public.ciclos_lectivos set es_actual = false where es_actual;
	update public.ciclos_lectivos set es_actual = true where anio = p_anio_lectivo;
end;
$$;

revoke all on function public.intiwo_proyecto_puede_gestionar(uuid) from public, anon;
revoke all on function public.intiwo_editor_proyecto_activo(uuid) from public, anon;
revoke all on function public.intiwo_proyecto_visible(uuid) from public, anon;
revoke all on function public.intiwo_gestionar_estado_proyecto(uuid, boolean, boolean, boolean) from public, anon;
revoke all on function public.intiwo_gestionar_editores_proyecto(uuid, uuid[]) from public, anon;
revoke all on function public.intiwo_crear_proyecto_tecnico(uuid, uuid[]) from public, anon;
revoke all on function public.intiwo_listar_docentes_academicos() from public, anon;
revoke all on function public.intiwo_crear_proyecto_academico(uuid, smallint, uuid[]) from public, anon;
revoke all on function public.intiwo_gestionar_docentes_proyecto(uuid, uuid[]) from public, anon;
revoke all on function public.intiwo_listar_codigos_mano_obra(smallint) from public, anon;
revoke all on function public.intiwo_gestionar_codigos_mano_obra(uuid, uuid[]) from public, anon;
revoke all on function public.intiwo_proyecto_codigos_mano_obra(uuid) from public;
revoke all on function public.intiwo_proyecto_autores_publicos(uuid) from public, anon;
revoke all on function public.intiwo_puede_gestionar_etiquetas(uuid) from public, anon;
revoke all on function public.intiwo_gestionar_etiquetas_proyecto(uuid, uuid[]) from public, anon;
revoke all on function public.intiwo_admin_guardar_nombre_especialidad_ciclo(uuid, smallint, text, text) from public, anon;
revoke all on function public.intiwo_admin_crear_ciclo(smallint) from public, anon;
revoke all on function public.intiwo_admin_establecer_ciclo_actual(smallint) from public, anon;
grant execute on function public.intiwo_proyecto_puede_gestionar(uuid) to authenticated;
grant execute on function public.intiwo_editor_proyecto_activo(uuid) to authenticated;
grant execute on function public.intiwo_proyecto_visible(uuid) to anon, authenticated;
grant execute on function public.intiwo_gestionar_estado_proyecto(uuid, boolean, boolean, boolean) to authenticated;
grant execute on function public.intiwo_gestionar_editores_proyecto(uuid, uuid[]) to authenticated;
grant execute on function public.intiwo_crear_proyecto_tecnico(uuid, uuid[]) to authenticated;
grant execute on function public.intiwo_listar_docentes_academicos() to authenticated;
grant execute on function public.intiwo_crear_proyecto_academico(uuid, smallint, uuid[]) to authenticated;
grant execute on function public.intiwo_gestionar_docentes_proyecto(uuid, uuid[]) to authenticated;
grant execute on function public.intiwo_listar_codigos_mano_obra(smallint) to authenticated;
grant execute on function public.intiwo_gestionar_codigos_mano_obra(uuid, uuid[]) to authenticated;
grant execute on function public.intiwo_proyecto_codigos_mano_obra(uuid) to anon, authenticated;
grant execute on function public.intiwo_proyecto_autores_publicos(uuid) to anon, authenticated;
grant execute on function public.intiwo_puede_gestionar_etiquetas(uuid) to authenticated;
grant execute on function public.intiwo_gestionar_etiquetas_proyecto(uuid, uuid[]) to authenticated;
grant execute on function public.intiwo_admin_guardar_nombre_especialidad_ciclo(uuid, smallint, text, text) to authenticated;
grant execute on function public.intiwo_admin_crear_ciclo(smallint) to authenticated;
grant execute on function public.intiwo_admin_establecer_ciclo_actual(smallint) to authenticated;

alter table public.ciclos_lectivos enable row level security;
alter table public.proyectos enable row level security;
alter table public.proyecto_editores enable row level security;
alter table public.proyecto_docente enable row level security;
alter table public.proyecto_codigo_mano_obra enable row level security;
alter table public.etiquetas enable row level security;
alter table public.especialidad_nombres enable row level security;
alter table public.proyecto_etiqueta enable row level security;

revoke all on public.ciclos_lectivos,
	public.proyectos, public.proyecto_editores, public.proyecto_docente,
	public.proyecto_codigo_mano_obra, public.etiquetas, public.especialidad_nombres,
	public.proyecto_etiqueta
	from public, anon, authenticated;

revoke all on public.ciclos_lectivos from anon, authenticated;
grant select (anio, es_actual, abierto_en) on public.ciclos_lectivos to anon, authenticated;
grant select on public.etiquetas to anon, authenticated;
grant select on public.especialidad_nombres to anon, authenticated;
grant select (
	id, tipo, codigo_id, anio_lectivo, asignatura_id, docente_nombre,
	titulo, descripcion, cuerpo, integrantes, urls, publicado,
	edicion_bloqueada, archivado_en, created_at, updated_at
) on public.proyectos to anon, authenticated;
grant update (titulo, descripcion, cuerpo, integrantes, urls) on public.proyectos to authenticated;
grant select on public.proyecto_editores, public.proyecto_docente,
	public.proyecto_codigo_mano_obra to authenticated;
grant select on public.proyecto_etiqueta to anon, authenticated;

drop policy if exists ciclos_lectivos_publico_select on public.ciclos_lectivos;
create policy ciclos_lectivos_publico_select on public.ciclos_lectivos
	for select to anon, authenticated using (true);
drop policy if exists ciclos_lectivos_admin_write on public.ciclos_lectivos;
create policy ciclos_lectivos_admin_write on public.ciclos_lectivos
	for all to authenticated using (public.intiwo_es_admin()) with check (public.intiwo_es_admin());
drop policy if exists especialidad_nombres_public_select on public.especialidad_nombres;
create policy especialidad_nombres_public_select on public.especialidad_nombres
	for select to anon, authenticated using (true);

drop policy if exists proyectos_visible_select on public.proyectos;
create policy proyectos_visible_select on public.proyectos
	for select to anon, authenticated using (public.intiwo_proyecto_visible(id));
drop policy if exists proyectos_docente_admin_insert on public.proyectos;
drop policy if exists proyectos_editor_contenido_update on public.proyectos;
create policy proyectos_editor_contenido_update on public.proyectos
	for update to authenticated
	using (public.intiwo_editor_proyecto_activo(id))
	with check (public.intiwo_editor_proyecto_activo(id));
drop policy if exists proyectos_docente_admin_update on public.proyectos;
create policy proyectos_docente_admin_update on public.proyectos
	for update to authenticated
	using (
		public.intiwo_es_admin()
		or (
			public.intiwo_proyecto_puede_gestionar(id)
			and (
				public.intiwo_rol_actual() <> 'academico'
				or (archivado_en is null and not edicion_bloqueada)
			)
		)
	)
	with check (
		public.intiwo_es_admin()
		or (
			public.intiwo_proyecto_puede_gestionar(id)
			and (
				public.intiwo_rol_actual() <> 'academico'
				or (archivado_en is null and not edicion_bloqueada)
			)
		)
	);

drop policy if exists proyecto_editores_participantes_select on public.proyecto_editores;
create policy proyecto_editores_participantes_select on public.proyecto_editores
	for select to authenticated
	using (editor_id = (select auth.uid()) or public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id));
drop policy if exists proyecto_editores_gestion_insert on public.proyecto_editores;
create policy proyecto_editores_gestion_insert on public.proyecto_editores
	for insert to authenticated
	with check (
		(public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id))
		and public.intiwo_perfil_editor_activo(editor_id)
	);
drop policy if exists proyecto_editores_gestion_update on public.proyecto_editores;

drop policy if exists proyecto_docente_select on public.proyecto_docente;
create policy proyecto_docente_select on public.proyecto_docente
	for select to authenticated
	using (docente_id = (select auth.uid()) or public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id));
drop policy if exists proyecto_docente_gestion_insert on public.proyecto_docente;
create policy proyecto_docente_gestion_insert on public.proyecto_docente
	for insert to authenticated
	with check (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id));
drop policy if exists proyecto_docente_gestion_update on public.proyecto_docente;
create policy proyecto_docente_gestion_update on public.proyecto_docente
	for update to authenticated
	using (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id))
	with check (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id));

drop policy if exists proyecto_codigo_select on public.proyecto_codigo_mano_obra;
create policy proyecto_codigo_select on public.proyecto_codigo_mano_obra
	for select to authenticated
	using (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id));
drop policy if exists proyecto_codigo_gestion_insert on public.proyecto_codigo_mano_obra;
create policy proyecto_codigo_gestion_insert on public.proyecto_codigo_mano_obra
	for insert to authenticated
	with check (public.intiwo_es_admin() or public.intiwo_proyecto_puede_gestionar(proyecto_id));

drop policy if exists etiquetas_publico_select on public.etiquetas;
create policy etiquetas_publico_select on public.etiquetas
	for select to anon, authenticated using (true);
drop policy if exists proyecto_etiqueta_visible_select on public.proyecto_etiqueta;
create policy proyecto_etiqueta_visible_select on public.proyecto_etiqueta
	for select to anon, authenticated using (public.intiwo_proyecto_visible(proyecto_id));
drop policy if exists proyecto_etiqueta_editor_insert on public.proyecto_etiqueta;
commit;
