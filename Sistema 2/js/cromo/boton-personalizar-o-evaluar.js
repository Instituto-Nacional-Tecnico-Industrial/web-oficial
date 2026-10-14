/* INTIWO S2 | mismo hueco que Editar S1 | Personalizar / Evaluar | S2N-01b */
(function () {
  function rolActual() {
    if (typeof window.intiwoObtenerRol === "function") return window.intiwoObtenerRol();
    var fuentes = [
      document.body && document.body.dataset && document.body.dataset.rol,
      window.INTIWO_ROL,
      window.__INTIWO_ROL__,
      sessionStorage.getItem("intiwo-rol"),
      localStorage.getItem("intiwo-rol")
    ];
    var valor = fuentes.find(function (v) { return typeof v === "string" && v.trim(); });
    return valor ? String(valor).trim().toLowerCase() : "";
  }

  function urlRelativa(rel) {
    try {
      return new URL(rel, window.location.href).href;
    } catch (e) {
      return rel;
    }
  }

  function aplicar() {
    var boton = document.getElementById("intiwo-accion-rol");
    if (!boton) return;
    var texto = boton.querySelector("[data-intiwo-accion-rol-texto]");
    var icono = boton.querySelector("[data-intiwo-accion-rol-icono]");
    var rol = rolActual();

    boton.hidden = true;
    boton.removeAttribute("href");
    if (texto) texto.textContent = "";
    if (icono) {
      icono.setAttribute("href", "#i-pencil");
      if (icono.href && icono.href.baseVal !== undefined) icono.href.baseVal = "#i-pencil";
    }

    if (rol === "editor" || rol === "academico") {
      boton.hidden = false;
      if (texto) texto.textContent = "Personalizar";
      var dest = rol === "academico"
        ? "../ficha/pagina-ficha-proyecto.html?tipo=academico&modo=personalizar"
        : "../ficha/pagina-ficha-proyecto.html?modo=personalizar";
      boton.setAttribute("href", urlRelativa(dest));
      boton.setAttribute("aria-label", "Personalizar proyecto");
      return;
    }

    if (rol === "docente" || rol === "administrador" || rol === "admin") {
      boton.hidden = false;
      if (texto) texto.textContent = "Evaluar";
      if (icono) {
        icono.setAttribute("href", "#i-clipboard");
        if (icono.href && icono.href.baseVal !== undefined) icono.href.baseVal = "#i-clipboard";
      }
      boton.setAttribute("href", urlRelativa("../evaluar/pagina-evaluar-codigos-docente.html"));
      boton.setAttribute("aria-label", "Evaluar proyectos");
    }
  }

  function iniciar() {
    aplicar();
    window.addEventListener("storage", aplicar);
    window.addEventListener("intiwo:auth-state-changed", aplicar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
