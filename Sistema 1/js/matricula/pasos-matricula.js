/* INTIWO S1 | scroll entre pasos, tinta y botones segun avance */
(function () {
  var pasos = document.querySelectorAll(".intiwo-paso");
  if (!pasos.length) return;

  function pintarAvance() {
    var alto = window.innerHeight || 1;
    pasos.forEach(function (paso) {
      if (paso.id === "paso-cierre") return;
      var caja = paso.getBoundingClientRect();
      var recorrido = (alto * 0.72 - caja.top) / (caja.height * 0.85);
      var n = Math.max(0, Math.min(1, recorrido));
      paso.style.setProperty("--avance-num", n.toFixed(3));
      paso.style.setProperty("--avance", (n * 100).toFixed(1) + "%");
    });
  }

  if ("IntersectionObserver" in window) {
    var vista = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.remove("es-en-vista");
          void entrada.target.offsetWidth;
          entrada.target.classList.add("es-en-vista");
        }
      });
    }, { threshold: 0.4 });
    pasos.forEach(function (paso) { vista.observe(paso); });
  } else {
    pasos.forEach(function (paso) { paso.classList.add("es-en-vista"); });
  }

  document.querySelectorAll("[data-siguiente]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      var destino = document.getElementById(boton.getAttribute("data-siguiente"));
      if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var pendiente = false;
  function alScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      pintarAvance();
    });
  }

  window.addEventListener("scroll", alScroll, { passive: true });
  window.addEventListener("resize", pintarAvance);
  pintarAvance();
})();
