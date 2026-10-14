/* INTIWO | arbol Academico|Tecnico, desactivar codigo o alumno | SH-04d S1-07c/h */
import { supabase } from "../supabase/cliente-supabase.js";

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

function correoDe(invitaciones, perfilId) {
  const fila = (invitaciones || []).find((item) => item.usado_por === perfilId && item.email);
  return fila ? fila.email : "";
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
    }
    invitaciones = await supabase
      .from("invitaciones_correo")
      .select("email, usado_por, codigo_id")
      .in("codigo_id", ids)
      .not("usado_por", "is", null);
  }
  return {
    error: especialidades.error || codigos.error || miembros.error,
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
    vacio.textContent = "Sin codigos activos.";
    details.appendChild(vacio);
    return details;
  }
  delGrupo.forEach((codigo) => {
    const bloque = document.createElement("div");
    bloque.className = "intiwo-arbol-codigo";
    const encabezado = document.createElement("p");
    const docente = datos.perfiles.find((p) => p.id === codigo.docente_id);
    encabezado.textContent = codigo.clave + " · " + codigo.anio_lectivo
      + (rol === "administrador" ? " · " + nombrePerfil(docente) : "");
    bloque.appendChild(encabezado);
    if (rol === "administrador" || rol === "docente") {
      bloque.appendChild(botonAccion("Desactivar codigo", { "data-desactivar-codigo": codigo.id }));
    }
    const alumnos = datos.miembros.filter((m) => m.codigo_id === codigo.id);
    if (!alumnos.length) {
      const vacio = document.createElement("p");
      vacio.className = "intiwo-config-estado";
      vacio.textContent = "Sin editores en este codigo.";
      bloque.appendChild(vacio);
    }
    alumnos.forEach((m) => {
      const fila = document.createElement("div");
      fila.className = "intiwo-config-fila-cuenta";
      const p = document.createElement("p");
      const persona = datos.perfiles.find((x) => x.id === m.perfil_id);
      const correo = correoDe(datos.invitaciones, m.perfil_id);
      const lista = m.n_lista ? " · n. " + m.n_lista : "";
      p.textContent = nombrePerfil(persona) + (correo ? " · " + correo : "") + lista;
      fila.appendChild(p);
      if (rol === "administrador" || rol === "docente") {
        fila.appendChild(botonAccion("Quitar del codigo", {
          "data-quitar-miembro": m.perfil_id,
          "data-codigo-id": codigo.id,
        }));
      }
      bloque.appendChild(fila);
    });
    details.appendChild(bloque);
  });
  return details;
}

function pintarArbol(raiz, datos, rol) {
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
  tecnicas.forEach((esp) => tecnico.appendChild(ramaEspecialidad(esp, datos, rol)));
  raiz.appendChild(tecnico);

  const academico = document.createElement("details");
  academico.className = "intiwo-arbol-rama";
  const sumA = document.createElement("summary");
  sumA.textContent = "Academico";
  academico.appendChild(sumA);
  const filasAcad = datos.especialidades.filter((e) => e.tipo === "academico");
  if (filasAcad.length) {
    filasAcad.forEach((esp) => academico.appendChild(ramaEspecialidad(esp, datos, rol)));
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
