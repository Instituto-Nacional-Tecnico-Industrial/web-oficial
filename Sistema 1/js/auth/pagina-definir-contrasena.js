import { supabase } from "../supabase/cliente-supabase.js";
import { recordarSesion } from "./cuentas-sesiones.js";
import { enlazarOjos, enlazarGenerador } from "./cuentas-campo-clave.js";

function mensaje(texto, error) {
  const nodo = document.querySelector("[data-cuentas-mensaje]");
  if (!nodo) return;
  nodo.textContent = texto;
  nodo.classList.toggle("es-error", Boolean(error));
}

enlazarOjos(document);
const form = document.getElementById("intiwo-form-definir");
if (form) {
  enlazarGenerador(
    document.getElementById("intiwo-generar-clave"),
    form.password,
    form.password2
  );
}

const hash = window.location.hash || "";
const invitacion = hash.indexOf("type=invite") !== -1 || hash.indexOf("type=recovery") !== -1;
if (invitacion) {
  mensaje("Elige tu contrasena para activar o restablecer la cuenta.");
}

if (!supabase) {
  mensaje("Entra por el sitio publicado en GitHub.", true);
} else if (form) {
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const password = form.password.value;
    const repetir = form.password2.value;
    if (password.length < 9) {
      mensaje("La contrasena debe tener al menos 9 caracteres.", true);
      return;
    }
    if (password !== repetir) {
      mensaje("Las contrasenas no coinciden.", true);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      mensaje(error.message, true);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const user = data && data.session ? data.session.user : null;
    let perfil = null;
    if (user) {
      const lectura = await supabase.from("perfiles").select("id, rol, nombre, nombres, apellidos").eq("id", user.id).maybeSingle();
      perfil = lectura.data;
    }
    await recordarSesion(supabase, perfil ? perfil.rol : "", perfil);
    window.location.href = new URL("../inicio/pagina-inicio-cms.html", window.location.href).href;
  });
}
