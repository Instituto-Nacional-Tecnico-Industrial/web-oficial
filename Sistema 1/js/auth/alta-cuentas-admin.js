/* INTIWO | altas, lista de correos y baja logica | admin y docente */
import { supabase } from "../supabase/cliente-supabase.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;
const ROLES_QUE_INVITAN = new Set(["administrador", "docente"]);
const ADMIN_MATRIZ = "intiwo11543@gmail.com";

function avisoEn(form, texto) {
  const nodo = form.querySelector("[data-alta-mensaje]") || form.parentElement.querySelector("[data-alta-mensaje]");
  if (nodo) nodo.textContent = texto;
}

function estadoFila(fila) {
  if (fila.revocado_en && !fila.usado_en) return "invitacion anulada";
  if (fila.revocado_en && fila.usado_en) return "desactivado";
  if (fila.usado_en) return "activo";
  return "correo pendiente";
}

function puedeBorrarFila(fila, rolVista, userId) {
  if (fila.email === ADMIN_MATRIZ) return false;
  if (fila.usado_por === userId) return false;
  if (fila.revocado_en) return false;
  if (rolVista === "administrador") return true;
  return rolVista === "docente" && fila.rol_destino === "editor" && fila.invitado_por === userId;
}

async function invocar(cuerpo) {
  const { data, error } = await supabase.functions.invoke("invitar-cuenta", { body: cuerpo });
  if (error) {
    let detalle = error.message || "";
    try {
      const cuerpoError = error.context && typeof error.context.json === "function"
        ? await error.context.json()
        : data;
      if (cuerpoError && cuerpoError.error) detalle = cuerpoError.error;
    } catch (_e) {
      /* mensaje de invoke */
    }
    throw new Error(detalle || "error desconocido");
  }
  if (data && data.error) throw new Error(data.error);
}

async function listarPendientes(rolVista, userId) {
  const listas = document.querySelectorAll("[data-altas-lista]");
  if (!listas.length || !supabase) return;
  const { data, error } = await supabase
    .from("invitaciones_correo")
    .select("id, email, rol_destino, nombres, apellidos, nombre, usado_en, usado_por, revocado_en, invitado_por, created_at")
    .order("created_at", { ascending: false })
    .limit(40);
  listas.forEach((lista) => {
    lista.replaceChildren();
    if (error) {
      lista.textContent = "No se pudieron leer las altas. Si faltan columnas, corre cuentas-nombres-y-bajas.sql.";
      return;
    }
    const filas = (data || []).filter((fila) => {
      if (rolVista === "docente") return fila.rol_destino === "editor";
      return true;
    });
    if (!filas.length) {
      lista.textContent = "Todavia no hay altas.";
      return;
    }
    filas.forEach((fila) => {
      const articulo = document.createElement("article");
      articulo.className = "intiwo-config-fila-cuenta";
      const texto = document.createElement("p");
      const persona = [fila.nombres, fila.apellidos].filter(Boolean).join(" ") || fila.nombre || "Sin nombre";
      texto.textContent = persona + " · " + fila.email + " · " + fila.rol_destino + " · " + estadoFila(fila);
      articulo.appendChild(texto);
      if (puedeBorrarFila(fila, rolVista, userId)) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "intiwo-config-baja";
        boton.textContent = "Eliminar";
        boton.setAttribute("data-baja-id", fila.id);
        articulo.appendChild(boton);
      }
      lista.appendChild(articulo);
    });
  });
}

function mostrarOpcionMatriz(emailSesion) {
  const esMatriz = String(emailSesion || "").trim().toLowerCase() === ADMIN_MATRIZ;
  document.querySelectorAll("option[data-opcion-matriz]").forEach((opcion) => {
    opcion.hidden = !esMatriz;
    opcion.disabled = !esMatriz;
  });
}

function iniciar() {
  const formularios = document.querySelectorAll("[data-form-alta]");
  if (!formularios.length) return;

  formularios.forEach((form) => {
    form.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      if (!supabase) {
        avisoEn(form, "Falta el cliente de Pages.");
        return;
      }
      const { data: sesionData } = await supabase.auth.getSession();
      const user = sesionData && sesionData.session ? sesionData.session.user : null;
      if (!user) {
        avisoEn(form, "Inicia sesion para dar de alta.");
        return;
      }
      const email = String(form.email.value || "").trim().toLowerCase();
      const nombres = String(form.nombres.value || "").replace(/\s+/g, " ").trim();
      const apellidos = String(form.apellidos.value || "").replace(/\s+/g, " ").trim();
      const rolFijo = form.getAttribute("data-alta-rol-fijo");
      const rol = String(rolFijo || form.rol.value || "").trim().toLowerCase();
      if (nombres.length < 2 || apellidos.length < 2) {
        avisoEn(form, "Escribe nombres y apellidos.");
        return;
      }
      if (email === ADMIN_MATRIZ) {
        avisoEn(form, "Esa cuenta matriz ya existe.");
        return;
      }
      if (!DOMINIOS.test(email)) {
        avisoEn(form, "Usa un correo @inti.edu.sv o @clases.edu.sv.");
        return;
      }
      if (rol === "administrador") {
        const correoSesion = String(user.email || "").trim().toLowerCase();
        if (correoSesion !== ADMIN_MATRIZ) {
          avisoEn(form, "Solo la cuenta matriz puede dar de alta administradores.");
          return;
        }
      }
      if (rol === "editor") {
        const nie = email.split("@")[0];
        if (!/^[0-9]+$/.test(nie)) {
          avisoEn(form, "El editor debe tener el NIE en la parte local del correo (ejemplo 19795194@clases.edu.sv).");
          return;
        }
      }
      avisoEn(form, "Enviando invitacion por correo…");
      try {
        await invocar({ accion: "invitar", email, rol, nombres, apellidos });
      } catch (falla) {
        avisoEn(form, "No se pudo enviar el correo: " + (falla && falla.message ? falla.message : ""));
        return;
      }
      form.reset();
      if (form.rol && rolFijo) form.rol.value = rolFijo;
      avisoEn(form, "Invitacion enviada. Esa persona debe abrir el correo y pulsar el enlace para elegir su contrasena en Cuentas.");
      const rolVista = (window.INTIWO_ROL || "").toLowerCase();
      listarPendientes(rolVista, user.id);
    });
  });

  document.querySelectorAll("[data-altas-lista]").forEach((lista) => {
    lista.addEventListener("click", async (evento) => {
      const boton = evento.target.closest("[data-baja-id]");
      if (!boton || !supabase) return;
      const id = boton.getAttribute("data-baja-id");
      if (!id) return;
      if (!window.confirm("Se desactiva el acceso. No se borra el historial ni los proyectos. ¿Continuar?")) return;
      boton.disabled = true;
      try {
        await invocar({ accion: "baja", id });
      } catch (falla) {
        window.alert(falla && falla.message ? falla.message : "No se pudo dar de baja.");
        boton.disabled = false;
        return;
      }
      const { data: sesionData } = await supabase.auth.getSession();
      const user = sesionData && sesionData.session ? sesionData.session.user : null;
      listarPendientes((window.INTIWO_ROL || "").toLowerCase(), user ? user.id : "");
    });
  });

  window.addEventListener("intiwo:auth-state-changed", async (evento) => {
    const rol = evento.detail && evento.detail.rol;
    const { data: sesionData } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
    const user = sesionData && sesionData.session ? sesionData.session.user : null;
    const correo = user ? user.email : "";
    mostrarOpcionMatriz(correo);
    if (ROLES_QUE_INVITAN.has(rol)) listarPendientes(rol, user ? user.id : "");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
