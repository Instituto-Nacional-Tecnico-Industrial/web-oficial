/* INTIWO | altas, codigos, lista de correos y baja logica | admin y docente */
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

function claveDe(fila) {
  const codigo = fila.codigos;
  if (codigo && codigo.clave) return codigo.clave;
  return "";
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

function mostrarCampoCodigoAdmin() {
  document.querySelectorAll("[data-form-alta]:not([data-alta-rol-fijo])").forEach((form) => {
    const campo = form.querySelector("[data-campo-codigo]");
    const selectRol = form.rol;
    if (!campo || !selectRol) return;
    const esEditor = String(selectRol.value || "") === "editor";
    campo.hidden = !esEditor;
    const selectCod = form.querySelector("[data-codigos-select]");
    if (selectCod) selectCod.required = esEditor;
  });
}

async function llenarEspecialidades() {
  const selects = document.querySelectorAll("[data-especialidad-select]");
  if (!selects.length || !supabase) return;
  const { data, error } = await supabase
    .from("especialidades")
    .select("id, nombre_corto, prefijo, tipo")
    .eq("tipo", "tecnica")
    .order("orden");
  selects.forEach((select) => {
    const actual = select.value;
    select.replaceChildren();
    const vacio = document.createElement("option");
    vacio.value = "";
    vacio.textContent = error ? "No se leyeron especialidades (corre codigos-y-membresias.sql)" : "Elige especialidad";
    select.appendChild(vacio);
    (data || []).forEach((esp) => {
      const op = document.createElement("option");
      op.value = esp.id;
      op.textContent = esp.prefijo + " · " + esp.nombre_corto;
      op.dataset.prefijo = esp.prefijo;
      select.appendChild(op);
    });
    if (actual) select.value = actual;
  });
}

async function llenarSelectCodigos(rolVista, userId) {
  const selects = document.querySelectorAll("[data-codigos-select]");
  if (!selects.length || !supabase) return;
  let consulta = supabase
    .from("codigos")
    .select("id, clave, anio_lectivo, docente_id")
    .is("desactivado_en", null)
    .order("clave");
  if (rolVista === "docente") consulta = consulta.eq("docente_id", userId);
  const { data, error } = await consulta;
  selects.forEach((select) => {
    const actual = select.value;
    select.replaceChildren();
    const vacio = document.createElement("option");
    vacio.value = "";
    vacio.textContent = error
      ? "Falta correr codigos-y-membresias.sql"
      : (data && data.length ? "Elige un codigo" : "Crea un codigo primero");
    select.appendChild(vacio);
    (data || []).forEach((codigo) => {
      const op = document.createElement("option");
      op.value = codigo.id;
      op.textContent = codigo.clave + " (" + codigo.anio_lectivo + ")";
      select.appendChild(op);
    });
    if (actual) select.value = actual;
  });
}

async function listarMisCodigos(userId) {
  const caja = document.querySelector("[data-codigos-mios]");
  if (!caja || !supabase) return;
  const { data, error } = await supabase
    .from("codigos")
    .select("id, clave, anio_lectivo, nivel, seccion")
    .eq("docente_id", userId)
    .is("desactivado_en", null)
    .order("clave");
  caja.replaceChildren();
  if (error) {
    caja.textContent = "No se pudieron leer tus codigos. Corre Sistema 1/supabase/codigos-y-membresias.sql.";
    return;
  }
  if (!data || !data.length) {
    caja.textContent = "Todavia no tienes codigos.";
    return;
  }
  data.forEach((codigo) => {
    const p = document.createElement("p");
    p.textContent = codigo.clave + " · " + codigo.anio_lectivo;
    caja.appendChild(p);
  });
}

async function listarPendientes(rolVista, userId) {
  const listas = document.querySelectorAll("[data-altas-lista]");
  if (!listas.length || !supabase) return;
  const columnas = "id, email, rol_destino, nombres, apellidos, nombre, usado_en, usado_por, revocado_en, invitado_por, created_at, codigo_id";
  let { data, error } = await supabase
    .from("invitaciones_correo")
    .select(columnas + ", codigos(clave)")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) {
    const reintento = await supabase
      .from("invitaciones_correo")
      .select(columnas)
      .order("created_at", { ascending: false })
      .limit(40);
    data = reintento.data;
    error = reintento.error;
  }
  listas.forEach((lista) => {
    lista.replaceChildren();
    if (error) {
      lista.textContent = "No se pudieron leer las altas.";
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
      const grupo = claveDe(fila);
      texto.textContent = persona + " · " + fila.email + " · " + fila.rol_destino
        + (grupo ? " · " + grupo : "") + " · " + estadoFila(fila);
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
    if (form.rol && !form.getAttribute("data-alta-rol-fijo")) {
      form.rol.addEventListener("change", mostrarCampoCodigoAdmin);
    }
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
      const codigo_id = form.codigo_id ? String(form.codigo_id.value || "").trim() : "";
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
        if (!codigo_id) {
          avisoEn(form, "Elige el codigo del grupo. Si no hay, crealo primero.");
          return;
        }
      }
      avisoEn(form, "Enviando invitacion por correo…");
      try {
        const cuerpo = { accion: "invitar", email, rol, nombres, apellidos };
        if (rol === "editor") cuerpo.codigo_id = codigo_id;
        await invocar(cuerpo);
      } catch (falla) {
        avisoEn(form, "No se pudo enviar el correo: " + (falla && falla.message ? falla.message : ""));
        return;
      }
      form.reset();
      if (form.rol && rolFijo) form.rol.value = rolFijo;
      mostrarCampoCodigoAdmin();
      avisoEn(form, "Invitacion enviada. Esa persona debe abrir el correo y elegir su contrasena. Al activar queda en miembro_codigo.");
      const rolVista = (window.INTIWO_ROL || "").toLowerCase();
      listarPendientes(rolVista, user.id);
    });
  });

  const formCodigo = document.querySelector("[data-form-codigo]");
  if (formCodigo) {
    formCodigo.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const aviso = document.querySelector("[data-codigo-mensaje]");
      if (!supabase) {
        if (aviso) aviso.textContent = "Falta el cliente de Pages.";
        return;
      }
      const { data: sesionData } = await supabase.auth.getSession();
      const user = sesionData && sesionData.session ? sesionData.session.user : null;
      if (!user) {
        if (aviso) aviso.textContent = "Inicia sesion.";
        return;
      }
      const especialidadId = String(formCodigo.especialidad_id.value || "");
      const opcion = formCodigo.especialidad_id.selectedOptions[0];
      const prefijo = opcion && opcion.dataset.prefijo ? opcion.dataset.prefijo : "";
      const nivel = Number(formCodigo.nivel.value);
      const seccion = String(formCodigo.seccion.value || "").trim().toUpperCase();
      const anio = Number(formCodigo.anio_lectivo.value);
      if (!especialidadId || !prefijo || !/^[A-Z]$/.test(seccion) || nivel < 1 || nivel > 3 || anio < 2026) {
        if (aviso) aviso.textContent = "Completa especialidad, nivel 1-3, seccion A-Z y anio desde 2026.";
        return;
      }
      const clave = prefijo + String(nivel) + seccion;
      if (aviso) aviso.textContent = "Creando " + clave + "…";
      const { error } = await supabase.from("codigos").insert({
        clave,
        especialidad_id: especialidadId,
        nivel,
        seccion,
        docente_id: user.id,
        anio_lectivo: anio,
      });
      if (error) {
        if (aviso) aviso.textContent = "No se creo el codigo: " + error.message;
        return;
      }
      formCodigo.reset();
      formCodigo.anio_lectivo.value = "2026";
      if (aviso) aviso.textContent = "Codigo " + clave + " creado. Ya puedes invitar alumnos a ese grupo.";
      const rolVista = (window.INTIWO_ROL || "").toLowerCase();
      await llenarSelectCodigos(rolVista, user.id);
      await listarMisCodigos(user.id);
    });
  }

  document.querySelectorAll("[data-altas-lista]").forEach((lista) => {
    lista.addEventListener("click", async (evento) => {
      const boton = evento.target.closest("[data-baja-id]");
      if (!boton || !supabase) return;
      const id = boton.getAttribute("data-baja-id");
      if (!id) return;
      if (!window.confirm("Se desactiva el acceso. No se borra el historial ni los proyectos. Continuar?")) return;
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
    mostrarCampoCodigoAdmin();
    if (!ROLES_QUE_INVITAN.has(rol) || !user) return;
    await llenarEspecialidades();
    await llenarSelectCodigos(rol, user.id);
    await listarMisCodigos(user.id);
    listarPendientes(rol, user.id);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
