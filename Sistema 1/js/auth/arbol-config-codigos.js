/* INTIWO | arbol Academico|Tecnico, desactivar codigo o alumno | SH-04d S1-07c/h */
import { supabase } from "../supabase/cliente-supabase.js";

let cacheArbol = null;

const ACADEMICAS = [
  { prefijo: "PC", nombre: "Precalculo" },
  { prefijo: "CV", nombre: "Ciudadania y valores" },
  { prefijo: "CT", nombre: "Ciencias y tecnologia" },
  { prefijo: "IN", nombre: "Ingles" },
  { prefijo: "LL", nombre: "Lenguaje y Literatura" },
];

function texto(nodo, valor) {
  if (nodo) nodo.textContent = valor;
}

function nombrePerfil(perfil) {
  if (!perfil) return "Docente";
  const compuesto = [perfil.nombres, perfil.apellidos].filter(Boolean).join(" ");
  return compuesto || perfil.nombre || perfil.rol || "Sin nombre";
}

function correoDe(invitaciones, perfilId, codigoId) {
  const filas = (invitaciones || []).filter((item) => item.usado_por === perfilId && item.email);
  const delCodigo = filas.find((item) => codigoId && item.codigo_id === codigoId);
  const fila = delCodigo || filas[0];
  return fila ? fila.email : "";
}

function textoMiembro(persona, correo, nLista) {
  const nombre = nombrePerfil(persona);
  const mail = correo || "sin correo en invitaciones";
  const lista = nLista ? String(nLista) : "-";
  return "nombre " + nombre + " · correo " + mail + " · n_lista " + lista;
}

async function cargarDatos(rol, userId) {
  const especialidades = await supabase
    .from("especialidades")
    .select("id, slug, nombre_corto, prefijo, tipo, orden")
    .neq("prefijo", "GE")
    .order("orden");
  let consultaCodigos = supabase
    .from("codigos")
    .select("id, clave, anio_lectivo, nivel, seccion, especialidad_id, docente_id, desactivado_en")
    .is("desactivado_en", null)
    .order("clave");
  if (rol === "docente") consultaCodigos = consultaCodigos.eq("docente_id", userId);
  const codigos = await consultaCodigos;
  const ids = (codigos.data || []).map((fila) => fila.id);
  let miembros = { data: [], error: null };
  let perfiles = { data: [], error: null };
  let invitaciones = { data: [], error: null };
  if (ids.length) {
    miembros = await supabase
      .from("miembro_codigo")
      .select("perfil_id, codigo_id, n_lista, desactivado_en")
      .in("codigo_id", ids)
      .is("desactivado_en", null);
    const perfilIds = Array.from(new Set((miembros.data || []).map((m) => m.perfil_id)
      .concat((codigos.data || []).map((c) => c.docente_id))));
    if (perfilIds.length) {
      perfiles = await supabase
        .from("perfiles")
        .select("id, rol, nombre, nombres, apellidos")
        .in("id", perfilIds);
      invitaciones = await supabase
        .from("invitaciones_correo")
        .select("email, usado_por, codigo_id")
        .in("usado_por", perfilIds)
        .not("usado_por", "is", null);
    }
  }
  return {
    error: especialidades.error || codigos.error || miembros.error || perfiles.error || invitaciones.error,
    especialidades: especialidades.data || [],
    codigos: codigos.data || [],
    miembros: miembros.data || [],
    perfiles: perfiles.data || [],
    invitaciones: invitaciones.data || [],
  };
}

function botonAccion(etiqueta, attrs) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "intiwo-config-baja";
  boton.textContent = etiqueta;
  Object.keys(attrs).forEach((clave) => boton.setAttribute(clave, attrs[clave]));
  return boton;
}

function ramaEspecialidad(esp, datos, rol) {
  const details = document.createElement("details");
  details.className = "intiwo-arbol-rama";
  const sumario = document.createElement("summary");
  const delGrupo = datos.codigos.filter((c) => c.especialidad_id === esp.id);
  sumario.textContent = (esp.prefijo || "") + " · " + (esp.nombre_corto || esp.nombre) + " (" + delGrupo.length + ")";
  details.appendChild(sumario);
  if (!delGrupo.length) {
    const vacio = document.createElement("p");
    vacio.className = "intiwo-config-estado";
    vacio.textContent = "Sin docentes ni codigos activos.";
    details.appendChild(vacio);
    return details;
  }
  const porDocente = new Map();
  delGrupo.forEach((codigo) => {
    const clave = codigo.docente_id || "sin-docente";
    if (!porDocente.has(clave)) porDocente.set(clave, []);
    porDocente.get(clave).push(codigo);
  });
  porDocente.forEach((codigosDocente, docenteId) => {
    const ramaDoc = document.createElement("details");
    ramaDoc.className = "intiwo-arbol-rama intiwo-arbol-docente";
    const docente = datos.perfiles.find((p) => p.id === docenteId);
    const correoDoc = correoDe(datos.invitaciones, docenteId);
    const sumDoc = document.createElement("summary");
    sumDoc.textContent = "Docente · " + nombrePerfil(docente)
      + (correoDoc ? " · " + correoDoc : "")
      + " · " + codigosDocente.length + " codigo" + (codigosDocente.length === 1 ? "" : "s");
    ramaDoc.appendChild(sumDoc);
    codigosDocente.forEach((codigo) => {
      ramaDoc.appendChild(ramaCodigo(codigo, datos, rol));
    });
    details.appendChild(ramaDoc);
  });
  return details;
}

function ramaCodigo(codigo, datos, rol) {
  const bloque = document.createElement("details");
  bloque.className = "intiwo-arbol-rama intiwo-arbol-codigo";
  const alumnos = datos.miembros.filter((m) => m.codigo_id === codigo.id);
  const sumario = document.createElement("summary");
  sumario.textContent = codigo.clave + " · " + codigo.anio_lectivo
    + " · niv. " + codigo.nivel + codigo.seccion
    + " · " + alumnos.length + " editor" + (alumnos.length === 1 ? "" : "es");
  bloque.appendChild(sumario);
  if (rol === "administrador" || rol === "docente") {
    bloque.appendChild(botonAccion("Desactivar codigo", { "data-desactivar-codigo": codigo.id }));
  }
  if (!alumnos.length) {
    const vacio = document.createElement("p");
    vacio.className = "intiwo-config-estado";
    vacio.textContent = "Sin editores autorizados en este codigo.";
    bloque.appendChild(vacio);
    return bloque;
  }
  alumnos.forEach((m) => {
    const fila = document.createElement("div");
    fila.className = "intiwo-config-fila-cuenta";
    const p = document.createElement("p");
    const persona = datos.perfiles.find((x) => x.id === m.perfil_id);
    const correo = correoDe(datos.invitaciones, m.perfil_id, codigo.id);
    p.textContent = textoMiembro(persona, correo, m.n_lista);
    fila.appendChild(p);
    if (rol === "administrador" || rol === "docente") {
      fila.appendChild(botonAccion("Quitar del codigo", {
        "data-quitar-miembro": m.perfil_id,
        "data-codigo-id": codigo.id,
      }));
    }
    bloque.appendChild(fila);
  });
  return bloque;
}

function filtrosDe(raiz) {
  const form = raiz.closest(".intiwo-config-tarjeta") && raiz.closest(".intiwo-config-tarjeta").querySelector("[data-arbol-filtros]");
  if (!form) return { anio: "", seccion: "", clave: "" };
  const datos = new FormData(form);
  return {
    anio: String(datos.get("anio") || ""),
    seccion: String(datos.get("seccion") || "").toUpperCase(),
    clave: String(datos.get("clave") || ""),
  };
}

function rellenarFiltros(form, codigos) {
  if (!form) return;
  const actual = new FormData(form);
  const anioSel = String(actual.get("anio") || "");
  const seccionSel = String(actual.get("seccion") || "");
  const claveSel = String(actual.get("clave") || "");
  const anios = Array.from(new Set(codigos.map((c) => String(c.anio_lectivo)))).sort();
  const secciones = Array.from(new Set(codigos.map((c) => String(c.seccion || "").toUpperCase()).filter(Boolean))).sort();
  const claves = Array.from(new Set(codigos.map((c) => c.clave))).sort();
  pintarOpciones(form.querySelector("[name=anio]"), anios, anioSel, "Todos");
  pintarOpciones(form.querySelector("[name=seccion]"), secciones, seccionSel, "Todas");
  pintarOpciones(form.querySelector("[name=clave]"), claves, claveSel, "Todos");
}

function pintarOpciones(select, valores, elegido, etiquetaTodos) {
  if (!select) return;
  select.replaceChildren();
  const todos = document.createElement("option");
  todos.value = "";
  todos.textContent = etiquetaTodos;
  select.appendChild(todos);
  valores.forEach((valor) => {
    const op = document.createElement("option");
    op.value = valor;
    op.textContent = valor;
    if (valor === elegido) op.selected = true;
    select.appendChild(op);
  });
}

function aplicarFiltros(codigos, filtros) {
  return codigos.filter((c) => {
    if (filtros.anio && String(c.anio_lectivo) !== filtros.anio) return false;
    if (filtros.seccion && String(c.seccion || "").toUpperCase() !== filtros.seccion) return false;
    if (filtros.clave && c.clave !== filtros.clave) return false;
    return true;
  });
}

function pintarArbol(raiz, datos, rol) {
  const filtros = filtrosDe(raiz);
  rellenarFiltros(raiz.closest(".intiwo-config-tarjeta") && raiz.closest(".intiwo-config-tarjeta").querySelector("[data-arbol-filtros]"), datos.codigos);
  const recorte = Object.assign({}, datos, { codigos: aplicarFiltros(datos.codigos, filtros) });
  raiz.replaceChildren();
  const tecnico = document.createElement("details");
  tecnico.className = "intiwo-arbol-rama";
  tecnico.open = true;
  const sumT = document.createElement("summary");
  sumT.textContent = "Tecnico";
  tecnico.appendChild(sumT);
  const tecnicas = datos.especialidades.filter((e) => e.tipo === "tecnica" && e.prefijo !== "GE");
  if (!tecnicas.length) {
    const p = document.createElement("p");
    p.className = "intiwo-config-estado";
    p.textContent = "Corre codigos-y-membresias.sql para ver las 6 especialidades.";
    tecnico.appendChild(p);
  }
  tecnicas.forEach((esp) => tecnico.appendChild(ramaEspecialidad(esp, recorte, rol)));
  raiz.appendChild(tecnico);

  const academico = document.createElement("details");
  academico.className = "intiwo-arbol-rama";
  const sumA = document.createElement("summary");
  sumA.textContent = "Academico";
  academico.appendChild(sumA);
  const filasAcad = datos.especialidades.filter((e) => e.tipo === "academico");
  if (filasAcad.length) {
    filasAcad.forEach((esp) => academico.appendChild(ramaEspecialidad(esp, recorte, rol)));
  } else {
    ACADEMICAS.forEach((asig) => {
      const details = document.createElement("details");
      details.className = "intiwo-arbol-rama";
      const sumario = document.createElement("summary");
      sumario.textContent = asig.prefijo + " · " + asig.nombre + " (0)";
      details.appendChild(sumario);
      const p = document.createElement("p");
      p.className = "intiwo-config-estado";
      p.textContent = "Sin codigos. Falta la semilla academica (tarea 183), no se usa GE.";
      details.appendChild(p);
      academico.appendChild(details);
    });
  }
  raiz.appendChild(academico);
}

async function refrescar(rol, userId) {
  const raices = document.querySelectorAll("[data-arbol-codigos]");
  if (!raices.length || !supabase) return;
  const datos = await cargarDatos(rol, userId);
  cacheArbol = datos;
  raices.forEach((raiz) => {
    if (datos.error) {
      texto(raiz, "No se pudo leer el arbol: " + datos.error.message);
      return;
    }
    pintarArbol(raiz, datos, rol);
  });
}

async function desactivarCodigo(id) {
  const ahora = new Date().toISOString();
  const { error: errM } = await supabase.from("miembro_codigo").update({ desactivado_en: ahora }).eq("codigo_id", id).is("desactivado_en", null);
  if (errM) throw errM;
  const { error: errC } = await supabase.from("codigos").update({ desactivado_en: ahora }).eq("id", id);
  if (errC) throw errC;
}

async function quitarMiembro(perfilId, codigoId) {
  const { error } = await supabase
    .from("miembro_codigo")
    .update({ desactivado_en: new Date().toISOString() })
    .eq("perfil_id", perfilId)
    .eq("codigo_id", codigoId);
  if (error) throw error;
}

function iniciar() {
  document.addEventListener("change", (evento) => {
    const form = evento.target.closest("[data-arbol-filtros]");
    if (!form || !cacheArbol || cacheArbol.error) return;
    const tarjeta = form.closest(".intiwo-config-tarjeta");
    const raiz = tarjeta && tarjeta.querySelector("[data-arbol-codigos]");
    const rol = String(window.INTIWO_ROL || "").toLowerCase();
    if (raiz) pintarArbol(raiz, cacheArbol, rol);
  });

  document.addEventListener("click", async (evento) => {
    const bCodigo = evento.target.closest("[data-desactivar-codigo]");
    const bAlumno = evento.target.closest("[data-quitar-miembro]");
    if (!bCodigo && !bAlumno) return;
    const rol = String(window.INTIWO_ROL || "").toLowerCase();
    const { data: sesionData } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
    const user = sesionData && sesionData.session ? sesionData.session.user : null;
    if (!user) return;
    try {
      if (bCodigo) {
        if (!window.confirm("Se desactiva el codigo y sus editores. No se borran proyectos. Continuar?")) return;
        bCodigo.disabled = true;
        await desactivarCodigo(bCodigo.getAttribute("data-desactivar-codigo"));
      } else {
        if (!window.confirm("Se quita al alumno de este codigo. Sigue en el sistema. Continuar?")) return;
        bAlumno.disabled = true;
        await quitarMiembro(bAlumno.getAttribute("data-quitar-miembro"), bAlumno.getAttribute("data-codigo-id"));
      }
    } catch (falla) {
      window.alert(falla && falla.message ? falla.message : "No se pudo desactivar.");
      if (bCodigo) bCodigo.disabled = false;
      if (bAlumno) bAlumno.disabled = false;
      return;
    }
    await refrescar(rol, user.id);
  });

  window.addEventListener("intiwo:auth-state-changed", async (evento) => {
    const rol = evento.detail && evento.detail.rol;
    if (rol !== "administrador" && rol !== "docente") return;
    const { data: sesionData } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
    const user = sesionData && sesionData.session ? sesionData.session.user : null;
    if (user) await refrescar(rol, user.id);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
