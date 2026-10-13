/* INTIWO | login y registro con invitacion | Cuentas */
import { supabase } from "../supabase/cliente-supabase.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;
const ADMIN_MATRIZ = "intiwo11543@gmail.com";

function mensaje(nodo, texto) {
  if (nodo) nodo.textContent = texto;
}

function mostrar(formulario, si) {
  if (formulario) formulario.hidden = !si;
}

function correoValidoLogin(email) {
  const valor = String(email || "").trim().toLowerCase();
  return valor === ADMIN_MATRIZ || DOMINIOS.test(valor);
}

function iniciar() {
  const nodo = document.querySelector("[data-cuentas-mensaje]");
  const formLogin = document.getElementById("intiwo-form-login");
  const formRegistro = document.getElementById("intiwo-form-registro");
  const btnSalir = document.getElementById("intiwo-cuentas-salir");

  if (!supabase) {
    mensaje(nodo, "Esta copia local no tiene la clave de Pages. Entra por el sitio publicado en GitHub para iniciar sesion.");
    return;
  }

  document.querySelectorAll("[data-cuentas-accion]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const accion = boton.dataset.cuentasAccion;
      mostrar(formLogin, accion === "login");
      mostrar(formRegistro, accion === "registro");
      mensaje(nodo, accion === "login"
        ? "Usa el correo con el que te dieron de alta y tu contrasena."
        : "Solo si un administrador o docente ya te dio de alta. Tu eliges la contrasena.");
    });
  });

  if (formLogin) {
    formLogin.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const email = String(formLogin.email.value || "").trim().toLowerCase();
      const password = formLogin.password.value;
      if (!correoValidoLogin(email)) {
        mensaje(nodo, "Solo se admite el administrador matriz o correos @inti.edu.sv / @clases.edu.sv.");
        return;
      }
      mensaje(nodo, "Entrando…");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        mensaje(nodo, error.message === "Invalid login credentials"
          ? "Correo o contrasena incorrectos."
          : error.message);
        return;
      }
      const inicio = new URL("../inicio/pagina-inicio-cms.html", window.location.href).href;
      window.location.href = inicio;
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const email = String(formRegistro.email.value || "").trim().toLowerCase();
      const password = formRegistro.password.value;
      const repetir = formRegistro.password2.value;
      if (!DOMINIOS.test(email)) {
        mensaje(nodo, "El registro es solo para @inti.edu.sv o @clases.edu.sv. El administrador matriz ya existe.");
        return;
      }
      if (password.length < 8) {
        mensaje(nodo, "La contrasena debe tener al menos 8 caracteres.");
        return;
      }
      if (password !== repetir) {
        mensaje(nodo, "Las contrasenas no coinciden.");
        return;
      }
      mensaje(nodo, "Creando cuenta…");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.href }
      });
      if (error) {
        const texto = error.message || "";
        if (texto.indexOf("dado de alta") !== -1 || texto.indexOf("P0001") !== -1) {
          mensaje(nodo, "Tu docente o administrador aun no te ha dado de alta.");
          return;
        }
        mensaje(nodo, texto);
        return;
      }
      mensaje(nodo, "Si el alta existia, la cuenta quedo creada. Si pide confirmar correo, revisa la bandeja; si no, inicia sesion.");
    });
  }

  if (btnSalir) {
    btnSalir.addEventListener("click", async () => {
      await supabase.auth.signOut();
      mensaje(nodo, "Sesion cerrada.");
    });
    window.addEventListener("intiwo:auth-state-changed", (evento) => {
      const rol = evento.detail && evento.detail.rol;
      btnSalir.hidden = !rol;
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
