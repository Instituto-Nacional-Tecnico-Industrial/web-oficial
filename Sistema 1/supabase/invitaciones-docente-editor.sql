-- INTIWO | el docente puede dar de alta editores (alumnos)
-- Correr UNA vez en SQL Editor despues de login-invitaciones-minimo.sql

drop policy if exists invitaciones_insert_docente_editor on public.invitaciones_correo;
create policy invitaciones_insert_docente_editor
	on public.invitaciones_correo for insert to authenticated
	with check (
		public.intiwo_rol_actual() = 'docente'
		and invitado_por = (select auth.uid())
		and rol_destino = 'editor'
	);
