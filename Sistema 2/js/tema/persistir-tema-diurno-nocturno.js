/* INTIWO | localStorage visitante | BACKLOG SH-02 */
(function () {
  var clave = "intiwo-tema";
  var guardado = localStorage.getItem(clave);
  var tema = guardado === "light" || guardado === "dark" ? guardado : "dark";
  document.documentElement.setAttribute("data-theme", tema);

  function pintar(boton) {
    if (!boton) return;
    var estado = tema === "dark" ? "dark" : "light";
    boton.setAttribute("data-estado", estado);
    boton.setAttribute("aria-label", tema === "dark" ? "Cambiar a modo brillo" : "Cambiar a modo nocturno");
    boton.setAttribute("aria-pressed", tema === "light" ? "true" : "false");
  }

  document.addEventListener("click", function (ev) {
    var boton = ev.target.closest("[data-intiwo-tema]");
    if (!boton) return;
    tema = tema === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(clave, tema);
    pintar(boton);
  });

  pintar(document.querySelector("[data-intiwo-tema]"));
})();
