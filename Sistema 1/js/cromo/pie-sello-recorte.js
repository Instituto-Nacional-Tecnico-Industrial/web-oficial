/* INTIWO S1 | recorte del sello circular soldado al pie */
(function () {
  var pista = document.querySelector(".intiwo-cierre-pista");
  var recorte = document.querySelector(".intiwo-cierre-recorte");
  var pie = document.querySelector(".intiwo-cierre .intiwo-pie");
  if (!pista || !recorte) return;

  function pintarCierre() {
    var sticky = 56;
    var pieH = pie ? pie.offsetHeight : 0;
    var hueco = Math.max(280, (window.innerHeight || 1) - sticky);
    var maxH = hueco;
    var minH = Math.max(220, Math.min(hueco * 0.42, 300));
    if (minH + pieH > hueco) minH = Math.max(180, hueco - pieH);
    var caja = pista.getBoundingClientRect();
    var recorrido = sticky - caja.top;
    var viaje = Math.max(1, caja.height - hueco);
    var t = Math.max(0, Math.min(1, recorrido / viaje));
    if (t > 0.82) t = 1;
    var alto = maxH - t * (maxH - minH);
    recorte.style.setProperty("--recorte-alto", alto.toFixed(1) + "px");
  }

  var pendiente = false;
  function alScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      pintarCierre();
    });
  }

  window.addEventListener("scroll", alScroll, { passive: true });
  window.addEventListener("resize", pintarCierre);
  pintarCierre();
})();
