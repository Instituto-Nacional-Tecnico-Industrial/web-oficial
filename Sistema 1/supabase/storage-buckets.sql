-- INTIWO | 186/142: bucket publico `inicio`. Escritura solo administrador. No crear bucket personal (0-05).
-- Preferir pegar UNA vez `contenido-inicio-cms.sql` (incluye este bucket). Necesita intiwo_es_admin.

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

-- Lectura publica. Escritura admin. Nombre = uuid.ext (sin carpetas arbitrarias).
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
