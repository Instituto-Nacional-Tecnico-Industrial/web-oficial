-- INTIWO SQL | catalogo tecnico aprobado; General no recibe color inventado.

create table if not exists public.especialidades (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	nombre text not null,
	nombre_corto text not null,
	prefijo text not null unique check (prefijo ~ '^[A-Z]{2}$'),
	color_hex text,
	tipo text not null check (tipo in ('tecnica', 'general')),
	orden smallint not null unique,
	created_at timestamptz not null default now(),
	constraint especialidades_hex_valido check (color_hex is null or color_hex ~ '^#[0-9A-Fa-f]{6}$'),
	constraint especialidad_general_color check (tipo = 'general' or color_hex is not null)
);

insert into public.especialidades (slug, nombre, nombre_corto, prefijo, color_hex, tipo, orden)
values
	('automotriz', 'Mantenimiento Automotriz', 'Automotriz', 'MA', '#166534', 'tecnica', 1),
	('mecanica-industrial', 'Mecanica Industrial', 'Mecanica', 'MI', '#EAB308', 'tecnica', 2),
	('desarrollo-software', 'Desarrollo de Software', 'Software', 'DS', '#EA580C', 'tecnica', 3),
	('electronica', 'Electronica', 'Electronica', 'EL', '#0000FF', 'tecnica', 4),
	('infraestructura-tecnologica', 'Infraestructura Tecnologica y Servicios Informaticos', 'ITSI', 'IT', '#64748B', 'tecnica', 5),
	('sistemas-electricos', 'Sistemas Electricos y Energia Renovable', 'Electricos', 'SE', '#E61010', 'tecnica', 6),
	('general', 'Bachillerato General', 'General', 'GE', null, 'general', 7)
on conflict (slug) do nothing;
