-- INTIWO | 35/96/101: el docente lee miembros de SUS codigos; desactiva codigo o membresia (no DELETE)
-- Correr UNA vez despues de codigos-y-membresias.sql. No repetir politicas-rls.sql.

drop policy if exists perfiles_select_miembros_de_mis_codigos on public.perfiles;
create policy perfiles_select_miembros_de_mis_codigos
	on public.perfiles for select to authenticated
	using (
		exists (
			select 1
			from public.miembro_codigo m
			join public.codigos c on c.id = m.codigo_id
			where m.perfil_id = public.perfiles.id
				and c.docente_id = (select auth.uid())
				and public.intiwo_rol_actual() = 'docente'
		)
	);

drop policy if exists perfiles_select_docentes_admin on public.perfiles;
create policy perfiles_select_docentes_admin
	on public.perfiles for select to authenticated
	using (
		public.intiwo_es_admin()
		and rol in ('docente', 'editor', 'administrador')
	);

drop policy if exists codigos_docente_admin_update on public.codigos;
create policy codigos_docente_admin_update
	on public.codigos for update to authenticated
	using (
		public.intiwo_es_admin()
		or (public.intiwo_rol_actual() = 'docente' and docente_id = (select auth.uid()))
	)
	with check (
		public.intiwo_es_admin()
		or (public.intiwo_rol_actual() = 'docente' and docente_id = (select auth.uid()))
	);

-- 97: correo de invitaciones por usado_por (no auth.users). Docente: miembros de SUS codigos
-- aunque la invitacion no tenga codigo_id (p. ej. alta de docente).
drop policy if exists invitaciones_select_usado_por_arbol on public.invitaciones_correo;
create policy invitaciones_select_usado_por_arbol
	on public.invitaciones_correo for select to authenticated
	using (
		usado_por is not null
		and (
			public.intiwo_es_admin()
			or usado_por = (select auth.uid())
			or exists (
				select 1
				from public.miembro_codigo m
				join public.codigos c on c.id = m.codigo_id
				where m.perfil_id = usado_por
					and c.docente_id = (select auth.uid())
					and public.intiwo_rol_actual() = 'docente'
					and m.desactivado_en is null
			)
		)
	);

drop policy if exists miembros_docente_admin_update on public.miembro_codigo;
create policy miembros_docente_admin_update
	on public.miembro_codigo for update to authenticated
	using (
		public.intiwo_es_admin()
		or public.intiwo_es_docente_codigo(codigo_id)
	)
	with check (
		public.intiwo_es_admin()
		or public.intiwo_es_docente_codigo(codigo_id)
	);
