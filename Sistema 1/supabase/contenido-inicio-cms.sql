-- INTIWO | 55/77/186: pegar UNA vez. Tabla contenido_inicio + bucket inicio.
-- Requiere intiwo_es_admin() (login-invitaciones-minimo / politicas-rls ya aplicadas).

create table if not exists public.contenido_inicio (
	id smallint primary key default 1 check (id = 1),
	contenido jsonb not null default '{"bloques":[]}'::jsonb,
	updated_by uuid references public.perfiles (id) on delete set null,
	updated_at timestamptz not null default now(),
	constraint contenido_inicio_bloques_objeto check (
		jsonb_typeof(contenido) = 'object'
		and contenido ? 'bloques'
		and jsonb_typeof(contenido -> 'bloques') = 'array'
	)
);

comment on table public.contenido_inicio is 'Fila unica del Inicio. Visitante lee; solo administrador escribe.';
comment on column public.contenido_inicio.contenido is 'S1-14a: { bloques: [{ id, plantilla, orden, textos, color, imagen, animacion, capas }] }';

create or replace function public.intiwo_contenido_inicio_antes()
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

drop trigger if exists contenido_inicio_antes on public.contenido_inicio;
create trigger contenido_inicio_antes
	before insert or update on public.contenido_inicio
	for each row execute function public.intiwo_contenido_inicio_antes();

insert into public.contenido_inicio (id, contenido)
values (1, '{"bloques":[]}'::jsonb)
on conflict (id) do nothing;

alter table public.contenido_inicio enable row level security;

revoke all on table public.contenido_inicio from public;
grant select on table public.contenido_inicio to anon, authenticated;
grant insert, update, delete on table public.contenido_inicio to authenticated;

drop policy if exists contenido_inicio_select_publico on public.contenido_inicio;
create policy contenido_inicio_select_publico
	on public.contenido_inicio for select
	to anon, authenticated
	using (true);

drop policy if exists contenido_inicio_insert_admin on public.contenido_inicio;
create policy contenido_inicio_insert_admin
	on public.contenido_inicio for insert
	to authenticated
	with check (public.intiwo_es_admin());

drop policy if exists contenido_inicio_update_admin on public.contenido_inicio;
create policy contenido_inicio_update_admin
	on public.contenido_inicio for update
	to authenticated
	using (public.intiwo_es_admin())
	with check (public.intiwo_es_admin());

drop policy if exists contenido_inicio_delete_admin on public.contenido_inicio;
create policy contenido_inicio_delete_admin
	on public.contenido_inicio for delete
	to authenticated
	using (public.intiwo_es_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'inicio',
	'inicio',
	true,
	5242880,
	array['image/webp', 'image/png', 'image/jpeg', 'image/svg+xml']::text[]
)
on conflict (id) do update
set
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists inicio_objetos_select on storage.objects;
create policy inicio_objetos_select
	on storage.objects for select
	to anon, authenticated
	using (bucket_id = 'inicio');

drop policy if exists inicio_objetos_insert_admin on storage.objects;
create policy inicio_objetos_insert_admin
	on storage.objects for insert
	to authenticated
	with check (
		bucket_id = 'inicio'
		and public.intiwo_es_admin()
		and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|png|jpe?g|svg)$'
	);

drop policy if exists inicio_objetos_update_admin on storage.objects;
create policy inicio_objetos_update_admin
	on storage.objects for update
	to authenticated
	using (bucket_id = 'inicio' and public.intiwo_es_admin())
	with check (
		bucket_id = 'inicio'
		and public.intiwo_es_admin()
		and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|png|jpe?g|svg)$'
	);

drop policy if exists inicio_objetos_delete_admin on storage.objects;
create policy inicio_objetos_delete_admin
	on storage.objects for delete
	to authenticated
	using (bucket_id = 'inicio' and public.intiwo_es_admin());
