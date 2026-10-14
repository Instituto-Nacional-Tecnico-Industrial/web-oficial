/* INTIWO S2 | Editor solo contenido tecnico; no archiva; academico sin Personalizar | S2N-03a DB-00f */
(function () {
  var params = new URLSearchParams(window.location.search);
  var tipo = params.get("tipo") || "tecnico";
  var modo = params.get("modo") || "ver";
  var clave = (params.get("clave") || "").toUpperCase();
  var rama = params.get("rama") || "";
  var anio = params.get("anio") || "2026";
  if (!/^\d{4}$/.test(anio) || Number(anio) < 2026) anio = "2026";
  var meta = window.INTIWO_RAMAS && window.INTIWO_RAMAS[rama];
  var etiqueta = meta ? meta.etiqueta : "";
  var academico = tipo === "academico";

  var ficha = document.getElementById("intiwo-ficha");
  var tituloEl = document.getElementById("intiwo-ficha-titulo");
  var metaEl = document.getElementById("intiwo-ficha-meta");
  var avisoEl = document.getElementById("intiwo-ficha-aviso");
  var bloqueTec = document.getElementById("intiwo-ficha-tecnico");
  var bloqueAca = document.getElementById("intiwo-ficha-academico");
  var equipoUl = document.getElementById("intiwo-ficha-equipo");
  var equipoVacio = document.getElementById("intiwo-ficha-equipo-vacio");
  var docenteEl = document.getElementById("intiwo-ficha-docente");
  var autoresEl = document.getElementById("intiwo-ficha-autores");
  var manoEl = document.getElementById("intiwo-ficha-mano");
  var cuerpoEl = document.getElementById("intiwo-ficha-cuerpo");
  var urlsUl = document.getElementById("intiwo-ficha-urls");
  var urlsVacio = document.getElementById("intiwo-ficha-urls-vacio");
  var plantillaUrl = document.getElementById("intiwo-plantilla-url");
  var campoTitulo = document.getElementById("intiwo-ficha-campo-titulo");
  var campoCuerpo = document.getElementById("intiwo-ficha-campo-cuerpo");
  var campoUrls = document.getElementById("intiwo-ficha-campo-urls");
  var guardar = document.getElementById("intiwo-ficha-guardar");
  var notaGuardar = document.getElementById("intiwo-ficha-nota-guardar");
  var urlsPrevia = document.getElementById("intiwo-ficha-urls-previa");

  function rol() {
    if (typeof window.intiwoObtenerRol === "function") return window.intiwoObtenerRol();
    return "";
  }

  function iconoDe(url) {
    if (typeof window.intiwoIconoPlataforma === "function") return window.intiwoIconoPlataforma(url);
    return "#i-globe";
  }

  function pintarUrls(filas, destino) {
    var caja = destino || urlsUl;
    if (!caja || !plantillaUrl) return;
    caja.innerHTML = "";
    var hay = Array.isArray(filas) && filas.length > 0;
    if (!destino && urlsVacio) urlsVacio.hidden = hay;
    if (!hay) return;
    filas.forEach(function (href) {
      var nodo = plantillaUrl.content.cloneNode(true);
      var li = nodo.querySelector(".intiwo-ficha-url");
      var use = nodo.querySelector("use");
      var a = nodo.querySelector("a");
      var plat = typeof window.intiwoPlataformaUrl === "function" ? window.intiwoPlataformaUrl(href) : "web";
      var hrefIco = iconoDe(href);
      if (li) li.setAttribute("data-plataforma", plat);
      if (use) {
        use.setAttribute("href", hrefIco);
        if (use.href && use.href.baseVal !== undefined) use.href.baseVal = hrefIco;
      }
      if (a) {
        a.href = /^https?:\/\//i.test(href) ? href : "https://" + href;
        a.textContent = href;
      }
      caja.appendChild(nodo);
    });
  }

  function pintarPersonas(ul, vacio, nombres) {
    if (!ul) return;
    ul.innerHTML = "";
    var hay = Array.isArray(nombres) && nombres.length > 0;
    if (vacio) vacio.hidden = hay;
    if (!hay) return;
    nombres.forEach(function (nombre) {
      var li = document.createElement("li");
      li.textContent = nombre;
      ul.appendChild(li);
    });
  }

  if (ficha) ficha.setAttribute("data-tipo", academico ? "academico" : "tecnico");
  if (bloqueTec) bloqueTec.hidden = academico;
  if (bloqueAca) bloqueAca.hidden = !academico;

  if (tituloEl) tituloEl.textContent = "Proyecto";
  document.title = "Proyecto | INTIWO";

  if (academico) {
    if (metaEl) metaEl.textContent = [etiqueta || "Asignatura", "año lectivo " + anio].filter(Boolean).join(" · ");
    if (autoresEl) autoresEl.textContent = "Aún no hay docentes autores publicados.";
    if (manoEl) manoEl.textContent = "Aún no hay códigos de mano de obra (1.º y 2.º).";
  } else {
    if (metaEl) metaEl.textContent = [clave || "Código", etiqueta, "año lectivo " + anio].filter(Boolean).join(" · ");
    if (docenteEl) docenteEl.textContent = "Aún no hay docente publicado.";
    pintarPersonas(equipoUl, equipoVacio, []);
  }

  if (cuerpoEl) cuerpoEl.textContent = "Aún no hay descripción publicada.";
  pintarUrls([]);

  var editorQuiereEditar = modo === "personalizar" && rol() === "editor";
  if (academico && editorQuiereEditar) {
    if (avisoEl) {
      avisoEl.hidden = false;
      avisoEl.textContent = "El Editor alumno no Personaliza proyectos académicos. Estos los conciben los docentes.";
    }
  } else if (editorQuiereEditar && !academico && ficha) {
    ficha.classList.add("es-edicion");
    if (campoTitulo) campoTitulo.value = "";
    if (campoCuerpo) campoCuerpo.value = "";
    if (campoUrls) {
      campoUrls.value = "";
      function refrescarPrevia() {
        var lineas = typeof window.intiwoLineasUrl === "function" ? window.intiwoLineasUrl(campoUrls.value) : [];
        pintarUrls(lineas, urlsPrevia);
      }
      campoUrls.addEventListener("input", refrescarPrevia);
      campoUrls.addEventListener("paste", function () { setTimeout(refrescarPrevia, 0); });
    }
    if (notaGuardar) {
      notaGuardar.hidden = false;
      notaGuardar.textContent = "Puedes cambiar el contenido permitido. No puedes archivar ni reasignar el líder (DB-00f). Se guardará cuando exista la base.";
    }
  }

  if (guardar) {
    guardar.addEventListener("click", function (ev) {
      ev.preventDefault();
      if (notaGuardar) {
        notaGuardar.hidden = false;
        notaGuardar.textContent = "Todavía no hay tabla de proyectos. El Editor no archiva la caja.";
      }
    });
  }
})();
