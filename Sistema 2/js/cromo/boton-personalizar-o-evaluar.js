/* INTIWO S2 | Personalizar (editor) / Evaluar (docente) | BACKLOG S2N-01b */
(function () {
  var CLAVE_ROL = "intiwo-rol";
  var boton = document.getElementById("intiwo-accion-rol");
  if (!boton) return;

  function rolActual() {
    var fuentes = [
      document.body && document.body.dataset && document.body.dataset.rol,
      window.INTIWO_ROL,
      sessionStorage.getItem(CLAVE_ROL),
      localStorage.getItem(CLAVE_ROL)
    ];
    var valor = fuentes.find(function (v) { return typeof v === "string" && v.trim(); });
    return valor ? String(valor).trim().toLowerCase() : "";
  }

  function rutaDesdePagina(rel) {
    var path = window.location.pathname.replace(/\\/g, "/");
    if (path.indexOf("/paginas/proyectos/") !== -1) return rel;
    if (path.indexOf("/paginas/") !== -1) return "../" + rel.replace(/^\.\.\//, "");
    return rel;
  }

  function aplicar() {
    var rol = rolActual();
    var texto = boton.querySelector("[data-intiwo-accion-rol-texto]");
    boton.hidden = true;
    boton.style.display = "none";
    boton.removeAttribute("href");
    if (texto) texto.textContent = "";

    if (rol === "editor") {
      boton.hidden = false;
      boton.style.display = "";
      if (texto) texto.textContent = "Personalizar";
      boton.setAttribute("href", rutaDesdePagina("../ficha/pagina-ficha-proyecto.html?modo=personalizar"));
      boton.setAttribute("aria-label", "Personalizar proyecto");
      return;
    }

    if (rol === "docente" || rol === "administrador" || rol === "admin") {
      boton.hidden = false;
      boton.style.display = "";
      if (texto) texto.textContent = "Evaluar";
      boton.setAttribute("href", rutaDesdePagina("../evaluar/pagina-evaluar-codigos-docente.html"));
      boton.setAttribute("aria-label", "Evaluar proyectos");
    }
  }

  aplicar();
  window.addEventListener("storage", aplicar);
  window.addEventListener("intiwo:auth-state-changed", aplicar);
})();
