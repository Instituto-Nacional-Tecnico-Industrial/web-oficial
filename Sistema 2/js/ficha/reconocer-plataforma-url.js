/* INTIWO S2 | icono segun URL | BACKLOG S2N-03b */
window.intiwoPlataformaUrl = function (url) {
  var texto = String(url || "").trim().toLowerCase();
  if (!texto) return "web";
  if (texto.indexOf("github.com") !== -1 || texto.indexOf("github.io") !== -1) return "github";
  if (texto.indexOf("drive.google.com") !== -1 || texto.indexOf("docs.google.com") !== -1) return "drive";
  if (texto.indexOf("youtube.com") !== -1 || texto.indexOf("youtu.be") !== -1) return "youtube";
  return "web";
};
