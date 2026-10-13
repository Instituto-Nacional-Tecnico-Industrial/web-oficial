-- INTIWO SQL | bootstrap seguro del administrador matriz sin tocar password ni email en Git.
-- Solo aplica si la cuenta Auth existe; no se almacena la contrasena ni el NIE aqui.

DO $$
DECLARE
    v_user_id uuid;
BEGIN
    select id into v_user_id
    from auth.users
    where lower(email) = 'intiwo11543@gmail.com'
    limit 1;

    if v_user_id is null then
        raise notice 'No existe auth.users para intiwo11543@gmail.com; no se asigna admin.';
        return;
    end if;

    insert into public.perfiles (id, rol, nombre, tema, desactivado_en)
    values (v_user_id, 'administrador', 'Administración INTIWO', 'dark', null)
    on conflict (id) do update
        set rol = 'administrador',
            nombre = coalesce(public.perfiles.nombre, 'Administración INTIWO'),
            tema = coalesce(public.perfiles.tema, 'dark'),
            desactivado_en = null,
            updated_at = now()
    where public.perfiles.rol is distinct from 'administrador'
       or public.perfiles.desactivado_en is not null;
END $$;

-- La UI y la politica deben evaluar el rol en public.perfiles, no un if por correo.
-- El correo matriz se usa solo como identificador de la cuenta Auth inicial; nunca como condicion para la capa de presentacion.
