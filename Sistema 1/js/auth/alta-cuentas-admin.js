/* INTIWO | admin da de alta y envia correo de invitacion */
import { supabase } from "../supabase/cliente-supabase.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;

function aviso(texto) {
  const nodo = document.querySelector("[data-alta-mensaje]");
  if (nodo) nodo.textContent = texto;
}

async function listarPendientes() {
  const lista = document.getElementById("intiwo-altas-lista");
  if (!lista || !supabase) return;
  const { data, error } = await supabase
    .from("invitaciones_correo")
    .select("email, rol_destino, usado_en, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    lista.textContent = "No se pudieron leer las altas.";
    return;
  }
  if (!data || !data.length) {
    lista.textContent = "Todavia no hay altas.";
    return;
  }
  lista.replaceChildren();
  data.forEach((fila) => {
    const p = document.createElement("p");
    p.textContent = fila.email + " ? " + fila.rol_destino + (fila.usado_en ? " (ya activo)" : " (correo pendiente o sin confirmar)");
    lista.appendChild(p);
  });
}

function iniciar() {
  const form = document.getElementById("intiwo-form-alta");
  if (!form) return;

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!supabase) {
      aviso("Falta el cliente de Pages.");
      return;
    }
    const { data: sesionData } = await supabase.auth.getSession();
    const user = sesionData && sesionData.session ? sesionData.session.user : null;
    if (!user) {
      aviso("Inicia sesion como administrador.");
      return;
    }
    const email = String(form.email.value || "").trim().toLowerCase();
    const rol = form.rol.value;
    if (!DOMINIOS.test(email)) {
      aviso("Usa un correo @inti.edu.sv o @clases.edu.sv.");
      return;
    }
    if (rol === "editor") {
      const nie = email.split("@")[0];
      if (!/^[0-9]+$/.test(nie)) {
        aviso("El editor debe tener el NIE en la parte local del correo (ejemplo 19795194@clases.edu.sv).");
        return;
      }
    }
    aviso("Enviando invitacion por correo…");
    const { data, error } = await supabase.functions.invoke("invitar-cuenta", {
      body: { email, rol }
    });
    let detalle = "";
    if (error) {
      detalle = error.message || "";
      try {
        const cuerpoError = error.context && typeof error.context.json === "function"
          ? await error.context.json()
          : data;
        if (cuerpoError && cuerpoError.error) detalle = cuerpoError.error;
      } catch (_e) {
        /* se deja el mensaje de invoke */
      }
      aviso("No se pudo enviar el correo: " + (detalle || "error desconocido"));
      return;
    }
    if (data && data.error) {
      aviso(data.error);
      return;
    }
    form.reset();
    aviso("Invitacion enviada. Esa persona debe abrir el correo de INTIWO/Supabase y pulsar el enlace para elegir su contrasena en Cuentas.");
    listarPendientes();
  });

  window.addEventListener("intiwo:auth-state-changed", (evento) => {
    if (evento.detail && evento.detail.rol === "administrador") listarPendientes();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
