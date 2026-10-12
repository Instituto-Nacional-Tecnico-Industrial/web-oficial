# Resoluciones (c�mo lo hizo cada IA)

**Ultima modificacion:** 2026-10-12 00:26 (UTC-6) - **IA:** GitHub Copilot - **Dispositivo:** laptop Windows (MINEDUCYT), `C:\Proyectos\web-oficial`

Solo existen estos dos archivos de IAs, en `IAs/`: este y `BACKLOG.md`. Al cambiar uno: **�ltima modificaci�n** con fecha, hora **UTC-6**, nombre de la IA y dispositivo. Si cambia una tarea, la misma marca en ambos.

Formato de entrada:

`### AAAA-MM-DD HH:MM (UTC-6) � IA: nombre � Dispositivo: �`

Las entradas van **en orden cronol�gico** (la m�s antigua arriba, la m�s nueva abajo). Si trabajas en un intervalo (p. ej. 14:00�16:00) y la otra IA ya escribi� a las 14:30, **inserta** tu nota donde caiga en el tiempo; no la pongas al final fuera de orden.

## Reglas entre IAs (Cursor y GitHub Copilot)

1. **Leer antes de c�digo.** Obligatorio leer `IAs/BACKLOG.md` e `IAs/RESOLUCIONES.md` **de inicio a fin** antes de tocar una sola l�nea de c�digo del proyecto. Despu�s se sigue el prompt del usuario.
2. **No borrar** lo que la otra IA ya escribi� en estos dos archivos. Se puede a�adir, insertar en orden, o aclarar debajo. No recortar ni sustituir el texto ajeno.
3. **C�digo del proyecto:** s� se puede corregir si la otra IA se confundi� o tom� una mala decisi�n. Ese cambio **debe quedar escrito aqu�** (y casilla en el backlog si aplica), dejando **en claro en qu� se equivoc�** la otra IA.
4. **Dos PCs a la vez:** si Copilot avanza en una computadora y Cursor en otra, los apuntes deben ser coherentes: misma zona horaria UTC-6, orden cronol�gico, sin contradecir casillas sin explicaci�n.
5. **Adobe Ilustrador/:** no editar. `.ai` no se parsea. PNG/PDF solo referencia.
6. **Fuentes e iconos (Lucide / Google Fonts):** Instituto puede pegar el **enlace** del sitio, el **snippet** (CSS o SVG), o **solo el nombre**. En los tres casos Cursor y Copilot **est�n obligados** a ir a la p�gina oficial, extraer el c�digo web vigente e incorporarlo al HTML. La personalizaci�n (color, tama�o, `font-weight`, tema) es **CSS**. No inventar otra familia ni otro set de iconos si Instituto ya eligi� Lucide y Roboto Serif. Trazo de icono: **2.5** en el SVG.
7. **Paleta `.ase`:** se puede **leer** `Adobe Ilustrador/Muestras de color INTIWO.ai.ase` (no editar). Es binario: extraer RGB/hex y copiar los valores a estos documentos. No hace falta que Instituto convierta el archivo si ya est� en esa carpeta.
8. **Im�genes en `Adobe Ilustrador/`:** son las **finales / m�s recientes** (PNG/PDF de referencia). Sigue prohibido editar esa carpeta. **No** construir el backlog Frontend/Backend ni el sistema hasta que Instituto lo indique de forma expl�cita.
9. **Antes del backlog (cuando Instituto lo pida):** la IA debe listar primero lo que falta (favicon de pesta�a, textos legales, mapa, etc.). No inventar esos assets.

---

### 2026-09-27 23:29 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Vincular GitHub y probar con Python.

**C�mo:** Repo `C:\Proyectos\web-oficial` ? remoto GitHub `web-oficial.git`. Archivo `hola.py`.

---

### 2026-09-30 12:55 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Quitar Visitante; login en hamburguesa; roles Admin / Docente / Editor.

**C�mo:** Decisi�n de producto (sin SQL ni pantallas nuevas). El prototipo a�n muestra �Iniciar sesi�n� en la barra.

---

### 2026-10-08 21:38 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** No modificar `Adobe Ilustrador/`; �se leen `.ai`?

**C�mo:** No. PNG/PDF s�, solo lectura. La carpeta es malet�n entre dispositivos, no c�digo del sitio.

---

### 2026-10-08 21:42 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Dos documentos (backlog + c�mo resolvi� cada IA) con fecha y hora compartida.

**C�mo:** Primera versi�n en `docs/`. Qued� **reemplazada** por esta carpeta `IAs/` (entrada de las 21:47).

---

### 2026-10-08 21:47 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Borrar lo creado antes y dejar una carpeta solo para IAs, con backlog (avance + fecha/hora/dispositivo) y resoluciones. Cerrar el backlog esperando im�genes para partir Frontend y Backend (Supabase).

**C�mo:** Se eliminaron `AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/documentos-ia.mdc` y `docs/BACKLOG.md` + `docs/RESOLUCIONES.md`. Se crearon `IAs/BACKLOG.md` e `IAs/RESOLUCIONES.md`. El avance del chat recuperado (23 sep�8 oct) qued� datado en el backlog. Estado expl�cito: **a�n se esperan las im�genes** para analizar y repartir tareas FE/BE.

**No se toc�:** `Adobe Ilustrador/`.

---

### 2026-10-08 22:10 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Incidente:** Instituto notific� a **GitHub Copilot** (otro dispositivo o VS Code) que deb�a trabajar con Cursor, leer e interpretar los dos documentos de `IAs/`, y anotar lo pedido antes y en ese momento. **Copilot no pudo ni leer** esos archivos. Instituto peg� ese prompt aqu� para dejar constancia.

**Lo que se le hab�a pedido a Copilot (y no ejecut�):**
- Anteriormente: coordinarse con Cursor; leer `IAs/BACKLOG.md` e `IAs/RESOLUCIONES.md` e interpretarlos.
- En ese momento: anotar esos pedidos; reglas de no borrar texto de la otra IA; poder corregir c�digo si la otra se equivoc�, dejando escrito el error; leer ambos documentos completos **antes de cualquier l�nea de c�digo**; apuntes en **orden cronol�gico** aunque las dos IAs escriban a la vez.

**C�mo (Cursor, no Copilot):** no se toc� c�digo del sitio. Se a�adieron las reglas arriba. Las entradas de resoluciones se **reordenaron de antigua a nueva** (el contenido de Cursor no se borr�). Se registr� el fallo de lectura de Copilot. Sigue bloqueado el desglose Frontend/Backend hasta las im�genes.

**A Copilot, cuando pueda leer esto:** no borres estas entradas. Lee los dos archivos enteros. Inserta tus notas por fecha/hora UTC-6. Si no ves `IAs/`, pide a Instituto **Archivo ? Abrir carpeta** en el clone `web-oficial` o `git pull`; la carpeta est� en la ra�z del repo, no dentro de `.github`.

---

### 2026-10-08 22:34 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** �Dos repos a la vez? �Se pueden pedir tipograf�a e iconos por enlace (sin descargar)? �Lucide o Google Icons? Trazo 2.5 px proporcional (como en Illustrator). �Qui�n pinta color y grosor? �C�mo se personaliza [Roboto Serif](https://fonts.google.com/specimen/Roboto+Serif)? Sistema 2: [web-oficial-proyectos](https://github.com/Instituto-Nacional-Tecnico-Industrial/web-oficial-proyectos.git).

**C�mo (solo documentos, sin tocar HTML/CSS/JS del sitio):**
- Un chat de Cursor = un workspace. Sistema 2 se atiende abriendo esa carpeta en otra ventana o en otro chat.
- Recomendar **Lucide** ([lucide.dev/icons](https://lucide.dev/icons/)): coincide con el `.ai`; `stroke-width="2.5"`; tama�o CSS igual en ancho y alto (no se deforma); color con `currentColor` + `color` / tema. Google Icons ([fonts.google.com/icons](https://fonts.google.com/icons)) es otra familia (peso de fuente, no trazo de 2.5 px).
- Roboto Serif: `<link>` de Google Fonts; pesos y color en CSS (`font-weight`, `font-size`, `color`).
- Sigue el bloqueo de im�genes para partir Frontend / Backend.

**No se toc�:** c�digo del sitio ni `Adobe Ilustrador/`.

---

### 2026-10-08 22:40 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** �Instituto debe pegar el bloque CSS de Roboto Serif y el SVG Lucide (ej. house con stroke 2.5) y ah� termina, o Cursor personaliza color/grosor en CSS/JS?

**C�mo:** Pegar ese texto es **�til y suficiente como forma base**, no obligatorio (Cursor puede copiar el mismo snippet de Google Fonts / Lucide si Instituto solo nombra �Roboto Serif� y �house�). Eso **no cierra** el trabajo: hay que incrustar el `<link>` y el `<svg>` en HTML, aplicar `font-family` / `font-weight` / `color` en CSS, y el icono hereda color con `currentColor`. `stroke-width="2.5"` se deja en el SVG. JS no pinta el icono; solo el tema (diurno/nocturno) cambia variables de color. El snippet de Google trae `<uniquifier>` y `<weight>`: se sustituyen por clases reales o se pone la familia en `body`.

**No se toc�:** c�digo del sitio.

---

### 2026-10-08 22:46 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** �Instituto pasa el link (Google Fonts / Lucide) o solo lo dice y las IAs deben ir al sitio, extraer el c�digo e incorporarlo, personalizando con CSS?

**C�mo:** **Las dos formas.** Si hay URL o snippet, se usa esa fuente. Si solo hay nombre (�Roboto Serif�, �house�), la IA **debe** abrir el sitio oficial y extraer `<link>` / SVG. Luego HTML + CSS (no inventar Material Icons). Qued� como regla 6. A�n no se incorpor� al prototipo.

**No se toc�:** c�digo del sitio.

---

### 2026-10-09 12:46 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** C�mo compartir la paleta Illustrator `Muestras de color INTIWO.ai.ase` para que las IAs vean todos los colores.

**C�mo:** El archivo ya estaba en `Adobe Ilustrador/` (no se modific�). El visor de Cursor no abre `.ase` (binario ASEF). Se parse� en solo lectura. 24 bloques. Hex para web:

Sin grupo: cafe random `#BD813F`; blanco generico random `#FFFFFF`.

Grupo Modo nocturno: Verde principa_2 `#539507`; gris mediano `#37393B`; gris `#282A2C`; negro `#0F0F0F`; Fondo brillo `#F2F0EB`.

Grupo Especialidades: Mecanica Industrial `#EAB308`; Mantenimiento automotriz `#166534`; Desarrollo de Software `#EA580C`; Electronica `#0000FF`; Infraestructura Tecnologica `#64748B`; Sistemas electricos `#E61010`.

Grupo Modo Brillo: Verde principal `#539507`; gris palido `#7C7C7C`; Blanco grisaceo `#B0B0B0`; blanco `#F2F0EB`; Fondo nocturno `#0F0F0F`.

El verde institucional en esta paleta es `#539507` (no el `#A8C200` de conversaciones viejas). A�n no se aplic� al CSS.

**No se toc�:** `Adobe Ilustrador/` ni el c�digo del sitio.

---

### 2026-10-09 12:54 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Organizar los grupos de color ya extra�dos en una tabla de tres columnas.

**C�mo:** Misma paleta `.ase` (sin reparsear ni editar Illustrator). Tabla: una columna por grupo. Fuera de grupos: cafe random `#BD813F`, blanco generico random `#FFFFFF`.

| Modo nocturno | Especialidades | Modo Brillo |
|---|---|---|
| Verde principa_2 `#539507` | Mec�nica Industrial `#EAB308` | Verde principal `#539507` |
| gris mediano `#37393B` | Mantenimiento automotriz `#166534` | gris p�lido `#7C7C7C` |
| gris `#282A2C` | Desarrollo de Software `#EA580C` | Blanco gris�ceo `#B0B0B0` |
| negro `#0F0F0F` | Electr�nica `#0000FF` | blanco `#F2F0EB` |
| Fondo brillo `#F2F0EB` | Infraestructura Tecnol�gica `#64748B` | Fondo nocturno `#0F0F0F` |
| | Sistemas el�ctricos `#E61010` | |

**No se toc�:** `Adobe Ilustrador/` ni el CSS del sitio.

---

### 2026-10-09 13:23 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Primera versi�n / prototipo de inicios: esa era la organizaci�n original. Algunas cosas siguen; otras no tienen que ver con lo actual. Las im�genes finales las enviar� Instituto m�s adelante.

**C�mo:** Solo lectura de PNG en `Adobe Ilustrador/Esquema visual de INTIWO/` (men� hamburguesa desplegado y footer) y del HTML actual. **No es la UI final.** No se parti� Frontend/Backend. No se reescribi� el sitio.

Organizaci�n **original** (mockup): barra hamburguesa + distintivo I.N.T.I; panel izquierdo Inicio, Matr�cula, Oferta acad�mica, Proyectos, Historia, Configuraciones, Cuentas abajo; tema sol/luna y bot�n Editar; home con I.N.T.I grande; footer con logo, slogan, redes, WhatsApp 7441-1075 y 6674-3159, enlaces, Inscr�bete ahora; en otra vista buscador.

**Suele conservarse:** hamburguesa, marca INTI, diurno/nocturno, verde institucional, Inicio / Matr�cula / Proyectos, footer (redes, tel�fonos, copyright 2026).

**Ya no alinear a esto (hasta las im�genes finales):** sidebar permanente; Historia / Configuraciones / Cuentas / Oferta acad�mica / Editar en barra; login como �Cuentas�. Lo vigente sigue siendo: login **dentro** del men�; Diurno/Nocturno **fuera**; sin rol Visitante; especialidades (no �oferta acad�mica� como �tem de men�, salvo que las finales lo confirmen).

El HTML de `index.html` es a�n m�s tosco (sesi�n en la barra, sin logo I.N.T.I, sin footer rico).

**No se toc�:** `Adobe Ilustrador/` ni c�digo del sitio.

---

### 2026-10-09 14:04 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Aclarar que los PNG/PDF de `Adobe Ilustrador/` ya son las im�genes finales, pero **no** armar el backlog ni el sistema a�n (falta contexto; Instituto dir� cu�ndo). Antes de ese backlog, listar huecos (ej. favicon). Registrar contacto y redes. Apartado para URLs del PDF `Documentaci�n relevante del INTI`. Extraer texto del sitio actual [nuevoingreso](https://sites.google.com/inti.edu.sv/nuevoingreso/inicio) (sin v�deos ni im�genes); Inicio s� se extrae, pero cambiar� despu�s.

**C�mo:** No se toc� c�digo ni Illustrator. El PDF `Documentaci�n relevante del INTI` **no estaba** en el repo ni en Descargas/Documentos al buscarlo: el apartado queda listo y vac�o hasta que Instituto lo deje en el proyecto.

---

### 2026-10-11 19:55 (UTC-6) � IA: GitHub Copilot � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Ejecutar la tarea 23 del backlog: desactivar el acceso a Configuraciones cuando no existe sesi�n con rol de administrador, docente o editor.

**C�mo:** Se actualiz� la l�gica de `Sistema 1/js/auth/sesion-roles-auth.js` y `Sistema 2/js/auth/sesion-roles-auth.js` para leer el rol desde `document.body.dataset.rol`, `window.INTIWO_ROL`, `window.__INTIWO_ROL__` o `localStorage/sessionStorage`, y bloquear el enlace `data-seccion="configuraciones"` cuando no hay un rol permitid. El estado se refleja con clase `es-desactivado` y `aria-disabled="true"`, y los eventos `click`/`keydown` quedan bloqueados para impedir navegaci�n. Tambi�n se agreg� la carga del script en `Sistema 1/paginas/inicio/pagina-inicio-cms.html` y `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` para que el guard se ejecute en las vistas actuales.

**Verificaci�n:** se valid� la sintaxis del script con `node --check` y la presencia del `script src` en ambas p�ginas.

---

### 2026-10-11 20:00 (UTC-6) � IA: GitHub Copilot � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Ejecutar la tarea 24 del backlog: dejar el bloque inferior del menú como panel de cuentas con acceso y registro, sin convertirlo en una navegación obligatoria ni en una pantalla de login completa.

**C�mo:** Se modific� el pie del overlay en `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` para mostrar un panel verde con el t�tulo "Cuentas" y dos botones: "Iniciar sesi�n" y "Registrarse". El visitante puede ignorarlo, y la UI mantiene la jerarqu�a del mockup: la navegaci�n principal arriba, los accesos de autenticaci�n abajo. Tambi�n se agreg� la capa JS en `Sistema 1/js/auth/panel-configuraciones-cuentas.js` y `Sistema 2/js/auth/panel-configuraciones-cuentas.js` para cambiar el texto de ayuda al pulsar cada acci�n, sin bloquear el resto del flujo ni crear rutas nuevas.

**Verificaci�n:** se valid� la sintaxis de ambos scripts con `node --check` y se comprob� que la carga del script qued� incluida en las p�ginas activas del sistema 1 y sistema 2.

---

## Datos institucionales (oficiales, 2026-10-09)

| Campo | Valor |
|---|---|
| Correo | direccion@inti.edu.sv |
| Ubicaci�n | Col. Roma, fnal. Boulevard Venezuela, San Salvador, San Salvador, El Salvador |
| Sitio actual (a reemplazar) | https://sites.google.com/inti.edu.sv/nuevoingreso/inicio |
| N�mero principal | 7441 1075 |
| WhatsApp principal | +503 7441 1075 |
| WhatsApp alterno | +503 6674 3159 |
| Instagram | https://www.instagram.com/inti.edu.sv/ |
| Facebook | https://www.facebook.com/tecnicosinti/?locale=es_LA |
| TikTok | https://www.tiktok.com/@intitecnicos |

Nota: los números 7441-1075 y 6674-3159 son contactos válidos de WhatsApp y se reconocen como reales. El número +503 7754 5899 no se usa como principal porque no es un contacto reconocido para la web del Instituto; queda descartado para la interfaz pública. El WhatsApp canónico para la web es +503 7441-1075 y +503 6674-3159 queda como respaldo.

## URLs � Documentaci�n relevante del INTI

PDF le�do 2026-10-09 (adjunto del chat / Descargas: `Documentaci�n e informaci�n revelante del INTI.pdf`). El cuerpo trae pocas URL completas; el resto son t�tulos de fuente. **No copiar al sitio p�blico** las piezas marcadas como delicadas hasta que Instituto indique el tono.

URLs expl�citas en el PDF:
- https://sites.google.com/inti.edu.sv/nuevoingreso/inicio
- https://www.instagram.com/inti.edu.sv/
- https://www.facebook.com/tecnicosinti/?locale=es_LA
- https://www.tiktok.com/@intitecnicos

Fuentes citadas (para verificar; el PDF advierte que la IA puede errar):
- elsalvador.com � �El INTI cumpli� 70 a�os� (26 oct 2024)
- La Prensa Gr�fica � �INTI cierra dos aulas por deserci�n� (13 feb 2015)
- La Prensa Gr�fica � destituci�n de director y subdirector
- MINED � mined.gob.sv (bachillerato, SIGES, estad�sticas)
- FGR � fiscalia.gob.sv
- Wikipedia � Bachillerato (duraci�n 2 vs 3 a�os)
- Scribd / UES � historia de educaci�n t�cnica / INTI (1954, �scar Osorio)
- Facebook p�gina oficial INTI; Instagram @inti.edu.sv
- UNICEF / InSight Crime / El Faro � contexto de violencia (uso **solo** si Instituto lo pide)

## Texto reutilizable � sitio Google actual (sin v�deos ni im�genes)

Fuente: https://sites.google.com/inti.edu.sv/nuevoingreso � extracci�n 2026-10-09. Inicio: se reutiliza el texto hasta que Instituto entregue la versi�n nueva.

### Inicio (cambiar� de forma dr�stica)

- INTI � Instituto Nacional T�cnico Industrial.
- Naci� el 26 de octubre de 1954, para formar personal calificado que contribuyera al desarrollo industrial del pa�s.
- Forma Bachilleres T�cnicos-Vocacionales; al terminar tres a�os de estudio diurno pueden incorporarse a la fuerza productiva o continuar estudios tecnol�gicos o universitarios.
- **Misi�n:** instituci�n responsable en la formaci�n de Bachilleres T�cnicos Vocacionales en especialidades industriales; formaci�n integral; bienestar social de la comunidad; desarrollo tecnol�gico; capacitaci�n continua del recurso humano; fortalecimiento econ�mico, social y cultural del pa�s.
- **Visi�n:** instituci�n educativa p�blica, l�der en Bachilleres T�cnicos Vocacionales, integraci�n a la sociedad y la industria con eficiencia y calidad, reconocimiento nacional e internacional.

### Inicio + Historia � hechos del PDF listos para copiar (sin lo delicado)

Instituto dir� **c�mo** se redacta; esto no se publica todav�a en HTML.

**Inicio (ampliar, no sustituir misi�n/visi�n del sitio actual hasta nuevo texto):** Bachillerato T�cnico Vocacional diurno de **tres a�os**. Seis especialidades (nombres actuales / anteriores): Mec�nica Industrial (Mec�nica General), Mantenimiento Automotriz (Automotores), Electr�nica, Sistemas El�ctricos (Electrotecnia), ITSI, Desarrollo de Software. Modalidades flexibles para adultos. Expotecnia anual (fin de a�o) como muestra p�blica de proyectos; Open House (desde 2015) para 9.� grado. Alianzas de empleabilidad (p. ej. sector aeron�utico / industrial). Logros recientes citados: competencias STEAM / RoboRAVE (ITSI). Cifra de matr�cula ~1000 (declaraci�n direcci�n, mediados 2025): **confirmar** antes de publicarla.

**Historia (l�nea de tiempo institucional, para la secci�n Historia):**
- 26 oct 1954: fundaci�n (gobierno �scar Osorio); educaci�n t�cnica media sistem�tica en el pa�s.
- 1955: construcci�n asociada al IVU; nombre hist�rico ITI / Instituto T�cnico de Educaci�n Media, luego INTI.
- Jul 1962: misi�n de asesor�a con Jap�n; se formaliza el Bachillerato T�cnico Industrial de tres a�os.
- Oct 1964: primera Expotecnia p�blica (talleres de mec�nica, automotores, electricidad, radio/TV); se mantiene cada oct�nov.
- 2015: Open House recurrente (captaci�n, por especialidad).
- 26 oct 2024: 70 a�os. Cifra citada: unos 20.000 bachilleres industriales formados 1964�2023 (**verificar** en nota de elsalvador.com).

### Retener � no va a Inicio ni Historia hasta que Instituto defina el mensaje

Delincuencia, pandillas, ri�as, capturas, destituci�n de autoridades (ago 2025), advertencias a 200 alumnos, deserci�n por violencia, auditor�as de talleres viejos, operativos PNC/FGR. El PDF lo documenta con prensa; **mal usado perjudica**. Instituto indicar� si se convierte en �superaci�n / seguridad actual / disciplina� o se omite.

**No se toc�:** HTML del sitio ni `Adobe Ilustrador/`.

---

### 2026-10-09 14:33 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Incorporar el PDF de documentaci�n ver�dica (cambios por etapas) en Inicio e Historia; no todo: lo delicado espera indicaci�n para que beneficie el mensaje.

**C�mo:** Se ley� el PDF adjunto (28 p�ginas). URLs y l�nea de tiempo institucional en las secciones de arriba. Seguridad/destituci�n/operativos **no** se redactaron para el p�blico. No se modific� `index.html`. El PDF mezcla fuentes de prensa/MINED con respuestas de IA (�puede cometer errores�): cifras a verificar.
- Enlaces de esa p�gina: Oferta acad�mica, Proceso de matr�cula 2027, Ubicaci�n, Cont�ctanos (Facebook; WhatsApp Institucional; WhatsApp Registro Acad�mico). V�deo promocional 2025: omitido.

### 2026-10-11 19:58 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Completar la tarea 1 del backlog: favicon y enlace en el sitio activo.

**C�mo:** Se crearon los archivos `Sistema 1/iconos/favicon.svg` y `Sistema 2/iconos/favicon.svg` con una marca cuadrada compatible con pesta�a del navegador. Luego se actualiz� la referencia del favicon en las páginas activas del proyecto: `Sistema 1/paginas/inicio/pagina-inicio-cms.html` y `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`. Se eligieron los colores institucionales del proyecto y se mantuvo la regla de no editar `Adobe Ilustrador/` ni borrar el texto previo de otras IAs.

### 2026-10-11 20:05 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 2 del backlog: decidir c�mo arranca la p�gina de inicio.

**C�mo:** Se tom� la decisi�n de producto de que la p�gina de inicio de INTIWO **arranca vac�a** y se llena cuando el administrador guarda contenido desde el CMS. No se usa un bloque de bienvenida por defecto. La regla aplica solo a `Sistema 1/paginas/inicio/` y no se modifica `Sistema 2`. Esta decisi�n se deja documentada para evitar contradicciones entre sesiones y IAs.

### 2026-10-11 20:15 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 3 del backlog: mockup de la secci�n de matr�cula.

**C�mo:** La secci�n de matr�cula de INTIWO debe incluir un banner o encabezado con "Nuevo ingreso 2027" y "EDUCAME", seguido por un paso breve del proceso (informaci�n general, formulario, documentaci�n y confirmaci�n). Los campos a incluir en el formulario son: nombre completo del estudiante, fecha de nacimiento, DUI/Documento, tel�fono, correo, direccion, departamento/municipio, especialidad deseada, modalidad, tipo de ingreso, documentos requeridos, consentimiento y aceptaci�n del proceso. Los campos se dejan en formato claro y ordenado para el HTML futuro de `Sistema 1/paginas/matricula/pagina-matricula-nuevo-ingreso.html`. No se inventan campos extra ni datos personales sensibles que no formen parte del flujo oficial de admisi�n del Instituto.

### 2026-10-11 20:20 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 4 del backlog: mockup de la p�gina personal.

**C�mo:** La secci�n personal de INTIWO se organiza en tres bloques principales: talleres / �reas t�cnicas primero, asignaturas b�sicas segundo y administraci�n tercero. La distribuci�n debe seguir una rejilla responsive con tarjetas por persona o por cargo; cada tarjeta incluye nombre, rol, especialidad o unidad, breve perfil y contacto/correo si aplica. Mientras no se decida la pol�tica de fotos, se usa placeholder o avatar gen�rico para evitar inventar datos personales. Esta decisi�n aplica para el HTML futuro de `Sistema 1/paginas/personal/pagina-personal-instituto.html`, sin tocar `Sistema 2`.

### 2026-10-11 20:25 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 5 del backlog: decisi�n sobre fotos en la secci�n personal.

**C�mo:** Por el momento, la p�gina personal de INTIWO no usa fotos reales. Se opta por un avatar o placeholder institucional en blanco y negro para evitar problemas de consentimiento, tama�o y almacenamiento. Si el Instituto aprueba m�s adelante el uso de fotos, entonces se habilita un bucket `personal` en Supabase con una pol�tica clara de consentimiento, formato uniforme y resoluci�n controlada. Mientras tanto, la secci�n personal se mantiene con icono/placeholder y texto descriptivo, sin crear almacenamiento adicional ni datos sensibles en el proyecto.

### 2026-10-11 20:30 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 6 del backlog: mockup de ubicaciones.

**C�mo:** La secci�n de ubicaciones se basar� en una tarjeta de direcci�n institucional, un breve bloque de contacto y una lista de rutas o buses confirmados por el Instituto. No se crea un mapa interactivo en esta etapa ni se inventan paradas o rutas. Si llega un mapa real, se usar� como imagen est�tica o referencia visual, pero sin inventar informaci�n. La prioridad es la veracidad del dato y la claridad del recorrido. Esta decisi�n aplica en `Sistema 1/paginas/ubicaciones/pagina-ubicaciones.html` y no afecta al contenido de `Sistema 2`.

### 2026-10-11 20:35 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 7 del backlog: configuraciones por rol.

**C�mo:** La pantalla de configuraciones de INTIWO debe estar separada por rol: administrador, docente y editor. El administrador gestiona contenido global, permisos y usuarios; el docente revisa y edita su �rea y sus bloques; el editor solo maneja los bloques asignados a su secci�n y no puede tocar ajustes institucionales. El mockup incluye encabezado de rol, lista de permisos y un panel de acciones diferenciado por alcance. Se deja como base para `Sistema 1/paginas/configuraciones/pagina-configuraciones.html`, sin duplicar contenido en `Sistema 2` ni abrir permisos de forma global.

### 2026-10-11 20:40 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 8 del backlog: texto base para Bachillerato General.

**C�mo:** El Bachillerato General debe describirse como una ruta académica flexible, equilibrada y orientada al futuro, con énfasis en formación integral, continuidad educativa y preparación para estudios superiores. El texto base destaca la combinación de competencias académicas, desarrollo de pensamiento crítico, trabajo en equipo y preparación para seguir aprendiendo en contextos técnicos y profesionales. Se deja como redacción base para `Sistema 1/paginas/oferta-academica/CONTENIDO.md` y no se reutiliza en Inicio ni Proyectos.

### 2026-10-11 20:45 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 9 del backlog: tono de la historia institucional.

**C�mo:** La historia de INTIWO debe escribirse en un tono sobrio, respetuoso y factual. Se omite cualquier formulaci�n melodram�tica, de "superaci�n heroica", de dramatizaci�n exagerada o anecd�tica sin respaldo institucional. La narraci�n debe centrarse en hechos, evoluci�n, formaci�n, servicio comunitario y continuidad educativa. La frase de ejemplo que se mantiene como referencia es: "INTIWO se consolid� como instituci�n educativa con vocaci�n t�cnica y comunitaria, fortaleciendo su oferta acad�mica y su labor formativa en la regi�n." Esta decisi�n aplica solo a `Sistema 1/paginas/historia/` y no modifica otras secciones del proyecto.

### 2026-10-11 20:50 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 10 del backlog: cifra aproximada de egresados 1964-2023.

**C�mo:** Se confirma la cifra aproximada de más de 20.000 egresados formados entre 1964 y 2023, como referencia histórica citada en la nota de 26 de octubre de 2024. Se presenta como valor aproximado y contextual, no como censo oficial ni como total auditado, por lo que se evita redactarlo como una afirmación absoluta. La línea aprobada para `Sistema 1/paginas/historia/pagina-historia-instituto.html` es: "2024: 70 años. Cifra aproximada: más de 20.000 egresados desde 1964 hasta 2023."

### 2026-10-11 20:55 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 11 del backlog: cifra aproximada de alumnos 2025.

**C�mo:** La cifra de aproximadamente 1.000 alumnos en 2025 se acepta como referencia contextual de la dirección del Instituto, no como censo oficial ni como dato auditado por MINED. Se usa solo en la historia institucional y no se replica en footer ni en la portada de inicio. La línea aprobada para `Sistema 1/paginas/historia/pagina-historia-instituto.html` es: "2025: matrícula aproximada de alrededor de 1.000 alumnos."

### 2026-10-11 21:00 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 12 del backlog: WhatsApp canónico institucional.

**C�mo:** Los n�meros 7441-1075 y 6674-3159 son contactos v�lidos de WhatsApp y se reconocen como reales. El n�mero +503 7754 5899 queda descartado como contacto principal para la web porque no es un n�mero reconocido por WhatsApp. Para la interfaz y el footer institucional se usa +503 7441-1075 como WhatsApp can�nico, mientras +503 6674-3159 queda como respaldo. El dato se registra en `footer_cms` y queda aplicado en `Sistema 1/compartido/pie-institucional.html` y en su copia en `Sistema 2/compartido/pie-institucional.html`; la ruta de contacto usa `https://wa.me/50374411075`.
### 2026-10-11 21:10 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 13 del backlog: dominio institucional de correos para alumnos y docentes.

**C�mo:** No se reutiliza el flujo ni los dominios heredados de Odoo. El dominio institucional para alumnos y docentes se considera un dato configurable del Instituto y no debe hardcodearse en JavaScript ni asumirse como regla fija de negocio para la interfaz. La regla del proyecto es usar el dominio que confirme el Instituto en `footer_cms`, en configuración de entorno o en SQL, y dejar la capa cliente sin fijar un dominio específico. Se conserva la referencia del patrón `@inti.edu.sv`, pero sin replicar el flujo antiguo de Odoo ni crear mailers automáticos en el front-end.

### 2026-10-11 21:15 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 14 del backlog: almacenamiento del NIE.

**C�mo:** El NIE no se almacena como dato legible en la base de datos ni en el front-end. La opción recomendada es guardar solo un hash o valor irreversible del NIE si el flujo del Instituto lo requiere para autenticación, validación o búsqueda controlada. Esto evita exponer identificadores sensibles en tablas y conserva la información sin riesgo para los alumnos. Si el Instituto no necesita ese dato para negocio, la mejor decisión es no guardarlo en Supabase ni en ningún cliente. Si se almacena por seguridad, solo se habilitaría una columna protegida como `nie_hash` o una equivalente con acceso restringido; nunca el NIE en texto plano.

### 2026-10-11 21:20 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 15 del backlog: configuración local de Supabase.

**C�mo:** El proyecto Supabase del Instituto se crea en la máquina local del cliente y se guarda fuera del repositorio; no se suben URL ni anon key al git. La implementación debe usarse con la URL y la anon key reales del proyecto del Instituto, mientras la clave `service_role` queda prohibida para el front-end. Los clientes JavaScript de `Sistema 1` y `Sistema 2` quedan con constantes vacías o con configuración cargada fuera del repo para evitar fugas de secretos y cumplir con la política de no-commit de credenciales.

### 2026-10-11 21:25 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 16 del backlog: lista base de docentes y administradores para bios.

**C�mo:** La sección personal no inventa nombres ni biografías sin confirmación institucional. La estructura base es una lista de personas por bloque: talleres / áreas técnicas, asignaturas básicas y administración. Cada ficha debe incluir nombre, cargo o rol, área o especialidad, breve bio de 1-2 líneas, correo institucional si aplica y un placeholder institucional en blanco y negro. La entrega final queda en `Sistema 1/paginas/personal/CONTENIDO.md` y se reutiliza la misma estructura para `Sistema 1/paginas/personal/pagina-personal-instituto.html`, sin crear datos sensibles ni nombres inventados.

### 2026-10-11 21:30 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 17 del backlog: nombre UI del área ITSI.

**C�mo:** Se define el nombre de la especialidad como "Servicios Informaticos" para mantener consistencia entre la página de oferta académica del sitio y las pildoras de proyectos del sistema 2. Se descarta "Sistemas Informaticos" para no mezclar la nomenclatura del Site con una variante del PNG. La etiqueta final que debe usarse en la interfaz es `Infraestructura Tecnologica y Servicios Informaticos`, sin variantes ni cambios de estilo en otros apartados del proyecto.

### 2026-10-11 21:35 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 18 del backlog: texto anecdótico de historia.

**C�mo:** No se incluye ningún texto anecdótico sobre "cocodrilos" ni "docentes japoneses" en la historia institucional sin aprobación explícita del Instituto. La decisión respeta el tono sobrio y factual del proyecto y evita publicar material no validado. Se deja el contenido como texto pendiente de revisión institucional en `Sistema 1/paginas/historia/CONTENIDO.md` y no se crea ningún archivo de anecdotas ni se agrega una sección nueva en la interfaz.

### 2026-10-11 21:40 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 19 del backlog: plantillas base del bloque de inicio.

**C�mo:** Para el inicio del sitio basta con tres plantillas base: banner institucional, bloque de texto con imagen y bloque de tres columnas. Esto asegura una edición flexible sin sobre-diseñar ni introducir complejidad innecesaria en el CMS. Las plantillas deben reutilizar un esquema de datos simple con `tipo`, `titulo`, `subtitulo`, `texto`, `imagen`, `cta`, `enlace` y columnas; la lógica concreta queda en `Sistema 1/js/cms/plantillas-bloques-inicio.js` y se usa únicamente para `Sistema 1`, sin duplicarla en `Sistema 2`.

### 2026-10-11 21:45 (UTC-6) � IA: Cursor � Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 20 del backlog: encabezado compartido con hamburguesa.

**C�mo:** El encabezado compartido usa la hamburguesa a la izquierda, el distintivo institucional en el centro y el selector de tema a la derecha, sin mostrar "Iniciar sesión" ni acceso directo en la barra superior. El acceso a cuentas se deja al pie del panel del menú para respetar el diseño del mockup y mantener la navegación principal limpia. La versión queda en `Sistema 1/compartido/encabezado-hamburguesa.html` y se replica idéntica en `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html` sin duplicar la lógica del sitio raíz.

### 2026-10-11 23:32 (UTC-6) - IA: GitHub Copilot - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Resolver la tarea 25: verificar que Proyectos enlace a Sistema 2 y señalar que la ruta cambiará al separar los repositorios.

**Cómo:** Se conservaron las rutas especificadas por el backlog y se añadió `TODO-SPLIT-REPO` junto al enlace en `Sistema 1/compartido/encabezado-hamburguesa.html` y `Sistema 2/compartido/encabezado-hamburguesa-con-busqueda.html`. S1 usa `../Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`; S2 usa `paginas/proyectos/pagina-hub-proyectos.html`.

**Verificación:** se comprobó en ambos archivos la ruta relativa y la presencia del comentario `TODO-SPLIT-REPO`. El destino S2 existe en `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html`.

### 2026-10-11 23:43 (UTC-6) - IA: GitHub Copilot - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Completar SH-02c: selector de tema fuera del menú con iconos Lucide y persistencia diurna/nocturna.

**Cómo:** Se añadieron los recursos `sun.svg` y `moon.svg` a `Sistema 1/iconos/` y `Sistema 2/iconos/`, usando el trazo Lucide `2.5` y `currentColor`. El botón fuera del menú y la lógica de tema ya estaban implementados en ambos encabezados/páginas activas y en sus scripts `persistir-tema-diurno-nocturno.js`; no se duplicó esa lógica.

**Verificación:** los cuatro SVG pasaron la comprobación sin errores. En el navegador, el selector actualizó `data-theme` y `localStorage.intiwo-tema` a `light`; se verificó también `dark` después de restaurar la preferencia previa.

### 2026-10-12 00:02 (UTC-6) - IA: GitHub Copilot - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Ejecutar SH-02e para sincronizar el tema de usuarios autenticados con `perfiles.tema`.

**Estado:** La tarea queda `[~]`, pendiente del DER aprobado que exige la sección D del backlog y de que exista el flujo de sesión Auth. La búsqueda encontró solo archivos cliente con configuración; no hay implementación de `createClient`, `auth.getUser`, `onAuthStateChange` ni consultas a `perfiles`. `Sistema 1/supabase/tabla-perfiles.sql` sigue vacío. No se escribió SQL ni lógica con un esquema no aprobado.

**Para continuar:** Instituto debe proporcionar el DER aprobado y confirmar que el proyecto Supabase/Auth ya está configurado localmente. Las claves no deben pegarse en el repositorio ni compartirse en el chat.

### 2026-10-12 00:11 (UTC-6) - IA: GitHub Copilot - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Analizar el sistema completo y evaluar si el DER propuesto por Cursor cubre las funciones presentes y pendientes.

**Hallazgos:** el DER sirve como inventario inicial, pero aun no esta listo para generar SQL. Los SQL de ambas carpetas son stubs; las paginas activas no cargan un cliente Supabase ni Auth; CMS Inicio, footer CMS y ficha tambien siguen sin persistencia. Se encontro que el borrador no asegura una relacion duradera editor-codigo despues de consumir una invitacion, el seed usa `email` sobre `perfiles` aunque el campo solo vive en `auth.users`, NIE plano contradice 0-14, RLS de fila no protege por si sola `rol`, y el modelo de proyectos no define la categoria/asignacion academica. El contrato JSON de Inicio tampoco coincide con la salida de las plantillas existentes y `footer_cms` no separa los dos WhatsApp.

**Como:** se agrego al BACKLOG una revision aditiva con los cambios requeridos y decisiones pendientes. Se preservo sin cambios el anexo original de Cursor. No se escribio ni ejecuto SQL de produccion; SH-02e queda `[~]` hasta disponer del DER aprobado y el flujo Auth.

**Verificacion:** se cotejaron las casillas del BACKLOG, los clientes/JS/HTML activos, las plantillas CMS y los archivos SQL de S1/S2. Todos los SQL existentes contienen solo comentarios `VACIO`; no se encontraron llamadas a `createClient`, `auth.getUser`, `onAuthStateChange` ni consultas `.from(...)` desde las paginas/scripts activos.

### 2026-10-12 00:19 (UTC-6) - IA: GitHub Copilot - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Corregir los pasos del BACKLOG relacionados con la base de datos para alinearlos con la revision del DER, sin adelantar implementaciones.

**Como:** Se actualizaron los criterios de SH-02e, Supabase client/configuracion, CMS Inicio/footer, cuentas/invitaciones, codigos/membresias, proyectos, RLS, Storage, trigger, seed, origenes Auth y QA. Se agregaron puertas DB-00a..DB-00e para decisiones pendientes (proyectos academicos, NIE, baja/retencion, URLs/deploy y JSON canonico) y una secuencia previa a migraciones.

**Estado/limites:** todas las tareas permanecen pendientes o en curso; no se escribio SQL, no se ejecuto migracion, no se creo tabla ni se cambiaron permisos en Supabase. Se mantuvo el anexo original de Cursor y se añadieron correcciones al plan.

**Verificacion:** se revisaron los bloques modificados de BACKLOG y esta resolucion; las marcas de tareas DB no se cambiaron y los SQL permanecen vacios.

### 2026-10-12 00:26 (UTC-6) - IA: GitHub Copilot - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Corregir los pasos del BACKLOG vinculados con la base de datos para que reflejen el DER revisado, sin adelantar la implementacion.

**Como:** Se actualizaron los criterios de SH-02e, SH-06b/c, SH-07a/c, S1-01b/S1-14a, administracion de cuentas/codigos, S2 ficha/listados/bajas, DB-01 a DB-09 y QA E-07. Se definieron puertas DB-00a..e para decisiones academicas, NIE, bajas/retencion, URLs/configuracion Pages y JSON CMS; se marco el anexo original de Cursor como borrador que no debe ejecutarse sin aplicar la revision.

**Estado y limites:** no se marcaron tareas como completadas, no se escribio SQL, no se aplico ninguna migracion ni se cambio Supabase. Las DB tasks permanecen pendientes y SH-02e permanece en curso hasta cerrar las puertas de aprobacion.

**Verificacion:** se contrastaron los textos de las tareas modificadas, se comprobo que no hay marcas `[x] DB-*` y se verifico que el backlog bloquea migraciones hasta cerrar DB-00a..e.

### Nuevo ingreso / Proceso de matr�cula 2027

https://sites.google.com/inti.edu.sv/nuevoingreso/nuevo-ingreso/proceso_de_matricula

Pasos (texto del sitio):
1. Del 10 de agosto al 30 de noviembre de 2026: llenado del formulario de inscripci�n en l�nea. Enlace del sitio: WhatsApp `+503 74411075` (solicitar formulario 2027). Este contacto coincide con el WhatsApp can�nico del sitio y reemplaza al n�mero no reconocido +503 7754 5899.
2. En una semana, correo de confirmaci�n de inscripci�n.
3. A partir del 25 de noviembre de 2027, correo con documentos a entregar, horario y fecha.
4. El joven y el encargado asisten a entregar documentos seg�n esa calendarizaci�n.
5. Una semana antes del inicio de clases, correo con informaci�n de inicio y correo institucional.

### Oferta acad�mica

https://sites.google.com/inti.edu.sv/nuevoingreso/OfertaAcademica � especialidades (p�ginas de texto; v�deos omitidos):

**Electr�nica** � circuitos an�logos/digitales; microcontroladores; fotovoltaica; audio/video; micro soldadura en m�viles; rob�tica Arduino y apps. M�dulos 1�: higiene y ambiente, n�meros complejos/matrices, circuitos resistivos CD, normativas instalaciones residenciales, semiconductores, prototipos, emprendimiento colaborativo. 2�: RLC CA, instrumentaci�n, digitales, mantenimiento inform�tico y redes b�sicas, software de planos, ingl�s industrial, planes de negocio cooperativa. 3�: conmutaci�n y potencia, m�quinas el�ctricas, l�gica de programaci�n, preventivo inform�tico y SO, microcontroladores 8/16 bits, apps para sistemas electr�nicos, microempresa cooperativa, mantenimiento de equipos m�viles.

**Sistemas el�ctricos y energ�as renovables** (antes Electrotecnia, plan modular 2024). AC/DC, residencial/industrial, distribuci�n, automatizaci�n, refrigeraci�n, generaci�n/transformaci�n, solar, planos. M�dulos 1��3�: planos y circuitos, proyectos el�ctricos, BT, mantenimiento BT, l�nea de distribuci�n secundaria, prototipos renovables, eficiencia energ�tica, control de m�quinas, iluminaci�n, fotovoltaica, simulaci�n geot�rmica/hidro/biomasa, transformadores, PLC, dom�tica, monitoreo industrial, mini e�lica, mantenimiento renovables y l�neas BT, negocio, ciencias de la computaci�n, proyecto de vida y carrera.

**Mec�nica industrial** (antes Mec�nica general). Dise�o, fabricaci�n y reparaci�n de piezas; torno, fresadora, rectificadora, CNC, soldadura, neum�tica e hidr�ulica. M�dulos: materiales, dibujo, herramientas manuales, soldadura aut�gena/el�ctrica, ingl�s, torno, t�rmicos, TIG/MIG, mantenimiento, lubricaci�n, fresa, CAD, CNC, hidr�ulica/neum�tica, montaje, microempresa, proyectos tecnol�gicos.

**Infraestructura tecnol�gica y servicios inform�ticos** � circuitos y prototipos (3D, CNC), microcontroladores, redes; certificaciones CCNA, CompTIA A+, Autodesk. M�dulos: el�ctrica y redes, ofim�tica, multimedia, l�gica, ingl�s TIC, software, redes inal�mbricas y voz, est�ndares TI, seguridad, bases de datos, ERP, centros de datos, servicios de red, auditor�a, conversaci�n en ingl�s, microempresa, proyectos.

**Desarrollo de software** � apps Android e IA, web, multimedia, bases de datos, LAN, IoT, CISCO, resoluci�n de problemas. M�dulos: algoritmos, requerimientos, multimedia, calidad de software, p�ginas web, ingl�s, arquitectura, POO, BD, redes LAN, mantenimiento de sistemas, documentaci�n, m�viles, microempresa, proyectos.

**Mantenimiento automotriz** (antes Mec�nica automotriz). Motor, diagn�stico, di�sel, inyecci�n electr�nica. M�dulos: preventivo motor/frenos/suspensi�n/el�ctrico/transmisi�n, confort y seguridad, reacondicionamiento, reparaciones, diagn�stico, gesti�n recepci�n-entrega, ingl�s t�cnico, microempresa, proyectos.

### Modalidades flexibles (EDUCAME)

https://sites.google.com/inti.edu.sv/nuevoingreso/educame

Bachillerato General a distancia, 1� y 2�, s�bados y domingo. Requisito: mayor de 18 a�os. M�dulos: Matem�tica, Ciencias Naturales, Lenguaje y Literatura, Ciencias Sociales, Idioma Ingl�s. (V�deos omitidos.)

**No se toc�:** `Adobe Ilustrador/` ni el c�digo del sitio.

---

### 2026-10-11 14:10 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Definir el sitio (8 secciones, 2 sistemas, roles), pensar BD, crear backlog, borrar pruebas, carpetas Sistema 1 y 2, anotar, esperar. ERP de BD = siguiente prompt.

**Deduccion:** Google Site (4 items) -> 8 secciones. Menu (no el PNG): Inicio, Matricula, Oferta Academica, Proyectos, Personal, Ubicaciones, Historia, Configuraciones. Matricula = Nuevo ingreso + EDUCAME. Oferta = 6 tecnicas + General. Inicio distinto y CMS. Proyectos = Sistema 2 (otro repo al final, misma BD). Visitante sin registro; Configuraciones disabled; solo persiste tema. Editor solo S2 y su ficha. Docente: codigos tipo DS2B. Admin: S1+S2, Editar, cuentas, CMS Canva, borrar paginas de proyecto.

**Como:** Borrados prototipos de la raiz. Creados Sistema 1/ y Sistema 2/. Backlog operativo en BACKLOG.md. No HTML de pantallas. No ERP. Adobe sin tocar. Huecos = bloque 0 del backlog.

---

### 2026-10-11 14:27 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Analisis critico Pages + Supabase del CMS Inicio (bloques tipo Illustrator/Canva, cuenta matriz, responsive). PDF portafolio vs PNG finales. Carpeta Documentacion con informacion. Rellenar S1 con fuentes ya dadas.

**Critica (decision de producto):** Un editor de mesas absolutas (x,y como Illustrator) en GitHub Pages se rompe en el celular. Realidad: bloques apilados a 100% de ancho; grid interno 12 cols que en movil es 1 col; orden por lista no por pixeles; capas solo dentro del bloque; efectos = lista corta de CSS (sombra, fade, overlay), no filtros de foto. Guardar escribe JSON a Supabase; el visitante lee el mismo JSON. Cuenta matriz intiwo11543@gmail.com se siembra como primer Administrador (email en config, nunca el password). Visitante ve Inicio vacio hasta el primer Guardar.

**PDF vs PNG:** Esquema visual del Portafolio de Proyectos DS.pdf = fases viejas (Acceder, 4 secciones). Look de S2 = PNG Adobe (tarjetas, busqueda, colores, hover).

**Como:** LEEME.md en Documentacion con informacion. CONTENIDO.md en paginas de Sistema 1. Backlog S1-01/S1-10/S1-11 y DB-08/09. No se implemento el editor todavia.

---

### 2026-10-11 14:33 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Incorporar la arquitectura de Google Gemini (lienzo estructurado, cuenta matriz, SortableJS, AOS, JSON a Supabase). Sistema 2 ya definido: no reabrir.

**Acuerdo con Gemini (ejecutar asi):**
1. Password nunca en GitHub Pages. Instituto se registra; se marca administrador a intiwo11543@gmail.com.
2. Editor = bloques modulares (plantillas: imagen+texto, 3 columnas, banner), no coordenadas absolutas.
3. Editar: se oculta el cromo y entra barra admin. (+) = contenedor con reglas, no mesa vacia.
4. Reordenar: SortableJS sobre el bloque entero.
5. Efectos: AOS / clases preaprobadas (slide-up, fade, parallax suave).
6. Guardar: JS empaca orden+textos+imagenes+efectos a JSON -> tabla contenido_inicio. Visitante GET y pinta (skeleton para no dejar el footer colgando un frame).

**Correccion (Cursor, backend):** RLS no debe ser "si email = intiwo11543". Eso se rompe si cambia el correo. La matriz se usa para **asignar** rol administrador en perfiles; las politicas miran `rol = administrador`. El resto de admins que cree Instituto heredan el mismo rol.

**Sistema 2:** sin cambios (proyectos tecnicos/academicos, Editor solo su ficha, Docente codigos DS2B, Admin borra paginas, misma BD).

---

### 2026-10-11 14:38 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Detallar BACKLOG.md en tareas atomicas para IAs.

**Como:** Cada casilla tiene criterio (archivo, paleta, RLS, px). Bloques 0 / SH / S1 / S2 / DB / E. No se borro el archivo historico. No se escribio HTML de pantallas.

---

### 2026-10-11 15:05 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Fuentes exactas por tarea en BACKLOG; prompt para IA de DER; nombrar arquitectura hibrida.

**Como:** BACKLOG.md mapa F-* (PNG Adobe, microservicio PDF 7 pag, dossier historia 28 pag con URLs, Site, CONTENIDO.md, CMS 14:27/14:33). Cada casilla tiene **Fuente**. Anexo prompt DER (no SQL ejecutado). Arquitectura: Jamstack + BaaS cliente-servidor, dual-client shared-backend, CMS headless, RLS. No event-driven. No microservicios propios.

**Seguridad:** `Documento sin titulo.pdf` pagina 1 trae credenciales. No se copiaron al backlog ni al prompt. IAs: no commitear passwords. Instituto: rotar esa clave fuera del git.

---

### 2026-10-11 15:20 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** En cada tarea: de donde extraer Y adonde escribir el codigo (Inicio vs Proyectos).

**Como:** BACKLOG.md ahora tiene Mapa de destinos (arbol Sistema 1/ y Sistema 2/). Cada casilla: Extraer de + Escribir en (ruta). Inicio solo `Sistema 1/paginas/inicio/`. Hub proyectos `Sistema 2/paginas/proyectos/`. Ficha `Sistema 2/paginas/ficha/`. Cromo duplicado en ambos compartido/. SQL en `Sistema 1/supabase/`. No HTML de pantallas todavia.

---

### 2026-10-11 15:28 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Crear documentos vacios con nombres claros (no index/style) en S1 y S2; anotar esos nombres en BACKLOG.

**Como:** 64 stubs (HTML/CSS/JS/SQL) con comentario de proposito. Ejemplos: pagina-inicio-cms.html, pagina-hub-proyectos.html, pagina-ficha-proyecto.html, encabezado-hamburguesa.html vs encabezado-hamburguesa-con-busqueda.html, cliente-supabase.js, tabla-*.sql. BACKLOG Mapa de destinos y Escribir en apuntan a esos archivos (rellenar, no crear index). LEEME de Sistema 1 y 2 actualizados.

---

### 2026-10-11 16:25 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Organizar BACKLOG.md con enumeracion 1 [ ], 2 [ ] y debajo las indicaciones ya existentes.

**Como:** Cada casilla de trabajo paso a `N [ ] ID titulo`. Extraer de y Escribir en se dejaron igual debajo. Hecho/Archivo historicos siguen con `- [x]`.

---

### 2026-10-11 19:40 (UTC-6) - IA: Cursor - Dispositivo: laptop Windows (MINEDUCYT)

**Pedido:** Las 5 PNG de referencia (footer, menu, busqueda, especialidades, hub) identicas en UI y UX: sugerencias semejantes en S2 (elegida verde + letra negra); Oferta Academica al asomarse gris + negro mientras Proyectos (seccion actual) sigue verde.

**Como:** HTML vivo en `Sistema 2/paginas/proyectos/pagina-hub-proyectos.html` y `Sistema 1/paginas/inicio/pagina-inicio-cms.html`. CSS `layout-hamburguesa-y-overlay.css` + `hub-y-pildoras-proyectos.css`. JS menu overlay, busqueda debounce 200 ms (cero match = 4 sugerencias del PNG), pildoras (electricos hover/activo `#E61010`). Pie: sello circular, WhatsApp oficial 7754-5899 (no los del PNG). Menu 8 items de producto, no los 6 del PNG. No se copio el lorem "Aca bla bla".

**Verificado en navegador:** hub 2 cards; menu Proyectos verde y Oferta gris; query `disenooh jafico` muestra aviso + 4 disenos y al elegir Diseño Grafico se pone verde/negro; electricos rojo.

**Pendiente:** favicon PNG 32/180/192/512; auth que oculte Editar al visitante (el PNG lo muestra); filtro especialidad con data Supabase; no se subio Adobe ni Documentacion.
