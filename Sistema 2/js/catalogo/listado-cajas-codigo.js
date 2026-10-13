/* INTIWO S2 | cajas tecnicas por codigo; academicos por asignatura+ciclo | BACKLOG S2N-02d */
(function () {
  var params = new URLSearchParams(window.location.search);
  var tipo = params.get("tipo") || "tecnico";
  var clave = params.get("clave") || "";
  var anio = params.get("anio") || "2026";
  var rama = params.get("rama") || "";
  var meta = window.INTIWO_RAMAS && window.INTIWO_RAMAS[rama];
  var encabezado = document.getElementById("intiwo-listado-clave");
  var contexto = document.getElementById("intiwo-listado-contexto");
  var vacio = document.getElementById("intiwo-listado-vacio");
  var etiqueta = meta ? meta.etiqueta : "";

  if (tipo === "academico") {
    if (encabezado) encabezado.textContent = etiqueta || "Asignatura";
    if (contexto) contexto.textContent = "Ciclo " + anio + " · proyectos concebidos por docentes (1.o y 2.o). Tercero no cursa estas asignaturas.";
    if (vacio) {
      vacio.hidden = false;
      vacio.textContent = "Este ciclo aun no tiene proyectos academicos publicados para esta asignatura. El numero de proyectos lo deciden los docentes (juntos, en grupos o cada uno), no un codigo de alumno.";
    }
    return;
  }

  if (encabezado) encabezado.textContent = clave || "Codigo";
  if (contexto) contexto.textContent = [etiqueta, anio ? "ciclo " + anio : ""].filter(Boolean).join(" · ");
  if (vacio) {
    vacio.hidden = false;
    vacio.textContent = "Aun no hay cajas publicadas para este codigo. El listado se llenara desde la base cuando exista proyectos.";
  }
})();
