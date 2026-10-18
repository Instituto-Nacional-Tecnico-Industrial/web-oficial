-- INTIWO | 100: n_lista en invitacion; HMAC NIE en servidor; padron privado (nunca Git)
-- Correr UNA vez. No pegar la lista oficial aqui. No repetir politicas-rls.sql.

create extension if not exists pgcrypto;

create table if not exists public.padron_nie_correo (
	email text primary key,
	nie_hmac text not null,
	created_at timestamptz not null default now()
);

comment on table public.padron_nie_correo is
	'Lista privada NIE-correo. Instituto la carga en SQL Editor. Nunca Git ni chat. Solo HMAC, no NIE plano.';

alter table public.padron_nie_correo enable row level security;
revoke all on table public.padron_nie_correo from anon, authenticated;

alter table public.invitaciones_correo
	add column if not exists n_lista integer,
	add column if not exists nie_hmac text,
	add column if not exists nie_verificado boolean not null default false;

alter table public.invitaciones_correo
	drop constraint if exists invitaciones_correo_n_lista_check;
alter table public.invitaciones_correo
	add constraint invitaciones_correo_n_lista_check
	check (n_lista is null or n_lista > 0);

alter table public.perfiles
	add column if not exists nie_hmac text,
	add column if not exists nie_verificado boolean not null default false;

create unique index if not exists perfiles_nie_hmac_uq
	on public.perfiles (nie_hmac)
	where nie_hmac is not null;

create unique index if not exists invitaciones_editor_pendientes_email_codigo_uq
	on public.invitaciones_correo (email, codigo_id)
	where rol_destino = 'editor' and usado_en is null and revocado_en is null;

create or replace function public.intiwo_cotejar_nie(p_email text, p_hmac text)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
	v_email text := lower(btrim(p_email));
	v_hmac text := lower(btrim(p_hmac));
	v_hay integer;
begin
	if v_email is null or v_email = '' or v_hmac is null or v_hmac = '' then
		return jsonb_build_object('ok', false, 'razon', 'datos_incompletos');
	end if;
	select count(*)::integer into v_hay from public.padron_nie_correo;
	if v_hay = 0 then
		return jsonb_build_object('ok', false, 'razon', 'padron_vacio');
	end if;
	if exists (
		select 1
		from public.padron_nie_correo p
		where p.email = v_email
			and lower(p.nie_hmac) = v_hmac
	) then
		return jsonb_build_object('ok', true, 'razon', 'coincide');
	end if;
	return jsonb_build_object('ok', false, 'razon', 'no_coincide');
end;
$$;

revoke all on function public.intiwo_cotejar_nie(text, text) from public, anon, authenticated;
grant execute on function public.intiwo_cotejar_nie(text, text) to service_role;

grant update (revocado_en, nombres, apellidos, nombre, rol_destino, codigo_id, n_lista, nie_hmac, nie_verificado)
	on public.invitaciones_correo to authenticated;

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
	v_nie_hmac text;
	v_nie_ok boolean;
	v_local text;
	v_es_primer_admin boolean := false;
	v_invitation record;
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
		v_es_primer_admin := true;
	else
		select count(distinct i.rol_destino), min(i.rol_destino),
					 max(i.nombre), max(i.nombres), max(i.apellidos),
					 max(i.nie_hmac), bool_or(i.nie_verificado)
			into v_role_count, v_role, v_nombre, v_nombres, v_apellidos,
					 v_nie_hmac, v_nie_ok
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
	end if;

	v_nombre := coalesce(
		nullif(btrim(concat_ws(' ', v_nombres, v_apellidos)), ''),
		v_nombre,
		nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '')
	);

	insert into public.perfiles (id, rol, nombre, nombres, apellidos, nie, nie_hmac, nie_verificado)
	values (new.id, v_role, v_nombre, v_nombres, v_apellidos, null, v_nie_hmac, coalesce(v_nie_ok, false));

	if not v_es_primer_admin and v_role = 'editor' then
		for v_invitation in
			select i.codigo_id, i.invitado_por, i.n_lista
			from public.invitaciones_correo i
			where i.email = v_email
				and i.rol_destino = 'editor'
				and i.usado_en is null
				and i.revocado_en is null
				and i.codigo_id is not null
			order by i.created_at, i.id
			for update
		loop
			insert into public.miembro_codigo (perfil_id, codigo_id, agregado_por, n_lista)
			values (new.id, v_invitation.codigo_id, v_invitation.invitado_por, v_invitation.n_lista)
			on conflict (perfil_id, codigo_id) do update
				set n_lista = excluded.n_lista,
						desactivado_en = null;
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
