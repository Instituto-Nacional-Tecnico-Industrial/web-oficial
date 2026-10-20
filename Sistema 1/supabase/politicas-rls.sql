-- INTIWO SQL | politicas para perfiles, especialidades, codigos, membresias e invitaciones.
-- Proyectos, contenido_inicio, footer_cms y Storage se agregan al cerrar sus tareas DB correspondientes.

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

create or replace function public.intiwo_perfil_editor_activo(p_perfil_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
	select exists (
		select 1
		from public.perfiles p
		where p.id = p_perfil_id
			and p.rol = 'editor'
			and p.desactivado_en is null
	)
$$;

revoke all on function public.intiwo_rol_actual() from public, anon;
revoke all on function public.intiwo_es_admin() from public, anon;
revoke all on function public.intiwo_es_docente_codigo(uuid) from public, anon;
revoke all on function public.intiwo_perfil_editor_activo(uuid) from public, anon;
grant execute on function public.intiwo_rol_actual() to authenticated;
grant execute on function public.intiwo_es_admin() to authenticated;
grant execute on function public.intiwo_es_docente_codigo(uuid) to authenticated;
grant execute on function public.intiwo_perfil_editor_activo(uuid) to authenticated;

alter table public.perfiles enable row level security;
alter table public.especialidades enable row level security;
alter table public.codigos enable row level security;
alter table public.miembro_codigo enable row level security;
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

revoke all on table public.especialidades from anon, authenticated;
grant select on table public.especialidades to anon, authenticated;
grant insert, update, delete on table public.especialidades to authenticated;

drop policy if exists especialidades_select_publico on public.especialidades;
create policy especialidades_select_publico
	on public.especialidades for select to anon, authenticated
	using (true);

drop policy if exists especialidades_admin_write on public.especialidades;
create policy especialidades_admin_write
	on public.especialidades for all to authenticated
	using (public.intiwo_es_admin())
	with check (public.intiwo_es_admin());

revoke all on table public.codigos from anon, authenticated;
grant select (id, clave, especialidad_id, nivel, seccion, anio_lectivo, desactivado_en, created_at)
	on table public.codigos to anon, authenticated;
grant insert, update, delete on table public.codigos to authenticated;

drop policy if exists codigos_select_publico on public.codigos;
create policy codigos_select_publico
	on public.codigos for select to anon, authenticated
	using (true);

drop policy if exists codigos_docente_admin_insert on public.codigos;
create policy codigos_docente_admin_insert
	on public.codigos for insert to authenticated
	with check (
		public.intiwo_es_admin()
		or (public.intiwo_rol_actual() = 'docente' and docente_id = (select auth.uid()))
	);

drop policy if exists codigos_docente_admin_update on public.codigos;
create policy codigos_docente_admin_update
	on public.codigos for update to authenticated
	using (public.intiwo_es_admin() or public.intiwo_es_docente_codigo(id))
	with check (
		public.intiwo_es_admin()
		or (public.intiwo_rol_actual() = 'docente' and docente_id = (select auth.uid()))
	);

drop policy if exists codigos_docente_admin_delete on public.codigos;
create policy codigos_docente_admin_delete
	on public.codigos for delete to authenticated
	using (public.intiwo_es_admin() or public.intiwo_es_docente_codigo(id));

revoke all on table public.miembro_codigo from anon, authenticated;
grant select on table public.miembro_codigo to authenticated;
grant insert on table public.miembro_codigo to authenticated;
grant update (n_lista, desactivado_en) on table public.miembro_codigo to authenticated;

drop policy if exists miembros_select_propios_docente_admin on public.miembro_codigo;
create policy miembros_select_propios_docente_admin
	on public.miembro_codigo for select to authenticated
	using (
		perfil_id = (select auth.uid())
		or public.intiwo_es_admin()
		or public.intiwo_es_docente_codigo(codigo_id)
	);

drop policy if exists miembros_docente_admin_insert on public.miembro_codigo;
create policy miembros_docente_admin_insert
	on public.miembro_codigo for insert to authenticated
	with check (
		public.intiwo_es_admin()
		or (
			public.intiwo_es_docente_codigo(codigo_id)
			and agregado_por = (select auth.uid())
			and public.intiwo_perfil_editor_activo(perfil_id)
		)
	);

drop policy if exists miembros_docente_admin_update on public.miembro_codigo;
create policy miembros_docente_admin_update
	on public.miembro_codigo for update to authenticated
	using (public.intiwo_es_admin() or public.intiwo_es_docente_codigo(codigo_id))
	with check (public.intiwo_es_admin() or public.intiwo_es_docente_codigo(codigo_id));

revoke all on table public.invitaciones_correo from anon, authenticated;
grant select, insert on table public.invitaciones_correo to authenticated;
grant update (revocado_en) on table public.invitaciones_correo to authenticated;

drop policy if exists invitaciones_select_admin_invitador_docente on public.invitaciones_correo;
create policy invitaciones_select_admin_invitador_docente
	on public.invitaciones_correo for select to authenticated
	using (
		public.intiwo_es_admin()
		or invitado_por = (select auth.uid())
		or (codigo_id is not null and public.intiwo_es_docente_codigo(codigo_id))
	);

drop policy if exists invitaciones_insert_admin_docente on public.invitaciones_correo;
create policy invitaciones_insert_admin_docente
	on public.invitaciones_correo for insert to authenticated
	with check (
		public.intiwo_es_admin()
		or (
			rol_destino = 'editor'
			and codigo_id is not null
			and invitado_por = (select auth.uid())
			and public.intiwo_es_docente_codigo(codigo_id)
		)
	);

drop policy if exists invitaciones_revocar_admin_invitador_docente on public.invitaciones_correo;
create policy invitaciones_revocar_admin_invitador_docente
	on public.invitaciones_correo for update to authenticated
	using (
		public.intiwo_es_admin()
		or invitado_por = (select auth.uid())
		or (codigo_id is not null and public.intiwo_es_docente_codigo(codigo_id))
	)
	with check (
		public.intiwo_es_admin()
		or invitado_por = (select auth.uid())
		or (codigo_id is not null and public.intiwo_es_docente_codigo(codigo_id))
	);
