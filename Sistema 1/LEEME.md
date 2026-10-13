# Sistema 1 - INTIWO (institucional)

Siete secciones HTML (nombres reales; no usar index.html):

- `paginas/inicio/pagina-inicio-cms.html`
- `paginas/matricula/pagina-matricula-nuevo-ingreso.html`
- `paginas/oferta-academica/pagina-oferta-academica.html`
- `paginas/personal/pagina-personal-instituto.html`
- `paginas/ubicaciones/pagina-ubicaciones.html`
- `paginas/historia/pagina-historia-instituto.html`
- `paginas/configuraciones/pagina-configuraciones.html`

Cromo: `compartido/encabezado-hamburguesa.html` y `compartido/pie-institucional.html`.
CSS: `css/variables-tema-diurno-nocturno.css` (no style.css).
JS CMS: `js/cms/*-inicio*.js`. Cliente: `js/supabase/cliente-supabase.js`.
SQL: `supabase/tabla-*.sql`. Completar segun `IAs/BACKLOG.md` Extraer de / Escribir en.

## Despliegue y Supabase

El cliente Supabase carga la configuracion generada por `.github/scripts/build-pages.mjs` durante el workflow `.github/workflows/deploy-pages.yml`; no pegar URL ni claves en los archivos JS. En GitHub, agregar las Actions Variables `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` (solo clave `sb_publishable_`, nunca una clave secreta) y seleccionar **Settings > Pages > Build and deployment > Source: GitHub Actions**. Si falta una variable o su formato no es valido, el build falla antes de publicar. Ambos sistemas usan las mismas variables y proyecto.
