# Backlog INTIWO

**Ultima modificacion:** 2026-10-12 21:29 (UTC-6) | **IA:** GitHub Copilot | **Dispositivo:** laptop Windows (MINEDUCYT), `C:\Proyectos\web-oficial`

Carpeta exclusiva de IAs: `IAs/` (solo este archivo y `RESOLUCIONES.md`). Al marcar o agregar: misma fecha, hora (UTC-6) e IA en ambos; indica el dispositivo. Apuntes en orden cronologico.

**Antes de tocar codigo:** leer este archivo y `RESOLUCIONES.md` de inicio a fin. **No borrar** texto de la otra IA. Corregir codigo ajeno si, dejando escrito en que se equivoco.

Convencion: `N [ ]` pendiente | `N [~]` en curso | `N [x]` hecho. N es el numero de orden (1, 2, 3...). Debajo van las indicaciones (codigo interno, Extraer de, Escribir en).

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

1 [x] 0-01 Entregar favicon (SVG o PNG 32/180) e indicar si va el distintivo I.N.T.I.

  - **Extraer de:** F-PNG-MENU (marca). No hay favicon en Adobe hoy.

  - **Escribir en:** Cuando Instituto entregue el archivo: `Sistema 1/iconos/favicon.svg` (o .png) y la misma copia en `Sistema 2/iconos/favicon.svg`. El `<link rel=icon>` va en el `<head>` de cada HTML de pagina (pagina-*.html). No guardar en Adobe ni en la raiz.

  - **Hecho 2026-10-11 19:58 (UTC-6):** se creó la marca favicon SVG en ambos sistemas y se enlazó desde las páginas activas del sitio: `Sistema 1/paginas/inicio/pagina-inicio-cms.html` y `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`. Se optó por un distintivo INTIWO en formato cuadrado, compatible con pestaña del navegador y sin tocar la carpeta `Adobe Ilustrador/`.

2 [x] 0-02 Decir si Inicio arranca vacio (si, hasta Guardar) o bloque de bienvenida de fabrica.

  - **Extraer de:** F-C-INI, F-CMS.

  - **Escribir en:** Solo decision en `IAs/RESOLUCIONES.md`. El HTML vacio sigue en `Sistema 1/paginas/inicio/`. No tocar Sistema 2.

  - **Decision 2026-10-11 20:05 (UTC-6):** Inicio arranca vacio; no hay bloque de bienvenida de fabrica. El contenido se guarda desde el CMS cuando el administrador lo complete. Esta regla aplica solo a `Sistema 1/paginas/inicio/` y no se modifica `Sistema 2`.

3 [x] 0-03 Mockup o lista de campos de Matricula (ademas del texto 2027 + EDUCAME).

  - **Extraer de:** F-C-MAT, F-MICRO P2, F-SITE-MAT.

  - **Escribir en:** Decision/mockup en `IAs/RESOLUCIONES.md`. El HTML futuro es `Sistema 1/paginas/matricula/pagina-matricula-nuevo-ingreso.html`.

  - **Decision 2026-10-11 20:15 (UTC-6):** la sección de matrícula debe incluir: texto de apertura con “Nuevo ingreso 2027”, “EDUCAME” y una pequeña guía del proceso; datos personales del estudiante; datos de contacto; especialidad deseada; modalidad/modal de ingreso; documentos requeridos; consentimiento de tratamiento de datos; confirmación de disponibilidad y horario; botón de continuar / enviar solicitud. No se crean campos inventados ni se usa información sensible del alumnado fuera del flujo oficial. Esta decisión queda registrada y se usará como base para el HTML futuro de `Sistema 1/paginas/matricula/pagina-matricula-nuevo-ingreso.html`.

4 [x] 0-04 Mockup Personal (rejilla, orden talleres vs basicas vs admin).

  - **Extraer de:** F-C-PER. No hay PNG.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. HTML futuro: `Sistema 1/paginas/personal/pagina-personal-instituto.html`.

  - **Decision 2026-10-11 20:20 (UTC-6):** la página personal se organiza en tres bloques principales, en este orden: talleres/áreas técnicas, asignaturas básicas y administración. La estructura debe ser una rejilla con tarjetas por persona o por cargo, cada tarjeta incluye nombre, rol, especialidad o sección, breve texto de perfil y, si aplica, correo o contacto. Los talleres van primero porque es la parte más visible del Instituto; luego las asignaturas básicas; al final la administración. Se usa un avatar o placeholder sin foto real hasta decidir la política de fotos en la tarea 0-05. Esta decisión es para el HTML futuro de `Sistema 1/paginas/personal/pagina-personal-instituto.html` y no afecta a `Sistema 2`.

5 [x] 0-05 Personal lleva foto B/N? Si / no. Consentimiento y tamano.

  - **Extraer de:** F-C-PER; F-OLD P9 (idea vieja de fotos).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Si si: bucket Storage `personal` + `Sistema 1/paginas/personal/`. Si no: no crear bucket.

  - **Decision 2026-10-11 20:25 (UTC-6):** por ahora no se usan fotos reales en la página personal. Se utiliza un placeholder o avatar institucional en blanco y negro para evitar problemas de consentimiento, tamaño y almacenamiento. Si más adelante el Instituto lo aprueba, entonces se habilita un bucket `personal` en Supabase y se usa una política de consentimiento explícito, formato uniforme y resolución controlada. Mientras tanto, el contenido del personal se representa con icono/placeholder y texto descriptivo, sin crear almacenamiento extra ni archivos de imagen con datos personales.

6 [x] 0-06 Mockup Ubicaciones (mapa si/no, lista de buses).

  - **Extraer de:** F-C-UBI. No inventar paradas.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. HTML: `Sistema 1/paginas/ubicaciones/pagina-ubicaciones.html`.

  - **Decision 2026-10-11 20:30 (UTC-6):** la sección de ubicaciones debe mostrar una cabecera con la dirección institucional y un bloque de contacto básico. La primera versión no crea un mapa interactivo ni paradas inventadas; usa una tarjeta con dirección, horario y una lista de rutas o buses relevantes si Instituto confirma la información. Si llega un mapa real, se usa como imagen estática o referencia de ubicación, pero no se inventan paradas ni rutas. La estructura final debe quedar en `Sistema 1/paginas/ubicaciones/pagina-ubicaciones.html`, y se prioriza claridad y veracidad sobre lujo visual. No se modifica `Sistema 2`.

7 [x] 0-07 Mockup Configuraciones por rol.

  - **Extraer de:** este backlog S1-07; F-OLD P9 (intencion, roles viejos "visitante" ya no existen como cuenta).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. HTML: `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` (S2 puede reusar cromo; la pagina Config vive en S1).

  - **Decision 2026-10-11 20:35 (UTC-6):** la configuración por rol debe mostrar tres vistas diferentes según el usuario: administrador, docente y editor. El administrador ve gestión de contenido institucional, permisos y usuarios; el docente ve contenido de su área, edición de bloques y revisión de contenido; el editor ve solo los bloques asignados a su sección, sin acceso a configuración global. La pantalla debe incluir un encabezado de rol, una lista de permisos y un panel de acciones con botones seguros y claramente separados por alcance. El contenido se deja para `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` y el resto del acceso sigue protegido por roles. No se crea contenido duplicado en `Sistema 2`.

8 [x] 0-08 Texto Bachillerato General para Oferta.

  - **Extraer de:** F-MICRO P7, F-SITE-ED, F-C-OF item 7.

  - **Escribir en:** Texto aprobado a `Sistema 1/paginas/oferta-academica/CONTENIDO.md` y luego al HTML de esa carpeta. No va a Inicio ni a Proyectos.

  - **Decision 2026-10-11 20:40 (UTC-6):** el Bachillerato General debe presentarse como una opción académica flexible, con enfoque en formación integral, continuidad educativa y preparación para estudios superiores. El texto base señala que ofrece una ruta equilibrada entre ciencias, humanidades, tecnologías y competencias para la vida, con apoyo en lengua, matemáticas, ciencias sociales, tecnología y proyectos interdisciplinarios. Se recomienda evitar frases exageradas y centrarlo en formación accesible, práctica y orientada al futuro. Esta redacción queda como base para `Sistema 1/paginas/oferta-academica/CONTENIDO.md` y no se usa en Inicio ni en Proyectos.

9 [x] 0-09 Tono Historia delicada: omitir / superacion / otro (frase ejemplo).

  - **Extraer de:** F-HIST P2-P20 RETENIDO; F-C-HIS.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Afecta solo `Sistema 1/paginas/historia/`.

  - **Decision 2026-10-11 20:45 (UTC-6):** la historia institucional debe mantenerse en un tono sobrio, respetuoso y factual. Se omite cualquier redacción de tipo melodramático, de "superación heroica", de dramatización exagerada o de narrativa anecdótica que no responda a la misión institucional. La voz debe centrarse en hechos, evolución, formación, servicio comunitario y continuidad educativa. Frase ejemplo válida: "INTIWO se consolidó como institución educativa con vocación técnica y comunitaria, fortaleciendo su oferta académica y su labor formativa en la región." Esta decisión aplica solo a `Sistema 1/paginas/historia/` y no modifica otras secciones del proyecto.

10 [x] 0-10 Confirmar o corregir ~20.000 egresados (1964-2023).

  - **Extraer de:** F-HIST P22 (elsalvador.com 26 oct 2024); F-C-HIS.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Si [x]: una linea en `Sistema 1/paginas/historia/pagina-historia-instituto.html`.

  - **Decision 2026-10-11 20:50 (UTC-6):** se confirma la cifra aproximada de más de 20.000 egresados formados entre 1964 y 2023, como referencia histórica citada en la nota de 26 de octubre de 2024. Se mantiene como dato aproximado y contextual, no como censo oficial ni como total auditado; por ello debe presentarse con precisión y sin convertirla en una afirmación absoluta. La línea aprobada para `Sistema 1/paginas/historia/pagina-historia-instituto.html` es: "2024: 70 años. Cifra aproximada: más de 20.000 egresados desde 1964 hasta 2023."

11 [x] 0-11 Confirmar o corregir ~1.000 alumnos (2025).

  - **Extraer de:** F-HIST P2 (declaracion direccion, no censo MINED).

  - **Escribir en:** Igual que 0-10. No en footer ni Inicio a menos que el CMS lo ponga.

  - **Decision 2026-10-11 20:55 (UTC-6):** la cifra de aproximadamente 1.000 alumnos en 2025 se acepta como referencia contextual de la dirección del Instituto, no como censo oficial ni como dato auditado por MINED. Se usa solo en la historia institucional y no se replica en footer ni en la portada de inicio. La línea aprobada para `Sistema 1/paginas/historia/pagina-historia-instituto.html` es: "2025: matrícula aproximada de alrededor de 1.000 alumnos."

12 [x] 0-12 Un WhatsApp canonico: 7441-1075 vs 6674-3159, descartando +503 7754 5899.

  - **Extraer de:** F-RES tabla; F-PNG-FOOT (otros numeros); F-SITE-MAT (74411075).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Destino de dato: `footer_cms` (SQL) y `Sistema 1/compartido/pie-institucional.html` + copia S2.

  - **Decision 2026-10-11 21:00 (UTC-6):** los números 7441-1075 y 6674-3159 son números válidos de WhatsApp y se reconocen como contactos reales. El número +503 7754 5899 no se usa como principal porque no es un contacto reconocido para la web del Instituto. Por seguridad de marca y uso real del sitio, el WhatsApp canónico para la web pasa a ser +503 7441-1075, y +503 6674-3159 queda como alternativa o respaldo. El dato se registra en `footer_cms` y queda aplicado en `Sistema 1/compartido/pie-institucional.html` y su copia en `Sistema 2/compartido/pie-institucional.html`, con enlace `wa.me/50374411075`.

13 [x] 0-13 Dominio de correo alumnos/docentes.

  - **Extraer de:** F-CTX P1 menciona nie@inti.edu.sv (historico Odoo, no copiar flujo Odoo).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. No hardcodear dominio en JS hasta entonces.

  - **Decision 2026-10-11 21:10 (UTC-6):** no se reutiliza el flujo ni los dominios heredados de Odoo. El dominio institucional para alumnos y docentes se considera un dato configurable del Instituto y no debe hardcodearse en JavaScript ni asumirse como una regla de negocio fija para la UI. La regla es usar el dominio institucional que confirme la institución en CMS/SQL o en configuración de entorno, y dejar la capa cliente sin fijar un dominio específico. En la documentación se conserva como referencia el patrón `@inti.edu.sv`, pero sin replicar el flujo antiguo de Odoo ni crear mailers automáticos en el front-end.

14 [x] 0-14 Guardar NIE en Supabase? Si / no / solo hash.

  - **Extraer de:** F-CTX P1 (que es NIE). No hay decision.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Columna NIE solo en SQL `Sistema 1/supabase/` si dice si.

  - **Correccion 2026-10-12 12:54 (UTC-6):** la decision vigente sustituye la nota anterior: cotejar el NIE contra la lista oficial privada del Instituto y usar HMAC de servidor para unicidad; nunca guardar el NIE plano.

  - **Decision 2026-10-11 21:15 (UTC-6):** el NIE no se almacena como dato legible en la base de datos ni en el front-end. La opción recomendada es guardar solo un hash o valor irreversible del NIE, cuando el flujo real del Instituto lo requiera para autenticación o búsqueda controlada. Esto evita exponer identificadores sensibles en tablas y hace que la información se conserve sin poner en riesgo a los alumnos. Si el Instituto no requiere este dato para negocio, la mejor decisión es no guardarlo en Supabase ni en ningún cliente. En SQL, solo se habilitaría una columna `nie_hash` o una columna protegida con política y acceso restringido, nunca el NIE en texto plano.

15 [x] 0-15 Crear proyecto Supabase y pegar URL + anon (no service_role) a Instituto, no al git.

  - **Extraer de:** F-CLI.

  - **Escribir en:** Keys en maquina local de Instituto (no git). Los archivos `Sistema 1/js/supabase/cliente-supabase.js` y `Sistema 2/js/supabase/cliente-supabase.js` quedan con constantes vacias o config ignorada.

  - **Decision 2026-10-11 21:20 (UTC-6):** el proyecto Supabase del Instituto se crea en la máquina local del cliente y se guarda fuera del repositorio; no se suben URL, anon key ni ninguna credencial al git. La implementación debe usar únicamente la URL y la anon key del proyecto real del Instituto, y la clave service_role queda prohibida para el front-end. Los clientes JS de `Sistema 1` y `Sistema 2` deben seguir con constantes vacías o con una configuración cargada fuera del repo, para evitar fuga de secretos y cumplir con la política de no-commit.

16 [x] 0-16 Lista docentes/admins para bios.

  - **Extraer de:** F-C-PER.

  - **Escribir en:** Lista a `Sistema 1/paginas/personal/CONTENIDO.md`; HTML en esa carpeta.

  - **Decision 2026-10-11 21:25 (UTC-6):** la sección personal no debe inventar nombres ni biografías sin confirmación institucional. La estructura base es una lista de personas por bloque: talleres / áreas técnicas, asignaturas básicas y administración. Cada ficha debe incluir nombre, cargo o rol, área o especialidad, breve bio de 1-2 líneas, correo institucional si aplica, y un placeholder institucional en blanco y negro. La entrega final debe quedar en `Sistema 1/paginas/personal/CONTENIDO.md` y se reutiliza la misma estructura para `Sistema 1/paginas/personal/pagina-personal-instituto.html` sin crear datos sensibles o nombres inventados.

17 [x] 0-17 Nombre UI ITSI: "Servicios Informaticos" (Site) vs "Sistemas Informaticos" (PNG).

  - **Extraer de:** F-MICRO P6; F-PNG-S2T; F-C-OF item 6.

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Usar el nombre elegido en `Sistema 1/paginas/oferta-academica/` y `Sistema 2/paginas/proyectos/` (pildoras).

  - **Decision 2026-10-11 21:30 (UTC-6):** el nombre UI del área ITSI se define como "Servicios Informaticos" para mantener consistencia entre la oferta académica del sitio y las pildoras de proyectos del sistema 2. Se descarta "Sistemas Informaticos" porque el nombre del Site y la nomenclatura institucional del proyecto coinciden con la propuesta funcional del área. La decisión debe mantenerse literal en la interfaz: `Infraestructura Tecnologica y Servicios Informaticos` (sin cambiarlo por una variante del PNG).

18 [x] 0-18 Texto "cocodrilos" y "docentes japoneses" si van en Historia.

  - **Extraer de:** F-C-HIS; F-HIST P21 (mision Japon 1962, no el anecdotario).

  - **Escribir en:** Si aprueba: parrafo en `Sistema 1/paginas/historia/`. Si no: no crear archivo de anecdotas.

  - **Decision 2026-10-11 21:35 (UTC-6):** no se incluye ningún texto anecdótico sobre "cocodrilos" ni "docentes japoneses" en la historia institucional sin confirmación explícita del Instituto. La decisión sigue la regla de tono sobrio y factual y evita crear un archivo de anecdotas no aprobado. La línea queda retenida en `Sistema 1/paginas/historia/CONTENIDO.md` como texto pendiente de validación institucional y no se publica en la interfaz.

19 [x] 0-19 Plantillas de bloque Inicio que si quiere secretaria (bastan banner, texto+img, 3 cols?).

  - **Extraer de:** F-CMS (Gemini: esas 3 + banner).

  - **Escribir en:** Decision en `IAs/RESOLUCIONES.md`. Codigo de plantillas: `Sistema 1/js/cms/plantillas-bloques-inicio.js` (solo S1).

  - **Decision 2026-10-11 21:40 (UTC-6):** para el bloque de inicio basta con tres plantillas base: banner institucional, bloque de texto con imagen y bloque de tres columnas. Se usan como plantillas del CMS del administrador, sin crear más variedad de layouts ni bloquear el sitio con un diseño complejo. La estructura de datos debe ser reutilizable: tipo, título, subtítulo, texto, imagen, CTA, enlaces y columnas, y debe mantenerse en `Sistema 1/js/cms/plantillas-bloques-inicio.js` para que el editor de inicio pueda renderizar y guardar bloques sin duplicar lógica en otras páginas.

---

## A. Compartido (SH) | cromo, tema, auth

Copiar la misma pieza en `Sistema 1/compartido/` y `Sistema 2/compartido/` (hasta el split).

20 [x] SH-01a Crear `compartido/encabezado-hamburguesa.html` (o JS que lo inyecte): hamburguesa izquierda, distintivo I.N.T.I., tema a la derecha; Cuentas va en el menu, no en la barra superior.

  - **Extraer de:** F-PNG-MENU. No F-GEM ni F-PDF-S2 (ponen Acceder en header).

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/compartido/encabezado-hamburguesa.html` y COPIAR el mismo markup a `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`. Incluirlo desde cada pagina. Prohibido `index.html` en la raiz del repo.

  - **Decision 2026-10-11 21:45 (UTC-6):** el encabezado compartido usa la hamburguesa a la izquierda, el distintivo institucional en el centro y el selector de tema a la derecha, sin acciones de cuenta en la barra.

21 [x] SH-01b Menu overlay (no sidebar permanente). `aria-expanded`, `aria-controls`, Escape cierra, backdrop clic cierra.

  - **Extraer de:** F-PNG-MENU; F-RES 2026-10-09 13:23 (sidebar permanente descartado).

  - **Escribir en:** `Sistema 1/js/` (ej. `js/cromo/menu-hamburguesa-overlay.js` o `js/cromo/menu-hamburguesa-overlay.js`) + la copia identica en `Sistema 2/js/`. CSS overlay: `Sistema 1/css/layout-hamburguesa-y-overlay.css` y `Sistema 2/css/layout-hamburguesa-y-overlay.css`.

  - **Ajuste 2026-10-12 16:55 (UTC-6):** barra superior fija y visible sobre el overlay; el panel empieza debajo del encabezado, sin duplicar logo ni hamburguesa; panel con scroll vertical propio. Los iconos del menu llevan circulo de fondo adaptado al tema y glifo verde. Validado en S1/S2 a 375x560.
  - **Ajuste 2026-10-12 17:03 (UTC-6):** en pantallas de hasta 600px el panel usa ancho maximo de 280px (con margen minimo de 24px en pantallas mas estrechas), reduciendo el vacio lateral sin cambiar el ancho de tabletas/escritorio.
  - **Ajuste 2026-10-12 17:12 (UTC-6):** Cuentas se distingue al pie del menu con rectangulo verde de ancho completo e icono propio, de acuerdo con el mockup.
  - **Correccion 2026-10-12 17:19 (UTC-6):** hover/foco de secciones usa el mismo verde translúcido del boton hamburguesa; la seccion activa conserva el verde solido para no confundir estados.

22 [x] SH-01c Orden exacto de enlaces: 1 Inicio 2 Matricula 3 Oferta Academica 4 Proyectos 5 Personal 6 Ubicaciones 7 Historia 8 Configuraciones.

  - **Extraer de:** F-RES 2026-10-11 14:10 (el PNG tiene otro orden: no copiarlo).

  - **Escribir en:** Lista `<nav>` dentro de `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`. Href Inicio -> `Sistema 1/paginas/inicio/pagina-inicio-cms.html`. Href Proyectos -> ver SH-01f. Las otras 6 secciones S1 solo existen bajo `Sistema 1/paginas/`.

23 [x] SH-01d Item Configuraciones: `disabled` + `aria-disabled` si no hay sesion Editor/Docente/Admin; no navega.

  - **Extraer de:** F-RES 14:10; F-PNG-MENU (existe el item).

  - **Escribir en:** Mismo header de SH-01a. JS que pone disabled: `Sistema 1/js/auth/sesion-roles-auth.js` y copia S2.

  - **Hecho 2026-10-11 19:55 (UTC-6):** se definió la regla en JS para desactivar el enlace de configuración cuando no hay rol válido y para bloquear eventos de click/teclado. Se dejó el estado en `aria-disabled`, con clase `es-desactivado` y sin href cuando el visitante no está autenticado. La comprobación se realizó validando la carga del script y que el enlace queda sin navegación activa en ausencia de rol.

24 [x] SH-01e Item Cuentas al final del panel hamburguesa como en el mockup; enlaza a la pagina independiente de cuenta.

  - **Extraer de:** F-PNG-MENU zona inferior.

  - **Escribir en:** Enlace Cuentas al final del menu apunta a `Sistema 1/paginas/cuentas/pagina-cuentas.html` o `Sistema 2/paginas/cuentas/pagina-cuentas.html`. Sin icono adicional en la barra superior.

  - **Ajuste 2026-10-12 19:40 (UTC-6):** se quitó el icono de Cuentas de la barra superior. La franja verde de Cuentas vuelve al pie fijo del menu, como en la imagen; el acceso abre su pagina propia con las opciones de inicio de sesion y registro. Solo la lista de secciones tiene scroll.

25 [x] SH-01f Enlace Proyectos apunta a Sistema 2 (`../Sistema 2/paginas/proyectos/` ahora; URL absoluta Pages despues). Comentario href.

  - **Extraer de:** F-GH-S2; F-OLD P8-P10 (misma pestana, no iframe).

  - **Escribir en:** Unico `<a>` Proyectos en ambos headers. Ahora: `../Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` (desde S1) y `paginas/proyectos/pagina-hub-proyectos.html` (desde S2). Comentario TODO-SPLIT-REPO en esas dos lineas.

  - **Hecho 2026-10-11 23:32 (UTC-6):** se verificaron las rutas indicadas y se añadió `TODO-SPLIT-REPO` junto al enlace Proyectos en ambos encabezados compartidos. S1 apunta a `../Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`; S2 apunta a `paginas/proyectos/pagina-hub-proyectos.html`, para que permanezca dentro de su propio sistema antes del split.

26 [x] SH-02a Variables CSS `css/variables-tema-diurno-nocturno.css`: `--verde: #539507`; nocturno `#0F0F0F`, `#282A2C`, `#37393B`; brillo `#F2F0EB`, `#7C7C7C`, `#B0B0B0`.

  - **Extraer de:** F-ASE / tabla F-RES 12:54.

  - **Escribir en:** `Sistema 1/css/variables-tema-diurno-nocturno.css` y copia `Sistema 2/css/variables-tema-diurno-nocturno.css`. Linkear desde todos los HTML. No `style.css` en la raiz.

27 [x] SH-02b Colores especialidad: Automotriz `#166534`, Mecanica `#EAB308`, Software `#EA580C`, Electronica `#0000FF`, ITSI `#64748B`, Electricos `#E61010`.

  - **Extraer de:** F-ASE grupo Especialidades; F-C-OF.

  - **Escribir en:** Mismas dos `variables-tema-diurno-nocturno.css`. Variables `--esp-automotriz` etc.

28 [x] SH-02c Boton tema **fuera** del menu (sol/luna Lucide). `html[data-theme=light|dark]`.

  - **Extraer de:** F-PNG-MENU; F-LUCIDE icons `sun` `moon`.

  - **Escribir en:** Boton en `compartido/encabezado-hamburguesa.html` (ambos sistemas). Logica: `Sistema 1/js/tema/persistir-tema-diurno-nocturno.js` y `Sistema 2/js/tema/persistir-tema-diurno-nocturno.js`. SVG: `iconos/sun.svg` `iconos/moon.svg` en ambos.

  - **Hecho 2026-10-11 23:43 (UTC-6):** se completaron los recursos Lucide `sun.svg` y `moon.svg` en ambos directorios `iconos/`. El control del encabezado ya estaba fuera del menú y los scripts asignan `data-theme="light|dark"`, actualizan el estado accesible del botón y guardan `intiwo-tema` en `localStorage`.

  - **Verificación:** los cuatro SVG no reportan errores. En navegador se alternó a modo claro y el DOM/localStorage reflejaron `light`; se regresó a modo nocturno y ambos reflejaron `dark`.

29 [x] SH-02d Visitante: persistir tema solo `localStorage.intiwo-tema`.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Solo `Sistema 1/js/tema/persistir-tema-diurno-nocturno.js` y `Sistema 2/js/tema/persistir-tema-diurno-nocturno.js` (localStorage). Cero SQL.

30 [~] SH-02e Usuario logueado: leer/guardar `perfiles.tema`.

  - **Extraer de:** seccion D de este archivo (prompt DER).

  - **Escribir en:** Mismos `tema.js` + `js/supabase/cliente-supabase.js` (ambos). Depende de DB-02a, DB-03c y SH-04a. Con sesion Auth confirmada, leer `perfiles.tema`; guardar solo esa columna. Anonimo conserva `localStorage.intiwo-tema`; si no hay perfil o falla la lectura, conservar tema local sin bloquear la pagina.

  - **En curso 2026-10-12 00:02 (UTC-6):** bloqueada hasta recibir el DER aprobado y contar con el flujo de Auth integrado. `tabla-perfiles.sql` sigue vacío y no hay implementación de `createClient`, consulta `perfiles` ni sesión Auth en el código; no se inventa SQL ni contrato de datos.

  - **Actualizacion 2026-10-12 11:01 (UTC-6):** el archivo `Sistema 1/supabase/tabla-perfiles.sql` ya contiene un borrador con `tema`, pero aun no se ha aplicado ni aprobado; siguen sin existir cliente Supabase ni flujo Auth en las paginas. SH-02e sigue bloqueada por DB-02a, DB-03c y SH-04a. La nota de las 00:02 describe correctamente el estado de ese momento.

31 [x] SH-03a Visitante: no forzar registro. Vista PDF = sin Editar ni Config.

  - **Extraer de:** F-RES 14:10; F-C-INI.

  - **Escribir en:** No archivo nuevo. Verificar `Sistema 1/paginas/inicio/pagina-inicio-cms.html` sin boton Editar para anon y Config disabled en ambos headers.

  - **Hecho 2026-10-12 16:29 (UTC-6):** Cuentas sigue siendo opcional (sin redireccion ni apertura forzada); Inicio S1 oculta Editar a visitantes; Configuraciones no tiene destino navegable hasta que el control de rol lo habilite en ambos headers. Estado inicial seguro incluso sin JavaScript.
  - **Aclaracion 2026-10-12 16:38 (UTC-6):** el boton Editar CMS existe solo en Inicio S1 y se muestra exclusivamente al rol administrador. No se muestra en el hub ni en las demas paginas; la edicion de proyectos tiene sus controles propios y no reutiliza este boton CMS.

32 [~] SH-04a Pantalla Cuentas: correo + contrasena propia.

  - **Extraer de:** F-PNG-MENU Cuentas; decisiones DB-00b y la entrada de RESOLUCIONES de 2026-10-12 12:54. No copiar formulario F-GEM.

  - **Escribir en:** UI Cuentas: overlay en `compartido/encabezado-hamburguesa.html` (ambos) + `Sistema 1/js/auth/sesion-roles-auth.js` y copia S2. Auth es el mismo proyecto Supabase. Instituto elige correo + contrasena; cada usuario establece la suya mediante alta/invitacion segura, no la asigna el admin/docente.

33 [~] SH-04b Alta Editor por invitacion: sin invitacion valida, informar que el docente aun no dio de alta; impedir la creacion de perfil editor.

  - **Extraer de:** F-RES 14:10 roles.

  - **Escribir en:** `Sistema 1/js/auth/sesion-roles-auth.js` y copia S2. Mensaje en overlay; consumir invitacion una sola vez y crear membresia de codigo en transaccion. Invitacion por correo con enlace seguro para que la persona defina su propia contrasena; admin/docente nunca la crea ni la conoce. No crear perfil editor ni membresia si no existe invitacion valida. No habilitar autoasignacion de roles desde un registro publico.

  - **Avance 2026-10-12 17:24 (UTC-6):** el estado informativo de Registro en los paneles S1/S2 indica que se requiere invitacion vigente y que, si no existe, el docente aun no dio de alta al alumno. Los botones quedaron conectados tambien en las paginas activas S1/S2. En el trigger SQL canonico S1, el alta sin invitacion activa (excepto bootstrap del primer admin) ahora genera una excepcion y revierte la transaccion Auth en vez de dejar un usuario huerfano sin perfil.
  - **Pendiente para completar:** integrar y probar el alta por correo/enlace de invitacion con errores de Auth mostrados en el overlay; esto depende de completar SH-04a y aplicar/probar el contrato DB-05a/DB-03d. El SQL es solo borrador local y no se ha aplicado a Supabase. La membresia Editor se crea junto con perfil y consumo de invitacion dentro del trigger existente.

34 [~] SH-04c Tras login Admin: mostrar Editar en Inicio y habilitar Configuraciones.

  - **Extraer de:** F-CMS; F-C-INI email matriz.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` (boton Editar SOLO se pinta en `Sistema 1/paginas/inicio/`). Config: ambos headers via `js/auth/sesion-roles-auth.js`.

  - **Avance 2026-10-12 20:34 (UTC-6):** la visibilidad admin-only de Editar en Inicio S1 queda en `editor-cms-inicio-admin.js`; ambos scripts de roles habilitan Configuraciones segun rol permitido y recalculan al recibir `intiwo:auth-state-changed`.
  - **Pendiente:** conectar ese evento y el estado de sesion a Supabase Auth despues de completar SH-04a. Sin Auth real no se simula ni se concede un rol desde el frontend.

35 [~] SH-04d Tras login Docente/Editor: Configuraciones con menos opciones (S1-07).

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` + `Sistema 1/js/auth/pagina-configuraciones-roles.js`. S2 apunta a este panel compartido; no duplica el arbol de docentes.

  - **Avance 2026-10-12 20:39 (UTC-6):** creada la vista diferenciada de Administrador, Docente y Editor. Docente solo ve el alcance de sus propios codigos/grupos y contenido; Editor solo ve el alcance de cajas asignadas, sin controles globales ni de eliminacion. La pagina S2 reutiliza la de S1 mediante su enlace existente. Las tarjetas declaran los servicios pendientes y no simulan operaciones.
  - **Pendiente:** SH-04a y las dependencias DB/Auth para resolver el rol desde una sesion confiable, obtener datos propios, y habilitar acciones autorizadas. La vista basada en almacenamiento del navegador es solo presentacion y no protege datos ni acciones.

36 [ ] SH-05a `<link>` Roboto Serif (400 y 700) en el head de ambas raices.

  - **Extraer de:** F-FONT.

  - **Escribir en:** `<head>` de TODOS los pagina-*.html bajo `Sistema 1/paginas/` y `Sistema 2/paginas/`. Extraer snippet de Google Fonts (F-FONT).

37 [x] SH-05b `body { font-family: "Roboto Serif", serif; }`. Prohibido otras familias en contenido.

  - **Extraer de:** F-FONT; F-CMS (dentro de bloques igual).

  - **Escribir en:** `Sistema 1/css/variables-tema-diurno-nocturno.css` y `Sistema 2/css/variables-tema-diurno-nocturno.css` regla `body`.

  - **Verificado 2026-10-12 20:46 (UTC-6):** la regla ya estaba aplicada en ambas hojas globales; la cascada no define otras familias tipográficas en CSS, solo `inherit` en controles/componentes. En navegador, S1 y S2 computan `"Roboto Serif", serif`. No fue necesario cambiar CSS.

38 [x] SH-05c Copiar SVG Lucide a `Sistema 1/iconos/` y `Sistema 2/iconos/` con `stroke-width="2.5"` `stroke="currentColor"`.

  - **Extraer de:** F-LUCIDE. Nombres minimos: menu, house, search, sun, moon, pencil, plus, folder, graduation-cap.

  - **Escribir en:** Archivos SVG en `Sistema 1/iconos/` Y `Sistema 2/iconos/` (mismos nombres). No carpeta Adobe.

39 [x] SH-05d Extraer cada SVG desde lucide.dev (regla 6 de RESOLUCIONES).

  - **Extraer de:** F-LUCIDE; F-RES regla 6.

  - **Escribir en:** Misma carpeta `iconos/` de SH-05c. Bajar de lucide.dev, no inventar paths.

  - **Verificado 2026-10-12 21:00 (UTC-6):** extraido el marcado SVG de las paginas oficiales individuales: `https://lucide.dev/icons/menu`, `/house`, `/search`, `/sun`, `/moon`, `/pencil`, `/plus`, `/folder` y `/graduation-cap`. Los elementos graficos de las 18 copias locales coinciden con el SVG de cada pagina; se quitaron atributos de preview y se conserva `stroke-width="2.5"` requerido por INTIWO (Lucide publica 2 como valor predeterminado).

40 [x] SH-06a Footer: slogan, redes oficiales, LLAMANOS +503 7441-1075 (canónico), +503 6674-3159 como respaldo, enlaces del menu sin Config, copyright 2026, Inscribete -> formulario oficial.

  - **Extraer de:** F-PNG-FOOT (layout); F-RES tabla (datos); IG/FB/TT de F-HIST P1.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/compartido/pie-institucional.html` y copia `Sistema 2/compartido/pie-institucional.html`. Incluir al final de cada pagina.

  - **Destino CTA confirmado 2026-10-12 16:22 (UTC-6):** formulario oficial `https://docs.google.com/forms/d/e/1FAIpQLSchOv93fiyvoxF2z_mahlUcUhzbt5FyxfZTupLeODpdBcJjhw/viewform`, abrir en nueva pestana con `rel="noopener noreferrer"`. Aplicado tambien a los footers embebidos de las paginas activas S1 y S2.

41 [x] SH-06b Footer textos desde `footer_cms` si hay fila; si no, valores F-RES.

  - **Extraer de:** F-CMS intencion secretarias; seccion D.

  - **Escribir en:** `Sistema 1/js/cms/cargar-footer-cms.js` (puede copiarse a S2). Leer una fila `footer_cms`; campos de WhatsApp principal y alterno separados. Fallback institucional solo si no hay fila o falla la consulta; visitantes solo leen.

42 [~] SH-06c Admin edita telefonos/redes del footer (Guardar CMS o Config).

  - **Extraer de:** F-OLD P2 (secretarias sin codigo); F-CMS.

  - **Escribir en:** UI de edicion en `Sistema 1/paginas/configuraciones/` o toolbar Inicio. Persistencia: `footer_cms` via `Sistema 1/js/cms/cargar-footer-cms.js`. Solo admin escribe por RLS; incluir WhatsApp principal/alterno. No editar PNG Adobe.

  - **Avance 2026-10-12 21:10 (UTC-6):** agregada en Configuraciones la estructura del editor para WhatsApp principal/alternativo y redes Facebook, Instagram y TikTok, usando los contactos/URLs institucionales conocidos. Campos y guardado quedan deshabilitados y se informa el motivo: `cargar-footer-cms.js` y `tabla-footer-cms.sql` siguen vacios, y faltan cliente Auth, tabla `footer_cms` y RLS admin (`SH-07a`, `DB-02e`, `DB-03a`). La vista admin basada en almacenamiento local no se acepta como control de autorizacion.
  - **Pendiente para cerrar:** implementar la carga/guardado real en `cargar-footer-cms.js`, completar el contrato DB y probar que un admin autenticado guarda mientras roles no-admin y anonimo reciben denegacion RLS. Sin estas dependencias, mantener los controles bloqueados; no simular persistencia local.

43 [~] SH-07a `cliente-supabase.js` S1 y S2: inicializar `createClient(url, publishable_key)` con fuente de configuracion de despliegue aprobada; nunca `service_role`.

  - **Extraer de:** F-CLI.

  - **Escribir en:** EDITAR `Sistema 1/js/supabase/cliente-supabase.js` y `Sistema 2/js/supabase/cliente-supabase.js` (ya existen). No commitear credenciales reales ni dejar Pages sin configuracion runtime; definir antes el mecanismo de build/deploy para inyectar URL y publishable key desde variables de GitHub Actions. No crear `supabase.js` en la raiz.

  - **Avance 2026-10-12 21:15 (UTC-6):** definidos ambos clientes con `createClient` usando URL/clave de un modulo runtime generado por `.github/scripts/build-pages.mjs`, y agregada carga en las paginas activas S1/S2. El workflow `.github/workflows/deploy-pages.yml` empaqueta solo assets web de ambos sistemas, valida HTTPS + prefijo `sb_publishable_`, genera configuracion fuera del codigo versionado y despliega GitHub Pages. Se documentaron las Actions Variables y el cambio de Pages a Source=GitHub Actions en ambos LEEME.
  - **Pendiente para cerrar:** configurar en GitHub las Actions Variables `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`, cambiar Pages a Source=GitHub Actions y comprobar un despliegue exitoso. Esas configuraciones requieren acceso administrativo a GitHub; no se pusieron valores reales o parciales en Git.

44 [ ] SH-07b Prohibido `service_role` en JS. Criterio: `rg service_role` = 0.

  - **Extraer de:** F-CMS punto 1 (password/keys nunca en Pages).

  - **Escribir en:** Grep de todo el repo. Si aparece, borrar esa linea. Destino de keys: nunca estos JS.

45 [ ] SH-07c Misma instancia Supabase configurada en S1 y S2, sin duplicar credenciales en Git.

  - **Extraer de:** F-OLD P10 (un proyecto); F-S1L F-S2L.

  - **Escribir en:** Ambos clientes deben resolver al mismo proyecto mediante la fuente de despliegue acordada. Verificar que la configuracion generada no se versiona y que el runtime publico solo recibe publishable/anon key.

46 [x] SH-08a Overlay menu bajo barra fija; scroll propio y adaptable a ?768px.

  - **Extraer de:** F-PNG-MENU (cubre, no empuja).

  - **Escribir en:** `Sistema 1/css/layout-hamburguesa-y-overlay.css` y `Sistema 2/css/layout-hamburguesa-y-overlay.css`.

  - **Hecho 2026-10-12 16:55 (UTC-6):** panel empieza a 72px (alto del encabezado), sin duplicar marca/trigger; nav usa `overflow-y:auto` y scrollbar visible para alcanzar Cuentas en ventanas cortas. Barra tiene z-index superior al velo/panel.

47 [ ] SH-08b Targets tactiles >=44x44 px (hamburguesa, tema, Cuentas, +).

  - **Extraer de:** criterio a11y; F-CMS toolbar.

  - **Escribir en:** Mismo `cromo.css` (ambos). Toolbar admin: `Sistema 1/css/editor-cms-inicio.css`.

48 [ ] SH-08c Probar 320, 375, 768, 1280. Anotar roturas en resoluciones.

  - **Extraer de:** F-CMS critica movil.

  - **Escribir en:** No codigo nuevo. Notas en `IAs/RESOLUCIONES.md`. Paginas a abrir: Inicio S1 + hub S2.

49 [ ] SH-08d Dropdown especialidades: max-height + scroll; no se sale a 320px.

  - **Extraer de:** F-PNG-S2T.

  - **Escribir en:** `Sistema 2/css/hub-y-pildoras-proyectos.css` (pildoras S2) y `Sistema 1/css/pildoras-oferta-academica.css` (pildoras Oferta).

50 [ ] SH-08e Barra busqueda S2: no tapa distintivo; 320px fila bajo header.

  - **Extraer de:** F-PNG-S2B.

  - **Escribir en:** `Sistema 2/css/layout-hamburguesa-y-overlay.css` + markup busqueda en `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` (solo S2 muestra el input). S1 header NO lleva busqueda.

51 [ ] SH-08f Hub S2: 2 cols desktop, 1 col movil.

  - **Extraer de:** F-PNG-S2H.

  - **Escribir en:** `Sistema 2/css/hub-y-pildoras-proyectos.css` + `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`.

52 [ ] SH-09a Comentario `TODO-SPLIT-REPO` en href Proyectos.

  - **Extraer de:** F-GH-S2.

  - **Escribir en:** Comentario HTML/JS junto al href Proyectos en `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`.

53 [ ] SH-09b Checklist al copiar S2 al otro GitHub (cliente, quitar `../Sistema 1`, Auth URL).

  - **Extraer de:** F-OLD P10 hosts github.io; F-GH-S1 F-GH-S2.

  - **Escribir en:** Checklist escrito en `Sistema 2/LEEME.md` (no en BACKLOG copiar de mas). Codigo sigue en este clone hasta el split.

---

## B. Sistema 1 | paginas

### B0. Inicio CMS (prioridad)

54 [ ] S1-01a `paginas/inicio/pagina-inicio-cms.html`: header + `<main id="inicio-root"></main>` + footer. Main vacio si no hay JSON.

  - **Extraer de:** F-C-INI; F-CMS. No F-SITE (mision/vision no van hardcode).

  - **Escribir en:** SOLO `Sistema 1/paginas/inicio/pagina-inicio-cms.html`. Incluye header+footer compartidos S1. NO crear inicio en Sistema 2.

55 [ ] S1-01b JS: `select` `contenido_inicio`. Si 0 filas o `bloques=[]`, no insertar bloques.

  - **Extraer de:** F-CMS; nombre de tabla canonico `contenido_inicio` (CONTENIDO.md decia `paginas_cms`: ignorar ese nombre).

  - **Escribir en:** `Sistema 1/js/cms/cargar-bloques-inicio.js` (select contenido_inicio). Lo llama `paginas/inicio/pagina-inicio-cms.html`. Consumir el JSON canonico fijado en DB-02d/S1-14a; 0 filas o `bloques=[]` deja Inicio vacio. No guardar JSON local como fuente de verdad.

56 [ ] S1-01c Skeleton 200ms (fondo paleta) para que el footer no salte.

  - **Extraer de:** F-CMS 14:33 punto 6; F-ASE.

  - **Escribir en:** `Sistema 1/js/cms/cargar-bloques-inicio.js` + `Sistema 1/css/pagina-inicio-visitante.css` (skeleton).

57 [ ] S1-01d Render visitante: mismos componentes que el editor, `contenteditable=false`, sin Sortable.

  - **Extraer de:** F-CMS.

  - **Escribir en:** `Sistema 1/js/cms/render-bloques-inicio.js` usado por visitante y admin. No duplicar markup.

58 [ ] S1-08a Boton Editar `display:none` por defecto; visible si `perfiles.rol==='administrador'`.

  - **Extraer de:** F-CMS; Lucide `pencil` F-LUCIDE. No hay PNG del boton: colocarlo en cromo Inicio, no en el menu.

  - **Escribir en:** Boton en `Sistema 1/paginas/inicio/pagina-inicio-cms.html` (fuera del menu). CSS `Sistema 1/css/editor-cms-inicio.css`. Visibilidad: `Sistema 1/js/cms/editor-cms-inicio-admin.js`.

59 [ ] S1-08b Cuenta matriz `intiwo11543@gmail.com` tras login ve Editar (rol admin, no `if email` en cada boton).

  - **Extraer de:** F-C-INI; F-CMS correccion RLS. **No** copiar password de F-OLD P1.

  - **Escribir en:** Mismo `editor.js`. Rol desde `perfiles`, no if email. Seed SQL en `Sistema 1/supabase/semilla-admin-sin-password.sql`.

60 [ ] S1-10a Clic Editar: ocultar hamburguesa/tema/Cuentas del cromo publico; montar `#admin-toolbar` (Lucide + texto: Plantilla, Color, Imagen, Texto, Capa, Animacion, Guardar, Cancelar).

  - **Extraer de:** F-CMS 14:33 puntos 3-5. **No existe mockup Adobe de esta barra.** No usar F-PNG-MENU como toolbar.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` monta `#admin-toolbar` dentro de `paginas/inicio/pagina-inicio-cms.html`. Iconos: `Sistema 1/iconos/`. No existe esta barra en S2.

61 [ ] S1-10b Estado inicial admin sin JSON: **2** bloques vacios plantilla `banner` + boton + entre bloques y footer.

  - **Extraer de:** F-CMS 14:33 punto 3.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` + `Sistema 1/js/cms/plantillas-bloques-inicio.js`. DOM: `#inicio-root` en inicio/pagina-inicio-cms.html.

62 [ ] S1-10c Clic +: append bloque vacio (`banner`) y dejar el + debajo.

  - **Extraer de:** F-CMS; icono `plus` F-LUCIDE.

  - **Escribir en:** Mismo `editor.js`. Boton + es HTML generado, no un PNG.

63 [ ] S1-10d Plantillas: `banner`, `texto-imagen-izq`, `texto-imagen-der`, `tres-columnas`. Cada una `article` full-width.

  - **Extraer de:** F-CMS 14:33 punto 2; 0-19.

  - **Escribir en:** `Sistema 1/js/cms/plantillas-bloques-inicio.js` (funciones que devuelven <article>). CSS de cada plantilla: `Sistema 1/css/editor-cms-inicio.css`.

64 [ ] S1-10e Dentro del bloque: solo Roboto Serif; clases `t-sm` `t-md` `t-lg` `t-xl`; no font-family libre.

  - **Extraer de:** F-FONT; F-CMS (no Canva tipografico).

  - **Escribir en:** `Sistema 1/css/editor-cms-inicio.css` clases t-sm..t-xl. Tipografia ya en variables-tema-diurno-nocturno.css S1.

65 [ ] S1-10f Color de fondo: swatches paleta .ase + `input type=color`.

  - **Extraer de:** F-ASE.

  - **Escribir en:** Swatches en toolbar (`editor-cms-inicio-admin.js`) leyendo hex de `variables-tema-diurno-nocturno.css`. Input color nativo.

66 [ ] S1-10g Imagen fondo/contenido: Storage bucket `inicio/`, accept `.webp,.png,.jpg,.jpeg,.svg`.

  - **Extraer de:** F-S1L `media/inicio/`; F-CMS.

  - **Escribir en:** Upload JS: `Sistema 1/js/cms/subir-imagenes-inicio.js`. Preview en el article. Archivo remoto: bucket Storage `inicio`. Opcional cache local `Sistema 1/media/inicio/` no commitear binarios de secretaria.

67 [ ] S1-10h Capas adelante/atras: solo elementos **dentro** del mismo `article`.

  - **Extraer de:** F-CMS 14:27.

  - **Escribir en:** Logica en `editor.js` sobre hijos del article. No z-index global de pagina.

68 [ ] S1-10i Prohibido `position:absolute` a nivel de pagina para texto suelto.

  - **Extraer de:** F-CMS 14:27 (se rompe en celular).

  - **Escribir en:** `Sistema 1/css/editor-cms-inicio.css` y `inicio.css`: bloques `position:relative`. Lint/revision, no archivo nuevo.

69 [ ] S1-11a Toggle Vista movil = iframe o contenedor width 360px del mismo render.

  - **Extraer de:** F-CMS.

  - **Escribir en:** `Sistema 1/js/cms/editor-cms-inicio-admin.js` toggle. Preview en el mismo inicio/pagina-inicio-cms.html (iframe o #preview-360).

70 [ ] S1-11b No habilitar Guardar si 360px tiene overflow-x.

  - **Extraer de:** F-CMS.

  - **Escribir en:** Mismo editor.js deshabilita boton Guardar. No hay destino S2.

71 [ ] S1-12a Incluir SortableJS. Handle = barra del bloque.

  - **Extraer de:** F-SORT; F-CMS punto 4.

  - **Escribir en:** Vendor: `Sistema 1/js/cms/sortable.min.js` o CDN en inicio/pagina-inicio-cms.html. Init en editor-cms-inicio-admin.js.

72 [ ] S1-12b Drag reordena `bloques[].orden`.

  - **Extraer de:** F-CMS punto 6.

  - **Escribir en:** editor.js actualiza array antes de Guardar.

73 [ ] S1-13a Dropdown Animacion: `ninguna | fade | slide-up | parallax-suave`. AOS o clases CSS.

  - **Extraer de:** F-AOS; F-CMS punto 5.

  - **Escribir en:** Select en toolbar (editor-cms-inicio-admin.js). Clases en `Sistema 1/css/editor-cms-inicio.css` y/o AOS desde CDN en inicio/pagina-inicio-cms.html.

74 [ ] S1-13b No permitir CSS arbitrario de la secretaria.

  - **Extraer de:** F-CMS.

  - **Escribir en:** No hay textarea CSS. Si aparece, borrarlo de editor.js.

75 [ ] S1-14a Guardar: JSON `{ bloques: [{ id, plantilla, orden, textos, color, imagen, animacion, capas }] }` upsert `contenido_inicio`.

  - **Extraer de:** F-CMS punto 6.

  - **Escribir en:** `Sistema 1/js/cms/guardar-contenido-inicio.js` valida/normaliza a ese contrato antes del upsert; compatibilizar `tipo`, `orientacion` y campos actuales de `plantillas-bloques-inicio.js` en S1-10d. Solo admin escribe por RLS. No escribir JSON en un HTML estatico.

76 [ ] S1-14b Cancelar: recargar JSON anterior; salir de edicion; restaurar cromo.

  - **Extraer de:** F-CMS.

  - **Escribir en:** guardar.js / editor.js recarga cargar.js. Restaura header S1.

77 [ ] S1-14c Tras Guardar: modo visitante de esa sesion Admin ve bloques publicados.

  - **Extraer de:** F-CMS; F-C-INI.

  - **Escribir en:** Tras upsert, render.js pinta en `#inicio-root`.

78 [ ] S1-15 Sanitizar texto (textContent o DOMPurify). No ejecutar `<script>` pegado.

  - **Extraer de:** F-CMS (secretaria pega HTML).

  - **Escribir en:** `Sistema 1/js/cms/sanitizar-texto-cms.js` (DOMPurify vendor en `Sistema 1/js/cms/` o textContent). Llamar antes de innerHTML.

### B1. Matricula / Oferta / Personal / Ubicaciones / Historia

79 [ ] S1-02a `paginas/matricula/pagina-matricula-nuevo-ingreso.html` con cromo compartido.

  - **Extraer de:** F-S1L; F-PNG-MENU.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/matricula/pagina-matricula-nuevo-ingreso.html`. Header/footer S1. No Sistema 2.

80 [ ] S1-02b Copiar pasos 2027 desde F-C-MAT (sin videos, sin inventar fechas).

  - **Extraer de:** F-C-MAT; F-MICRO P2 (pasos 2.2.x, numeracion del PDF puede diferir del Site: **priorizar F-C-MAT / F-SITE-MAT** que ya unifico 5 pasos con fechas); F-RES "Nuevo ingreso".

  - **Escribir en:** Cuerpo de `pagina-matricula-nuevo-ingreso.html` (no crear matricula.js; el HTML ya existe). Extraer texto de CONTENIDO.md de la MISMA carpeta.

81 [ ] S1-02c Seccion EDUCAME desde el mismo CONTENIDO.

  - **Extraer de:** F-C-MAT; F-MICRO P7; F-SITE-ED.

  - **Escribir en:** Misma pagina matricula/pagina-matricula-nuevo-ingreso.html, seccion debajo de 2027.

82 [ ] S1-02d CTA Inscribete: enlazar al formulario oficial de Google Forms; el WhatsApp oficial queda como contacto alternativo, no como destino del boton.

  - **Extraer de:** F-PNG-FOOT CTA; F-RES tabla vs F-SITE-MAT.

  - **Escribir en:** CTA en matricula/pagina-matricula-nuevo-ingreso.html y en footer compartido (href a esta pagina).

  - **Destino oficial confirmado 2026-10-12 16:22 (UTC-6):** `https://docs.google.com/forms/d/e/1FAIpQLSchOv93fiyvoxF2z_mahlUcUhzbt5FyxfZTupLeODpdBcJjhw/viewform`. Los enlaces "Inscríbete ahora" en la página activa Inicio S1, hub S2 y ambos footers abren el formulario en nueva pestaña con `rel="noopener noreferrer"`.

83 [ ] S1-03a Pagina oferta: dropdown/pildoras como PNG (fondo `#539507`, activo/hover).

  - **Extraer de:** F-PNG-S2T (look de pildoras, reutilizado en Oferta S1); F-ASE verde.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/oferta-academica/pagina-oferta-academica.html` + `Sistema 1/css/pildoras-oferta-academica.css`. Look de pildoras desde PNG S2 pero el HTML NO va a Sistema 2.

84 [ ] S1-03b Seis tecnicas + General (7). Copy de modulos.

  - **Extraer de:** F-C-OF (lista corta); F-MICRO P2-P7 (modulos largos por especialidad); F-RES Oferta academica; F-SITE-OF. General = F-MICRO P7 no una septima tecnica.

  - **Escribir en:** Copy en oferta-academica/pagina-oferta-academica.html (modulos). Fuente de texto: CONTENIDO.md de esa carpeta + F-MICRO P2-P7.

85 [ ] S1-03c Color de pildora = SH-02b. Hover Sistemas Electricos puede ir `#E61010` como PNG.

  - **Extraer de:** F-PNG-S2T; F-ASE.

  - **Escribir en:** Colores en `Sistema 1/css/pildoras-oferta-academica.css` usando variables de variables-tema-diurno-nocturno.css S1.

86 [ ] S1-03d Sin videos .mp4 del Site.

  - **Extraer de:** F-LEEME; F-SITE-OF.

  - **Escribir en:** No crear `Sistema 1/media/` para mp4 de oferta. Cero <video>.

87 [ ] S1-04a Personal: "Proximamente" si no hay 0-16.

  - **Extraer de:** F-C-PER.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/personal/pagina-personal-instituto.html` con mensaje Proximamente.

88 [ ] S1-04b Ficha: nombre, cargo, bio. Foto solo si 0-05 = si.

  - **Extraer de:** F-C-PER.

  - **Escribir en:** Componente en esa misma pagina o `personal.js` en la carpeta. Fotos solo si 0-05.

89 [ ] S1-05a Ubicaciones: Col. Roma, final Blvd. Venezuela, San Salvador.

  - **Extraer de:** F-C-UBI; F-HIST P1; F-RES tabla.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/ubicaciones/pagina-ubicaciones.html`.

90 [ ] S1-05b Contacto tabla RESOLUCIONES. Buses/plano placeholder hasta 0-06.

  - **Extraer de:** F-C-UBI.

  - **Escribir en:** Misma pagina. No inventar mapa JS hasta 0-06.

91 [ ] S1-06a Historia: 1954, 1955, 1962, 1964 Expotecnia, 2015 Open House, 2024 70 anios.

  - **Extraer de:** F-C-HIS (lista corta publicable); F-HIST **P21** (Expotecnia inicia 1964, mision Japon 1962); **P22-P25** (feria oct-nov, especialidades en stands); **P27-P28** (Open House desde oct 2015, captacion 9 grado). URLs de apoyo en F-HIST P22 (elsalvador.com 70 anios, Scribd/UES 1954). Transcribir solo hechos, no el tono de IA del PDF.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/historia/pagina-historia-instituto.html` con timeline. Texto de `Sistema 1/paginas/historia/CONTENIDO.md` + F-HIST P21-P28.

92 [ ] S1-06b No renderizar violencia/destitucion. Comentario HTML `<!-- RETENIDO -->`.

  - **Extraer de:** F-HIST **P2-P3, P7-P20** (pandillas, FGR, destitucion 25 ago 2025, 2015, 2021-2026). F-RES "Retener". Hasta 0-09.

  - **Escribir en:** Comentario HTML en historia/pagina-historia-instituto.html. No hay pagina 'retenido'.

93 [ ] S1-06c Cifras 20.000 / 1.000 solo si 0-10 y 0-11 estan `[x]`.

  - **Extraer de:** F-HIST P2 y P22 (el PDF avisa "la IA puede cometer errores").

  - **Escribir en:** Condicional en historia/pagina-historia-instituto.html. Cifras no van a Inicio ni footer.

### B2. Configuraciones y cuentas (S1)

94 [ ] S1-07a Visitante: Configuraciones no navega (SH-01d).

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Logica en `Sistema 1/js/auth/sesion-roles-auth.js` (item Config del header S1 y S2).

95 [ ] S1-07b Admin: dos dropdowns raiz: Administradores | Docentes.

  - **Extraer de:** F-RES 14:10 (no hay PNG). F-OLD P9 es otra IA de roles: no copiar "visitante" como cuenta.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 1/paginas/configuraciones/pagina-configuraciones.html` + `Sistema 1/js/auth/panel-configuraciones-cuentas.js`. Esta pagina NO se duplica en S2 (enlace del menu S2 apunta a S1 o replica minima).

96 [ ] S1-07c Admin > Docentes > Academico | Tecnico. Tecnico > 6 especialidades (sin General aqui salvo Instituto).

  - **Extraer de:** F-C-OF; F-MICRO 3.x.

  - **Escribir en:** Arbol DOM en configuraciones/pagina-configuraciones.html. Tecnico consulta especialidades/codigos; academico consulta el catalogo que Instituto confirme en DB-00a. No clasificar asignaturas como `GE` sin aprobacion.

97 [ ] S1-07d Al elegir especialidad: lista docentes + codigos. Expandir: editores/alumnos (correo, nombre, n_lista) autorizados.

  - **Extraer de:** F-RES 14:10; F-PDF-S2 filtros anio/seccion/codigo (logica, no look).

  - **Escribir en:** `Sistema 1/js/auth/panel-configuraciones-cuentas.js` listas desde `codigos.docente_id` y `miembro_codigo`; usar correo de invitaciones consumidas (`usado_por`) mediante RLS/RPC autorizada, no leer `auth.users` desde el navegador ni exponer NIE. No HTML de proyectos.

98 [ ] S1-07e Admin invita/activa/desactiva Admin, Docente, Editor (correo+nombre; NIE segun DB-00b).

  - **Extraer de:** F-RES 14:10; F-OLD P9 (invitacion por correo).

  - **Escribir en:** Formularios en configuraciones/pagina-configuraciones.html. Crear invitaciones/usuarios mediante Auth confiable; nunca invocar Admin API ni `service_role` desde Pages. No asignar contrasena: el invitado la define desde el enlace de activacion. No borrar perfiles con referencias: desactivar segun DB-00c. Aplicar identificador NIE/login solo segun flujo seguro DB-00b.

99 [ ] S1-07f Docente: codigo = Especialidad + Nivel 1/2/3 + Seccion ? `DS2B`. Prefijos DS, EL, MI, MA, SE, IT, GE.

  - **Extraer de:** F-RES 14:10; F-PDF-S2 "Codigo DSXX".

  - **Escribir en:** `Sistema 1/js/auth/panel-configuraciones-cuentas.js` genera y valida clave; guardar `codigos` con unicidad por especialidad/nivel/seccion/anio_lectivo y docente propietario.

100 [ ] S1-07g Docente: dentro del codigo, correo/n_lista de editores; verificar el NIE del alumno contra la lista oficial DB-00b.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Mismo panel de Config. Invitar por correo normalizado y codigo; el flujo confiable coteja el NIE contra la lista oficial privada antes del alta y conserva solo HMAC/estado de verificacion, no NIE plano. Al aceptar, crear perfil + membresia persistente. Permitir otra invitacion para otro codigo sin mas de una invitacion pendiente por email/codigo.

101 [ ] S1-07h Docente: eliminar codigo o alumno de su codigo; no ve otros docentes.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Desactivar/eliminar la membresia o codigo segun DB-00c, filtrando por `docente_id`; no borrar fisicamente proyectos ni perder autoria por cascada.

102 [ ] S1-07i Editor: Config minima (ficha S2 / password / tema). No crea cuentas.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Vista reducida en configuraciones/pagina-configuraciones.html si rol=editor. Link a `Sistema 2/paginas/ficha/`; tema lee/escribe `perfiles.tema` solo tras Auth y DB-02a/DB-03c (SH-02e). Cambio de password se delega a Supabase Auth, nunca a SQL propio.

103 [ ] S1-09a Nadie se auto-asigna Admin excepto la matriz via DB-09.

  - **Extraer de:** F-CMS; F-C-INI.

  - **Escribir en:** Trigger/SQL `Sistema 1/supabase/`. Front no ofrece combo Rol=admin al registrarse.

104 [ ] S1-09b Admin no desactiva ni elimina fisicamente al ultimo administrador.

  - **Extraer de:** F-CMS seguridad.

  - **Escribir en:** operacion confiable + RLS/constraint acordada. Rechazar desactivacion del ultimo admin; conservar filas historicas y evitar delete en cascada.

---

## C. Sistema 2 | proyectos

Look: F-PNG-S2H, F-PNG-S2T, F-PNG-S2B. Estructura de datos (URLs, no fotos de alumno): F-PDF-S2 fases 2-3 y F-OLD P10 grupo B.

105 [x] S2-01a `paginas/proyectos/pagina-hub-proyectos.html` cromo + busqueda.

  - **Extraer de:** F-PNG-S2H; F-S2L; cromo F-PNG-MENU.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`. Header S2 (con busqueda). NO crear esta pagina bajo Sistema 1.

106 [x] S2-01b Dos cards Tecnicos / Academicos con copy del PNG y Ver mas.

  - **Extraer de:** F-PNG-S2H (leer textos del PNG pixel a pixel).

  - **Escribir en:** Las dos cards en proyectos/pagina-hub-proyectos.html. CSS `Sistema 2/css/hub-y-pildoras-proyectos.css`.

107 [x] S2-01c Lucide folder vs graduation-cap, trazo 2.5, color `#539507`.

  - **Extraer de:** F-LUCIDE; F-PNG-S2H; F-ASE.

  - **Escribir en:** SVG ya en `Sistema 2/iconos/folder.svg` y `graduation-cap.svg` (SH-05). Usarlos en las cards.

108 [x] S2-02a Tras Tecnicos: pildoras especialidades (nombres del PNG + General).

  - **Extraer de:** F-PNG-S2T; F-C-OF nombres; 0-17 ITSI.

  - **Escribir en:** Bloque pildoras en proyectos/pagina-hub-proyectos.html (tras click Tecnicos). Nombres de F-C-OF / PNG.

109 [x] S2-02b Hover/activo: rojo o verde segun PNG; contraste.

  - **Extraer de:** F-PNG-S2T.

  - **Escribir en:** `Sistema 2/css/hub-y-pildoras-proyectos.css` :hover/:active.

110 [ ] S2-02c Filtrar proyectos por especialidad/tipo/año cuando haya data.

  - **Extraer de:** F-PDF-S2 Fase 2 (filtro anio/seccion/codigo) como **logica**, UI = PNG.

  - **Escribir en:** `Sistema 2/js/busqueda/filtrar-proyectos-especialidad.js` consulta proyectos activos; tecnico filtra por `codigo_id -> especialidad_id`, año/ciclo y tipo. Academico usa DB-00a; no asumir que tiene `especialidad_id`. No filtrar en S1.

111 [x] S2-03a Input placeholder `Busca algun proyecto de tu interes....`

  - **Extraer de:** F-PNG-S2B (respetar puntos del PNG).

  - **Escribir en:** Input en `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` (solo S2). Placeholder exacto del PNG.

112 [x] S2-03b Cero resultados: copy del PNG ("No se encontro... quizas te refieres a").

  - **Extraer de:** F-PNG-S2B.

  - **Escribir en:** Panel resultados: `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` o overlay. Copy del PNG.

113 [x] S2-03c Debounce 200ms. 0 caracteres = hub.

  - **Extraer de:** F-PNG-S2H estado vacio de query.

  - **Escribir en:** `Sistema 2/js/busqueda/buscar-proyectos.js`.

114 [ ] S2-04a Ficha `paginas/ficha/pagina-ficha-proyecto.html?id=`. Campos: titulo, especialidad, codigo, anio, tipo tecnico|academico, texto, URLs (GitHub, Drive, YouTube). **Sin foto de alumno.**

  - **Extraer de:** F-PDF-S2 Fase 3 (equipo, descripcion, adjuntos como URL no PNG de cara); F-OLD P10 grupo B "solo URLs"; F-RES 14:10.

  - **Escribir en:** Rellenar (ya existe vacio) `Sistema 2/paginas/ficha/pagina-ficha-proyecto.html`. Query ?id=. `urls` jsonb validado como URL http/https. Tecnico: codigo/especialidad. Academico: relacion definida en DB-00a antes de SQL; no asignar `GE` por defecto. Cero `<img>` de alumno.

115 [ ] S2-04b Editor lider asignado: form de contenido solo si existe asignacion activa a la caja/proyecto.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** `Sistema 2/js/ficha/editar-ficha-propia.js`. Solo si perfil activo, es Editor lider asignado a ese proyecto y pertenece al codigo correspondiente mediante `miembro_codigo`; permitir cambios de contenido, nunca borrar la caja, reasignar lider ni alterar propiedad/estado. RLS/grants deben imponerlo aunque se manipule el JS.

116 [ ] S2-04c Editor viendo otro proyecto: mismo DOM que visitante.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Mismo ficha/pagina-ficha-proyecto.html rama visitante; no incluir datos de perfiles/invitaciones en la lectura publica.

117 [ ] S2-05a Docente: listado cuyo `codigo_id` esta en sus codigos.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Listado docente S2 filtrado por `codigos.docente_id`; Editor por `miembro_codigo`. Acceso docente a proyectos academicos depende de DB-00a.

118 [ ] S2-05b Docente: archivar proyecto (confirmacion). Soft-delete administrativo `deleted_at`.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Boton en ficha o listado S2. Archivar logicamente con `deleted_at`, permitido solo a docente responsable del codigo y administrador. Editor no puede archivar ni borrar; desactivar/reemplazar un Editor no altera el proyecto, contenido ni visibilidad. No borrar fisicamente.

119 [ ] S2-05c Toggle docente: ver como visitante | como editor solo en proyectos de sus alumnos.

  - **Extraer de:** F-RES 14:10.

  - **Escribir en:** Toggle en ficha/pagina-ficha-proyecto.html (solo docente). Reusa render visitante/editor.

120 [ ] S2-06a Admin S2: archivar pagina/caja de proyecto (cualquier codigo). No "borrar un archivo del repo".

  - **Extraer de:** F-RES 14:10 (los adjuntos son URLs externas).

  - **Escribir en:** Admin: mismo soft-delete `deleted_at` desde S2 ficha; accion separada de reemplazar al Editor. No borrado fisico ni `git rm`.

121 [ ] S2-06b Admin S2: alta correos Docente (misma API que S1-07e).

  - **Extraer de:** un proyecto Supabase.

  - **Escribir en:** Reutilizar UI/politica de S1-07e o redirigir a S1 Config; crear usuarios por backend confiable, nunca Supabase Admin API ni `service_role` desde el cliente S2.

122 [ ] S2-07a Crear codigo: regex `^[A-Z]{2}[123][A-Z]$` o mapa real (DS2B).

  - **Extraer de:** F-RES 14:10; F-PDF-S2 DSXX.

  - **Escribir en:** Validacion en `Sistema 1/js/auth/panel-configuraciones-cuentas.js` (crear codigo es de docente, UI Config S1). Regex en ese archivo.

123 [ ] S2-07b Insertar `invitaciones_correo` antes del registro del alumno.

  - **Extraer de:** F-OLD P9 invitacion email; F-RES 14:10.

  - **Escribir en:** INSERT seguro desde Config S1 a `invitaciones_correo`; al aceptar, trigger/transaccion asigna perfil y `miembro_codigo`, marca `usado_en/usado_por`. No hay formulario de alta en ficha S2 ni autoasignacion de rol.

124 [ ] S2-08a `Sistema 2/LEEME.md`: pasos copy-paste al repo web-oficial-proyectos.

  - **Extraer de:** F-S2L; F-GH-S2.

  - **Escribir en:** EDITAR `Sistema 2/LEEME.md` con pasos de copia al otro repo.

125 [ ] S2-08b Auth: permitir origenes Pages S1 y S2.

  - **Extraer de:** F-OLD P10.

  - **Escribir en:** Panel Auth de Supabase (no archivo git) + nota en `Sistema 1/supabase/README.md` si se crea. Origenes Pages S1 y S2.

126 [ ] S2-09a Header S2: busqueda centrada como PNG; no mostrar el boton Editar CMS (es exclusivo de Inicio S1).

  - **Extraer de:** F-PNG-S2B; F-CMS (Editar = Inicio S1).

  - **Escribir en:** Header S2 distinto: `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` incluye busqueda. Boton Editar CMS no existe en S2 (el de ficha es otro, S2-04b).

127 [ ] S2-09b Placeholder "Aca bla bla" del PNG **no** copiar a prod.

  - **Extraer de:** F-PNG-S2H nota.

  - **Escribir en:** No pegar lorem del PNG en proyectos/pagina-hub-proyectos.html. Copy real cuando exista CONTENIDO; si no, omitir esa frase.

---

## D. Supabase (un proyecto, dos fronts)

No ejecutar migraciones en Supabase hasta que Instituto apruebe el **DER revisado** y confirme DB-00a..DB-00f. El permiso para redactar SQL no cambia el estado de las tareas ni autoriza aplicarlo en la instancia. Las casillas DB-* implementan el contrato aprobado, no un esquema inventado. El anexo original de Cursor se conserva como borrador de entrada; la seccion "Revision del DER propuesto" define las correcciones y decisiones que deben resolverse primero.

### Estado real de los borradores SQL (2026-10-12 11:01 UTC-6)

Instituto indico el nombre `bd_inti_web_oficial` y la URL `https://akvprrwjfstncadkybeh.supabase.co` (ref `akvprrwjfstncadkybeh`). No se inspecciono ni modifico Supabase: el estado siguiente describe unicamente los archivos versionados.

- **Borradores parciales en `Sistema 1/supabase/`:** `tabla-perfiles.sql`, `tabla-especialidades.sql`, `tabla-codigos-seccion.sql` (incluye `miembro_codigo`), `tabla-invitaciones-correo.sql`, `politicas-rls.sql` (solo perfiles/especialidades/codigos/membresias/invitaciones) y `trigger-nuevo-perfil.sql`.
- **Aun stubs:** `tabla-contenido-inicio.sql`, `tabla-footer-cms.sql`, `tabla-proyectos.sql`, `storage-buckets.sql` y `semilla-admin-sin-password.sql`. Faltan ademas las politicas de CMS, proyectos y Storage.
- **Sistema 2:** sus archivos SQL siguen siendo stubs; no son otra BD ni deben aplicarse. Sincronizar las copias de referencia desde S1 cuando el contrato canonico este revisado.
- **No inferir despliegue:** el SQL de S1 es codigo candidato, no evidencia de tablas, Auth o politicas existentes en el proyecto remoto. No ejecutar nada hasta cerrar DB-00a..DB-00f y recibir autorizacion expresa para aplicar una migracion.

**Para la siguiente IA:** revisar los borradores contra el DER revisado y corregir, como minimo, la ausencia de `especialidad_id` en `perfiles` aunque DB-02a lo requiere; comprobar la unicidad de `codigos.clave` frente a la unicidad por ciclo lectivo; revisar grants/policies para que solo la aceptacion de una invitacion cree membresias y para que bajas/invitaciones no puedan eludir el flujo aprobado; y verificar bootstrap concurrente del primer administrador. Resolver DB-00a y DB-00d antes de completar tablas/policies dependientes; aplicar DB-00b/c/e/f aprobadas. Despues, completar DB-02d/e/f, DB-03a/b, DB-04a y DB-09a, validar el SQL en entorno controlado, sincronizar las copias S2 y solo aplicar una vez con permiso de Instituto.

128 [x] DB-01a Confirmar el proyecto Supabase unico y activar Auth email.

  - **Extraer de:** F-CLI; 0-15.

  - **Escribir en:** Confirmacion en dashboard Supabase y resoluciones. No desplegar tablas ni aplicar SQL hasta cerrar DB-00a..DB-00f.

  - **Confirmado 2026-10-12 11:31 (UTC-6):** Instituto confirma que Auth email esta activado en el proyecto `bd_inti_web_oficial` (ref `akvprrwjfstncadkybeh`). Esto confirma proveedor email; no confirma todavia ajustes de registro publico, confirmacion de correo, URL/callbacks ni el despliegue de tablas.

129 [ ] DB-01b Definir configuracion de cliente/deploy sin claves en Git.

  - **Extraer de:** F-CLI; F-CMS.

  - **Escribir en:** Variables de entorno/Actions y config local ignorada. Para GitHub Pages, inyectar URL y publishable/anon key durante el build; no usar `service_role` ni dejar el sitio publicado sin config. Documentar y probar el mecanismo antes de SH-07a.

130 [ ] DB-02a a DB-09b: implementar el contrato aprobado y sus decisiones de seguridad; no iniciar hasta cerrar DB-00a..DB-00f.

  - **Extraer de:** Anexo DER; F-OLD P10 grupos A/B/C; F-CMS `contenido_inicio`; F-RES 14:33 RLS por `rol` no por email.

  - **Escribir en:** SQL S1 como fuente canonica. Copias S2 son solo referencia de la misma base; ejecutar una migracion una sola vez. No duplicar ejecucion ni configurar una segunda BD.

### Puertas de aprobacion del modelo (DB-00, antes de cualquier migracion)

DB-00a [ ] Instituto define que materias/areas tendran proyectos academicos y como se asignaran; decidir quien los crea, edita y elimina. No inventar materias/codigos, no hacer `codigo_id` nullable ni asignar `GE` por defecto hasta acordar el modelo.

DB-00b [x] Instituto confirma que el NIE es unico y se verifica durante el alta contra una lista oficial Instituto NIE-correo; login por correo + contrasena, y cada usuario define su propia contrasena. No guardar NIE plano: usar identificador HMAC con secreto solo de servidor para comparar unicidad y asociar el NIE verificado al correo autorizado. La lista fuente se entrega/importa solo por un proceso privado y confiable: nunca al chat, Git ni logs.

DB-00c [x] Decision del Instituto: cuando un alumno egrese, su cuenta queda inactiva (sin importar el rol); se conserva el registro de la cuenta y no se elimina ningun proyecto ni su autoria. La cuenta no se borra por dejar de existir su Gmail institucional; un administrador debe desactivarla y revocar sus sesiones mediante un flujo confiable. La visibilidad/estado aprobado de proyectos no cambia por desactivar la cuenta. No usar borrado en cascada. Proteger siempre al ultimo administrador activo.

DB-00d [ ] Confirmar URL publica de cada sitio ya publicado (GitHub Pages, normalmente termina en `github.io/...`, o dominio propio), NO la URL del repositorio GitHub. Anotar Sistema 1 y Sistema 2; determinar origenes y callbacks Auth. Si aun no estan publicados, dejar pendiente hasta habilitar Pages. La URL de repo sirve para codigo, no para configurar callbacks del sitio.

DB-00e [x] Decision tecnica de v1: usar como contrato canonico el JSON de S1-14a `{ bloques: [{ id, plantilla, orden, textos, color, imagen, animacion, capas }] }`; las plantillas JS se adaptan a ese formato (incluidos tipo/orientacion/alineacion/CTA/enlace) antes de conectar la tabla. Versionar el contrato si cambia; no guardar el contenido real hasta probar lectura/escritura.

DB-00f [x] Instituto define que una caja/proyecto persiste independientemente de su Editor lider. Docente o administrador la crea y asigna expresamente al lider autorizado; la lista completa de una seccion no convierte a todos en Editores y no se presume quien es lider. El Editor puede agregar/modificar el contenido permitido, pero no borrar/archivar la caja ni reasignar lider por su cuenta. El lider vigente puede iniciar el relevo; docente/administrador pueden ejecutarlo y autorizar al reemplazo, quien debe ser miembro elegible del mismo codigo. Se revoca la asignacion anterior y se asigna otro Editor a la misma caja, conservando ID, contenido, autoria, estado y visibilidad. Desactivar la cuenta tampoco altera proyectos. La nomina DS1B compartida no se conserva: contiene identificadores y calificaciones de estudiantes. Referencia de requisitos no sensibles: `IAs/RESOLUCIONES.md`, entrada 2026-10-12 16:08.

Casillas atomicas de implementacion (cuando haya DER):

131 [~] DB-02a Tabla `perfiles` ligada 1:1 a `auth.users`


  - **Escribir en:** `tabla-perfiles.sql`: PK/FK `id = auth.users.id`, rol validado, nombre, tema `light|dark` default `dark`, especialidad docente nullable, timestamps y estado de desactivacion. No duplicar email ni almacenar NIE plano. No permitir que el usuario cambie su rol mediante update propio.

132 [~] DB-02b Tabla `codigos` y membresia persistente `miembro_codigo`


  - **Escribir en:** `tabla-codigos-seccion.sql` define codigos unicos por especialidad/nivel/seccion/anio y owner docente; incluir `miembro_codigo(perfil_id,codigo_id,...)` con unique por pareja para la pertenencia persistente de editores. No tratar invitacion consumida como unica relacion.

133 [~] DB-02c Tabla `especialidades` seed 6+General+hex


  - **Escribir en:** `Sistema 1/supabase/tabla-especialidades.sql` con INSERT seed hex.

134 [ ] DB-02d Tabla `contenido_inicio` JSON canonico de bloques, una fila


  - **Escribir en:** `tabla-contenido-inicio.sql`: una fila con JSON acorde al contrato S1-10d/S1-14a; version/campos documentados, `updated_by` FK `perfiles`, `updated_at` automatico. Normalizar el modulo de plantillas antes de conectar persistencia.

135 [ ] DB-02e Tabla `footer_cms` editable, fila unica


  - **Escribir en:** `tabla-footer-cms.sql`: PK singleton, telefono, `whatsapp_principal`, `whatsapp_alterno`, redes, correo, direccion, CTA y copyright; `updated_by` FK y timestamp. Valores iniciales solo de RESOLUCIONES.

136 [ ] DB-02f Tabla `proyectos` con owner, soft-delete y URLs externas


  - **Escribir en:** `tabla-proyectos.sql`: caja con identidad estable, `creado_por`/autor y codigo/tipo segun DB-00a, año, contenido y `urls` jsonb solo http/https; nunca hacer que su existencia dependa del Editor asignado. Modelar en `asignaciones_editor_proyecto` el historial de `proyecto_id`, `editor_id`, `asignado_por`, `asignado_en` y `revocado_en`, con una sola asignacion vigente de lider por caja. Docente/admin crean y asignan; el lider vigente puede iniciar un relevo y docente/admin lo confirman; el reemplazo debe ser miembro elegible del codigo. Solo docente responsable/admin archivan con `deleted_at`; Editor asignado modifica campos de contenido permitidos, no elimina ni cambia asignacion por su cuenta. No incluir NIE, calificaciones, padrones, binarios ni fotos de alumnos. No implementar hasta resolver modelo academico.

137 [~] DB-02g Tabla `invitaciones_correo` con consumo/auditoria


  - **Escribir en:** `tabla-invitaciones-correo.sql`: email normalizado, rol destino, codigo destino para editor, invitador, timestamps de creacion/uso y usuario que la consumio (`auth.users.id`). Definir unicidad para invitaciones activas por email/codigo; permitir re-invitacion autorizada tras consumo.

138 [ ] DB-03a RLS contenido_inicio y footer: lectura publica; escritura admin


  - **Escribir en:** `politicas-rls.sql`: SELECT anon/autenticado; INSERT/UPDATE/DELETE solo admin para contenido_inicio/footer_cms. Restringir UPDATE por columnas; revisar grants, no confiar solo en esconder controles UI.

139 [ ] DB-03b RLS proyectos: SELECT activos publico; escritura segun owner/codigo/rol


  - **Escribir en:** Mismo archivo. SELECT proyectos no archivados; INSERT por docente/admin con caja y asignacion valida; UPDATE limitado de contenido por Editor lider asignado y miembro activo del codigo; reasignacion/cambios estructurales por docente/admin; soft-delete solo por docente responsable/admin. Desactivar o reemplazar al Editor no elimina, archiva ni oculta el proyecto. Definir aparte permisos academicos en DB-00a; no otorgar DELETE fisico a Editor ni depender solo de controles UI.

140 [~] DB-03c RLS perfiles sin auto-escalacion de rol


  - **Escribir en:** SELECT propio con columnas privadas, SELECT amplio solo admin. Usuario actualiza solo campos aprobados (tema/nombre); rol, estado, NIE hash y metadatos protegidos solo por operación admin confiable. Probar que no puede cambiar `rol` por REST/PostgREST.

141 [~] DB-03d RLS codigos / membresias / invitaciones


  - **Escribir en:** Docente lee/administra solo codigos propios; editor solo ve membresias/codigos propios; invitaciones solo visible al invitador/admin y nunca anonimo. Evitar recursion RLS con funciones seguras y `search_path` fijo.

142 [ ] DB-04a Bucket `inicio` lectura publica; escritura admin


  - **Escribir en:** Bucket `inicio` una sola vez en el proyecto compartido; lectura publica, insert/update/delete admin; limitar paths a `inicio/`. Si se admite SVG, definir sanitizacion/validacion para no servir SVG activo no confiable.

143 [ ] DB-04b Bucket `personal` solo si 0-05 = si


  - **Escribir en:** No crear hasta 0-05=si. Si si: bucket `personal` + storage-buckets.sql.

144 [~] DB-05a Trigger transaccional auth.users -> perfil e invitacion


  - **Escribir en:** `trigger-nuevo-perfil.sql`: crear perfil minimo; validar/consumir invitacion y crear `miembro_codigo` en la misma transaccion. Rechazar editor sin invitacion. Bootstrap admin solo para la cuenta matriz si no existe otro admin, consultando `auth.users`; funcion segura con `search_path` fijo. No guardar contraseña/email duplicado.

145 [ ] DB-06a Confirmar/documentar host y origen reales de Pages


  - **Escribir en:** Verificar URL publicada de ambos repos. Si comparten `owner.github.io` y solo cambia el path, es el mismo origin; si hay dominios personalizados distintos, `localStorage`/sesion son aislados. Documentar los URLs base reales, no asumir origenes distintos.

146 [ ] DB-06b CORS y Redirect URLs Auth para cada callback real


  - **Escribir en:** Allowlist de callbacks exactos de cada sistema y localhost de desarrollo aprobado; verificar retorno de OAuth/magic link si se elige. Documentar en LEEME + dashboard Auth; CORS no comparte sesiones entre origins.

147 [ ] DB-07a Unicidad de invitaciones activas; SH-04b


  - **Escribir en:** Indice unico parcial sobre email normalizado + codigo para invitaciones pendientes (y regla separada para invitaciones de staff sin codigo); permitir nuevas invitaciones despues de uso/cancelacion. Mensaje SH-04b en sesion JS.

148 [ ] DB-08a Indices de busqueda v1 (proyectos y JSON opcional)


  - **Escribir en:** Indice de busqueda de proyectos (titulo/cuerpo) solo si se habilita busqueda remota; GIN de `contenido_inicio.bloques` sigue opcional. No indexar JSON sin caso de consulta definido.

149 [ ] DB-09a Seed inicial de `intiwo11543@gmail.com` como admin **sin password**


  - **Escribir en:** Seed idempotente que une `perfiles.id` con `auth.users.id` y filtra email solo para el bootstrap; no asumir columna `perfiles.email`, no incluir password. Copia S2 es referencia; ejecutar una vez en la BD compartida.

150 [ ] DB-09b Politicas `rol = administrador`, nunca email como unica regla


  - **Escribir en:** Revisar policies/grants/RPC: autorizacion normal por rol y ownership; email solo en bootstrap inicial, nunca como politica permanente. Verificar que el usuario no pueda elevar su rol por UPDATE propio.

---

## E. QA

151 [ ] E-01 320px: menu overlay, Inicio 0 bloques, sin scroll horizontal.

  - **Extraer de:** F-CMS; F-C-INI.

  - **Escribir en:** Probar `Sistema 1/paginas/inicio/pagina-inicio-cms.html` a 320px. Anotar `IAs/RESOLUCIONES.md`.

152 [ ] E-02 360px: 4 bloques no desbordan.

  - **Extraer de:** S1-11; F-CMS.

  - **Escribir en:** Probar mismo inicio con 4 bloques (sesion admin). Anotar resoluciones.

153 [ ] E-03 768px: hub S2 2 cols; especialidades wrap.

  - **Extraer de:** F-PNG-S2H F-PNG-S2T.

  - **Escribir en:** Probar `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` 768px.

154 [ ] E-04 Landscape: busqueda S2 no tapa logo.

  - **Extraer de:** F-PNG-S2B.

  - **Escribir en:** Probar header S2 landscape.

155 [ ] E-05 XSS bloque Inicio no alerta.

  - **Extraer de:** S1-15.

  - **Escribir en:** Probar pegando en editor Inicio (S1). No en ficha S2.

156 [ ] E-06 Visitante no ve `#admin-toolbar` ni Editar.

  - **Extraer de:** F-CMS.

  - **Escribir en:** Inspeccionar DOM de inicio S1 sin login.

157 [ ] E-07 RLS impide editar proyecto ajeno, autoelevar rol y usar codigo no asignado.

  - **Extraer de:** Anexo DER.

  - **Escribir en:** Probar dos editores, dos codigos, update de `perfiles.rol`, invitacion usada/reusada y docente fuera de sus codigos; comprobar que Editor no puede eliminar ni reasignar la caja, que docente/admin transfieren la asignacion conservando el mismo proyecto y que desactivar al Editor no borra ni oculta la caja; verificar soft-delete y proyectos academicos conforme a DB-00a.

158 [ ] E-08 Copiar S2: grep `Sistema 1` = 0 o documentado.

  - **Extraer de:** SH-09b.

  - **Escribir en:** Tras copiar repo S2: grep. Documentar en Sistema 2/LEEME.md.

159 [ ] E-09 `rg service_role` = 0.

  - **Extraer de:** SH-07b.

  - **Escribir en:** Grep raiz del clone web-oficial.

160 [ ] E-10 No fotos de estudiantes en fichas S2.

  - **Extraer de:** S2-04a; F-OLD P10.

  - **Escribir en:** Inspeccionar `Sistema 2/paginas/ficha/pagina-ficha-proyecto.html`.

---

## Anexo | Prompt para la IA de DER / ERD (borrador original de Cursor)

**No copiar ni ejecutar tal cual:** es el insumo original, no una aprobacion de esquema. Aplicar primero la seccion "Revision del DER propuesto" y cerrar DB-00a..DB-00f; los requisitos corregidos del backlog prevalecen sobre contradicciones del prompt original.

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

- Editor: lider asignado que agrega/modifica contenido de su caja sin poder eliminarla ni reasignarla. Docente: codigos propios, invita correos, crea cajas de su alcance, reasigna lideres y puede archivar proyectos autorizados. Admin: ambos sistemas, CMS Inicio, alta de cuentas, reasigna lideres y puede archivar cualquier proyecto.

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

5. miembro_codigo para membresia de editor a codigo; la asignacion de lider a caja es una relacion separada y auditable (no hacer depender la fila del proyecto de ese usuario).

   Justifica si la omites.

6. contenido_inicio (grupo C, UNA fila)

   PK: id smallint default 1 check (id=1)

   Atributos: bloques jsonb not null default '[]', updated_by FK perfiles, updated_at

   Forma de bloques[]: {id, plantilla: banner|texto-imagen-izq|texto-imagen-der|tres-columnas, orden int, textos object, color, imagen (path storage), animacion: ninguna|fade|slide-up|parallax-suave, capas[]}

   SELECT publico (anon). INSERT/UPDATE/DELETE solo administrador.

7. footer_cms (grupo C, UNA fila)

   PK id=1

   Atributos: slogan, telefono, whatsapp, instagram_url, facebook_url, tiktok_url, correo, direccion, copyright_anio, cta_label, cta_href, updated_by, updated_at

   Defaults de documentacion: correo direccion@inti.edu.sv, WhatsApp +503 7441-1075 (principal), alterno +503 6674-3159, IG instagram.com/inti.edu.sv, FB facebook.com/tecnicosinti, TT tiktok.com/@intitecnicos, direccion Col. Roma final Blvd Venezuela San Salvador. No uses +503 7754 5899 como default.

8. proyectos (grupo B)

   PK: id uuid

   Atributos del borrador original; **editor_id NOT NULL queda sustituido por DB-00f**: la caja conserva identidad y creador/autor propios, y la asignacion del lider activo se gestiona por relacion separada; codigo_id segun DB-00a, tipo text check (tecnico|academico), titulo text, cuerpo text, anio int, urls jsonb not null default '{}',

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

- proyectos (politica corregida por DB-00f): lectura publica de cajas no archivadas; Editor activo asignado actualiza solo contenido permitido; docente responsable/admin crea, reasigna o archiva; Editor no puede borrar ni reasignar. No eliminar proyecto al desactivar su Editor.

- contenido_inicio / footer_cms: SELECT anon; WRITE admin

INDICES

- proyectos(codigo_id), relacion de asignacion editor-proyecto (asignado_perfil_id/proyecto_id/estado), invitaciones(email), unique perfiles(id)

- GIN en contenido_inicio.bloques opcional v1

SALIDA QUE DEBES ENTREGAR

1. erDiagram Mermaid con PK y FK nombradas

2. Tabla diccionario: entidad, atributo, tipo, nulo, default, FK, descripcion

3. SQL: tables, indexes, seeds especialidades, semilla-admin-sin-password.sql sin password (solo UPDATE perfiles SET rol donde email=...)

4. SQL: RLS policies completas

5. SQL: trigger handle_new_user

6. Lista de lo que NO modelaste (Oferta estatica, Historia estatica, NIE fuera del SQL hasta cerrar DB-00b, fotos personal pendientes)

7. Como se relacionan los dos GitHub Pages con Auth redirect URLs

Si dudas, elige la opcion mas restrictiva y etiquetala DECISION.

```

## Revision del DER propuesto (GitHub Copilot, 2026-10-12 00:11 UTC-6)

**Evaluacion:** el anexo de Cursor es una buena lista inicial de entidades y funcionalidades, pero no debe usarse tal cual para crear SQL de produccion. Los SQL de S1 y sus copias de S2 siguen vacios, no hay flujo Auth/cliente Supabase conectado desde las paginas activas y el CMS/ficha siguen como stubs. Esta revision complementa el anexo sin borrar ni sustituir el texto de Cursor. No se ejecutaron migraciones.

### Ajustes necesarios antes de aprobar el DER

1. **Relacion persistente editor-codigo.** `miembro_codigo` no debe quedar como opcional mientras Configuracion lista alumnos por codigo y los proyectos de Editor pertenecen a un codigo. La aceptacion de una invitacion debe crear el perfil, insertar su membresia y marcar la invitacion como usada en una misma transaccion. Agregar a `invitaciones_correo` un `usado_por` FK a `auth.users` o `perfiles` (definir una sola referencia canonica); conservar `codigo_id` para editor.

2. **NIE (corregido por decision posterior):** el borrador `nie text` sigue prohibido. La decision vigente DB-00b exige verificacion del NIE con la lista oficial y comparacion con HMAC secreto del servidor; no se ejecuta ni registra NIE plano. `n_lista` requiere RLS que limite su lectura al docente del codigo y al administrador.

3. **Seed del administrador.** El borrador de `perfiles` no incluye `email`, por lo que `UPDATE perfiles ... WHERE email=...` no es ejecutable con esa tabla. No duplicar email sin necesidad: resolver el perfil uniendo `perfiles.id = auth.users.id` y filtrando el email de `auth.users`. Ese uso de email es solo bootstrap, no una politica RLS.

4. **Proyectos academicos.** `proyectos.codigo_id NOT NULL` solo funciona si todo proyecto academico se asigna a un codigo institucional. El material actual no define esa regla ni un codigo de asignatura. Instituto debe elegir: asignar formalmente los academicos a un codigo (p. ej. GE, solo si lo confirma), o modelar `asignaturas/areas_academicas`, hacer `codigo_id` nullable unicamente para tipo academico y definir quien puede editarlos. No asumir una de esas reglas.

5. **RLS y cambio de rol.** RLS limita filas, no columnas. La regla “cada usuario actualiza su perfil” permitiria cambiar tambien `rol` si no se separan privilegios. Limitar columnas actualizables por el usuario (por ejemplo, `tema` y campos de perfil aprobados) y reservar `rol`, membresias e invitaciones a operaciones privilegiadas. Las funciones usadas por politicas no deben crear recursion RLS.

6. **Baja y referencias.** `auth.users ON DELETE CASCADE` puede borrar perfiles referidos por codigos/proyectos o impedir la baja por FK. Definir desactivacion/archivo y las reglas `ON DELETE` antes del SQL. Crear/borrar usuarios con Auth Admin requiere una Edge Function o proceso confiable; nunca exponer `service_role` en Pages.

7. **Contrato de Inicio.** El JSON propuesto (`plantilla`, `orden`, `textos`) no coincide con `plantillas-bloques-inicio.js`, que hoy emite `tipo`, titulo/subtitulo/texto, `orientacion/alineacion`, CTA y enlace. Definir un unico JSON canonico y armonizar JS antes del upsert. Tambien fijar una sola nomenclatura para `textoImagen` frente a `texto-imagen-izq/der`.

8. **Footer editable.** El esquema enumera `whatsapp` singular, pero la interfaz y decisiones requieren WhatsApp principal y alterno. Modelar ambos campos por separado (ademas de telefono publico, si se mantiene) y enlazar `updated_by` con `perfiles`.

9. **Timestamps e indices.** Definir `updated_at` automatico y sus FKs `updated_by`; mantener unicidad para invitaciones/codigos segun ciclo lectivo. Para la busqueda futura del hub, especificar indice de texto solo cuando se cierre el contrato de busqueda y volumen esperado.

10. **Origenes de Auth.** La allowlist de Redirect URLs no comparte por si sola una sesion entre origenes. Confirmar si ambos Pages usaran el mismo hostname; si son origenes distintos, `localStorage` y la sesion Auth quedan aislados y debe definirse el reingreso/autenticacion en cada uno. `perfiles.tema` puede restaurar la preferencia despues de autenticar, pero no transfiere la sesion.

**Correccion posterior (2026-10-12 12:54 UTC-6):** el Instituto confirma que el NIE es unico y debe verificarse en el alta; el login usa correo + contrasena. La recomendacion anterior de excluirlo de v1 queda superada. Verificar con lista oficial y HMAC calculado solo en servidor, sin NIE plano ni hash simple.

### Puertas previas y cambios concretos que rigen las tareas

- **DB-00a [ ] Academico:** Instituto debe identificar las materias/areas academicas que admitiran proyectos y quien podra crearlos, editarlos y eliminarlos. No asumir `GE` ni codigos.
- **DB-00b [x] Identidad de acceso:** validar el NIE contra la lista oficial privada NIE-correo; login por correo + contrasena. Implementar cotejo/unicidad con HMAC secreto de servidor, sin almacenar NIE plano ni exponer la lista.
- **DB-00c [x] Egreso:** al egresar, desactivar cuenta y sesiones sin eliminar cuenta, proyectos, autoria ni cambiar la visibilidad de proyectos. Accion administrativa confiable, no deteccion automatica de Gmail expirado. Nunca borrar en cascada; proteger ultimo administrador activo.
- **DB-00d [ ] Despliegue/Auth:** URL publica GitHub Pages o dominio propio para cada sitio (no URLs de repositorio), y callbacks exactos.
- **DB-00e [x] Contrato CMS:** JSON canonico S1-14a; adaptar y probar las plantillas antes de persistir.
- **DB-00f [x] Caja de proyecto:** identidad/proyecto independiente del Editor asignado; historial auditable de asignaciones; solo docente/admin crean, reasignan o archivan; Editor lider modifica contenido permitido y no borra ni reasigna.

**DB-00c en palabras simples:** cuando un alumno egresa, se le cierra el acceso, pero la cuenta queda registrada y sus proyectos permanecen tal como estaban. Que deje de funcionar su Gmail institucional no debe borrar ni proyectos ni datos.

**Alineacion obligatoria:** `perfiles` referencia `auth.users` por id y no duplica email/password; invitacion aceptada genera una membresia persistente `miembro_codigo`; `proyectos` conserva identidad, creador/autor, codigo (cuando aplique), tipo y estado independientemente de su Editor asignado; la asignacion de lider es separada y auditable. Editor solo modifica contenido permitido; docente/admin reasignan o archivan. Desactivar una cuenta no borra/oculta proyectos. `footer_cms` tiene ambos WhatsApp; perfiles/codigos/invitaciones no son publicos. Operaciones que usan Auth Admin van en backend confiable, nunca en Pages.

### Secuencia de tareas DB actualizada

1. Resolver DB-00a y DB-00d con Instituto; DB-00b/c/e/f tienen decision. Mantener implementacion DB pendiente hasta completar contrato y revisar los borradores.
2. Configurar un solo proyecto Supabase y mecanismo de build/deploy con URL + publishable key, sin versionar secretos ni exponer `service_role`.
3. Crear esquema en SQL S1, revisar migracion y permisos; S2 guarda solo copias de referencia. Aplicar en Supabase una vez cuando Instituto lo solicite.
4. Implementar Auth/invitaciones y transaccion trigger; despues consumo de perfiles/codigos/proyectos/CMS desde clientes.
5. Cerrar RLS y QA de escalamiento, membresias, invitaciones, baja logica, CMS, proyectos tecnicos y academicos antes de marcar DB tasks.

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

### 2026-10-11 16:25 (UTC-6) | Cursor | laptop MINEDUCYT

- [x] Tareas del backlog enumeradas 1 [ ], 2 [ ], ...; debajo se mantienen Extraer de y Escribir en.

---

## Archivo (avances anteriores; no borrar)

### 2026-09-23 ~10:22|10:43 (UTC-6) | laptop Windows (MINEDUCYT)

- [x] Interfaz de Cursor en espanol

### 2026-09-27 ~23:20|23:29 (UTC-6) | laptop Windows (MINEDUCYT)

- [x] Repo GitHub vinculado; prueba `hola.py` (luego eliminada)

### 2026-09-28 a 2026-10-09 | laptop Windows (MINEDUCYT)

- [x] Hamburguesa, sin Visitante-cuenta, Lucide 2.5, Roboto Serif, paleta `.ase`, texto Site, PDF historia retenida, Adobe = referencia final

- [x] Incidente Copilot / `IAs/` documentado
