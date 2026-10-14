/* INTIWO S1 | dropdown pildoras Oferta | SH-08d S1-03a */
(function () {
  var lista = document.getElementById("intiwo-lista-especialidades");
  var chevron = document.querySelector("[data-cerrar-catalogo]");
  if (lista && chevron) {
    function colapsar(abierto) {
      lista.classList.toggle("es-colapsada", !abierto);
      chevron.setAttribute("aria-expanded", String(abierto));
      chevron.setAttribute("aria-label", abierto ? "Ocultar especialidades" : "Mostrar especialidades");
    }
    colapsar(true);
    chevron.addEventListener("click", function () {
      colapsar(chevron.getAttribute("aria-expanded") !== "true");
    });
  }

  var pildoras = document.querySelectorAll(".intiwo-pildora-esp[data-esp]");
  var fichas = document.querySelectorAll("[data-oferta-ficha]");
  pildoras.forEach(function (pildora) {
    pildora.addEventListener("click", function () {
      pildoras.forEach(function (otra) { otra.classList.remove("es-activa"); });
      pildora.classList.add("es-activa");
      var clave = pildora.getAttribute("data-esp");
      fichas.forEach(function (ficha) {
        ficha.hidden = ficha.getAttribute("data-oferta-ficha") !== clave;
      });
    });
  });
})();
