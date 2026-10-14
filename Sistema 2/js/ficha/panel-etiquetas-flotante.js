/* INTIWO S2 | panel flotante; semilla S1 S2N-04a | Editor aplica; docente corrige */
(function () {
  var FAMILIAS = ["especialidad", "asignatura", "oficio", "salud", "ambiente", "tematica"];
  var CATALOGO = window.INTIWO_ETIQUETAS_SEMILLA || [
    { slug: "automotriz", nombre: "Mantenimiento Automotriz", familia: "especialidad" },
    { slug: "mecanica", nombre: "Mecánica Industrial", familia: "especialidad" },
    { slug: "electricos", nombre: "Sistemas Eléctricos y Energía Renovable", familia: "especialidad" },
    { slug: "electronica", nombre: "Electrónica", familia: "especialidad" },
    { slug: "ds", nombre: "Desarrollo de Software", familia: "especialidad" },
    { slug: "itsi", nombre: "Infraestructura Tecnológica y Servicios Informáticos", familia: "especialidad" },
    { slug: "precalculo", nombre: "Precálculo", familia: "asignatura" },
    { slug: "ciudadania", nombre: "Ciudadanía y valores", familia: "asignatura" },
    { slug: "ciencias", nombre: "Ciencias y tecnología", familia: "asignatura" },
    { slug: "ingles", nombre: "Inglés", familia: "asignatura" },
    { slug: "literatura", nombre: "Lenguaje y Literatura", familia: "asignatura" },
    { slug: "salud", nombre: "Salud", familia: "salud" },
    { slug: "ambiente", nombre: "Ambiente", familia: "ambiente" },
    { slug: "higiene", nombre: "Higiene y ambiente", familia: "ambiente" },
    { slug: "eficiencia-energetica", nombre: "Eficiencia energética", familia: "ambiente" },
    { slug: "motor", nombre: "Motor", familia: "oficio" },
    { slug: "diagnostico", nombre: "Diagnóstico", familia: "oficio" },
    { slug: "diesel", nombre: "Diésel", familia: "oficio" },
    { slug: "inyeccion-electronica", nombre: "Inyección electrónica", familia: "oficio" },
    { slug: "frenos", nombre: "Frenos", familia: "oficio" },
    { slug: "suspension", nombre: "Suspensión", familia: "oficio" },
    { slug: "transmision", nombre: "Transmisión", familia: "oficio" },
    { slug: "torno", nombre: "Torno", familia: "oficio" },
    { slug: "fresadora", nombre: "Fresadora", familia: "oficio" },
    { slug: "cnc", nombre: "CNC", familia: "oficio" },
    { slug: "soldadura", nombre: "Soldadura", familia: "oficio" },
    { slug: "tig-mig", nombre: "TIG/MIG", familia: "oficio" },
    { slug: "neumatica", nombre: "Neumática", familia: "oficio" },
    { slug: "hidraulica", nombre: "Hidráulica", familia: "oficio" },
    { slug: "cad", nombre: "CAD", familia: "oficio" },
    { slug: "fotovoltaica", nombre: "Fotovoltaica", familia: "oficio" },
    { slug: "iluminacion", nombre: "Iluminación", familia: "oficio" },
    { slug: "plc", nombre: "PLC", familia: "oficio" },
    { slug: "baja-tension", nombre: "Baja tensión", familia: "oficio" },
    { slug: "distribucion", nombre: "Distribución eléctrica", familia: "oficio" },
    { slug: "refrigeracion", nombre: "Refrigeración", familia: "oficio" },
    { slug: "circuitos", nombre: "Circuitos", familia: "oficio" },
    { slug: "microcontroladores", nombre: "Microcontroladores", familia: "oficio" },
    { slug: "arduino", nombre: "Arduino", familia: "oficio" },
    { slug: "semiconductores", nombre: "Semiconductores", familia: "oficio" },
    { slug: "audio-video", nombre: "Audio y video", familia: "oficio" },
    { slug: "algoritmos", nombre: "Algoritmos", familia: "oficio" },
    { slug: "web", nombre: "Páginas web", familia: "oficio" },
    { slug: "bases-de-datos", nombre: "Bases de datos", familia: "oficio" },
    { slug: "moviles", nombre: "Móviles", familia: "oficio" },
    { slug: "iot", nombre: "IoT", familia: "oficio" },
    { slug: "uml", nombre: "Diagrama UML", familia: "oficio" },
    { slug: "redes", nombre: "Redes", familia: "oficio" },
    { slug: "seguridad-ti", nombre: "Seguridad TI", familia: "oficio" },
    { slug: "centros-de-datos", nombre: "Centros de datos", familia: "oficio" },
    { slug: "ofimatica", nombre: "Ofimática", familia: "oficio" },
    { slug: "ccna", nombre: "CCNA", familia: "oficio" },
    { slug: "software", nombre: "Software", familia: "tematica" },
    { slug: "horror", nombre: "Horror", familia: "tematica" },
    { slug: "terror", nombre: "Terror", familia: "tematica" },
    { slug: "halloween", nombre: "Halloween", familia: "tematica" },
    { slug: "navidad", nombre: "Navidad", familia: "tematica" },
    { slug: "deporte", nombre: "Deporte", familia: "tematica" },
    { slug: "musica", nombre: "Música", familia: "tematica" },
    { slug: "historia", nombre: "Historia", familia: "tematica" },
    { slug: "comunidad", nombre: "Comunidad", familia: "tematica" },
    { slug: "energia", nombre: "Energía", familia: "tematica" },
    { slug: "audiovisual", nombre: "Audiovisual", familia: "tematica" },
    { slug: "emprendimiento", nombre: "Emprendimiento", familia: "tematica" }
  ];

  if (!window.INTIWO_ETIQUETAS_SEMILLA) window.INTIWO_ETIQUETAS_SEMILLA = CATALOGO;

  function rol() {
    if (typeof window.intiwoObtenerRol === "function") return window.intiwoObtenerRol();
    return "";
  }

  function puedeEditar() {
    var r = rol();
    var ficha = document.getElementById("intiwo-ficha");
    var academico = ficha && ficha.getAttribute("data-tipo") === "academico";
    if (r === "docente" || r === "administrador" || r === "admin") return true;
    if (r === "academico") return !!(academico && ficha && ficha.classList.contains("es-edicion"));
    if (r !== "editor") return false;
    if (academico) return false;
    return !!(ficha && ficha.classList.contains("es-edicion"));
  }

  function claveFicha() {
    var p = new URLSearchParams(window.location.search);
    return [p.get("tipo") || "", p.get("id") || "", p.get("clave") || "", p.get("rama") || "", p.get("anio") || "2026"].join("|");
  }

  function leerAplicadas() {
    try {
      var bruto = JSON.parse(localStorage.getItem("intiwo-etiquetas-ficha") || "{}");
      var lista = bruto[claveFicha()];
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function guardarAplicadas(slugs) {
    try {
      var bruto = JSON.parse(localStorage.getItem("intiwo-etiquetas-ficha") || "{}");
      bruto[claveFicha()] = slugs;
      localStorage.setItem("intiwo-etiquetas-ficha", JSON.stringify(bruto));
    } catch (e) { /* sin persistencia de padrones */ }
  }

  function porSlug(slug) {
    var i;
    for (i = 0; i < CATALOGO.length; i++) {
      if (CATALOGO[i].slug === slug) return CATALOGO[i];
    }
    return { slug: slug, nombre: slug, familia: "tematica" };
  }

  function asegurarMarkup() {
    if (!document.getElementById("intiwo-panel-etiquetas")) {
      var panel = document.createElement("div");
      panel.id = "intiwo-panel-etiquetas";
      panel.className = "intiwo-panel-etiquetas";
      panel.hidden = true;
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", "intiwo-panel-etiquetas-titulo");
      panel.innerHTML = '<div class="intiwo-panel-etiquetas-cabeza"><h2 id="intiwo-panel-etiquetas-titulo">Etiquetas</h2><button type="button" class="intiwo-btn-icono" data-cerrar-etiquetas aria-label="Cerrar etiquetas">×</button></div>' +
        '<p class="intiwo-panel-etiquetas-ayuda">Catálogo precreado. El Editor aplica; el docente puede corregir. Clic en una etiqueta del listado público abre todos los proyectos con esa etiqueta.</p>' +
        '<label class="intiwo-panel-etiquetas-busca" for="intiwo-panel-etiquetas-q">Buscar</label><input id="intiwo-panel-etiquetas-q" type="search" autocomplete="off" placeholder="zalud → Salud">' +
        '<div id="intiwo-panel-etiquetas-lista" class="intiwo-panel-etiquetas-lista"></div>';
      document.body.appendChild(panel);
    }
    if (!document.getElementById("intiwo-panel-etiquetas-velo")) {
      var velo = document.createElement("div");
      velo.id = "intiwo-panel-etiquetas-velo";
      velo.className = "intiwo-panel-etiquetas-velo";
      velo.hidden = true;
      document.body.appendChild(velo);
    }
    var ficha = document.getElementById("intiwo-ficha");
    if (ficha && !document.getElementById("intiwo-ficha-etiquetas")) {
      var bloque = document.createElement("section");
      bloque.className = "intiwo-ficha-bloque";
      bloque.innerHTML = '<h2>Etiquetas</h2><p class="intiwo-ficha-ayuda">Elige del catálogo. No inventes etiquetas. El clic público lista todos los proyectos con esa etiqueta.</p><ul id="intiwo-ficha-etiquetas" class="intiwo-ficha-chips"></ul><p><button type="button" class="intiwo-pildora" id="intiwo-abrir-etiquetas" hidden>Elegir etiquetas</button></p>';
      var form = ficha.querySelector("form");
      if (form) ficha.insertBefore(bloque, form);
      else ficha.appendChild(bloque);
    }
  }

  function pintarChips() {
    var aplicadas = leerAplicadas();
    ["intiwo-ficha-etiquetas", "intiwo-ficha-etiquetas-lectura"].forEach(function (id) {
      var ul = document.getElementById(id);
      if (!ul) return;
      ul.innerHTML = "";
      aplicadas.forEach(function (slug) {
        var item = porSlug(slug);
        var a = document.createElement("a");
        a.className = "intiwo-ficha-chip";
        a.href = "../listado/pagina-listado-proyectos-codigo.html?etiqueta=" + encodeURIComponent(slug);
        a.textContent = item.nombre;
        ul.appendChild(a);
      });
    });
  }

  function filtrar(q) {
    if (!q) return CATALOGO.slice();
    if (typeof window.intiwoFuzzyOrdenar === "function") {
      return window.intiwoFuzzyOrdenar(q, CATALOGO)
        .filter(function (x) { return x.pts >= 55; })
        .map(function (x) { return x.item; });
    }
    var n = String(q).toLowerCase();
    return CATALOGO.filter(function (e) { return e.nombre.toLowerCase().indexOf(n) !== -1 || e.slug.indexOf(n) !== -1; });
  }

  function pintarLista(q) {
    var caja = document.getElementById("intiwo-panel-etiquetas-lista");
    if (!caja) return;
    caja.innerHTML = "";
    var aplicadas = leerAplicadas();
    var puede = puedeEditar();
    var grupos = {};
    FAMILIAS.forEach(function (f) { grupos[f] = []; });
    filtrar(q).forEach(function (e) {
      if (!grupos[e.familia]) grupos[e.familia] = [];
      grupos[e.familia].push(e);
    });
    FAMILIAS.forEach(function (fam) {
      var items = grupos[fam];
      if (!items || !items.length) return;
      var h = document.createElement("p");
      h.className = "intiwo-panel-etiquetas-fam";
      h.textContent = fam;
      caja.appendChild(h);
      items.forEach(function (e) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "intiwo-ficha-chip";
        b.textContent = e.nombre;
        if (aplicadas.indexOf(e.slug) !== -1) b.classList.add("es-activa");
        b.disabled = !puede;
        b.addEventListener("click", function () {
          if (!puedeEditar()) return;
          var actual = leerAplicadas();
          var i = actual.indexOf(e.slug);
          if (i === -1) actual.push(e.slug);
          else actual.splice(i, 1);
          guardarAplicadas(actual);
          pintarChips();
          pintarLista(document.getElementById("intiwo-panel-etiquetas-q") && document.getElementById("intiwo-panel-etiquetas-q").value);
        });
        caja.appendChild(b);
      });
    });
  }

  function abrir() {
    var panel = document.getElementById("intiwo-panel-etiquetas");
    var velo = document.getElementById("intiwo-panel-etiquetas-velo");
    if (panel) panel.hidden = false;
    if (velo) velo.hidden = false;
    pintarLista("");
    var q = document.getElementById("intiwo-panel-etiquetas-q");
    if (q) q.focus();
  }

  function cerrar() {
    var panel = document.getElementById("intiwo-panel-etiquetas");
    var velo = document.getElementById("intiwo-panel-etiquetas-velo");
    if (panel) panel.hidden = true;
    if (velo) velo.hidden = true;
  }

  function iniciar() {
    asegurarMarkup();
    pintarChips();
    var abrirBtn = document.getElementById("intiwo-abrir-etiquetas");
    if (!abrirBtn && puedeEditar() && !document.getElementById("intiwo-ficha")) {
      abrirBtn = document.createElement("button");
      abrirBtn.type = "button";
      abrirBtn.id = "intiwo-abrir-etiquetas";
      abrirBtn.className = "intiwo-pildora";
      abrirBtn.textContent = "Corregir etiquetas";
      var hueco = document.querySelector(".intiwo-filtro") || document.querySelector(".intiwo-main");
      if (hueco) hueco.appendChild(abrirBtn);
    }
    if (abrirBtn) {
      abrirBtn.hidden = !puedeEditar();
      abrirBtn.addEventListener("click", abrir);
    }
    document.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("[data-cerrar-etiquetas]")) cerrar();
      if (ev.target && ev.target.id === "intiwo-panel-etiquetas-velo") cerrar();
    });
    var q = document.getElementById("intiwo-panel-etiquetas-q");
    if (q) {
      var t = 0;
      q.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { pintarLista(q.value); }, 200);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
