import { supabase } from "../supabase/cliente-supabase.js";
import { recordarSesion } from "./cuentas-sesiones.js";
import { enlazarOjos } from "./cuentas-campo-clave.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;
const ADMIN_MATRIZ = "intiwo11543@gmail.com";

function mensaje(texto, error) {
  const nodo = document.querySelector("[data-cuentas-mensaje]");
  if (!nodo) return;
  nodo.textContent = texto;
  nodo.classList.toggle("es-error", Boolean(error));
}

enlazarOjos(document);

const form = document.getElementById("intiwo-form-login");
if (!supabase) {
  mensaje("Entra por el sitio publicado en GitHub para iniciar sesion.", true);
} else if (form) {
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = String(form.email.value || "").trim().toLowerCase();
    const password = form.password.value;
    if (email !== ADMIN_MATRIZ && !DOMINIOS.test(email)) {
      mensaje("Solo el administrador matriz o correos @inti.edu.sv / @clases.edu.sv.", true);
      return;
    }
    mensaje("Entrando…");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      mensaje(error.message === "Invalid login credentials" ? "Correo o contrasena incorrectos." : error.message, true);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const user = data && data.session ? data.session.user : null;
    let perfil = null;
    if (user) {
      const lectura = await supabase.from("perfiles").select("id, rol, nombre, nombres, apellidos, desactivado_en").eq("id", user.id).maybeSingle();
      perfil = lectura.data;
      if (perfil && perfil.desactivado_en) {
        await supabase.auth.signOut({ scope: "local" });
        mensaje("Esta cuenta esta desactivada.", true);
        return;
      }
    }
    await recordarSesion(supabase, perfil ? perfil.rol : "", perfil);
    window.location.href = new URL("../inicio/pagina-inicio-cms.html", window.location.href).href;
  });
}
