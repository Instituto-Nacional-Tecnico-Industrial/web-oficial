-- INTIWO SQL | rol academico + titulo unico + adjuntos texto|url | BACKLOG 190
-- Fuente canonica S1. NO APLICAR hasta autorizacion expresa.
-- Rol academico: docente de aula que llena proyectos academicos.
-- Lo crea y da de baja solo el administrador. Inferior a docente y a editor.
-- Correo @clases.edu.sv | @inti.edu.sv con nombre (NO NIE en local-part).
-- nie permanece NULL. Misma UI de Personalizar que el Editor, con tipografia formal.

alter table public.perfiles
	drop constraint if exists perfiles_rol_check;

alter table public.perfiles
	add constraint perfiles_rol_check
	check (rol in ('administrador', 'docente', 'editor', 'academico'));

-- Invitaciones: el admin puede destinar rol academico.
-- (rehacer el check de rol_destino en tabla-invitaciones si ya existiera)

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
-- Academico UPDATE contenido de proyectos tipo=academico asignados; no archive.
