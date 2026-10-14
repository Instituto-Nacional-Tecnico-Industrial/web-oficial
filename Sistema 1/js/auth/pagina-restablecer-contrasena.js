import { supabase } from "../supabase/cliente-supabase.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;
const ADMIN_MATRIZ = "intiwo11543@gmail.com";

function mensaje(texto, error) {
  const nodo = document.querySelector("[data-cuentas-mensaje]");
  if (!nodo) return;
  nodo.textContent = texto;
  nodo.classList.toggle("es-error", Boolean(error));
}

const form = document.getElementById("intiwo-form-restablecer");
if (!supabase) {
  mensaje("Entra por el sitio publicado en GitHub.", true);
} else if (form) {
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = String(form.email.value || "").trim().toLowerCase();
    if (email !== ADMIN_MATRIZ && !DOMINIOS.test(email)) {
      mensaje("Usa el correo institucional con el que te dieron de alta.", true);
      return;
    }
    mensaje("Enviando enlace…");
    const destino = new URL("pagina-definir-contrasena.html", window.location.href).href;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: destino });
    if (error) {
      mensaje(error.message, true);
      return;
    }
    mensaje("Si el correo existe, llegara un enlace para elegir una contrasena nueva. Revisa tambien Spam.");
  });
}
