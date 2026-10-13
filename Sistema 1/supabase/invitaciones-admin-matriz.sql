-- INTIWO | la cuenta matriz puede dar de alta otros administradores
-- Correr UNA vez en SQL Editor (despues de login-invitaciones-minimo.sql)

alter table public.invitaciones_correo
	drop constraint if exists invitaciones_correo_rol_destino_check;

alter table public.invitaciones_correo
	add constraint invitaciones_correo_rol_destino_check
	check (rol_destino in ('administrador', 'docente', 'editor'));

create or replace function public.intiwo_es_admin_matriz()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'intiwo11543@gmail.com'
$$;

revoke all on function public.intiwo_es_admin_matriz() from public, anon;
grant execute on function public.intiwo_es_admin_matriz() to authenticated;

drop policy if exists invitaciones_insert_admin on public.invitaciones_correo;
create policy invitaciones_insert_admin
	on public.invitaciones_correo for insert to authenticated
	with check (
		public.intiwo_es_admin()
		and invitado_por = (select auth.uid())
		and (
			rol_destino in ('docente', 'editor')
			or (rol_destino = 'administrador' and public.intiwo_es_admin_matriz())
		)
	);
