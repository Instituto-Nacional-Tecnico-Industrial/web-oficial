-- Solo lectura: inspecciona el esquema remoto antes de preparar migraciones.
-- No muestra filas institucionales ni modifica tablas, funciones o politicas.

with columnas as (
	select
		c.table_name,
		jsonb_agg(
			jsonb_build_object(
				'nombre', c.column_name,
				'tipo', c.data_type,
				'esquema_tipo', c.udt_name,
				'nulo', c.is_nullable,
				'default', c.column_default
			)
			order by c.ordinal_position
		) as definicion
	from information_schema.columns c
	where c.table_schema = 'public'
		and (c.table_name in (
			'perfiles',
			'especialidades',
			'ciclos_lectivos',
			'codigos',
			'miembro_codigo',
			'proyectos',
			'proyecto_editor',
			'proyecto_editores',
			'proyecto_docente',
			'proyecto_codigo_mano_obra',
			'proyecto_etiqueta',
			'etiquetas',
			'especialidad_nombres',
			'especialidades_nombres',
			'footer_cms',
			'educame_cms',
			'matricula_cms',
			'contenido_inicio',
			'configuracion_institucional'
		) or c.table_name ilike any (array[
			'%proyect%', '%especial%', '%ciclo%', '%footer%', '%config%', '%etiqueta%'
		]))
	group by c.table_name
),
tablas as (
	select
		t.table_name,
		t.definicion,
		coalesce(r.relrowsecurity, false) as rls_habilitado,
		coalesce(r.relforcerowsecurity, false) as rls_forzado
	from columnas t
	left join pg_namespace n on n.nspname = 'public'
	left join pg_class r on r.relnamespace = n.oid and r.relname = t.table_name
),
restricciones as (
	select
		cl.relname as tabla,
		jsonb_agg(jsonb_build_object(
			'nombre', co.conname,
			'tipo', co.contype,
			'expresion', pg_get_constraintdef(co.oid, true)
		) order by co.conname) as definicion
	from pg_constraint co
	join pg_class cl on cl.oid = co.conrelid
	join pg_namespace ns on ns.oid = cl.relnamespace
	where ns.nspname = 'public'
		and (cl.relname in (
			'perfiles', 'especialidades', 'ciclos_lectivos', 'codigos',
			'miembro_codigo', 'proyectos', 'proyecto_editor',
			'proyecto_editores', 'proyecto_docente',
			'proyecto_codigo_mano_obra', 'footer_cms',
			'educame_cms', 'matricula_cms',
			'contenido_inicio', 'configuracion_institucional'
		) or cl.relname ilike any (array[
			'%proyect%', '%especial%', '%ciclo%', '%footer%', '%config%', '%etiqueta%'
		]))
	group by cl.relname
),
politicas as (
	select
		p.tablename as tabla,
		jsonb_agg(jsonb_build_object(
			'nombre', p.policyname,
			'comando', p.cmd,
			'roles', p.roles,
			'using', p.qual,
			'check', p.with_check
		) order by p.policyname) as definicion
	from pg_policies p
	where p.schemaname = 'public'
		and (p.tablename in (
			'perfiles', 'especialidades', 'ciclos_lectivos', 'codigos',
			'miembro_codigo', 'proyectos', 'proyecto_editor',
			'proyecto_editores', 'proyecto_docente',
			'proyecto_codigo_mano_obra', 'footer_cms',
			'educame_cms', 'matricula_cms',
			'contenido_inicio', 'configuracion_institucional'
		) or p.tablename ilike any (array[
			'%proyect%', '%especial%', '%ciclo%', '%footer%', '%config%', '%etiqueta%'
		]))
	group by p.tablename
),
indices as (
	select
		i.tablename as tabla,
		jsonb_agg(jsonb_build_object(
			'nombre', i.indexname,
			'expresion', i.indexdef
		) order by i.indexname) as definicion
	from pg_indexes i
	where i.schemaname = 'public'
		and (i.tablename in (
			'perfiles', 'especialidades', 'ciclos_lectivos', 'codigos',
			'miembro_codigo', 'proyectos', 'proyecto_editor',
			'proyecto_editores', 'proyecto_docente',
			'proyecto_codigo_mano_obra', 'proyecto_etiqueta',
			'etiquetas', 'especialidad_nombres', 'especialidades_nombres',
			'footer_cms', 'educame_cms', 'matricula_cms',
			'contenido_inicio', 'configuracion_institucional'
		) or i.tablename ilike any (array[
			'%proyect%', '%especial%', '%ciclo%', '%footer%', '%config%', '%etiqueta%'
		]))
	group by i.tablename
),
triggers as (
	select
		c.relname as tabla,
		jsonb_agg(jsonb_build_object(
			'nombre', t.tgname,
			'definicion', pg_get_triggerdef(t.oid, true),
			'funcion', p.proname
		) order by t.tgname) as definicion
	from pg_trigger t
	join pg_class c on c.oid = t.tgrelid
	join pg_namespace n on n.oid = c.relnamespace
	join pg_proc p on p.oid = t.tgfoid
	where n.nspname = 'public'
		and not t.tgisinternal
		and (c.relname in (
			'perfiles', 'especialidades', 'ciclos_lectivos', 'codigos',
			'miembro_codigo', 'proyectos', 'proyecto_editor',
			'proyecto_editores', 'proyecto_docente',
			'proyecto_codigo_mano_obra', 'proyecto_etiqueta',
			'etiquetas', 'especialidad_nombres', 'especialidades_nombres',
			'footer_cms', 'educame_cms', 'matricula_cms',
			'contenido_inicio', 'configuracion_institucional'
		) or c.relname ilike any (array[
			'%proyect%', '%especial%', '%ciclo%', '%footer%', '%config%', '%etiqueta%'
		]))
	group by c.relname
)
select jsonb_pretty(jsonb_build_object(
	'tablas', coalesce((
		select jsonb_agg(jsonb_build_object(
			'nombre', t.table_name,
			'rls_habilitado', t.rls_habilitado,
			'rls_forzado', t.rls_forzado,
			'columnas', t.definicion,
			'restricciones', r.definicion,
			'indices', i.definicion,
			'triggers', g.definicion,
			'politicas', p.definicion
		) order by t.table_name)
		from tablas t
		left join restricciones r on r.tabla = t.table_name
		left join indices i on i.tabla = t.table_name
		left join triggers g on g.tabla = t.table_name
		left join politicas p on p.tabla = t.table_name
	), '[]'::jsonb),
	'nota', 'Resultado estructural solamente; no contiene filas de alumnos ni credenciales.'
)) as diagnostico;
