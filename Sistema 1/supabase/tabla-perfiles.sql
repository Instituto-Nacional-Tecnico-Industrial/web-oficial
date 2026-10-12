-- INTIWO SQL | tabla de perfiles; aplicar despues de aprobar el DER.
-- El correo y las credenciales permanecen en auth.users/Auth; nunca se guarda NIE en claro.

create table if not exists public.perfiles (
	id uuid primary key references auth.users (id) on delete restrict,
	rol text not null check (rol in ('administrador', 'docente', 'editor')),
	nombre text,
	tema text not null default 'dark' check (tema in ('light', 'dark')),
	desactivado_en timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create or replace function public.intiwo_actualizar_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
	new.updated_at := now();
	return new;
end;
$$;

drop trigger if exists perfiles_actualizar_updated_at on public.perfiles;
create trigger perfiles_actualizar_updated_at
before update on public.perfiles
for each row execute function public.intiwo_actualizar_updated_at();
