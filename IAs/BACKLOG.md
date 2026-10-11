# Backlog INTIWO

**Ultima modificacion:** 2026-10-11 15:28 (UTC-6) | **IA:** Cursor | **Dispositivo:** laptop Windows (MINEDUCYT), `C:\Proyectos\web-oficial`

Carpeta exclusiva de IAs: `IAs/` (solo este archivo y `RESOLUCIONES.md`). Al marcar o agregar: misma fecha, hora (UTC-6) e IA en ambos; indica el dispositivo. Apuntes en orden cronologico.

**Antes de tocar codigo:** leer este archivo y `RESOLUCIONES.md` de inicio a fin. **No borrar** texto de la otra IA. Corregir codigo ajeno si, dejando escrito en que se equivoco.

Convencion: `- [ ]` pendiente | `- [~]` en curso | `- [x]` hecho.

**Como cumplir una tarea (IAs):**

1. Una sola casilla por paso. Leer **Extraer de** y **Escribir en** de ESA casilla antes de abrir el editor.

2. El codigo va EXACTAMENTE a **Escribir en**. Inicio = `Sistema 1/paginas/inicio/pagina-inicio-cms.html`. Proyectos = `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`. Ficha = `Sistema 2/paginas/ficha/pagina-ficha-proyecto.html`. Cromo se duplica en ambos `compartido/`. SQL vive en `Sistema 1/supabase/`. No editar `Adobe Ilustrador/`. No prototipos en la raiz.

3. Si el bloque 0 no esta cerrado y la casilla depende de el: `[~]` y pregunta a Instituto. No inventar.

4. Al cerrar: misma marca UTC-6 en `RESOLUCIONES.md` (archivo tocado + como se probo).

5. Listo cuando se cumple el Criterio. Si hay conflicto entre un PDF viejo y un PNG / una resolucion de 2026-10-11, gana **PNG + resolucion reciente**.

---

## Arquitectura hibrida de INTIWO (nombre)

No es arquitectura orientada a eventos. No es microservicios (el PDF "microservicio del INTI" es la **transcripcion del Google Site actual**, no un servicio nuestro).

Nombre preciso:

**Hibrido Jamstack + BaaS cliente-servidor, dos frontends estaticos y un backend compartido (shared-backend dual-client), con CMS headless y autorizacion en la base (RLS).**

Desglose:

- **Cliente-servidor (3 capas delgadas):** el navegador pide HTML/CSS/JS a GitHub Pages; el JS pide JSON/Auth/Storage a Supabase (PostgREST + Auth). No hay servidor Node/PHP propio.

- **Jamstack:** sitios estaticos versionados en Git; el contenido vivo no vive en el HTML.

- **BaaS:** un solo proyecto Supabase free (Auth + Postgres + Storage).

- **Dos clientes, un origen de datos:** Sistema 1 (`web-oficial`) y Sistema 2 (`web-oficial-proyectos`). Misma sesion (Auth allowlist de ambos origenes Pages). Enlace `<a>` **sin** `target="_blank"`: cambia de host en la misma pestana; no es iframe.

- **CMS headless:** Inicio y footer se guardan como JSON/filas; el visitante solo lee.

- **RBAC en datos:** roles `administrador | docente | editor`. Visitante = anonimo, sin fila.

- **No:** event-driven, SOA, 3 bases Supabase, Odoo, ni editor de coordenadas absolutas tipo Illustrator.

Tres grupos logicos de tablas (NO tres proyectos): **A cuentas/roles**, **B portafolio (textos + URLs externas)**, **C CMS institucional**.

---


## Mapa de destinos (adonde va el codigo; no a la raiz ni a Adobe)

Regla: **Extraer de** = leer. **Escribir en** = el archivo YA EXISTE vacio (creado 2026-10-11 15:28 UTC-6). Completar ese archivo, no crear `index.html` ni `style.css`.

Los nombres no son genericos: cada archivo dice para que sirve.

```
Sistema 1/
  compartido/encabezado-hamburguesa.html
  compartido/pie-institucional.html
  css/variables-tema-diurno-nocturno.css
  css/layout-hamburguesa-y-overlay.css
  css/pagina-inicio-visitante.css
  css/editor-cms-inicio.css
  css/pildoras-oferta-academica.css
  js/supabase/cliente-supabase.js
  js/tema/persistir-tema-diurno-nocturno.js
  js/auth/sesion-roles-auth.js
  js/auth/panel-configuraciones-cuentas.js
  js/cromo/menu-hamburguesa-overlay.js
  js/cms/cargar-bloques-inicio.js
  js/cms/render-bloques-inicio.js
  js/cms/editor-cms-inicio-admin.js
  js/cms/plantillas-bloques-inicio.js
  js/cms/subir-imagenes-inicio.js
  js/cms/guardar-contenido-inicio.js
  js/cms/sanitizar-texto-cms.js
  js/cms/cargar-footer-cms.js
  paginas/inicio/pagina-inicio-cms.html
  paginas/matricula/pagina-matricula-nuevo-ingreso.html
  paginas/oferta-academica/pagina-oferta-academica.html
  paginas/personal/pagina-personal-instituto.html
  paginas/ubicaciones/pagina-ubicaciones.html
  paginas/historia/pagina-historia-instituto.html
  paginas/configuraciones/pagina-configuraciones.html
  paginas/*/CONTENIDO.md
  supabase/tabla-especialidades.sql
  supabase/tabla-perfiles.sql
  supabase/tabla-codigos-seccion.sql
  supabase/tabla-contenido-inicio.sql
  supabase/tabla-footer-cms.sql
  supabase/tabla-proyectos.sql
  supabase/tabla-invitaciones-correo.sql
  supabase/politicas-politicas-rls.sql
  supabase/storage-buckets.sql
  supabase/trigger-nuevo-perfil.sql
  supabase/semilla-admin-sin-password.sql

Sistema 2/
  compartido/encabezado-hamburguesa-con-busqueda.html
  compartido/pie-institucional.html
  css/variables-tema-diurno-nocturno.css
  css/layout-hamburguesa-y-overlay.css
  css/hub-y-pildoras-proyectos.css
  css/ficha-proyecto.css
  js/supabase/cliente-supabase.js
  js/tema/persistir-tema-diurno-nocturno.js
  js/auth/sesion-roles-auth.js
  js/cromo/menu-hamburguesa-overlay.js
  js/busqueda/buscar-proyectos.js
  js/busqueda/filtrar-proyectos-especialidad.js
  js/ficha/editar-ficha-propia.js
  paginas/proyectos/pagina-hub-proyectos.html
  paginas/ficha/pagina-ficha-proyecto.html
  supabase/  (copias de los .sql de S1, misma base)
```

Prohibido: `index.html`, `style.css`, `app.js`, `supabase.js` en la raiz. Prohibido Adobe y Documentacion. El archivo `js/supabase/cliente.js` es legado; **usar `cliente-supabase.js`**.

## Mapa de fuentes (abrir estos paths; no editar Adobe ni PDFs)

Ruta base documentacion: `Documentacion con informacion/` (en disco puede verse `Documentaci|n con informaci|n/`).

| ID | Que es | Path / URL | Usar para | NO usar para |

|---|---|---|---|---|

| F-PNG-MENU | UI menu overlay | `Adobe Ilustrador/Esquema visual de INTIWO/Sistema 1 y 2 Menu Hamburguesa desplegado.png` | Cromo: hamburguesa, distintivo I.N.T.I., lista, Cuentas abajo, tema a la derecha | Orden de 8 secciones (el PNG esta desfasado; orden = este backlog SH-01c) |

| F-PNG-FOOT | UI footer | `Adobe Ilustrador/Esquema visual de INTIWO/Sistema 1 y 2 Footer.png` | Layout footer, redes, slogan, Inscribete | Telefonos 7441-1075 / 6674-3159 (usar tabla institucional hasta 0-12) |

| F-PNG-S2H | Hub proyectos | `Adobe Ilustrador/Esquema visual de INTIWO/Sistema 2 Seccion Proyectos.png` | 2 cards Tecnico/Academico, copy, iconos, verde | Texto "Aca bla bla" en produccion |

| F-PNG-S2T | Pildoras especialidad | `Adobe Ilustrador/Esquema visual de INTIWO/Sistema 2 Seccion Proyectos Tecnicos.png` | Dropdown/pildoras, hover rojo/verde | Menu de 4 secciones del PDF viejo |

| F-PNG-S2B | Busqueda | `Adobe Ilustrador/Esquema visual de INTIWO/Sistema 2 Barra de busqueda con resultados.png` | Placeholder, cero resultados, barra centrada | - |

| F-BANNER | Piezas graficas expo | `Adobe Ilustrador/Banner del proyecto/` PNG | Solo si Instituto pide banner de feria | CMS Inicio (no es el editor admin) |

| F-AFICHE | Afiche expo | `Adobe Ilustrador/Afiche Oficial de la institucion/` PNG/PDF | Referencia de marca de feria | Layout web |

| F-SITIOAI | Sitio Web.ai | `Adobe Ilustrador/Sitio Web.ai` | No parsear .ai | Codigo |

| F-ASE | Paleta | `Adobe Ilustrador/Muestras de color INTIWO.ai.ase` + tabla en `IAs/RESOLUCIONES.md` (2026-10-09 12:54) | Variables CSS | Inventar #A8C200 |

| F-FONT | Tipografia | https://fonts.google.com/specimen/Roboto+Serif | archivos en `Adobe Ilustrador/Roboto_Serif/` (OFL) | link CSS pesos 400/700 | Otras familias |

| F-LUCIDE | Iconos | https://lucide.dev/icons/ | SVG stroke 2.5 currentColor | Material/Google Icons |

| F-SORT | Drag bloques | https://github.com/SortableJS/Sortable | S1-12 | Posicion absolute de pagina |

| F-AOS | Animaciones | https://michalsnik.github.io/aos/ | S1-13 lista corta | CSS libre de secretaria |

| F-SITE | Google Site vigente | https://sites.google.com/inti.edu.sv/nuevoingreso/inicio | Verificar copy vivo | Inicio INTIWO (CMS vacio). Videos: no copiar |

| F-SITE-MAT | Matricula 2027 | https://sites.google.com/inti.edu.sv/nuevoingreso/nuevo-ingreso/proceso_de_matricula | Pasos 1-5 | WhatsApp 74411075 como oficial |

| F-SITE-OF | Oferta | https://sites.google.com/inti.edu.sv/nuevoingreso/OfertaAcademica | 6 tecnicas + modulos | Videos .mp4 |

| F-SITE-ED | EDUCAME | https://sites.google.com/inti.edu.sv/nuevoingreso/educame | General / flexibles | - |

| F-MICRO | Transcripcion Site (7 pag) | `Documentacion con informacion/Informacion del microservicio del inti.pdf` | P1 identidad mision vision. P2 matricula. P2-P6 especialidades y modulos. P7 EDUCAME. Popular Oferta/Matricula. | NO: UI admin Editar, Historia socio-cultural, 3 bases |

| F-HIST | Dossier URLs + contexto | `Documentacion con informacion/Documentacion e informacion revelante del INTI.pdf` (28 pag) | P1 contacto/URLs. P21-P28 Expotecnia 1964, Open House 2015, 70 anios, 20.000 (verificar). Prensa P4-P6 y P22-P28. | P2-P20 RETENIDO: violencia, pandillas, destitucion 2025, operativos. Cifras sin 0-10/0-11 |

| F-LEEME | Mapa corto | `Documentacion con informacion/LEEME.md` | Indice rapido de que PDF/URL | - |

| F-CTX | Chat enorme 1139 pag | `Documentacion con informacion/Contexto Completo.pdf` | Solo arqueologia (Odoo descartado). No implementar Odoo. | UX actual, CMS, roles 2026-10-11 |

| F-OLD | Inicios + password filtrada | `Documentacion con informacion/Documento sin titulo.pdf` (11 pag) | **P2, P8-P11** intencion: secretarias editan sin codigo; S1+S2 misma pestana; grupos A/B/C de tablas; URLs de proyectos no binarios | **P1 credenciales: NO copiar al git ni al DER.** Fases ASCII P3-P8 y barra "Acceder" = esquema viejo. Tres proyectos Supabase = rechazado |

| F-PDF-S2 | Portafolio DS 5 pag | `Documentacion con informacion/Esquema visual del Portafolio de Proyectos DS.pdf` | Evolucion especialidad -> codigo -> ficha + URLs | Look final = PNG. Login Acceder en header: no |

| F-GEM | ASCII login viejo | `Documentacion con informacion/gemini-code-1791745251831.txt` | Nada de produccion | Header Acceder |

| F-RES | Decisiones vigentes | `IAs/RESOLUCIONES.md` | Paleta, contacto, copy Site, CMS 14:27 y Gemini 14:33, roles | Entradas anteriores a 2026-10-11 si chocan |

| F-C-INI | Inicio vacio | `Sistema 1/paginas/inicio/CONTENIDO.md` | Visitante 0 bloques; matriz email (sin password) | Pegar mision del Site en HTML |

| F-C-MAT | | `Sistema 1/paginas/matricula/CONTENIDO.md` | Pasos 2027 + EDUCAME | - |

| F-C-OF | | `Sistema 1/paginas/oferta-academica/CONTENIDO.md` | 7 items + hex | - |

| F-C-HIS | | `Sistema 1/paginas/historia/CONTENIDO.md` | Linea 1954-2024 publicable | Violencia |

| F-C-UBI | | `Sistema 1/paginas/ubicaciones/CONTENIDO.md` | Direccion y contacto | Buses inventados |

| F-C-PER | | `Sistema 1/paginas/personal/CONTENIDO.md` | Placeholder hasta 0-16 | Nombres inventados |

| F-S1L | | `Sistema 1/LEEME.md` | Arbol S1 | - |

| F-S2L | | `Sistema 2/LEEME.md` | Arbol S2 | - |

| F-CLI | Cliente JS | `Sistema 1/js/supabase/cliente-supabase.js` y copia S2 | createClient; URL/key vacias | service_role |

| F-GH-S1 | Repo S1 | https://github.com/Instituto-Nacional-Tecnico-Industrial/web-oficial | Pages S1 | - |

| F-GH-S2 | Repo S2 | https://github.com/Instituto-Nacional-Tecnico-Industrial/web-oficial-proyectos.git | Pages S2 futuro | Implementar en este clone hasta el split |

| F-CMS | CMS bloques | `RESOLUCIONES.md` entradas **2026-10-11 14:27** y **14:33** | Boton Editar, toolbar, SortableJS, JSON `contenido_inicio`, skeleton, RLS por rol | Lienzo x,y; if email en cada boton; password en Pages |

**No hay PNG del modo admin Inicio.** Replicar Editar solo con F-CMS + este backlog S1-10. Look de cromo publico = F-PNG-MENU + F-PNG-FOOT.

Tabla institucional (telefonos/redes): `RESOLUCIONES.md` seccion "Datos institucionales". Email publico admin: `intiwo11543@gmail.com` (nunca password en archivos).

---

## 0. Instituto (entregas; las IAs no las cierran solas)

- [ ] 0-01 Entregar favicon (SVG o PNG 32/180) e indicar si va el distintivo I.N.T.I.

  - **Extraer de:** F-PNG-MENU (marca). No hay favicon en Adobe hoy.

  - **Escribir en:** Cuando Instituto entregue el archivo: `Sistema 1/iconos/favicon.svg` (o .png) y la misma copia en `Sistema 2/iconos/favicon.svg`. El `<link rel=icon>` va en el `<head>` de cada HTML de pagina (pagina-*.html). No guardar en Adobe ni en la raiz.

- [ ] 0-02 Decir si Inicio arranca vacio (si, hasta Guardar) o bloque de bienvenida de fabrica.

  - **Extraer de:** F-C-INI, F-CMS.

  - **Escribir en:** Solo decision en `IAs/RESOLUCIONES.md`. El HTML vacio sigue en `Sistema 1/paginas/inicio/`. No tocar Sistema 2.

- [ ] 0-03 Mockup o lista de campos de Matricula (ademas del texto 2027 + EDUCAME).

  - **Extraer de:** F-C-MAT, F-MICRO P2, F-SITE-MAT.

  - **Escribir en:** Decision/mockup en `IAs/RESOLUCIONES.md`. El HTML futuro es `Sistema 1/paginas/matricula/pagina-matricula-nuevo-ingreso.html`.

- [ ] 0-04 Mockup Personal (rejilla, orden talleres vs basicas vs admin).

  - **Extraer de:** F-C-PER. No hay PNG.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. HTML futuro: `Sistema 1/paginas/personal/pagina-personal-instituto.html`.

- [ ] 0-05 Personal lleva foto B/N? Si / no. Consentimiento y tamano.

  - **Extraer de:** F-C-PER; F-OLD P9 (idea vieja de fotos).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Si si: bucket Storage `personal` + `Sistema 1/paginas/personal/`. Si no: no crear bucket.

- [ ] 0-06 Mockup Ubicaciones (mapa si/no, lista de buses).

  - **Extraer de:** F-C-UBI. No inventar paradas.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. HTML: `Sistema 1/paginas/ubicaciones/pagina-ubicaciones.html`.

- [ ] 0-07 Mockup Configuraciones por rol.

  - **Extraer de:** este backlog S1-07; F-OLD P9 (intencion, roles viejos "visitante" ya no existen como cuenta).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. HTML: `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` (S2 puede reusar cromo; la pagina Config vive en S1).

- [ ] 0-08 Texto Bachillerato General para Oferta.

  - **Extraer de:** F-MICRO P7, F-SITE-ED, F-C-OF item 7.

  - **Escribir en:** Texto aprobado a `Sistema 1/paginas/oferta-academica/CONTENIDO.md` y luego al HTML de esa carpeta. No va a Inicio ni a Proyectos.

- [ ] 0-09 Tono Historia delicada: omitir / superacion / otro (frase ejemplo).

  - **Extraer de:** F-HIST P2-P20 RETENIDO; F-C-HIS.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Afecta solo `Sistema 1/paginas/historia/`.

- [ ] 0-10 Confirmar o corregir ~20.000 egresados (1964-2023).

  - **Extraer de:** F-HIST P22 (elsalvador.com 26 oct 2024); F-C-HIS.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Si [x]: una linea en `Sistema 1/paginas/historia/pagina-historia-instituto.html`.

- [ ] 0-11 Confirmar o corregir ~1.000 alumnos (2025).

  - **Extraer de:** F-HIST P2 (declaracion direccion, no censo MINED).

  - **Escribir en:** Igual que 0-10. No en footer ni Inicio a menos que el CMS lo ponga.

- [ ] 0-12 Un WhatsApp canonico: +503 7754 5899 vs 7441-1075 / 6674-3159.

  - **Extraer de:** F-RES tabla; F-PNG-FOOT (otros numeros); F-SITE-MAT (74411075).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Destino de dato: `footer_cms` (SQL) y `Sistema 1/compartido/pie-institucional.html` + copia S2.

- [ ] 0-13 Dominio de correo alumnos/docentes.

  - **Extraer de:** F-CTX P1 menciona nie@inti.edu.sv (historico Odoo, no copiar flujo Odoo).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. No hardcodear dominio en JS hasta entonces.

- [ ] 0-14 Guardar NIE en Supabase? Si / no / solo hash.

  - **Extraer de:** F-CTX P1 (que es NIE). No hay decision.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Columna NIE solo en SQL `Sistema 1/supabase/` si dice si.

- [ ] 0-15 Crear proyecto Supabase y pegar URL + anon (no service_role) a Instituto, no al git.

  - **Extraer de:** F-CLI.

  - **Escribir en:** Keys en maquina local de Instituto (no git). Los archivos `Sistema 1/js/supabase/cliente-supabase.js` y `Sistema 2/js/supabase/cliente-supabase.js` quedan con constantes vacias o config ignorada.

- [ ] 0-16 Lista docentes/admins para bios.

  - **Extraer de:** F-C-PER.

  - **Escribir en:** Lista a `Sistema 1/paginas/personal/CONTENIDO.md`; HTML en esa carpeta.

- [ ] 0-17 Nombre UI ITSI: "Servicios Informaticos" (Site) vs "Sistemas Informaticos" (PNG).

  - **Extraer de:** F-MICRO P6; F-PNG-S2T; F-C-OF item 6.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Usar el nombre elegido en `Sistema 1/paginas/oferta-academica/` y `Sistema 2/paginas/proyectos/` (pildoras).

- [ ] 0-18 Texto "cocodrilos" y "docentes japoneses" si van en Historia.

  - **Extraer de:** F-C-HIS; F-HIST P21 (mision Japon 1962, no el anecdotario).

  - **Escribir en:** Si aprueba: parrafo en `Sistema 1/paginas/historia/`. Si no: no crear archivo de anecdotas.

- [ ] 0-19 Plantillas de bloque Inicio que si quiere secretaria (bastan banner, texto+img, 3 cols?).

  - **Extraer de:** F-CMS (Gemini: esas 3 + banner).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Codigo de plantillas: `Sistema 1/js/cms/plantillas-bloques-inicio.js` (solo S1).

---

## A. Compartido (SH) | cromo, tema, auth

Copiar la misma pieza en `Sistema 1/compartido/` y `Sistema 2/compartido/` (hasta el split).

- [ ] SH-01a Crear `compartido/encabezado-hamburguesa.html` (o JS que lo inyecte): hamburguesa izquierda, distintivo I.N.T.I., tema a la derecha, **sin** "Iniciar sesion" en la barra (Cuentas va al pie del menu).

  - **Extraer de:** F-PNG-MENU. No F-GEM ni F-PDF-S2 (ponen Acceder en header).

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/compartido/encabezado-hamburguesa.html` y COPIAR el mismo markup a `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`. Incluirlo desde cada pagina. Prohibido `index.html` en la raiz del repo.

- [ ] SH-01b Menu overlay (no sidebar permanente). `aria-expanded`, `aria-controls`, Escape cierra, backdrop clic cierra.

  - **Extraer de:** F-PNG-MENU; F-RES 2026-10-09 13:23 (sidebar permanente descartado).

  - **Escribir en:** `Sistema 1/js/` (ej. `js/cromo/menu-hamburguesa-overlay.js` o `js/cromo/menu-hamburguesa-overlay.js`) + la copia identica en `Sistema 2/js/`. CSS overlay: `Sistema 1/css/layout-hamburguesa-y-overlay.css` y `Sistema 2/css/layout-hamburguesa-y-overlay.css`.

- [ ] SH-01c Orden exacto de enlaces: 1 Inicio 2 Matricula 3 Oferta Academica 4 Proyectos 5 Personal 6 Ubicaciones 7 Historia 8 Configuraciones.

  - **Extraer de:** F-RES 2026-10-11 14:10 (el PNG tiene otro orden: no copiarlo).

  - **Escribir en:** Lista `<nav>` dentro de `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`. Href Inicio -> `Sistema 1/paginas/inicio/pagina-inicio-cms.html`. Href Proyectos -> ver SH-01f. Las otras 6 secciones S1 solo existen bajo `Sistema 1/paginas/`.

- [ ] SH-01d Item Configuraciones: `disabled` + `aria-disabled` si no hay sesion Editor/Docente/Admin; no navega.

  - **Extraer de:** F-RES 14:10; F-PNG-MENU (existe el item).

  - **Escribir en:** Mismo header de SH-01a. JS que pone disabled: `Sistema 1/js/auth/sesion-roles-auth.js` y copia S2.

- [ ] SH-01e Item Cuentas al final del panel (como el PNG, abajo): login/registro; visitante puede ignorarlo.

  - **Extraer de:** F-PNG-MENU zona inferior.

  - **Escribir en:** Panel inferior del overlay en `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`. Formulario de login puede ser un `<dialog>` ahi; no crear `paginas/cuentas/` salvo que haga falta. No F-GEM.

- [ ] SH-01f Enlace Proyectos apunta a Sistema 2 (`../Sistema 2/paginas/proyectos/` ahora; URL absoluta Pages despues). Comentario href.

  - **Extraer de:** F-GH-S2; F-OLD P8-P10 (misma pestana, no iframe).

  - **Escribir en:** Unico `<a>` Proyectos en ambos headers. Ahora: `../Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` (desde S1) y `paginas/proyectos/pagina-hub-proyectos.html` (desde S2). Comentario TODO-SPLIT-REPO en esas dos lineas.

- [ ] SH-02a Variables CSS `css/variables-tema-diurno-nocturno.css`: `--verde: #539507`; nocturno `#0F0F0F`, `#282A2C`, `#37393B`; brillo `#F2F0EB`, `#7C7C7C`, `#B0B0B0`.

  - **Extraer de:** F-ASE / tabla F-RES 12:54.

  - **Escribir en:** `Sistema 1/css/variables-tema-diurno-nocturno.css` y copia `Sistema 2/css/variables-tema-diurno-nocturno.css`. Linkear desde todos los HTML. No `style.css` en la raiz.

- [ ] SH-02b Colores especialidad: Automotriz `#166534`, Mecanica `#EAB308`, Software `#EA580C`, Electronica `#0000FF`, ITSI `#64748B`, Electricos `#E61010`.

  - **Extraer de:** F-ASE grupo Especialidades; F-C-OF.

  - **Escribir en:** Mismas dos `variables-tema-diurno-nocturno.css`. Variables `--esp-automotriz` etc.

- [ ] SH-02c Boton tema **fuera** del menu (sol/luna Lucide). `html[data-theme=light|dark]`.

  - **Extraer de:** F-PNG-MENU; F-LUCIDE icons `sun` `moon`.

  - **Escribir en:** Boton en `compartido/encabezado-hamburguesa.html` (ambos sistemas). Logica: `Sistema 1/js/tema/persistir-tema-diurno-nocturno.js` y `Sistema 2/js/tema/persistir-tema-diurno-nocturno.js`. SVG: `iconos/sun.svg` `iconos/moon.svg` en ambos.

- [ ] SH-02d Visitante: persistir tema solo `localStorage.intiwo-tema`.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Solo `Sistema 1/js/tema/persistir-tema-diurno-nocturno.js` y `Sistema 2/js/tema/persistir-tema-diurno-nocturno.js` (localStorage). Cero SQL.

- [ ] SH-02e Usuario logueado: leer/guardar `perfiles.tema`.

  - **Extraer de:** seccion D de este archivo (prompt DER).

  - **Escribir en:** Mismos `tema.js` + `js/supabase/cliente-supabase.js` (ambos). Tabla `perfiles` en SQL S1.

- [ ] SH-03a Visitante: no forzar registro. Vista PDF = sin Editar ni Config.

  - **Extraer de:** F-RES 14:10; F-C-INI.

  - **Escribir en:** No archivo nuevo. Verificar `Sistema 1/paginas/inicio/pagina-inicio-cms.html` sin boton Editar para anon y Config disabled en ambos headers.

- [ ] SH-04a Pantalla Cuentas: email + contrasena o magic link (elegir uno; documentar en resoluciones).

  - **Extraer de:** F-PNG-MENU Cuentas; no copiar formulario F-GEM.

  - **Escribir en:** UI Cuentas: overlay en `compartido/encabezado-hamburguesa.html` (ambos) + `Sistema 1/js/auth/sesion-roles-auth.js` y copia S2. Auth es el mismo proyecto Supabase.

- [ ] SH-04b Registro Editor: si el correo no esta en un codigo/invitacion, mensaje "Tu docente aun no te dio de alta" y no crea perfil editor.

  - **Extraer de:** F-RES 14:10 roles.

  - **Escribir en:** `Sistema 1/js/auth/sesion-roles-auth.js` y copia S2. Mensaje de error en el overlay. Tabla `invitaciones_correo` (SQL).

- [ ] SH-04c Tras login Admin: mostrar Editar en Inicio y habilitar Configuraciones.

  - **Extraer de:** F-CMS; F-C-INI email matriz.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` (boton Editar SOLO se pinta en `Sistema 1/paginas/inicio/`). Config: ambos headers via `js/auth/sesion-roles-auth.js`.

- [ ] SH-04d Tras login Docente/Editor: Configuraciones con menos opciones (S1-07).

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` + `Sistema 1/js/auth/sesion-roles-auth.js`. S2 no duplica el arbol de docentes; redirige o muestra subset.

- [ ] SH-05a `<link>` Roboto Serif (400 y 700) en el head de ambas raices.

  - **Extraer de:** F-FONT.

  - **Escribir en:** `<head>` de TODOS los pagina-*.html bajo `Sistema 1/paginas/` y `Sistema 2/paginas/`. Extraer snippet de Google Fonts (F-FONT).

- [ ] SH-05b `body { font-family: "Roboto Serif", serif; }`. Prohibido otras familias en contenido.

  - **Extraer de:** F-FONT; F-CMS (dentro de bloques igual).

  - **Escribir en:** `Sistema 1/css/variables-tema-diurno-nocturno.css` y `Sistema 2/css/variables-tema-diurno-nocturno.css` regla `body`.

- [ ] SH-05c Copiar SVG Lucide a `Sistema 1/iconos/` y `Sistema 2/iconos/` con `stroke-width="2.5"` `stroke="currentColor"`.

  - **Extraer de:** F-LUCIDE. Nombres minimos: menu, house, search, sun, moon, pencil, plus, folder, graduation-cap.

  - **Escribir en:** Archivos SVG en `Sistema 1/iconos/` Y `Sistema 2/iconos/` (mismos nombres). No carpeta Adobe.

- [ ] SH-05d Extraer cada SVG desde lucide.dev (regla 6 de RESOLUCIONES).

  - **Extraer de:** F-LUCIDE; F-RES regla 6.

  - **Escribir en:** Misma carpeta `iconos/` de SH-05c. Bajar de lucide.dev, no inventar paths.

- [ ] SH-06a Footer: slogan, redes oficiales, LLAMANOS +503 7754 5899 (hasta 0-12), enlaces del menu sin Config, copyright 2026, Inscribete -> Matricula.

  - **Extraer de:** F-PNG-FOOT (layout); F-RES tabla (datos); IG/FB/TT de F-HIST P1.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/compartido/pie-institucional.html` y copia `Sistema 2/compartido/pie-institucional.html`. Incluir al final de cada pagina.

- [ ] SH-06b Footer textos desde `footer_cms` si hay fila; si no, valores F-RES.

  - **Extraer de:** F-CMS intencion secretarias; seccion D.

  - **Escribir en:** `Sistema 1/js/cms/cargar-footer-cms.js` (puede copiarse a S2). Lee tabla `footer_cms`. Fallback hardcode solo si 0 filas.

- [ ] SH-06c Admin edita telefonos/redes del footer (Guardar CMS o Config).

  - **Extraer de:** F-OLD P2 (secretarias sin codigo); F-CMS.

  - **Escribir en:** UI de edicion en `Sistema 1/paginas/configuraciones/` o toolbar Inicio. Persistencia: `footer_cms` via `Sistema 1/js/cms/cargar-footer-cms.js`. No editar PNG Adobe.

- [ ] SH-07a `cliente-supabase.js` S1 y S2: `createClient(url, anon)` constantes vacias + comentario no commitear keys.

  - **Extraer de:** F-CLI.

  - **Escribir en:** EDITAR `Sistema 1/js/supabase/cliente-supabase.js` y `Sistema 2/js/supabase/cliente-supabase.js` (ya existen). No crear `supabase.js` en la raiz.

- [ ] SH-07b Prohibido `service_role` en JS. Criterio: `rg service_role` = 0.

  - **Extraer de:** F-CMS punto 1 (password/keys nunca en Pages).

  - **Escribir en:** Grep de todo el repo. Si aparece, borrar esa linea. Destino de keys: nunca estos JS.

- [ ] SH-07c Misma URL/key en S1 y S2.

  - **Extraer de:** F-OLD P10 (un proyecto); F-S1L F-S2L.

  - **Escribir en:** Los dos `cliente-supabase.js` deben ser identicos en URL/anon.

- [ ] SH-08a Overlay menu `position:fixed; inset:0` en ?768px.

  - **Extraer de:** F-PNG-MENU (cubre, no empuja).

  - **Escribir en:** `Sistema 1/css/layout-hamburguesa-y-overlay.css` y `Sistema 2/css/layout-hamburguesa-y-overlay.css`.

- [ ] SH-08b Targets tactiles >=44x44 px (hamburguesa, tema, Cuentas, +).

  - **Extraer de:** criterio a11y; F-CMS toolbar.

  - **Escribir en:** Mismo `cromo.css` (ambos). Toolbar admin: `Sistema 1/css/editor-cms-inicio.css`.

- [ ] SH-08c Probar 320, 375, 768, 1280. Anotar roturas en resoluciones.

  - **Extraer de:** F-CMS critica movil.

  - **Escribir en:** No codigo nuevo. Notas en `IAs/RESOLUCIONES.md`. Paginas a abrir: Inicio S1 + hub S2.

- [ ] SH-08d Dropdown especialidades: max-height + scroll; no se sale a 320px.

  - **Extraer de:** F-PNG-S2T.

  - **Escribir en:** `Sistema 2/css/hub-y-pildoras-proyectos.css` (pildoras S2) y `Sistema 1/css/pildoras-oferta-academica.css` (pildoras Oferta).

- [ ] SH-08e Barra busqueda S2: no tapa distintivo; 320px fila bajo header.

  - **Extraer de:** F-PNG-S2B.

  - **Escribir en:** `Sistema 2/css/layout-hamburguesa-y-overlay.css` + markup busqueda en `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` (solo S2 muestra el input). S1 header NO lleva busqueda.

- [ ] SH-08f Hub S2: 2 cols desktop, 1 col movil.

  - **Extraer de:** F-PNG-S2H.

  - **Escribir en:** `Sistema 2/css/hub-y-pildoras-proyectos.css` + `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`.

- [ ] SH-09a Comentario `TODO-SPLIT-REPO` en href Proyectos.

  - **Extraer de:** F-GH-S2.

  - **Escribir en:** Comentario HTML/JS junto al href Proyectos en `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`.

- [ ] SH-09b Checklist al copiar S2 al otro GitHub (cliente, quitar `../Sistema 1`, Auth URL).

  - **Extraer de:** F-OLD P10 hosts github.io; F-GH-S1 F-GH-S2.

  - **Escribir en:** Checklist escrito en `Sistema 2/LEEME.md` (no en BACKLOG copiar de mas). Codigo sigue en este clone hasta el split.

---

## B. Sistema 1 | paginas

### B0. Inicio CMS (prioridad)

- [ ] S1-01a `paginas/inicio/pagina-inicio-cms.html`: header + `<main id="inicio-root"></main>` + footer. Main vacio si no hay JSON.

  - **Extraer de:** F-C-INI; F-CMS. No F-SITE (mision/vision no van hardcode).

  - **Escribir en:** SOLO `Sistema 1/paginas/inicio/pagina-inicio-cms.html`. Incluye header+footer compartidos S1. NO crear inicio en Sistema 2.

- [ ] S1-01b JS: `select` `contenido_inicio`. Si 0 filas o `bloques=[]`, no insertar bloques.

  - **Extraer de:** F-CMS; nombre de tabla canonico `contenido_inicio` (CONTENIDO.md decia `paginas_cms`: ignorar ese nombre).

  - **Escribir en:** `Sistema 1/js/cms/cargar-bloques-inicio.js` (select contenido_inicio). Lo llama `paginas/inicio/pagina-inicio-cms.html`. Tabla: SQL, no JSON local.

- [ ] S1-01c Skeleton 200ms (fondo paleta) para que el footer no salte.

  - **Extraer de:** F-CMS 14:33 punto 6; F-ASE.

  - **Escribir en:** `Sistema 1/js/cms/cargar-bloques-inicio.js` + `Sistema 1/css/pagina-inicio-visitante.css` (skeleton).

- [ ] S1-01d Render visitante: mismos componentes que el editor, `contenteditable=false`, sin Sortable.

  - **Extraer de:** F-CMS.

  - **Escribir en:** `Sistema 1/js/cms/render-bloques-inicio.js` usado por visitante y admin. No duplicar markup.

- [ ] S1-08a Boton Editar `display:none` por defecto; visible si `perfiles.rol==='administrador'`.

  - **Extraer de:** F-CMS; Lucide `pencil` F-LUCIDE. No hay PNG del boton: colocarlo en cromo Inicio, no en el menu.

  - **Escribir en:** Boton en `Sistema 1/paginas/inicio/pagina-inicio-cms.html` (fuera del menu). CSS `Sistema 1/css/editor-cms-inicio.css`. Visibilidad: `Sistema 1/js/cms/editor-cms-inicio-admin.js`.

- [ ] S1-08b Cuenta matriz `intiwo11543@gmail.com` tras login ve Editar (rol admin, no `if email` en cada boton).

  - **Extraer de:** F-C-INI; F-CMS correccion RLS. **No** copiar password de F-OLD P1.

  - **Escribir en:** Mismo `editor.js`. Rol desde `perfiles`, no if email. Seed SQL en `Sistema 1/supabase/semilla-admin-sin-password.sql`.

- [ ] S1-10a Clic Editar: ocultar hamburguesa/tema/Cuentas del cromo publico; montar `#admin-toolbar` (Lucide + texto: Plantilla, Color, Imagen, Texto, Capa, Animacion, Guardar, Cancelar).

  - **Extraer de:** F-CMS 14:33 puntos 3-5. **No existe mockup Adobe de esta barra.** No usar F-PNG-MENU como toolbar.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` monta `#admin-toolbar` dentro de `paginas/inicio/pagina-inicio-cms.html`. Iconos: `Sistema 1/iconos/`. No existe esta barra en S2.

- [ ] S1-10b Estado inicial admin sin JSON: **2** bloques vacios plantilla `banner` + boton + entre bloques y footer.

  - **Extraer de:** F-CMS 14:33 punto 3.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` + `Sistema 1/js/cms/plantillas-bloques-inicio.js`. DOM: `#inicio-root` en inicio/pagina-inicio-cms.html.

- [ ] S1-10c Clic +: append bloque vacio (`banner`) y dejar el + debajo.

  - **Extraer de:** F-CMS; icono `plus` F-LUCIDE.

  - **Escribir en:** Mismo `editor.js`. Boton + es HTML generado, no un PNG.

- [ ] S1-10d Plantillas: `banner`, `texto-imagen-izq`, `texto-imagen-der`, `tres-columnas`. Cada una `article` full-width.

  - **Extraer de:** F-CMS 14:33 punto 2; 0-19.

  - **Escribir en:** `Sistema 1/js/cms/plantillas-bloques-inicio.js` (funciones que devuelven <article>). CSS de cada plantilla: `Sistema 1/css/editor-cms-inicio.css`.

- [ ] S1-10e Dentro del bloque: solo Roboto Serif; clases `t-sm` `t-md` `t-lg` `t-xl`; no font-family libre.

  - **Extraer de:** F-FONT; F-CMS (no Canva tipografico).

  - **Escribir en:** `Sistema 1/css/editor-cms-inicio.css` clases t-sm..t-xl. Tipografia ya en variables-tema-diurno-nocturno.css S1.

- [ ] S1-10f Color de fondo: swatches paleta .ase + `input type=color`.

  - **Extraer de:** F-ASE.

  - **Escribir en:** Swatches en toolbar (`editor-cms-inicio-admin.js`) leyendo hex de `variables-tema-diurno-nocturno.css`. Input color nativo.

- [ ] S1-10g Imagen fondo/contenido: Storage bucket `inicio/`, accept `.webp,.png,.jpg,.jpeg,.svg`.

  - **Extraer de:** F-S1L `media/inicio/`; F-CMS.

  - **Escribir en:** Upload JS: `Sistema 1/js/cms/subir-imagenes-inicio.js`. Preview en el article. Archivo remoto: bucket Storage `inicio`. Opcional cache local `Sistema 1/media/inicio/` no commitear binarios de secretaria.

- [ ] S1-10h Capas adelante/atras: solo elementos **dentro** del mismo `article`.

  - **Extraer de:** F-CMS 14:27.

  - **Escribir en:** Logica en `editor.js` sobre hijos del article. No z-index global de pagina.

- [ ] S1-10i Prohibido `position:absolute` a nivel de pagina para texto suelto.

  - **Extraer de:** F-CMS 14:27 (se rompe en celular).

  - **Escribir en:** `Sistema 1/css/editor-cms-inicio.css` y `inicio.css`: bloques `position:relative`. Lint/revision, no archivo nuevo.

- [ ] S1-11a Toggle Vista movil = iframe o contenedor width 360px del mismo render.

  - **Extraer de:** F-CMS.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` toggle. Preview en el mismo inicio/pagina-inicio-cms.html (iframe o #preview-360).

- [ ] S1-11b No habilitar Guardar si 360px tiene overflow-x.

  - **Extraer de:** F-CMS.

  - **Escribir en:** Mismo editor.js deshabilita boton Guardar. No hay destino S2.

- [ ] S1-12a Incluir SortableJS. Handle = barra del bloque.

  - **Extraer de:** F-SORT; F-CMS punto 4.

  - **Escribir en:** Vendor: `Sistema 1/js/cms/sortable.min.js` o CDN en inicio/pagina-inicio-cms.html. Init en editor-cms-inicio-admin.js.

- [ ] S1-12b Drag reordena `bloques[].orden`.

  - **Extraer de:** F-CMS punto 6.

  - **Escribir en:** editor.js actualiza array antes de Guardar.

- [ ] S1-13a Dropdown Animacion: `ninguna | fade | slide-up | parallax-suave`. AOS o clases CSS.

  - **Extraer de:** F-AOS; F-CMS punto 5.

  - **Escribir en:** Select en toolbar (editor-cms-inicio-admin.js). Clases en `Sistema 1/css/editor-cms-inicio.css` y/o AOS desde CDN en inicio/pagina-inicio-cms.html.

- [ ] S1-13b No permitir CSS arbitrario de la secretaria.

  - **Extraer de:** F-CMS.

  - **Escribir en:** No hay textarea CSS. Si aparece, borrarlo de editor.js.

- [ ] S1-14a Guardar: JSON `{ bloques: [{ id, plantilla, orden, textos, color, imagen, animacion, capas }] }` upsert `contenido_inicio`.

  - **Extraer de:** F-CMS punto 6.

  - **Escribir en:** `Sistema 1/js/cms/guardar-contenido-inicio.js` upsert a contenido_inicio. No escribir el JSON en un .html estatico.

- [ ] S1-14b Cancelar: recargar JSON anterior; salir de edicion; restaurar cromo.

  - **Extraer de:** F-CMS.

  - **Escribir en:** guardar.js / editor.js recarga cargar.js. Restaura header S1.

- [ ] S1-14c Tras Guardar: modo visitante de esa sesion Admin ve bloques publicados.

  - **Extraer de:** F-CMS; F-C-INI.

  - **Escribir en:** Tras upsert, render.js pinta en `#inicio-root`.

- [ ] S1-15 Sanitizar texto (textContent o DOMPurify). No ejecutar `<script>` pegado.

  - **Extraer de:** F-CMS (secretaria pega HTML).

  - **Escribir en:** `Sistema 1/js/cms/sanitizar-texto-cms.js` (DOMPurify vendor en `Sistema 1/js/cms/` o textContent). Llamar antes de innerHTML.

### B1. Matricula / Oferta / Personal / Ubicaciones / Historia

- [ ] S1-02a `paginas/matricula/pagina-matricula-nuevo-ingreso.html` con cromo compartido.

  - **Extraer de:** F-S1L; F-PNG-MENU.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/matricula/pagina-matricula-nuevo-ingreso.html`. Header/footer S1. No Sistema 2.

- [ ] S1-02b Copiar pasos 2027 desde F-C-MAT (sin videos, sin inventar fechas).

  - **Extraer de:** F-C-MAT; F-MICRO P2 (pasos 2.2.x, numeracion del PDF puede diferir del Site: **priorizar F-C-MAT / F-SITE-MAT** que ya unifico 5 pasos con fechas); F-RES "Nuevo ingreso".

  - **Escribir en:** Cuerpo de `pagina-matricula-nuevo-ingreso.html` (no crear matricula.js; el HTML ya existe). Extraer texto de CONTENIDO.md de la MISMA carpeta.

- [ ] S1-02c Seccion EDUCAME desde el mismo CONTENIDO.

  - **Extraer de:** F-C-MAT; F-MICRO P7; F-SITE-ED.

  - **Escribir en:** Misma pagina matricula/pagina-matricula-nuevo-ingreso.html, seccion debajo de 2027.

- [ ] S1-02d CTA Inscribete: no 74411075 hasta 0-12; usar +503 7754 5899 o enlace Matricula.

  - **Extraer de:** F-PNG-FOOT CTA; F-RES tabla vs F-SITE-MAT.

  - **Escribir en:** CTA en matricula/pagina-matricula-nuevo-ingreso.html y en footer compartido (href a esta pagina).

- [ ] S1-03a Pagina oferta: dropdown/pildoras como PNG (fondo `#539507`, activo/hover).

  - **Extraer de:** F-PNG-S2T (look de pildoras, reutilizado en Oferta S1); F-ASE verde.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/oferta-academica/pagina-oferta-academica.html` + `Sistema 1/css/pildoras-oferta-academica.css`. Look de pildoras desde PNG S2 pero el HTML NO va a Sistema 2.

- [ ] S1-03b Seis tecnicas + General (7). Copy de modulos.

  - **Extraer de:** F-C-OF (lista corta); F-MICRO P2-P7 (modulos largos por especialidad); F-RES Oferta academica; F-SITE-OF. General = F-MICRO P7 no una septima tecnica.

  - **Escribir en:** Copy en oferta-academica/pagina-oferta-academica.html (modulos). Fuente de texto: CONTENIDO.md de esa carpeta + F-MICRO P2-P7.

- [ ] S1-03c Color de pildora = SH-02b. Hover Sistemas Electricos puede ir `#E61010` como PNG.

  - **Extraer de:** F-PNG-S2T; F-ASE.

  - **Escribir en:** Colores en `Sistema 1/css/pildoras-oferta-academica.css` usando variables de variables-tema-diurno-nocturno.css S1.

- [ ] S1-03d Sin videos .mp4 del Site.

  - **Extraer de:** F-LEEME; F-SITE-OF.

  - **Escribir en:** No crear `Sistema 1/media/` para mp4 de oferta. Cero <video>.

- [ ] S1-04a Personal: "Proximamente" si no hay 0-16.

  - **Extraer de:** F-C-PER.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/personal/pagina-personal-instituto.html` con mensaje Proximamente.

- [ ] S1-04b Ficha: nombre, cargo, bio. Foto solo si 0-05 = si.

  - **Extraer de:** F-C-PER.

  - **Escribir en:** Componente en esa misma pagina o `personal.js` en la carpeta. Fotos solo si 0-05.

- [ ] S1-05a Ubicaciones: Col. Roma, final Blvd. Venezuela, San Salvador.

  - **Extraer de:** F-C-UBI; F-HIST P1; F-RES tabla.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/ubicaciones/pagina-ubicaciones.html`.

- [ ] S1-05b Contacto tabla RESOLUCIONES. Buses/plano placeholder hasta 0-06.

  - **Extraer de:** F-C-UBI.

  - **Escribir en:** Misma pagina. No inventar mapa JS hasta 0-06.

- [ ] S1-06a Historia: 1954, 1955, 1962, 1964 Expotecnia, 2015 Open House, 2024 70 anios.

  - **Extraer de:** F-C-HIS (lista corta publicable); F-HIST **P21** (Expotecnia inicia 1964, mision Japon 1962); **P22-P25** (feria oct-nov, especialidades en stands); **P27-P28** (Open House desde oct 2015, captacion 9 grado). URLs de apoyo en F-HIST P22 (elsalvador.com 70 anios, Scribd/UES 1954). Transcribir solo hechos, no el tono de IA del PDF.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/historia/pagina-historia-instituto.html` con timeline. Texto de `Sistema 1/paginas/historia/CONTENIDO.md` + F-HIST P21-P28.

- [ ] S1-06b No renderizar violencia/destitucion. Comentario HTML `<!-- RETENIDO -->`.

  - **Extraer de:** F-HIST **P2-P3, P7-P20** (pandillas, FGR, destitucion 25 ago 2025, 2015, 2021-2026). F-RES "Retener". Hasta 0-09.

  - **Escribir en:** Comentario HTML en historia/pagina-historia-instituto.html. No hay pagina 'retenido'.

- [ ] S1-06c Cifras 20.000 / 1.000 solo si 0-10 y 0-11 estan `[x]`.

  - **Extraer de:** F-HIST P2 y P22 (el PDF avisa "la IA puede cometer errores").

  - **Escribir en:** Condicional en historia/pagina-historia-instituto.html. Cifras no van a Inicio ni footer.

### B2. Configuraciones y cuentas (S1)

- [ ] S1-07a Visitante: Configuraciones no navega (SH-01d).

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Logica en `Sistema 1/js/auth/sesion-roles-auth.js` (item Config del header S1 y S2).

- [ ] S1-07b Admin: dos dropdowns raiz: Administradores | Docentes.

  - **Extraer de:** F-RES 14:10 (no hay PNG). F-OLD P9 es otra IA de roles: no copiar "visitante" como cuenta.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` + `Sistema 1/js/auth/panel-configuraciones-cuentas.js`. Esta pagina NO se duplica en S2 (enlace del menu S2 apunta a S1 o replica minima).

- [ ] S1-07c Admin > Docentes > Academico | Tecnico. Tecnico > 6 especialidades (sin General aqui salvo Instituto).

  - **Extraer de:** F-C-OF; F-MICRO 3.x.

  - **Escribir en:** Arbol DOM en configuraciones/pagina-configuraciones.html. Datos: tablas especialidades/codigos.

- [ ] S1-07d Al elegir especialidad: lista docentes + codigos. Expandir: alumnos (correo, nombre, n lista).

  - **Extraer de:** F-RES 14:10; F-PDF-S2 filtros anio/seccion/codigo (logica, no look).

  - **Escribir en:** `Sistema 1/js/auth/panel-configuraciones-cuentas.js` listas. No HTML de proyectos.

- [ ] S1-07e Admin crea/borra Admin, Docente, Editor (correo+nombre; NIE+n lista si 0-14).

  - **Extraer de:** F-RES 14:10; F-OLD P9 (invitacion por correo).

  - **Escribir en:** Formularios en configuraciones/pagina-configuraciones.html. Writes: invitaciones_correo + Auth via cliente-supabase.js S1.

- [ ] S1-07f Docente: codigo = Especialidad + Nivel 1/2/3 + Seccion ? `DS2B`. Prefijos DS, EL, MI, MA, SE, IT, GE.

  - **Extraer de:** F-RES 14:10; F-PDF-S2 "Codigo DSXX".

  - **Escribir en:** `config.js` genera string clave. Insert `codigos`. Prefijos documentados en comentario del JS.

- [ ] S1-07g Docente: dentro del codigo, correos de editores de a uno + n lista (+ NIE si 0-14).

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Mismo config.js. Una fila invitaciones_correo por correo.

- [ ] S1-07h Docente: eliminar codigo o alumno de su codigo; no ve otros docentes.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** DELETE/UPDATE en config.js filtrado por docente_id.

- [ ] S1-07i Editor: Config minima (ficha S2 / password / tema). No crea cuentas.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Vista reducida en configuraciones/pagina-configuraciones.html si rol=editor. Link a `Sistema 2/paginas/ficha/`.

- [ ] S1-09a Nadie se auto-asigna Admin excepto la matriz via DB-09.

  - **Extraer de:** F-CMS; F-C-INI.

  - **Escribir en:** Trigger/SQL `Sistema 1/supabase/`. Front no ofrece combo Rol=admin al registrarse.

- [ ] S1-09b Admin no borra la ultima cuenta administrador.

  - **Extraer de:** F-CMS seguridad.

  - **Escribir en:** `config.js` + RLS SQL. Impedir delete si count admin = 1.

---

## C. Sistema 2 | proyectos

Look: F-PNG-S2H, F-PNG-S2T, F-PNG-S2B. Estructura de datos (URLs, no fotos de alumno): F-PDF-S2 fases 2-3 y F-OLD P10 grupo B.

- [ ] S2-01a `paginas/proyectos/pagina-hub-proyectos.html` cromo + busqueda.

  - **Extraer de:** F-PNG-S2H; F-S2L; cromo F-PNG-MENU.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`. Header S2 (con busqueda). NO crear esta pagina bajo Sistema 1.

- [ ] S2-01b Dos cards Tecnicos / Academicos con copy del PNG y Ver mas.

  - **Extraer de:** F-PNG-S2H (leer textos del PNG pixel a pixel).

  - **Escribir en:** Las dos cards en proyectos/pagina-hub-proyectos.html. CSS `Sistema 2/css/hub-y-pildoras-proyectos.css`.

- [ ] S2-01c Lucide folder vs graduation-cap, trazo 2.5, color `#539507`.

  - **Extraer de:** F-LUCIDE; F-PNG-S2H; F-ASE.

  - **Escribir en:** SVG ya en `Sistema 2/iconos/folder.svg` y `graduation-cap.svg` (SH-05). Usarlos en las cards.

- [ ] S2-02a Tras Tecnicos: pildoras especialidades (nombres del PNG + General).

  - **Extraer de:** F-PNG-S2T; F-C-OF nombres; 0-17 ITSI.

  - **Escribir en:** Bloque pildoras en proyectos/pagina-hub-proyectos.html (tras click Tecnicos). Nombres de F-C-OF / PNG.

- [ ] S2-02b Hover/activo: rojo o verde segun PNG; contraste.

  - **Extraer de:** F-PNG-S2T.

  - **Escribir en:** `Sistema 2/css/hub-y-pildoras-proyectos.css` :hover/:active.

- [ ] S2-02c Filtrar por especialidad + anio cuando haya data.

  - **Extraer de:** F-PDF-S2 Fase 2 (filtro anio/seccion/codigo) como **logica**, UI = PNG.

  - **Escribir en:** `Sistema 2/js/busqueda/filtrar-proyectos-especialidad.js` lee tabla proyectos. No filtrar en S1.

- [ ] S2-03a Input placeholder `Busca algun proyecto de tu interes....`

  - **Extraer de:** F-PNG-S2B (respetar puntos del PNG).

  - **Escribir en:** Input en `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` (solo S2). Placeholder exacto del PNG.

- [ ] S2-03b Cero resultados: copy del PNG ("No se encontro... quizas te refieres a").

  - **Extraer de:** F-PNG-S2B.

  - **Escribir en:** Panel resultados: `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` o overlay. Copy del PNG.

- [ ] S2-03c Debounce 200ms. 0 caracteres = hub.

  - **Extraer de:** F-PNG-S2H estado vacio de query.

  - **Escribir en:** `Sistema 2/js/busqueda/buscar-proyectos.js`.

- [ ] S2-04a Ficha `paginas/ficha/pagina-ficha-proyecto.html?id=`. Campos: titulo, especialidad, codigo, anio, tipo tecnico|academico, texto, URLs (GitHub, Drive, YouTube). **Sin foto de alumno.**

  - **Extraer de:** F-PDF-S2 Fase 3 (equipo, descripcion, adjuntos como URL no PNG de cara); F-OLD P10 grupo B "solo URLs"; F-RES 14:10.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 2/paginas/ficha/pagina-ficha-proyecto.html`. Query ?id=. Campos en esa pagina. urls jsonb. Cero <img> de alumno.

- [ ] S2-04b Editor: form solo si `proyecto.editor_id === auth.uid()`.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** `Sistema 2/js/` (ej. `ficha/editar.js`) en la misma seccion ficha. Solo si editor_id coincide.

- [ ] S2-04c Editor viendo otro proyecto: mismo DOM que visitante.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Mismo ficha/pagina-ficha-proyecto.html rama visitante.

- [ ] S2-05a Docente: listado cuyo `codigo_id` esta en sus codigos.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Listado docente: puede ser `Sistema 2/paginas/proyectos/` filtrado o seccion en configuraciones S1. Preferir S2 proyectos con query ?vista=docente.

- [ ] S2-05b Docente: borrar proyecto (confirm). Soft-delete `deleted_at`.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Boton en ficha o listado S2. UPDATE deleted_at via cliente-supabase.js S2.

- [ ] S2-05c Toggle docente: ver como visitante | como editor solo en proyectos de sus alumnos.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Toggle en ficha/pagina-ficha-proyecto.html (solo docente). Reusa render visitante/editor.

- [ ] S2-06a Admin S2: borrar pagina de proyecto (cualquier codigo). No "borrar un archivo del repo".

  - **Extraer de:** F-RES 14:10 (los adjuntos son URLs externas).

  - **Escribir en:** Admin: mismo UPDATE deleted_at desde S2 ficha. No `git rm`.

- [ ] S2-06b Admin S2: alta correos Docente (misma API que S1-07e).

  - **Extraer de:** un proyecto Supabase.

  - **Escribir en:** Reutilizar `Sistema 1/js/auth/panel-configuraciones-cuentas.js` (alta docente). Si se llama desde S2, importar o redirigir a `Sistema 1/paginas/configuraciones/`.

- [ ] S2-07a Crear codigo: regex `^[A-Z]{2}[123][A-Z]$` o mapa real (DS2B).

  - **Extraer de:** F-RES 14:10; F-PDF-S2 DSXX.

  - **Escribir en:** Validacion en `Sistema 1/js/auth/panel-configuraciones-cuentas.js` (crear codigo es de docente, UI Config S1). Regex en ese archivo.

- [ ] S2-07b Insertar `invitaciones_correo` antes del registro del alumno.

  - **Extraer de:** F-OLD P9 invitacion email; F-RES 14:10.

  - **Escribir en:** INSERT desde config.js S1 a invitaciones_correo. No hay formulario de alta en ficha S2.

- [ ] S2-08a `Sistema 2/LEEME.md`: pasos copy-paste al repo web-oficial-proyectos.

  - **Extraer de:** F-S2L; F-GH-S2.

  - **Escribir en:** EDITAR `Sistema 2/LEEME.md` con pasos de copia al otro repo.

- [ ] S2-08b Auth: permitir origenes Pages S1 y S2.

  - **Extraer de:** F-OLD P10.

  - **Escribir en:** Panel Auth de Supabase (no archivo git) + nota en `Sistema 1/supabase/README.md` si se crea. Origenes Pages S1 y S2.

- [ ] S2-09a Header S2: busqueda centrada como PNG; Editar solo admin (CMS no aplica a fichas de alumnos).

  - **Extraer de:** F-PNG-S2B; F-CMS (Editar = Inicio S1).

  - **Escribir en:** Header S2 distinto: `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` incluye busqueda. Boton Editar CMS no existe en S2 (el de ficha es otro, S2-04b).

- [ ] S2-09b Placeholder "Aca bla bla" del PNG **no** copiar a prod.

  - **Extraer de:** F-PNG-S2H nota.

  - **Escribir en:** No pegar lorem del PNG en proyectos/pagina-hub-proyectos.html. Copy real cuando exista CONTENIDO; si no, omitir esa frase.

---

## D. Supabase (un proyecto, dos fronts)

No escribir SQL de produccion hasta que Instituto pegue el **Anexo prompt DER** (abajo) a la IA de modelado y vuelva el diagrama. Las casillas DB-* implementan ese DER, no lo inventan distinto.

- [ ] DB-01a Crear proyecto free. Activar Auth email.

  - **Extraer de:** F-CLI; 0-15.

  - **Escribir en:** Proyecto en dashboard Supabase (nube). Cero archivos todavia.

- [ ] DB-01b URL y anon en local de Instituto, no git.

  - **Extraer de:** F-CLI; F-CMS.

  - **Escribir en:** Local Instituto. Los `cliente-supabase.js` S1 y S2 no llevan la key real en git.

- [ ] DB-02a a DB-09b: seguir entidades/PK/FK del DER aprobado. Borrador de trabajo = Anexo de este archivo.

  - **Extraer de:** Anexo DER; F-OLD P10 grupos A/B/C; F-CMS `contenido_inicio`; F-RES 14:33 RLS por `rol` no por email.

  - **Escribir en:** SQL `Sistema 1/supabase/tabla-perfiles.sql`. Copia de referencia `Sistema 2/supabase/` (mismo archivo, no otra BD).

Casillas atomicas de implementacion (cuando haya DER):

- [ ] DB-02a Tabla `perfiles`


  - **Escribir en:** SQL `Sistema 1/supabase/tabla-perfiles.sql`. Copia de referencia `Sistema 2/supabase/` (mismo archivo, no otra BD).

- [ ] DB-02b Tabla `codigos`


  - **Escribir en:** `Sistema 1/supabase/tabla-codigos-seccion.sql` (+ copia S2/supabase).

- [ ] DB-02c Tabla `especialidades` seed 6+General+hex


  - **Escribir en:** `Sistema 1/supabase/tabla-especialidades.sql` con INSERT seed hex.

- [ ] DB-02d Tabla `contenido_inicio` JSON bloques, una fila


  - **Escribir en:** `Sistema 1/supabase/tabla-contenido-inicio.sql`.

- [ ] DB-02e Tabla `footer_cms`


  - **Escribir en:** `Sistema 1/supabase/tabla-footer-cms.sql`.

- [ ] DB-02f Tabla `proyectos` + `urls jsonb` (github, drive, youtube, otros)


  - **Escribir en:** `Sistema 1/supabase/tabla-proyectos.sql` (urls jsonb).

- [ ] DB-02g Tabla `invitaciones_correo`


  - **Escribir en:** `Sistema 1/supabase/tabla-invitaciones-correo.sql`.

- [ ] DB-03a RLS contenido_inicio: SELECT publico; UPDATE admin


  - **Escribir en:** `Sistema 1/supabase/politicas-rls.sql` policies contenido_inicio.

- [ ] DB-03b RLS proyectos: SELECT no deleted publico; UPDATE dueno; DELETE docente del codigo o admin


  - **Escribir en:** Mismo politicas-rls.sql policies proyectos.

- [ ] DB-03c RLS perfiles


  - **Escribir en:** Mismo politicas-rls.sql policies perfiles.

- [ ] DB-03d RLS codigos / invitaciones


  - **Escribir en:** Mismo politicas-rls.sql policies codigos e invitaciones.

- [ ] DB-04a Bucket `inicio` lectura publica; write admin


  - **Escribir en:** Bucket en dashboard Storage nombre `inicio`. Politicas en `Sistema 1/supabase/storage-buckets.sql`.

- [ ] DB-04b Bucket `personal` solo si 0-05 = si


  - **Escribir en:** No crear hasta 0-05=si. Si si: bucket `personal` + storage-buckets.sql.

- [ ] DB-05a Trigger auth.users ? perfiles (editor solo si invitacion; email matriz ? administrador)


  - **Escribir en:** `Sistema 1/supabase/trigger-nuevo-perfil.sql`.

- [ ] DB-06a Documentar origenes Pages distintos


  - **Escribir en:** Parrafo en `Sistema 1/LEEME.md` y `Sistema 2/LEEME.md`.

- [ ] DB-06b CORS y Redirect URLs Auth


  - **Escribir en:** Checklist en esos LEEME + panel Auth.

- [ ] DB-07a Unique email invitaciones; SH-04b


  - **Escribir en:** UNIQUE en tabla-invitaciones-correo.sql + mensaje SH-04b en sesion.js.

- [ ] DB-08a Indice GIN opcional v1


  - **Escribir en:** Opcional en tabla-contenido-inicio.sql. Se puede omitir v1.

- [ ] DB-09a Seed `intiwo11543@gmail.com` rol admin **sin password** en `Sistema 1/supabase/semilla-admin-sin-password.sql`


  - **Escribir en:** `Sistema 1/supabase/semilla-admin-sin-password.sql` UPDATE por email, SIN password. Copiar a S2/supabase como referencia.

- [ ] DB-09b Politicas `rol = administrador`, nunca email como unica regla


  - **Escribir en:** Revisar politicas-rls.sql: ninguna policy solo con auth.email() = matriz.

---

## E. QA

- [ ] E-01 320px: menu overlay, Inicio 0 bloques, sin scroll horizontal.

  - **Extraer de:** F-CMS; F-C-INI.

  - **Escribir en:** Probar `Sistema 1/paginas/inicio/pagina-inicio-cms.html` a 320px. Anotar `IAs/RESOLUCIONES.md`.

- [ ] E-02 360px: 4 bloques no desbordan.

  - **Extraer de:** S1-11; F-CMS.

  - **Escribir en:** Probar mismo inicio con 4 bloques (sesion admin). Anotar resoluciones.

- [ ] E-03 768px: hub S2 2 cols; especialidades wrap.

  - **Extraer de:** F-PNG-S2H F-PNG-S2T.

  - **Escribir en:** Probar `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` 768px.

- [ ] E-04 Landscape: busqueda S2 no tapa logo.

  - **Extraer de:** F-PNG-S2B.

  - **Escribir en:** Probar header S2 landscape.

- [ ] E-05 XSS bloque Inicio no alerta.

  - **Extraer de:** S1-15.

  - **Escribir en:** Probar pegando en editor Inicio (S1). No en ficha S2.

- [ ] E-06 Visitante no ve `#admin-toolbar` ni Editar.

  - **Extraer de:** F-CMS.

  - **Escribir en:** Inspeccionar DOM de inicio S1 sin login.

- [ ] E-07 Editor no actualiza proyecto ajeno (RLS).

  - **Extraer de:** Anexo DER.

  - **Escribir en:** Dos cuentas editor contra ficha S2.

- [ ] E-08 Copiar S2: grep `Sistema 1` = 0 o documentado.

  - **Extraer de:** SH-09b.

  - **Escribir en:** Tras copiar repo S2: grep. Documentar en Sistema 2/LEEME.md.

- [ ] E-09 `rg service_role` = 0.

  - **Extraer de:** SH-07b.

  - **Escribir en:** Grep raiz del clone web-oficial.

- [ ] E-10 No fotos de estudiantes en fichas S2.

  - **Extraer de:** S2-04a; F-OLD P10.

  - **Escribir en:** Inspeccionar `Sistema 2/paginas/ficha/pagina-ficha-proyecto.html`.

---

## Anexo | Prompt para la IA de DER / ERD (copiar tal cual)

El nombre que buscas es el de una IA o modo de **diagrama entidad-relacion (DER / ERD)**, no un ERP tipo SAP. Pegar el bloque siguiente en Gemini, ChatGPT, Claude, v0, o el canvas de diagramas. Pedirle: (1) diagrama Mermaid `erDiagram`, (2) diccionario de datos, (3) SQL Postgres/Supabase comentado, (4) politicas RLS. **No debe inventar tablas fuera de la lista. No debe poner passwords. No debe usar el email como unica regla RLS.**

```

Eres una IA de modelado de datos. Genera el DER (diagrama entidad-relacion) y el SQL de PostgreSQL para INTIWO. No implementes HTML. No uses service_role en el cliente.

CONTEXTO DE SISTEMA

- Sustituye https://sites.google.com/inti.edu.sv/nuevoingreso/inicio

- Arquitectura: hibrido Jamstack + BaaS cliente-servidor. Dos frontends estaticos (GitHub Pages):

  - Sistema 1 repo web-oficial (Inicio CMS, Matricula, Oferta, Personal, Ubicaciones, Historia, Configuraciones)

  - Sistema 2 repo web-oficial-proyectos (solo Proyectos)

- UN unico proyecto Supabase (Auth + Postgres + Storage). NO tres bases. Tres grupos logicos de tablas:

  A = cuentas y roles (los dos sitios)

  B = portafolio: textos + SOLO URLs externas (GitHub, Google Drive, YouTube, otros). Nunca binarios de proyectos ni fotos de alumnos.

  C = CMS institucional (Inicio JSON + footer editable por secretarias/admin)

- Visitante: anonimo, sin fila, solo lee. Tema en localStorage.

- Roles en perfiles.rol: administrador | docente | editor

- Cuenta matriz para PRIMERA asignacion de admin: intiwo11543@gmail.com (el password NO va en SQL ni en git; Instituto se registra por Auth y un seed UPDATE pone el rol)

- Codigos de seccion tipo DS2B = especialidad + nivel 1|2|3 + seccion A|B|...

- Prefijos sugeridos: DS software, EL electronica, MI mecanica industrial, MA automotriz, SE sistemas electricos, IT ITSI, GE general

- Editor: solo su ficha de proyecto. Docente: codigos propios, invita correos, borra proyectos de sus alumnos. Admin: ambos sistemas, CMS Inicio, alta de cuentas, borrar cualquier pagina de proyecto.

- NIE: columna nullable; Instituto no ha autorizado guardarlo. No lo hagas NOT NULL.

- Contenido Oferta/Matricula/Historia de v1 puede ser HTML estatico desde markdown; NO hace falta CMS JSON para esas paginas en v1. Solo Inicio y footer son CMS.

ENTIDADES MINIMAS (usar estos nombres en espanol_snake o los equivalentes claros)

1. especialidades

   PK: id uuid o smallserial

   Atributos: slug text unique, nombre text, nombre_corto text, color_hex text, tipo text check (tecnica|general), orden int

   Seed: 6 tecnicas + General. Hex: Automotriz #166534, Mecanica #EAB308, Software #EA580C, Electronica #0000FF, ITSI #64748B, Electricos #E61010. General: color a definir, no inventar un septimo industrial.

2. perfiles

   PK: id uuid FK ? auth.users(id) ON DELETE CASCADE

   Atributos: rol text not null check (administrador|docente|editor), nombre text, tema text check (light|dark) default dark, especialidad_id uuid FK especialidades nullable (docentes de taller), nie text nullable, n_lista int nullable, created_at, updated_at

   Un perfil por usuario. Visitante no tiene perfil.

3. codigos

   PK: id uuid

   Atributos: clave text unique (ej DS2B), especialidad_id FK NOT NULL, nivel int check (1,2,3), seccion text (1 char), docente_id FK perfiles NOT NULL, anio_lectivo int, created_at

   Unique (especialidad_id, nivel, seccion, anio_lectivo)

4. invitaciones_correo

   PK: id

   Atributos: email citext unique, rol_destino text check (administrador|docente|editor), codigo_id FK codigos nullable (obligatorio si editor), nie nullable, n_lista nullable, nombre text, invitado_por FK perfiles, created_at, usado_en timestamptz nullable

   Un alumno editor no se registra si su email no esta aqui.

5. miembro_codigo (si hace falta N:N docente-codigo o alumno-codigo extra; si no, editor_id en proyectos + invitacion basta)

   Justifica si la omites.

6. contenido_inicio (grupo C, UNA fila)

   PK: id smallint default 1 check (id=1)

   Atributos: bloques jsonb not null default '[]', updated_by FK perfiles, updated_at

   Forma de bloques[]: {id, plantilla: banner|texto-imagen-izq|texto-imagen-der|tres-columnas, orden int, textos object, color, imagen (path storage), animacion: ninguna|fade|slide-up|parallax-suave, capas[]}

   SELECT publico (anon). INSERT/UPDATE/DELETE solo administrador.

7. footer_cms (grupo C, UNA fila)

   PK id=1

   Atributos: slogan, telefono, whatsapp, instagram_url, facebook_url, tiktok_url, correo, direccion, copyright_anio, cta_label, cta_href, updated_by, updated_at

   Defaults de documentacion: correo direccion@inti.edu.sv, WhatsApp +503 7754 5899, IG instagram.com/inti.edu.sv, FB facebook.com/tecnicosinti, TT tiktok.com/@intitecnicos, direccion Col. Roma final Blvd Venezuela San Salvador. No uses 7441-1075 como default.

8. proyectos (grupo B)

   PK: id uuid

   Atributos: codigo_id FK codigos NOT NULL, editor_id FK perfiles NOT NULL, tipo text check (tecnico|academico), titulo text, cuerpo text, anio int, urls jsonb not null default '{}',

     ejemplo urls: {"github":"https://github.com/org/repo","drive":"https://drive.google.com/...","youtube":"https://youtube.com/...","otros":[]}

   deleted_at timestamptz nullable (soft delete)

   Sin columnas de foto de estudiante. Sin bytea de adjuntos.

9. (opcional v1) personal_fichas | omitir hasta que Instituto entregue bios (backlog 0-16). Si la incluyes, marca TODO.

STORAGE

- Bucket publico lectura `inicio` paths inicio/{uuid}. Escritura: rol administrador.

- Bucket `personal` no crear hasta 0-05=si.

TRIGGERS

- AFTER INSERT auth.users: crear perfiles. Si email en invitaciones y no usado: copiar rol_destino, marcar usado. Si email = intiwo11543@gmail.com Y no existe ningun administrador: rol administrador. Else: no crear editor; o crear sin rol y bloquear login de editor (elige uno y documenta). Nunca poner el password.

- Nadie se auto-asigna administrador despues del primero salvo un administrador existente (RLS UPDATE perfiles.rol).

RLS (obligatorio, por rol, NO por email)

- especialidades: SELECT all; WRITE admin

- perfiles: SELECT propio; SELECT all si admin; UPDATE propio (nombre, tema, nie si se permite); UPDATE rol solo admin; no borrar el ultimo administrador

- codigos: SELECT all (claves se ven en UI publica de proyectos) o SELECT autenticado | documenta. INSERT/UPDATE/DELETE: docente dueno o admin

- invitaciones: docente ve/inserta las de sus codigos; admin todas

- proyectos: SELECT where deleted_at is null para anon; UPDATE if editor_id = auth.uid(); DELETE if admin OR docente del codigo; INSERT if editor y su email ligado al codigo

- contenido_inicio / footer_cms: SELECT anon; WRITE admin

INDICES

- proyectos(codigo_id), proyectos(editor_id), invitaciones(email), unique perfiles(id)

- GIN en contenido_inicio.bloques opcional v1

SALIDA QUE DEBES ENTREGAR

1. erDiagram Mermaid con PK y FK nombradas

2. Tabla diccionario: entidad, atributo, tipo, nulo, default, FK, descripcion

3. SQL: tables, indexes, seeds especialidades, semilla-admin-sin-password.sql sin password (solo UPDATE perfiles SET rol donde email=...)

4. SQL: RLS policies completas

5. SQL: trigger handle_new_user

6. Lista de lo que NO modelaste (Oferta estatica, Historia estatica, NIE pendiente, fotos personal pendientes)

7. Como se relacionan los dos GitHub Pages con Auth redirect URLs

Si dudas, elige la opcion mas restrictiva y etiquetala DECISION.

```

---

## Hecho (no borrar)

### 2026-10-11 14:10 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Definicion UX/UI; carpetas S1/S2; borrar prototipos raiz; `.gitignore`

### 2026-10-11 14:27 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] CMS Inicio criticado; `Documentacion con informacion/LEEME.md`; PNG S2 vs PDF viejo

### 2026-10-11 14:33 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Gemini: SortableJS, AOS, `contenido_inicio`; RLS por rol no por email

### 2026-10-11 14:38 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Backlog partido en casillas atomicas (criterio por linea) para IAs

### 2026-10-11 15:05 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Cada casilla con **Fuente** (PNG, PDF+pagina, URL Site, RESOLUCIONES). Arquitectura hibrida nombrada. Prompt DER en Anexo. No se copiaron credenciales de F-OLD P1.

### 2026-10-11 15:20 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Cada casilla: Extraer de + Escribir en (ruta S1/S2). Mapa de destinos. Inicio no se escribe en S2; Proyectos no se escribe en S1.

### 2026-10-11 15:28 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Creados 64 archivos vacios con nombres descriptivos (sin index/style). Mapa de destinos y casillas Escribir en actualizados a esos nombres.


---

## Archivo (avances anteriores; no borrar)

### 2026-09-23 ~10:22|10:43 (UTC-6) | laptop Windows (MINEDUCYT)

- [x] Interfaz de Cursor en espanol

### 2026-09-27 ~23:20|23:29 (UTC-6) | laptop Windows (MINEDUCYT)

- [x] Repo GitHub vinculado; prueba `hola.py` (luego eliminada)

### 2026-09-28 a 2026-10-09 | laptop Windows (MINEDUCYT)

- [x] Hamburguesa, sin Visitante-cuenta, Lucide 2.5, Roboto Serif, paleta `.ase`, texto Site, PDF historia retenida, Adobe = referencia final

- [x] Incidente Copilot / `IAs/` documentado

