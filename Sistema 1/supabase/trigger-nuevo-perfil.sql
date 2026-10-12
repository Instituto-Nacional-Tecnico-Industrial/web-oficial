-- INTIWO SQL | crea perfil solo para cuenta matriz inicial o invitacion vigente.
-- El trigger corre dentro de la transaccion de Auth; las credenciales no se leen ni almacenan aqui.

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
	v_es_primer_admin boolean := false;
	v_invitation record;
begin
	if new.email is null then
		return new;
	end if;

	v_email := lower(btrim(new.email));

	if v_email = 'intiwo11543@gmail.com'
		 and not exists (
			 select 1
			 from public.perfiles p
			 where p.rol = 'administrador'
				 and p.desactivado_en is null
		 ) then
		v_role := 'administrador';
		v_nombre := nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '');
		v_es_primer_admin := true;
	else
		perform i.id
		from public.invitaciones_correo i
		where i.email = v_email
			and i.usado_en is null
			and i.revocado_en is null
		order by i.created_at, i.id
		for update;

		select count(distinct i.rol_destino), min(i.rol_destino), max(i.nombre)
			into v_role_count, v_role, v_nombre
		from public.invitaciones_correo i
		where i.email = v_email
			and i.usado_en is null
			and i.revocado_en is null;

		if v_role_count = 0 then
			return new;
		end if;

		if v_role_count > 1 then
			raise exception 'Las invitaciones activas de este correo tienen roles incompatibles';
		end if;
	end if;

	insert into public.perfiles (id, rol, nombre)
	values (
		new.id,
		v_role,
		coalesce(v_nombre, nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''))
	);

	if not v_es_primer_admin and v_role = 'editor' then
		for v_invitation in
			select i.codigo_id, i.invitado_por, i.n_lista
			from public.invitaciones_correo i
			where i.email = v_email
				and i.rol_destino = 'editor'
				and i.usado_en is null
				and i.revocado_en is null
			order by i.created_at, i.id
			for update
		loop
			insert into public.miembro_codigo (perfil_id, codigo_id, agregado_por, n_lista)
			values (new.id, v_invitation.codigo_id, v_invitation.invitado_por, v_invitation.n_lista)
			on conflict (perfil_id, codigo_id) do nothing;
		end loop;
	end if;

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

revoke all on function public.intiwo_handle_new_auth_user() from public, anon, authenticated;

drop trigger if exists intiwo_auth_user_profile on auth.users;
create trigger intiwo_auth_user_profile
after insert on auth.users
for each row execute function public.intiwo_handle_new_auth_user();
