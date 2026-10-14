/* INTIWO S2 | nivel + seccion de un ciclo ya elegido | BACKLOG S2N-02c */
(function () {
  var params = new URLSearchParams(window.location.search);
  var rama = params.get("rama") || "";
  var anio = params.get("anio") || "2026";
  var meta = window.INTIWO_RAMAS && window.INTIWO_RAMAS[rama];
  var titulo = document.getElementById("intiwo-filtro-rama");
  var claveEl = document.getElementById("intiwo-filtro-clave");
  var cicloEl = document.getElementById("intiwo-filtro-ciclo");
  var nivelEl = document.getElementById("intiwo-filtro-nivel");
  var seccionEl = document.getElementById("intiwo-filtro-seccion");
  var ir = document.getElementById("intiwo-filtro-ir");
  if (!meta || meta.tipo !== "tecnico" || !titulo || !claveEl || !nivelEl || !seccionEl || !ir) {
    if (meta && meta.tipo === "academico") {
      window.location.replace("../listado/pagina-listado-proyectos-codigo.html?tipo=academico&rama=" + encodeURIComponent(rama) + "&anio=" + encodeURIComponent(anio));
    }
    return;
  }

  titulo.textContent = meta.etiqueta;
  if (cicloEl) cicloEl.textContent = "Ciclo " + anio;

  function refrescar() {
    var clave = window.intiwoConstruirClave(meta.prefijo, nivelEl.value, seccionEl.value);
    claveEl.textContent = clave || "—";
    if (!clave) {
      ir.setAttribute("aria-disabled", "true");
      ir.removeAttribute("href");
      return;
    }
    ir.setAttribute("aria-disabled", "false");
    ir.href = "../listado/pagina-listado-proyectos-codigo.html?tipo=tecnico&rama=" + encodeURIComponent(rama) +
      "&anio=" + encodeURIComponent(anio) +
      "&clave=" + encodeURIComponent(clave);
  }

  nivelEl.addEventListener("change", refrescar);
  seccionEl.addEventListener("change", refrescar);
  refrescar();
})();
