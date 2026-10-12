/* INTIWO S2 | debounce 200ms, cero resultados, hover verde letra negra | BACKLOG S2-03 */
(function () {
  var entrada = document.getElementById("intiwo-q");
  var caja = document.getElementById("intiwo-sugerencias");
  var aviso = document.getElementById("intiwo-sugerencias-aviso");
  var lista = document.getElementById("intiwo-sugerencias-lista");
  if (!entrada || !caja || !lista) return;

  var catalogo = [
    "Diseño Grafico",
    "Diseño vectorial",
    "Diseño Automotriz",
    "Diseño de diagrama UML",
    "Mantenimiento Automotriz",
    "Mecanica Industrial",
    "Sistemas Electricos y Energia Renovable",
    "Electronica",
    "Desarrollo de Software",
    "Infraestructura Tecnologica y Servicios Informaticos"
  ];

  var t = 0;
  var indice = -1;

  function normalizar(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function pintar(items, hayExacto) {
    lista.innerHTML = "";
    indice = -1;
    if (!entrada.value.trim()) {
      caja.classList.remove("es-abierto");
      return;
    }
    caja.classList.add("es-abierto");
    aviso.hidden = hayExacto;
    items.forEach(function (nombre, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "intiwo-sugerencia";
      b.textContent = nombre;
      b.addEventListener("mouseenter", function () {
        lista.querySelectorAll(".intiwo-sugerencia").forEach(function (n) { n.classList.remove("es-activa"); });
        b.classList.add("es-activa");
        indice = i;
      });
      b.addEventListener("click", function () {
        entrada.value = nombre;
        aviso.hidden = true;
        lista.querySelectorAll(".intiwo-sugerencia").forEach(function (n) { n.classList.remove("es-activa"); });
        b.classList.add("es-activa");
      });
      lista.appendChild(b);
    });
  }

  function buscar() {
    var q = normalizar(entrada.value.trim());
    if (!q) {
      caja.classList.remove("es-abierto");
      return;
    }
    var exactos = catalogo.filter(function (n) { return normalizar(n).indexOf(q) !== -1; });
    if (exactos.length) {
      pintar(exactos, true);
      return;
    }
    pintar(catalogo.slice(0, 4), false);
  }

  entrada.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(buscar, 200);
  });

  entrada.addEventListener("focus", function () {
    if (entrada.value.trim()) buscar();
  });

  document.addEventListener("click", function (ev) {
    if (!ev.target.closest(".intiwo-busqueda")) caja.classList.remove("es-abierto");
  });
})();
