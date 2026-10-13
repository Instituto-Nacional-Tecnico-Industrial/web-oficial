# Sistema 2 - INTIWO (proyectos)

Solo proyectos. HTML (nombres reales; no usar index.html):

- `paginas/proyectos/pagina-hub-proyectos.html`
- `paginas/ficha/pagina-ficha-proyecto.html`

Cromo: `compartido/encabezado-hamburguesa-con-busqueda.html` (lleva el input de busqueda) y `compartido/pie-institucional.html`.
CSS: `css/hub-y-pildoras-proyectos.css`, `css/ficha-proyecto.css`.
JS: `js/busqueda/buscar-proyectos.js`, `js/ficha/editar-ficha-propia.js`.
Cliente: `js/supabase/cliente-supabase.js` (misma base que Sistema 1).
SQL en `supabase/` es copia de Sistema 1, no otra base.
Repo futuro: web-oficial-proyectos. Completar segun `IAs/BACKLOG.md`.

## Despliegue y Supabase

En este repositorio, `.github/workflows/deploy-pages.yml` publica Sistema 1 y Sistema 2, y `.github/scripts/build-pages.mjs` genera la configuracion runtime para ambos desde las Actions Variables `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`. En GitHub, seleccionar **Settings > Pages > Build and deployment > Source: GitHub Actions**. Solo usar la clave publica `sb_publishable_`; nunca una clave secreta. Ambos clientes comparten URL y clave. Si Sistema 2 se mueve a `web-oficial-proyectos`, ese repositorio necesitara configurar las mismas variables y su propio workflow de publicacion.
