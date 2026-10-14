/* INTIWO | hub Cuentas: solo dos destinos */
const hash = window.location.hash || "";
if (hash.indexOf("type=invite") !== -1 || hash.indexOf("type=recovery") !== -1) {
  window.location.replace(new URL("pagina-definir-contrasena.html", window.location.href).href + hash);
}
