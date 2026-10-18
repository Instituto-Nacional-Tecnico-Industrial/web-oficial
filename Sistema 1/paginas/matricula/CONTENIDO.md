# Matricula (Nuevo ingreso + EDUCAME)

Fuente: IAs/RESOLUCIONES.md y sitio https://sites.google.com/inti.edu.sv/nuevoingreso/nuevo-ingreso/proceso_de_matricula
Sin videos. WhatsApp principal del sitio institucional: +503 7441-1075. Para la modalidad flexible EDUCAME, el Instituto confirmó como contacto específico el +503 7754-5899 y el correo oficina.educame@inti.edu.sv; esta excepción no cambia el contacto general del sitio.

## Dos vías (no mezclar)

- **Seis especialidades técnicas (diurno / Nuevo ingreso 2027).** URL confirmada 2026-10-12: `https://docs.google.com/forms/d/e/1FAIpQLSchOv93fiyvoxF2z_mahlUcUhzbt5FyxfZTupLeODpdBcJjhw/viewform`. Ese es el destino de «Inscríbete ahora» del pie y del paso 1 de esta página.
- **Modalidad flexible / EDUCAME (Bachillerato General).** **No hay formulario público.** Contacto específico: WhatsApp **7754-5899** (`https://wa.me/50377545899`) y correo [oficina.educame@inti.edu.sv](mailto:oficina.educame@inti.edu.sv). El personal evalúa las consultas de ingreso. No reutilizar el Forms de las técnicas. No inventar enlace a Google Forms de EDUCAME.

## Proceso 2027
1. 10 ago - 30 nov 2026: formulario en linea (solo las seis técnicas; URL de arriba).
2. En una semana: correo de confirmacion.
3. Desde 25 nov 2027: correo con documentos, horario y fecha.
4. Joven y encargado entregan documentos en el instituto.
5. Una semana antes de clases: correo de inicio y correo institucional.

Detalle ingreso/traslados: `pagina-inscripcion-y-traslados.html` (paso 1 «Ver más»). Traslado = misma especialidad. 2.º y 3.º: entrevista con subdirectores, encargado, lun–vie 8:00–11:30 y 13:30–17:00.

Detalle documentos: `pagina-entrega-documentos.html` (paso 4 «Ver más»). Lista SIGES, partida original, DUI 150 %, fotos 3,5×2,5 granulado, exámenes, antitetánica; entrega en instalaciones cuando se solicite.

## EDUCAME (Bachillerato General, modalidades flexibles)
Fuente histórica (desactualizada en teléfono y nombres de materias): https://sites.google.com/inti.edu.sv/nuevoingreso/educame

Vigente (tríptico oficial + Instituto, 2026-10-14):
- Bachillerato General en modalidades flexibles a distancia; 1.º y 2.º año.
- Pensado para continuar estudios sin dejar responsabilidades diarias.
- Requisito público: mayor de 18 años. El resto lo evalúa el Instituto por WhatsApp.
- Horario: asistencia presencial dentro del Instituto únicamente los sábados, de 7:00 a.m. a 4:00 p.m. La modalidad es a distancia; no es virtual.
- Materiales: paquete escolar (cuadernos, borrador, lápiz, lapiceros, sacapuntas y tijera), libros educativos para las cinco asignaturas y una laptop gratuita, sin límite de edad.
- Asignaturas: Precálculo; Ciencias y Tecnología; Lenguaje y Literatura; Ciudadanía y valores; Inglés.
- Requisitos: tener más de 18 años; presentar certificado de noveno grado y Documento Único de Identidad (DUI).
- Contactos exclusivos de EDUCAME: WhatsApp +503 7754-5899 y oficina.educame@inti.edu.sv. El WhatsApp institucional general +503 7441-1075 no se sustituye en los pies de página comunes.
- Página larga: `pagina-educame-modalidad-flexible.html` (botón «Más información» desde Matrícula y Oferta).

## CMS de contactos

Los contactos del Footer, EDUCAME y Matrícula se editan por separado en Configuraciones (Admin). EDUCAME mantiene su enlace de consulta por WhatsApp y su correo; no debe usar el formulario de ingreso de las especialidades técnicas. La URL de inscripción de Matrícula solo se usa en las llamadas a la acción de nuevo ingreso técnico. Los valores se guardan en Supabase cuando sus tablas/RLS estén instaladas; no ejecutar sus migraciones sin instrucción expresa del Instituto.
