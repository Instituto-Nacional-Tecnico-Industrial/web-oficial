-- INTIWO SQL | codigos y membresias persistentes por ciclo lectivo.

create table if not exists public.codigos (
	id uuid primary key default gen_random_uuid(),
	clave text not null unique check (clave ~ '^[A-Z]{2}[123][A-Z]$'),
	especialidad_id uuid not null references public.especialidades (id) on delete restrict,
	nivel smallint not null check (nivel between 1 and 3),
	seccion text not null check (seccion ~ '^[A-Z]$'),
	docente_id uuid not null references public.perfiles (id) on delete restrict,
	anio_lectivo smallint not null,
	desactivado_en timestamptz,
	created_at timestamptz not null default now(),
	unique (especialidad_id, nivel, seccion, anio_lectivo)
);

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
