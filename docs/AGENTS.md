# INTIWO — reglas para cualquier IA (Cursor u OpenCode)
Este archivo es el **cuaderno de reglas**. Lo lee la IA de cualquier computadora. **No copies chats enteros** aquí ni en el prompt: gasta el saldo de Cursor y satura a Ollama.
## Quién es el humano
- Nombre: Jonathan Peña. Prefiere que lo llamen **J_Peña**.
- Alumno, 17 años. Cuenta Cursor: **intiwo** (saldo limitado; no desperdiciar tokens).
- **Nunca había usado IA** de forma habitual: explica con pasos cortos, sin jerga innecesaria.
## Qué es este proyecto
Sitio web oficial del **Instituto Nacional Técnico Industrial (INTI / INTIWO)**, El Salvador.
Objetivo: mostrar bien la oferta a egresados de noveno y a padres de familia.
Repo: `https://github.com/Instituto-Nacional-Tecnico-Industrial/web-oficial.git`
### Stack (no cambiar sin anotarlo en `docs/PROGRESO.md`)
- HTML, CSS y JavaScript (sin React/Next por ahora)
- Archivos principales: `index.html`, `style.css`, `supabase.js`, `main_proto.html`
- Supabase (CDN). Las claves **aún son placeholders** (`TU_SUPABASE_URL_AQUI`). **Nunca** subir claves reales al git.
- Paleta: verde institucional `#A8C200`, hover `#8da300`
- Idioma de la web: español (`lang="es"`)
- Incluye menú hamburguesa y modo claro/oscuro
## Tres computadoras (estaciones)
| Nombre de estación | Dispositivo | Sistema | Dónde está el código |
|---|---|---|---|
| `[HP-Arch]` | Laptop HP | Arch Linux | Clon local + GitHub |
| `[DELL-Win]` | Laptop DELL | Windows 11 | Clon local + GitHub |
| `[PC-Escritorio]` | PC de escritorio | Windows 11 | Clon local + GitHub |
Las tres **no comparten el chat**. Comparten el código por **GitHub** (`git pull` / `git push`).
## Cuatro IAs (nombres oficiales)
Cursor usa la **misma cuenta intiwo** (mismos tokens), pero **cada chat es otro cerebro**. Por eso cada IA tiene nombre:
| Nombre de la IA | Estación | Programa | ¿Gasta los $30 de Cursor? |
|---|---|---|---|
| **Grok-Escritorio** | `[PC-Escritorio]` | Cursor (Grok) | Sí |
| **Grok-DELL** | `[DELL-Win]` | Cursor (Grok) | Sí |
| **Grok-HP** | `[HP-Arch]` | Cursor (Grok), si lo abre en Linux | Sí |
| **Ollama-HP** | `[HP-Arch]` | OpenCode + Ollama (local) | No (gratis en esa laptop) |
Al **empezar un chat nuevo**, J_Peña debe decir:
> Estoy en la estación `[NOMBRE]`. Tú eres **[nombre de la IA]**. Lee `AGENTS.md` y `docs/PROGRESO.md` y dime el siguiente paso.
Si no dice el nombre, la IA debe preguntar: HP-Arch, DELL-Win o PC-Escritorio.
## Cómo trabajar (todas las IAs)
1. Leer `AGENTS.md` y `docs/PROGRESO.md` **antes** de inventar el estado del proyecto.
2. Avanzar **poco a poco** (una pieza: una sección, un estilo, un arreglo). No reescribir todo el sitio de golpe.
3. Al terminar la sesión, **actualizar** `docs/PROGRESO.md` (qué se hizo, qué falta, en qué estación).
4. Indicar a J_Peña que suba a GitHub (`git add`, `git commit`, `git push`) cuando pida guardar. No hacer push si él no lo pide.
5. Preferir **Ollama-HP** para maquetado y cambios simples. Usar Grok (Cursor) para arquitectura, bugs difíciles o cuando Ollama se atasque.
6. No pegar transcripciones largas de otros chats. El progreso va en `docs/PROGRESO.md`.
## Cómo reconocer en qué chat estás (para J_Peña)
- Si estás en la **torre / PC grande** con Windows y Cursor → habla con **Grok-Escritorio**.
- Si estás en la **DELL** con Windows y Cursor → habla con **Grok-DELL**.
- Si estás en la **HP con Arch** y abriste **Cursor** → habla con **Grok-HP**.
- Si estás en la **HP con Arch** y abriste **OpenCode** (terminal) → habla con **Ollama-HP**.