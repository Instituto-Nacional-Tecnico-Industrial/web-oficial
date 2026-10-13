/* INTIWO S2 | ciclos desde 2026; solo admin incorpora | BACKLOG S2N-08 */
(function () {
  var CLAVE = "intiwo-ciclos";
  var ANIO_MIN = 2026;
  var CLAVE_ROL = "intiwo-rol";

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

  function esAdmin() {
    var rol = rolActual();
    return rol === "administrador" || rol === "admin";
  }

  function porDefecto() {
    return { anios: [ANIO_MIN], actual: ANIO_MIN };
  }

  function leer() {
    try {
      var bruto = JSON.parse(localStorage.getItem(CLAVE) || "null");
      if (!bruto || !Array.isArray(bruto.anios) || !bruto.anios.length) return porDefecto();
      var anios = bruto.anios.map(Number).filter(function (y) { return y >= ANIO_MIN; });
      if (!anios.length) anios = [ANIO_MIN];
      anios.sort(function (a, b) { return b - a; });
      var actual = Number(bruto.actual);
      if (anios.indexOf(actual) === -1) actual = anios[0];
      return { anios: anios, actual: actual };
    } catch (e) {
      return porDefecto();
    }
  }

  function guardar(estado) {
    if (!esAdmin()) return;
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  }

  function llenarSelect(select, preferido) {
    if (!select) return;
    var estado = leer();
    var elegido = Number(preferido) || estado.actual;
    if (estado.anios.indexOf(elegido) === -1) elegido = estado.actual;
    select.innerHTML = "";
    estado.anios.forEach(function (y) {
      var opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      if (y === elegido) opt.selected = true;
      select.appendChild(opt);
    });
    return Number(select.value);
  }

  function incorporarSiguiente() {
    if (!esAdmin()) return leer();
    var estado = leer();
    var max = Math.max.apply(null, estado.anios);
    var siguiente = max + 1;
    if (estado.anios.indexOf(siguiente) === -1) estado.anios.push(siguiente);
    estado.actual = siguiente;
    estado.anios.sort(function (a, b) { return b - a; });
    guardar(estado);
    return estado;
  }

  function marcarActual(anio) {
    if (!esAdmin()) return leer();
    var estado = leer();
    var y = Number(anio);
    if (estado.anios.indexOf(y) === -1) return estado;
    estado.actual = y;
    guardar(estado);
    return estado;
  }

  window.INTIWO_CICLOS = {
    ANIO_MIN: ANIO_MIN,
    leer: leer,
    llenarSelect: llenarSelect,
    incorporarSiguiente: incorporarSiguiente,
    marcarActual: marcarActual,
    esAdmin: esAdmin
  };

  function iniciarCatalogo() {
    var select = document.getElementById("intiwo-ciclo");
    if (!select || !window.INTIWO_CICLOS) return;
    var params = new URLSearchParams(window.location.search);
    llenarSelect(select, params.get("anio"));
    var admin = document.getElementById("intiwo-ciclo-admin");
    if (admin) admin.hidden = !esAdmin();
    var incorporar = document.getElementById("intiwo-ciclo-incorporar");
    if (incorporar) {
      incorporar.hidden = !esAdmin();
      incorporar.addEventListener("click", function () {
        incorporarSiguiente();
        llenarSelect(select);
        select.dispatchEvent(new Event("change"));
      });
    }
    select.addEventListener("change", function () {
      if (esAdmin()) marcarActual(select.value);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarCatalogo, { once: true });
  } else {
    iniciarCatalogo();
  }
})();
