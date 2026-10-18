-- INTIWO | docente/admin buscan cuentas ya dadas de alta e incorporan al codigo del anio
-- Correr UNA vez despues de codigos-y-membresias.sql y arbol-config-codigos.sql.
-- No leer auth.users. No DELETE. Sin GE.

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

revoke all on function public.intiwo_perfil_editor_activo(uuid) from public, anon;
grant execute on function public.intiwo_perfil_editor_activo(uuid) to authenticated;

-- Docente: correos de editores ya activados (otro anio / otro docente). No pendientes.
drop policy if exists invitaciones_select_docente_editores_activos on public.invitaciones_correo;
create policy invitaciones_select_docente_editores_activos
	on public.invitaciones_correo for select to authenticated
	using (
		public.intiwo_rol_actual() = 'docente'
		and rol_destino = 'editor'
		and usado_por is not null
	);

drop policy if exists perfiles_select_editores_para_docente_busqueda on public.perfiles;
create policy perfiles_select_editores_para_docente_busqueda
	on public.perfiles for select to authenticated
	using (
		public.intiwo_rol_actual() = 'docente'
		and rol = 'editor'
		and desactivado_en is null
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
