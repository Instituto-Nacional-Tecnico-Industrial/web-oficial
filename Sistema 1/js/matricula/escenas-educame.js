/* INTIWO S1 | refuerzo visual de las escenas EDUCAME */
(function () {
  var numero = document.querySelector(".intiwo-edu-numero a");
  if (!numero) return;

  var latido = 0;
  window.setInterval(function () {
    latido = latido ? 0 : 1;
    numero.style.opacity = latido ? "1" : "0.72";
  }, 900);
})();
