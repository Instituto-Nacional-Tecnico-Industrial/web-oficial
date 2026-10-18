/* INTIWO | altas, codigos, lista de correos y baja logica | admin y docente */
import { supabase } from "../supabase/cliente-supabase.js";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;
const ROLES_QUE_INVITAN = new Set(["administrador", "docente"]);
const ADMIN_MATRIZ = "intiwo11543@gmail.com";
const PREFIJOS_CODIGO = new Set(["DS", "EL", "MI", "MA", "SE", "IT"]);

function construirClaveCodigo(prefijo, nivel, seccion) {
  const pre = String(prefijo || "").trim().toUpperCase();
  const niv = Number(nivel);
  const sec = String(seccion || "").trim().toUpperCase();
  if (!PREFIJOS_CODIGO.has(pre) || pre === "GE") return "";
  if (niv < 1 || niv > 3) return "";
  if (!/^[A-Z]$/.test(sec)) return "";
  const clave = pre + String(niv) + sec;
  return /^[A-Z]{2}[123][A-Z]$/.test(clave) ? clave : "";
}

function mensajeErrorCodigo(error) {
  const texto = String(error && error.message ? error.message : "");
  const codigo = String(error && error.code ? error.code : "");
  if (codigo === "23505" || /duplicate|unique/i.test(texto)) {
    return "Ese codigo ya existe en ese anio (misma clave o misma especialidad + nivel + seccion).";
  }
  return "No se creo el codigo: " + texto;
}

function pintarVistaClave(form) {
  if (!form) return;
  const vista = form.parentElement && form.parentElement.querySelector("[data-codigo-clave-vista]");
  if (!vista) return;
  const opcion = form.especialidad_id && form.especialidad_id.selectedOptions[0];
  const prefijo = opcion && opcion.dataset.prefijo ? opcion.dataset.prefijo : "";
  const clave = construirClaveCodigo(prefijo, form.nivel && form.nivel.value, form.seccion && form.seccion.value);
  vista.textContent = clave ? "Clave: " + clave : "Clave: especialidad + nivel + seccion (ejemplo DS2B). Sin GE.";
}

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

function puedeActuarFila(fila, rolVista, userId) {
  if (fila.email === ADMIN_MATRIZ) return false;
  if (fila.usado_por === userId) return false;
  if (rolVista === "administrador") return true;
  return rolVista === "docente" && fila.rol_destino === "editor" && fila.invitado_por === userId;
}

function puedeDesactivarFila(fila, rolVista, userId) {
  return puedeActuarFila(fila, rolVista, userId) && !fila.revocado_en;
}

function puedeActivarFila(fila, rolVista, userId) {
  return puedeActuarFila(fila, rolVista, userId) && Boolean(fila.revocado_en);
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
    const campoLista = form.querySelector("[data-campo-n-lista]");
    if (campoLista) campoLista.hidden = !esEditor;
    const inputLista = form.querySelector("[name=n_lista]");
    if (inputLista) inputLista.required = esEditor;
  });
}

async function llenarEspecialidades() {
  const selects = document.querySelectorAll("[data-especialidad-select]");
  if (!selects.length || !supabase) return;
  const { data, error } = await supabase
    .from("especialidades")
    .select("id, nombre_corto, prefijo, tipo")
    .eq("tipo", "tecnica")
    .neq("prefijo", "GE")
    .order("orden");
  selects.forEach((select) => {
    const actual = select.value;
    select.replaceChildren();
    const vacio = document.createElement("option");
    vacio.value = "";
    vacio.textContent = error ? "No se leyeron especialidades (corre codigos-y-membresias.sql)" : "Elige especialidad";
    select.appendChild(vacio);
    (data || []).forEach((esp) => {
      if (!PREFIJOS_CODIGO.has(String(esp.prefijo || "").toUpperCase())) return;
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
    p.textContent = codigo.clave + " · niv. " + codigo.nivel + codigo.seccion + " · " + codigo.anio_lectivo;
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
      if (puedeDesactivarFila(fila, rolVista, userId)) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "intiwo-config-baja";
        boton.textContent = "Desactivar";
        boton.setAttribute("data-baja-id", fila.id);
        articulo.appendChild(boton);
      }
      if (puedeActivarFila(fila, rolVista, userId)) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "intiwo-pildora";
        boton.textContent = "Activar";
        boton.setAttribute("data-activar-id", fila.id);
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
        const nLista = Number(form.n_lista && form.n_lista.value);
        if (!Number.isInteger(nLista) || nLista < 1) {
          avisoEn(form, "Escribe el numero de lista (n_lista) del alumno.");
          return;
        }
      }
      avisoEn(form, "Enviando invitacion por correo…");
      try {
        const cuerpo = { accion: "invitar", email, rol, nombres, apellidos };
        if (rol === "editor") {
          cuerpo.codigo_id = codigo_id;
          cuerpo.n_lista = Number(form.n_lista && form.n_lista.value);
        }
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
    formCodigo.addEventListener("input", () => pintarVistaClave(formCodigo));
    formCodigo.addEventListener("change", () => pintarVistaClave(formCodigo));
    pintarVistaClave(formCodigo);
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
      const rolVista = String(window.INTIWO_ROL || "").toLowerCase();
      if (rolVista !== "docente") {
        if (aviso) aviso.textContent = "Solo el docente crea codigos de su grupo.";
        return;
      }
      const especialidadId = String(formCodigo.especialidad_id.value || "");
      const opcion = formCodigo.especialidad_id.selectedOptions[0];
      const prefijo = opcion && opcion.dataset.prefijo ? opcion.dataset.prefijo : "";
      const nivel = Number(formCodigo.nivel.value);
      const seccion = String(formCodigo.seccion.value || "").trim().toUpperCase();
      if (formCodigo.seccion) formCodigo.seccion.value = seccion;
      const anio = Number(formCodigo.anio_lectivo.value);
      const clave = construirClaveCodigo(prefijo, nivel, seccion);
      if (!especialidadId || !clave || anio < 2026) {
        if (aviso) aviso.textContent = "Completa especialidad (DS EL MI MA SE IT, sin GE), nivel 1-3, seccion A-Z y anio desde 2026.";
        pintarVistaClave(formCodigo);
        return;
      }
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
        if (aviso) aviso.textContent = mensajeErrorCodigo(error);
        return;
      }
      formCodigo.reset();
      formCodigo.anio_lectivo.value = "2026";
      pintarVistaClave(formCodigo);
      if (aviso) aviso.textContent = "Codigo " + clave + " creado. Ya puedes invitar alumnos a ese grupo.";
      await llenarSelectCodigos(rolVista, user.id);
      await listarMisCodigos(user.id);
    });
  }

  document.querySelectorAll("[data-altas-lista]").forEach((lista) => {
    lista.addEventListener("click", async (evento) => {
      const bBaja = evento.target.closest("[data-baja-id]");
      const bActiva = evento.target.closest("[data-activar-id]");
      if ((!bBaja && !bActiva) || !supabase) return;
      const id = bBaja ? bBaja.getAttribute("data-baja-id") : bActiva.getAttribute("data-activar-id");
      if (!id) return;
      const confirmar = bBaja
        ? "Se desactiva el acceso. No se borra el historial ni los proyectos. Continuar?"
        : "Se reactiva el acceso. La persona entra con su correo y contrasena. Continuar?";
      if (!window.confirm(confirmar)) return;
      const boton = bBaja || bActiva;
      boton.disabled = true;
      try {
        await invocar({ accion: bBaja ? "baja" : "activar", id });
      } catch (falla) {
        window.alert(falla && falla.message ? falla.message : "No se pudo completar.");
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
    pintarVistaClave(document.querySelector("[data-form-codigo]"));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
