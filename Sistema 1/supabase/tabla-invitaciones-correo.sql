-- INTIWO SQL | invitaciones para provisionar roles; Auth conserva el email de la cuenta.

create table if not exists public.invitaciones_correo (
	id uuid primary key default gen_random_uuid(),
	email text not null check (email = lower(btrim(email))),
	rol_destino text not null check (rol_destino in ('administrador', 'docente', 'editor', 'academico')),
	codigo_id uuid references public.codigos (id) on delete restrict,
	nombre text,
	n_lista integer check (n_lista is null or n_lista > 0),
	invitado_por uuid references public.perfiles (id) on delete restrict,
	created_at timestamptz not null default now(),
	usado_en timestamptz,
	usado_por uuid references auth.users (id) on delete restrict,
	revocado_en timestamptz,
	constraint invitacion_editor_requiere_codigo check (
		(rol_destino = 'editor' and codigo_id is not null)
		or (rol_destino <> 'editor' and codigo_id is null)
	),
	constraint invitacion_consumo_coherente check (
		(usado_en is null and usado_por is null)
		or (usado_en is not null and usado_por is not null)
	)
);

create unique index if not exists invitaciones_editor_pendientes_email_codigo_uq
	on public.invitaciones_correo (email, codigo_id)
	where rol_destino = 'editor' and usado_en is null and revocado_en is null;

create unique index if not exists invitaciones_staff_pendientes_email_uq
	on public.invitaciones_correo (email)
	where rol_destino <> 'editor' and usado_en is null and revocado_en is null;

create index if not exists invitaciones_codigo_pendientes_idx
	on public.invitaciones_correo (codigo_id, email)
	where usado_en is null and revocado_en is null;
