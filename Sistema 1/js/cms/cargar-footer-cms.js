/* INTIWO | pie desde footer_cms; fallback F-RES; admin guarda en Config | SH-06b/c */
import { supabase } from "../supabase/cliente-supabase.js";

const FALLBACK = {
  whatsapp_principal: "+503 7441-1075",
  whatsapp_alterno: "+503 6674-3159",
  email: "",
  facebook_url: "https://www.facebook.com/tecnicosinti/?locale=es_LA",
  instagram_url: "https://www.instagram.com/inti.edu.sv/",
  tiktok_url: "https://www.tiktok.com/@inti.edu.sv",
};
let errorLectura = "";

function digitosWa(tel) {
  const d = String(tel || "").replace(/\D/g, "");
  if (d.startsWith("503") && d.length >= 11) return d.slice(0, 11);
  if (d.length === 8) return "503" + d;
  return d;
}

function etiquetaWa(tel) {
  const local = digitosWa(tel).replace(/^503/, "");
  if (local.length === 8) return local.slice(0, 4) + "-" + local.slice(4);
  return String(tel || "").trim();
}

function hrefWa(tel) {
  const d = digitosWa(tel);
  return d ? "https://wa.me/" + d : "#";
}

function urlHttps(valor, respaldo) {
  const t = String(valor || "").trim();
  if (/^https:\/\//i.test(t)) return t;
  return respaldo;
}

function ponerWa(ancla, tel) {
  if (!ancla) return;
  ancla.setAttribute("href", hrefWa(tel));
  const icono = ancla.querySelector(".intiwo-wa-icono");
  const copia = icono ? icono.cloneNode(true) : null;
  ancla.replaceChildren();
  if (copia) ancla.appendChild(copia);
  ancla.appendChild(document.createTextNode(" " + etiquetaWa(tel)));
}

function pintarPie(datos) {
  const contactos = document.querySelector(".intiwo-pie-llamanos");
  if (contactos) {
    const correoExistente = contactos.querySelector("[data-footer-email]");
    if (datos.email) {
      const correo = correoExistente || document.createElement("a");
      correo.setAttribute("data-footer-email", "");
      correo.setAttribute("href", "mailto:" + datos.email);
      correo.textContent = datos.email;
      if (!correoExistente) contactos.appendChild(correo);
    } else if (correoExistente) {
      correoExistente.remove();
    }
  }
  const redes = document.querySelector(".intiwo-pie-redes");
  if (redes) {
    const fb = redes.querySelector('[aria-label="Facebook"]');
    const ig = redes.querySelector('[aria-label="Instagram"]');
    const tt = redes.querySelector('[aria-label="TikTok"]');
    if (fb) fb.setAttribute("href", datos.facebook_url);
    if (ig) ig.setAttribute("href", datos.instagram_url);
    if (tt) tt.setAttribute("href", datos.tiktok_url);
  }
  const llamarnos = document.querySelectorAll(".intiwo-pie-llamanos a.intiwo-wa");
  ponerWa(llamarnos[0], datos.whatsapp_principal);
  if (llamarnos[1]) {
    ponerWa(llamarnos[1], datos.whatsapp_alterno);
  } else if (llamarnos[0] && datos.whatsapp_alterno) {
    const caja = document.querySelector(".intiwo-pie-llamanos");
    if (caja) {
      const clon = llamarnos[0].cloneNode(true);
      ponerWa(clon, datos.whatsapp_alterno);
      caja.appendChild(clon);
    }
  }
}

function rellenarFormulario(datos) {
  const form = document.querySelector("[data-form-footer]");
  if (!form) return;
  if (form.whatsapp_principal) form.whatsapp_principal.value = datos.whatsapp_principal;
  if (form.whatsapp_alterno) form.whatsapp_alterno.value = datos.whatsapp_alterno;
  if (form.email) form.email.value = datos.email || "";
  if (form.facebook_url) form.facebook_url.value = datos.facebook_url;
  if (form.instagram_url) form.instagram_url.value = datos.instagram_url;
  if (form.tiktok_url) form.tiktok_url.value = datos.tiktok_url;
}

function datosDeFormulario(form) {
  return {
    whatsapp_principal: String(form.whatsapp_principal.value || "").trim(),
    whatsapp_alterno: String(form.whatsapp_alterno.value || "").trim(),
    email: String(form.email.value || "").trim(),
    facebook_url: urlHttps(form.facebook_url.value, FALLBACK.facebook_url),
    instagram_url: urlHttps(form.instagram_url.value, FALLBACK.instagram_url),
    tiktok_url: urlHttps(form.tiktok_url.value, FALLBACK.tiktok_url),
  };
}

function waValido(tel) {
  const d = digitosWa(tel);
  return d.length === 11 && d.startsWith("503");
}

async function leerFila() {
  if (!supabase) {
    errorLectura = "Falta el cliente de Supabase.";
    return null;
  }
  const { data, error } = await supabase
    .from("footer_cms")
    .select("whatsapp_principal, whatsapp_alterno, email, facebook_url, instagram_url, tiktok_url")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("No se pudieron leer los datos de footer_cms:", error);
    errorLectura = error.message;
    return null;
  }
  if (!data) return null;
  return {
    whatsapp_principal: data.whatsapp_principal || FALLBACK.whatsapp_principal,
    whatsapp_alterno: data.whatsapp_alterno || FALLBACK.whatsapp_alterno,
    email: data.email || "",
    facebook_url: urlHttps(data.facebook_url, FALLBACK.facebook_url),
    instagram_url: urlHttps(data.instagram_url, FALLBACK.instagram_url),
    tiktok_url: urlHttps(data.tiktok_url, FALLBACK.tiktok_url),
  };
}

function avisoFooter(texto) {
  const nodo = document.querySelector("[data-footer-mensaje]");
  if (nodo) nodo.textContent = texto;
}

function habilitarEditor(si) {
  const form = document.querySelector("[data-form-footer]");
  if (!form) return;
  const campo = form.querySelector("fieldset");
  const boton = form.querySelector("[data-footer-guardar]");
  if (campo) campo.disabled = !si;
  if (boton) boton.disabled = !si;
}

function actualizarAccesoEditor(rol) {
  const esAdmin = String(rol || "").toLowerCase() === "administrador";
  habilitarEditor(esAdmin);
  if (!esAdmin) avisoFooter("Solo el administrador puede editar el pie.");
  else avisoFooter(errorLectura
    ? "No se pudieron leer los datos guardados: " + errorLectura + ". Se muestran valores iniciales."
    : "Puedes guardar contactos y redes. Visitantes solo leen.");
}

async function guardar(form) {
  const datos = datosDeFormulario(form);
  if (!waValido(datos.whatsapp_principal) || !waValido(datos.whatsapp_alterno)) {
    avisoFooter("Usa WhatsApp de El Salvador con 8 digitos (ejemplo +503 7441-1075).");
    return;
  }
  if (!supabase) {
    avisoFooter("Falta el cliente de Pages.");
    return;
  }
  avisoFooter("Guardando…");
  const { error } = await supabase.from("footer_cms").upsert({
    id: 1,
    whatsapp_principal: datos.whatsapp_principal,
    whatsapp_alterno: datos.whatsapp_alterno,
    facebook_url: datos.facebook_url,
    instagram_url: datos.instagram_url,
    tiktok_url: datos.tiktok_url,
  });
  if (error) {
    avisoFooter("No se pudo guardar: " + error.message + ". Revisa tabla-footer-cms.sql, cms-contactos-programas.sql y el acceso Admin.");
    return;
  }
  pintarPie(datos);
  avisoFooter("Guardado. El pie de ambas webs usa estos datos.");
}

async function iniciar() {
  window.addEventListener("intiwo:auth-state-changed", (evento) => {
    actualizarAccesoEditor(evento.detail && evento.detail.rol);
  });

  let datos = FALLBACK;
  const fila = await leerFila();
  if (fila) datos = fila;
  pintarPie(datos);
  rellenarFormulario(datos);

  const form = document.querySelector("[data-form-footer]");
  if (form) {
    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      guardar(form);
    });
  }

  actualizarAccesoEditor(window.INTIWO_ROL);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
