/* INTIWO S1 | fichas Personal | S1-04b | 0-05 = no foto real */
(function () {
  var FOTOS = false;
  var FICHAS = {
    talleres: [],
    basicas: [],
    administracion: []
  };

  var plantilla = document.getElementById("intiwo-plantilla-ficha");
  var aviso = document.querySelector("[data-personal-aviso]");
  if (!plantilla) return;

  function texto(valor) {
    return String(valor || "").trim();
  }

  function pintarBloque(clave, personas) {
    var bloque = document.querySelector("[data-personal-bloque=\"" + clave + "\"]");
    var lista = document.querySelector("[data-personal-lista=\"" + clave + "\"]");
    if (!bloque || !lista) return 0;
    lista.textContent = "";
    personas.forEach(function (persona) {
      var nombre = texto(persona.nombre);
      var cargo = texto(persona.cargo);
      var area = texto(persona.area);
      var bio = texto(persona.bio);
      var correo = texto(persona.correo);
      if (!nombre) return;
      var nodo = plantilla.content.firstElementChild.cloneNode(true);
      nodo.querySelector("[data-ficha-nombre]").textContent = nombre;
      var cargoLinea = cargo;
      if (area) cargoLinea = cargoLinea ? cargoLinea + " · " + area : area;
      nodo.querySelector("[data-ficha-cargo]").textContent = cargoLinea;
      nodo.querySelector("[data-ficha-bio]").textContent = bio;
      var mail = nodo.querySelector("[data-ficha-correo]");
      if (correo) {
        mail.href = "mailto:" + correo;
        mail.textContent = correo;
      } else {
        mail.remove();
      }
      if (FOTOS && texto(persona.foto)) {
        var hueco = nodo.querySelector("[data-ficha-avatar]");
        var img = document.createElement("img");
        img.src = persona.foto;
        img.alt = "";
        hueco.replaceChildren(img);
      }
      lista.appendChild(nodo);
    });
    var hay = lista.children.length > 0;
    bloque.hidden = !hay;
    return lista.children.length;
  }

  var total = 0;
  total += pintarBloque("talleres", FICHAS.talleres);
  total += pintarBloque("basicas", FICHAS.basicas);
  total += pintarBloque("administracion", FICHAS.administracion);
  if (aviso) aviso.hidden = total > 0;
})();
