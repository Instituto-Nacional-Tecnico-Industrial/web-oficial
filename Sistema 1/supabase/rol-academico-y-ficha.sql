-- INTIWO SQL | contrato del rol academico | fuente canonica S1.
-- Candidato local. No ejecutar hasta cotejar diagnostico y recibir autorizacion.
-- Academico: docente responsable de proyectos academicos. Puede elegir cualquiera
-- de las cinco asignaturas, crear proyectos, editar los que autoriza, administrar
-- sus coautores, publicar/despublicar y archivar/reactivar sus propios proyectos.
-- No gestiona cuentas/codigos tecnicos/ciclos/CMS ni bloquea edicion.
-- Cuenta creada/desactivada por Admin; correo institucional con nombre, sin NIE.

alter table public.perfiles
	drop constraint if exists perfiles_rol_check;

alter table public.perfiles
	add constraint perfiles_rol_check
	check (rol in ('administrador', 'docente', 'editor', 'academico'));

alter table public.invitaciones_correo
	drop constraint if exists invitaciones_correo_rol_destino_check;

alter table public.invitaciones_correo
	add constraint invitaciones_correo_rol_destino_check
	check (rol_destino in ('administrador', 'docente', 'editor', 'academico'));

-- La politica invitaciones_insert_admin de invitaciones-admin-matriz.sql debe
-- permitir "academico" solo a Administradores. Docente sigue limitado a Editor.

-- Titulo unico entre proyectos no archivados (como nombre de repo GitHub).
-- create unique index if not exists proyectos_titulo_unico
--	on public.proyectos (lower(btrim(titulo)))
--	where deleted_at is null;

-- Adjuntos: no solo URL. Cada item { texto, url nullable, plataforma }.
-- urls jsonb default '[]'::jsonb
-- check: cada elemento es objeto; url http/https o null; texto no vacio.

-- Integrantes tecnicos: jsonb de nombres a mano (no exige cuenta Auth).
-- docente_id y codigo_id los rellena el sistema al crear la caja vacia.
-- Editor (alumno) UPDATE contenido; no INSERT ni archive.
-- Los permisos de proyecto viven en proyectos-core-v2.sql (RPC, RLS y grants).
