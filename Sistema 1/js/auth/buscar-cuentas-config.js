/* INTIWO | buscar cuentas existentes e incorporar al codigo | look F-PNG-S2B */
import { supabase } from "../supabase/cliente-supabase.js";

const ADMIN_MATRIZ = "intiwo11543@gmail.com";
const AVISO_PNG = "No se encontro ningun resultado bajo ese termino, pero quizas te refieres a";

function normalizar(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function distancia(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = [];
  let j;
  for (j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (j = 1; j <= b.length; j++) {
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

function mejorContraPalabras(q, nombre) {
  const nq = normalizar(q);
  const nn = normalizar(nombre);
  if (!nq || !nn) return { d: 99, incluye: false };
  if (nn.indexOf(nq) !== -1 || nq.indexOf(nn) !== -1) {
    return { d: 0, incluye: true };
  }
  let mejor = distancia(nq, nn);
  nq.split(" ").forEach((tokenQ) => {
    if (tokenQ.length < 3) return;
    nn.split(" ").forEach((tokenN) => {
      if (tokenN.length < 3) return;
      const d = distancia(tokenQ, tokenN);
      if (d < mejor) mejor = d;
    });
  });
  return { d: mejor, incluye: false };
}

function puntuacion(q, nombre) {
  const r = mejorContraPalabras(q, nombre);
  if (r.incluye) return 90;
  if (r.d === 0) return 88;
  if (r.d === 1) return 75;
  if (r.d === 2) return 55;
  if (r.d === 3) return 30;
  return Math.max(0, 18 - r.d);
}

function esCercano(q, nombre) {
  const r = mejorContraPalabras(q, nombre);
  return r.incluye || r.d <= 1;
}

function etiquetaPersona(fila) {
  const persona = [fila.nombres, fila.apellidos].filter(Boolean).join(" ") || fila.nombre || "";
  return (persona ? persona + " � " : "") + fila.email + " � " + fila.rol_destino;
}

let catalogo = [];

async function cargarCatalogo(rol) {
  catalogo = [];
  if (!supabase || (rol !== "administrador" && rol !== "docente")) return;
  let consulta = supabase
    .from("invitaciones_correo")
    .select("id, email, rol_destino, nombres, apellidos, nombre, usado_por, usado_en, revocado_en")
    .not("usado_por", "is", null)
    .order("created_at", { ascending: false })
    .limit(400);
  if (rol === "docente") consulta = consulta.eq("rol_destino", "editor");
  else consulta = consulta.in("rol_destino", ["editor", "docente"]);
  const { data, error } = await consulta;
  if (error || !data) return;
  const vistos = {};
  data.forEach((fila) => {
    if (!fila.email || fila.email === ADMIN_MATRIZ) return;
    const clave = fila.usado_por || fila.email;
    if (vistos[clave]) return;
    vistos[clave] = true;
    catalogo.push({
      id: fila.id,
      email: fila.email,
      rol: fila.rol_destino,
      usado_por: fila.usado_por,
      revocado_en: fila.revocado_en,
      nombre: etiquetaPersona(fila),
    });
  });
}

function pintarSugerencias(raiz, items, hayMatch) {
  const caja = raiz.querySelector("[data-buscar-sugerencias]");
  const aviso = raiz.querySelector("[data-buscar-aviso]");
  const lista = raiz.querySelector("[data-buscar-lista]");
  const entrada = raiz.querySelector("[data-buscar-q]");
  if (!caja || !lista || !entrada) return;
  lista.replaceChildren();
  raiz._visibles = items;
  raiz._indice = -1;
  if (!entrada.value.trim()) {
    caja.classList.remove("es-abierto");
    return;
  }
  caja.classList.add("es-abierto");
  if (aviso) {
    aviso.hidden = hayMatch;
    aviso.textContent = AVISO_PNG;
  }
  items.forEach((item, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "intiwo-sugerencia";
    b.textContent = item.nombre;
    b.addEventListener("mouseenter", () => {
      lista.querySelectorAll(".intiwo-sugerencia").forEach((n) => n.classList.remove("es-activa"));
      b.classList.add("es-activa");
      raiz._indice = i;
    });
    b.addEventListener("click", () => {
      entrada.value = item.email;
      caja.classList.remove("es-abierto");
      mostrarDetalle(raiz, item);
    });
    lista.appendChild(b);
  });
}

function buscarEn(raiz) {
  const entrada = raiz.querySelector("[data-buscar-q]");
  const q = entrada ? entrada.value.trim() : "";
  if (!q) {
    const caja = raiz.querySelector("[data-buscar-sugerencias]");
    if (caja) caja.classList.remove("es-abierto");
    return;
  }
  const ranked = catalogo
    .map((item) => ({
      item,
      pts: Math.max(puntuacion(q, item.nombre), puntuacion(q, item.email)),
    }))
    .sort((a, b) => b.pts - a.pts);
  const matches = ranked
    .filter((r) => esCercano(q, r.item.nombre) || esCercano(q, r.item.email))
    .map((r) => r.item);
  if (matches.length) {
    pintarSugerencias(raiz, matches.slice(0, 8), true);
    return;
  }
  const similares = ranked.filter((r) => r.pts > 0).map((r) => r.item).slice(0, 4);
  pintarSugerencias(raiz, similares, false);
}

function mostrarDetalle(raiz, item) {
  const tarjeta = raiz.closest(".intiwo-config-tarjeta") || raiz.parentElement;
  const detalle = tarjeta.querySelector("[data-buscar-detalle]");
  const aviso = tarjeta.querySelector("[data-buscar-mensaje]");
  if (!detalle) return;
  detalle.hidden = false;
  detalle.replaceChildren();
  if (aviso) aviso.textContent = "";
  const p = document.createElement("p");
  p.textContent = item.nombre + (item.revocado_en ? " � desactivado" : " � en el sistema");
  detalle.appendChild(p);
  const rolVista = String(window.INTIWO_ROL || "").toLowerCase();
  if (item.rol === "editor") {
    const label = document.createElement("label");
    label.textContent = "Incorporar a codigo";
    const select = document.createElement("select");
    select.setAttribute("data-buscar-codigo", "");
    const origen = document.querySelector("[data-codigos-select]");
    if (origen) {
      select.innerHTML = origen.innerHTML;
    } else {
      const op = document.createElement("option");
      op.value = "";
      op.textContent = "Crea un codigo primero";
      select.appendChild(op);
    }
    label.appendChild(select);
    detalle.appendChild(label);
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "intiwo-pildora";
    boton.textContent = "Incorporar al codigo";
    boton.addEventListener("click", () => incorporar(item, select.value, aviso));
    detalle.appendChild(boton);
  }
  if (rolVista === "administrador") {
    const baja = document.createElement("button");
    baja.type = "button";
    baja.className = "intiwo-config-baja";
    baja.textContent = item.revocado_en ? "Activar" : "Desactivar";
    baja.addEventListener("click", async () => {
      try {
        const { data, error } = await supabase.functions.invoke("invitar-cuenta", {
          body: { accion: item.revocado_en ? "activar" : "baja", id: item.id },
        });
        if (error || (data && data.error)) throw new Error((data && data.error) || error.message);
        if (aviso) aviso.textContent = item.revocado_en ? "Cuenta reactivada." : "Acceso desactivado. La cuenta y los proyectos siguen.";
        await cargarCatalogo(rolVista);
      } catch (falla) {
        if (aviso) aviso.textContent = falla && falla.message ? falla.message : "No se pudo cambiar el estado.";
      }
    });
    detalle.appendChild(baja);
  }
}

async function incorporar(item, codigoId, aviso) {
  if (!supabase) {
    if (aviso) aviso.textContent = "Falta el cliente de Pages.";
    return;
  }
  if (!item.usado_por) {
    if (aviso) aviso.textContent = "Esa persona todavia no activo la cuenta.";
    return;
  }
  if (!codigoId) {
    if (aviso) aviso.textContent = "Elige el codigo de este anio.";
    return;
  }
  const { data: sesionData } = await supabase.auth.getSession();
  const user = sesionData && sesionData.session ? sesionData.session.user : null;
  if (!user) {
    if (aviso) aviso.textContent = "Inicia sesion.";
    return;
  }
  const { data: ya } = await supabase
    .from("miembro_codigo")
    .select("perfil_id, desactivado_en")
    .eq("perfil_id", item.usado_por)
    .eq("codigo_id", codigoId)
    .maybeSingle();
  if (ya && !ya.desactivado_en) {
    if (aviso) aviso.textContent = "Ese alumno ya esta en este codigo.";
    return;
  }
  if (ya && ya.desactivado_en) {
    const { error } = await supabase
      .from("miembro_codigo")
      .update({ desactivado_en: null })
      .eq("perfil_id", item.usado_por)
      .eq("codigo_id", codigoId);
    if (aviso) aviso.textContent = error ? error.message : "Alumno reincorporado a este codigo. No se creo otra cuenta.";
    return;
  }
  const { error } = await supabase.from("miembro_codigo").insert({
    perfil_id: item.usado_por,
    codigo_id: codigoId,
    agregado_por: user.id,
  });
  if (error) {
    if (aviso) aviso.textContent = error.message;
    return;
  }
  if (aviso) aviso.textContent = "Alumno incorporado a tu codigo. Sigue con la misma cuenta.";
}

function enlazarRaiz(raiz) {
  const entrada = raiz.querySelector("[data-buscar-q]");
  const caja = raiz.querySelector("[data-buscar-sugerencias]");
  if (!entrada) return;
  let t = 0;
  raiz._visibles = [];
  raiz._indice = -1;
  entrada.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => buscarEn(raiz), 200);
  });
  entrada.addEventListener("focus", () => {
    if (entrada.value.trim()) buscarEn(raiz);
  });
  entrada.addEventListener("keydown", (ev) => {
    const visibles = raiz._visibles || [];
    if (!caja || !caja.classList.contains("es-abierto") || !visibles.length) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      raiz._indice = Math.min((raiz._indice || 0) + 1, visibles.length - 1);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      raiz._indice = Math.max((raiz._indice || 0) - 1, 0);
    } else if (ev.key === "Enter" && raiz._indice >= 0) {
      ev.preventDefault();
      const item = visibles[raiz._indice];
      entrada.value = item.email;
      caja.classList.remove("es-abierto");
      mostrarDetalle(raiz, item);
      return;
    } else if (ev.key === "Escape") {
      caja.classList.remove("es-abierto");
      return;
    } else {
      return;
    }
    raiz.querySelectorAll(".intiwo-sugerencia").forEach((n, i) => n.classList.toggle("es-activa", i === raiz._indice));
  });
}

function iniciar() {
  const raices = document.querySelectorAll("[data-buscar-cuentas]");
  if (!raices.length) return;
  raices.forEach(enlazarRaiz);
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-buscar-cuentas]")) return;
    document.querySelectorAll("[data-buscar-sugerencias]").forEach((caja) => caja.classList.remove("es-abierto"));
  });
  window.addEventListener("intiwo:auth-state-changed", async (evento) => {
    const rol = evento.detail && evento.detail.rol;
    await cargarCatalogo(rol);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
