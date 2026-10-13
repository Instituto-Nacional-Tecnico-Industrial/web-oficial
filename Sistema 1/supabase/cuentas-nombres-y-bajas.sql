-- INTIWO | nombres/apellidos en altas y baja logica (DB-00c)
-- Correr UNA vez en SQL Editor

alter table public.invitaciones_correo
	add column if not exists nombres text,
	add column if not exists apellidos text;

alter table public.perfiles
	add column if not exists nombres text,
	add column if not exists apellidos text;

create or replace function public.intiwo_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
	v_email text;
	v_role text;
	v_role_count bigint;
	v_nombre text;
	v_nombres text;
	v_apellidos text;
	v_nie text;
	v_local text;
	v_es_primer_admin boolean := false;
begin
	if new.email is null then
		return new;
	end if;

	v_email := lower(btrim(new.email));

	if exists (select 1 from public.perfiles p where p.id = new.id) then
		return new;
	end if;

	if v_email = 'intiwo11543@gmail.com'
		 and not exists (
			 select 1 from public.perfiles p
			 where p.rol = 'administrador' and p.desactivado_en is null
		 ) then
		v_role := 'administrador';
		v_nombre := nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '');
		v_es_primer_admin := true;
	else
		select count(distinct i.rol_destino), min(i.rol_destino),
					 max(i.nombre), max(i.nombres), max(i.apellidos)
			into v_role_count, v_role, v_nombre, v_nombres, v_apellidos
		from public.invitaciones_correo i
		where i.email = v_email
			and i.usado_en is null
			and i.revocado_en is null;

		if v_role_count = 0 then
			raise exception using
				errcode = 'P0001',
				message = 'Tu docente aun no te ha dado de alta.';
		end if;

		if v_role_count > 1 then
			raise exception 'Las invitaciones activas de este correo tienen roles incompatibles';
		end if;
	end if;

	v_local := split_part(v_email, '@', 1);
	if v_role = 'editor' then
		if v_local !~ '^[0-9]+$' then
			raise exception 'El correo de editor debe tener el NIE como parte local';
		end if;
		v_nie := v_local;
	end if;

	v_nombre := coalesce(
		nullif(btrim(concat_ws(' ', v_nombres, v_apellidos)), ''),
		v_nombre,
		nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '')
	);

	insert into public.perfiles (id, rol, nombre, nombres, apellidos, nie)
	values (new.id, v_role, v_nombre, v_nombres, v_apellidos, v_nie);

	if not v_es_primer_admin then
		update public.invitaciones_correo
		set usado_en = now(),
				usado_por = new.id
		where email = v_email
			and rol_destino = v_role
			and usado_en is null
			and revocado_en is null;
	end if;

	return new;
end;
$$;

grant update (revocado_en, nombres, apellidos, nombre, rol_destino)
	on public.invitaciones_correo to authenticated;
