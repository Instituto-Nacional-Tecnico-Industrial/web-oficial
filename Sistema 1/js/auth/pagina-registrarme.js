import { supabase } from "../supabase/cliente-supabase.js";
import { enlazarOjos, enlazarGenerador } from "./cuentas-campo-clave.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;

function mensaje(texto, error) {
  const nodo = document.querySelector("[data-cuentas-mensaje]");
  if (!nodo) return;
  nodo.textContent = texto;
  nodo.classList.toggle("es-error", Boolean(error));
}

enlazarOjos(document);
const form = document.getElementById("intiwo-form-registro");
if (form) {
  enlazarGenerador(
    document.getElementById("intiwo-generar-clave"),
    form.password,
    form.password2
  );
}

if (!supabase) {
  mensaje("Entra por el sitio publicado en GitHub para registrarte.", true);
} else if (form) {
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = String(form.email.value || "").trim().toLowerCase();
    const password = form.password.value;
    const repetir = form.password2.value;
    if (!DOMINIOS.test(email)) {
      mensaje("El registro es solo para @inti.edu.sv o @clases.edu.sv.", true);
      return;
    }
    if (password.length < 9) {
      mensaje("La contrasena debe tener al menos 9 caracteres (3 letras, 3 numeros y 3 signos).", true);
      return;
    }
    if (password !== repetir) {
      mensaje("Las contrasenas no coinciden. Revisa mayusculas y minusculas.", true);
      return;
    }
    mensaje("Creando cuenta…");
    const destino = new URL("pagina-definir-contrasena.html", window.location.href).href;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: destino }
    });
    if (error) {
      const texto = error.message || "";
      if (texto.indexOf("dado de alta") !== -1 || texto.indexOf("P0001") !== -1) {
        mensaje("Tu docente o administrador aun no te ha dado de alta.", true);
        return;
      }
      mensaje(texto, true);
      return;
    }
    mensaje("Si el alta existia, la cuenta quedo creada. Si pide confirmar correo, revisa la bandeja; si no, inicia sesion.");
  });
}
