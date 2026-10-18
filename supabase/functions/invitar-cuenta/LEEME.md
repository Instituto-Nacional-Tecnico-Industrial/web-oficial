# Invitar cuenta (correo)

Esta funcion envia el correo de invitacion de Supabase Auth. El enlace abre Cuentas para elegir contrasena. Acciones JSON: `invitar`, `baja` (desactiva, no DELETE) y `activar` (quita ban y `desactivado_en`). El navegador llama `functions.invoke`; no lleva `service_role`.

## Desplegar (una vez)

En la carpeta del repo, con el CLI de Supabase (iniciado sesion en el proyecto `bd_inti_web_oficial`):

```bash
npx supabase login
npx supabase functions deploy invitar-cuenta --project-ref akvprrwjfstncadkybeh
```

O en el dashboard: **Edge Functions ? invitar-cuenta ? Code**, pegar `index.ts` y Deploy. JWT legacy OFF. `withSupabase({ auth: "user" })`.

## Plantilla del correo

**Authentication ? Correos electronicos** (Emails) ? plantilla **Invite user** / **Invitar usuario**.

El cuerpo debe incluir el enlace `{{ .ConfirmationURL }}`. Si no esta, el clic no lleva a Cuentas.

## SMTP (recomendado en el instituto)

El correo gratis de Supabase a veces no llega a @inti.edu.sv. En **Project Settings → Authentication → SMTP** configura el correo institucional (Google Workspace) para envios fiables.

## NIE (tarea 100)

1. SQL Editor: correr `Sistema 1/supabase/nie-hmac-n-lista.sql`.
2. Edge Functions → Secrets: `NIE_HMAC_SECRET` (frase larga, solo dashboard).
3. Padrón: **nunca** en Git ni en el chat. En SQL Editor, con el **mismo** secreto:

```sql
select encode(hmac(convert_to('NIE_AQUI','UTF8'), convert_to('EL_SECRETO','UTF8'), 'sha256'), 'hex');
insert into public.padron_nie_correo (email, nie_hmac)
values ('nie@clases.edu.sv', 'hex_del_select');
```

No dejes el secreto ni NIEs reales en un archivo del repo. Pegar de nuevo `index.ts` y Deploy.
