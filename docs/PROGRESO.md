# Progreso INTIWO
Cuaderno corto para las 4 IAs. Actualizar al **cerrar** cada sesión (pocas viñetas, no el chat entero).
**Última estación:** `[PC-Escritorio]`  
**Última IA:** **Grok-Escritorio**  
**Fecha:** 2026-09-28
---
## Hecho
- Repo clonado y workspace en `web-oficial` (esta PC de escritorio).
- Sitio base ya existía en GitHub: `index.html`, `style.css`, `supabase.js`, `main_proto.html`, `README.md`.
- Hero aún muestra “en construcción” hasta conectar claves reales de Supabase (no están en el repo; está bien).
- Acuerdo de trabajo en 3 PCs: código por GitHub; **no** copiar chats entre dispositivos.
- Creados este archivo y `AGENTS.md` para que Grok-Escritorio, Grok-DELL, Grok-HP y Ollama-HP partan del mismo estado.
## Pendiente (siguiente paso sugerido)
- [ ] En las otras dos PCs: `git clone` (si no está) o `git pull` (si ya está) y abrir la carpeta del proyecto.
- [ ] En cada chat nuevo, presentarse con estación + nombre de IA y pedir que lean estos dos archivos.
- [ ] Decidir con J_Peña la primera pieza de desarrollo (por ejemplo: contenido real del hero, sección Especialidades, o conectar Supabase sin subir secretos).
## Decisiones
- Llamar a Jonathan **J_Peña**.
- Nombres de estación: `[HP-Arch]`, `[DELL-Win]`, `[PC-Escritorio]`.
- Nombres de IA: **Grok-Escritorio**, **Grok-DELL**, **Grok-HP**, **Ollama-HP**.
- No pegar la conversación completa a las otras IAs.
## Cuidado
- No commitear `.env` ni claves de Supabase.
- No sincronizar carpetas internas de Cursor (`AppData`) entre PCs.