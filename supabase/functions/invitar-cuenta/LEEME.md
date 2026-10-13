# Invitar cuenta (correo)

Esta funcion envia el correo de invitacion de Supabase Auth. El enlace abre Cuentas para elegir contrasena.

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

El correo gratis de Supabase a veces no llega a @inti.edu.sv. En **Project Settings ? Authentication ? SMTP** configura el correo institucional (Google Workspace) para envios fiables.
