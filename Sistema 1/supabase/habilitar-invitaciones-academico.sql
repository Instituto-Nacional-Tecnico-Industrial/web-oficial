-- Migracion puntual para el proyecto compartido.
-- Reemplaza solo la politica INSERT de Administradores; no modifica roles,
-- restricciones, funciones, triggers ni otras politicas.

begin;

drop policy if exists invitaciones_insert_admin
	on public.invitaciones_correo;

create policy invitaciones_insert_admin
	on public.invitaciones_correo
	for insert
	to authenticated
	with check (
		public.intiwo_es_admin()
		and invitado_por = (select auth.uid())
		and (
			rol_destino in ('docente', 'editor', 'academico')
			or (
				rol_destino = 'administrador'
				and public.intiwo_es_admin_matriz()
			)
		)
	);

commit;
