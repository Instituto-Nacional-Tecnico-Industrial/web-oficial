/* INTIWO | contactos independientes de EDUCAME y Matricula */
import { supabase } from "../supabase/cliente-supabase.js";

const EDUCAME_INICIAL = {
  whatsapp: "+503 7754-5899",
  email: "oficina.educame@inti.edu.sv",
};
const MATRICULA_INICIAL = {
  whatsapp_principal: "+503 7441-1075",
  whatsapp_alterno: "+503 6674-3159",
  email: "",
  formulario_url: "https://docs.google.com/forms/d/e/1FAIpQLSchOv93fiyvoxF2z_mahlUcUhzbt5FyxfZTupLeODpdBcJjhw/viewform",
};

function digitosWa(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function etiquetaWa(valor) {
  const digitos = digitosWa(valor).replace(/^503/, "");
  return digitos.length === 8
    ? digitos.slice(0, 4) + "-" + digitos.slice(4)
    : String(valor || "").trim();
}

function hrefWa(valor) {
  const digitos = digitosWa(valor);
  return "https://wa.me/" + (digitos.length === 8 ? "503" + digitos : digitos);
}

function waValido(valor) {
  const digitos = digitosWa(valor);
  return digitos.length === 11 && digitos.startsWith("503");
}

function correoValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || "").trim());
}

function urlHttps(valor) {
  try {
    return new URL(String(valor || "").trim()).protocol === "https:";
  } catch {
    return false;
  }
}

function leerCampo(formulario, nombre) {
  return String(formulario.elements.namedItem(nombre)?.value || "").trim();
}

function cargarFormulario(formulario, datos) {
  Object.entries(datos).forEach(([nombre, valor]) => {
    const campo = formulario.elements.namedItem(nombre);
    if (campo) campo.value = valor || "";
  });
}

function ponerNumero(nodo, telefono) {
  if (nodo) nodo.textContent = etiquetaWa(telefono);
}

function pintarEducame(datos) {
  document.querySelectorAll("[data-educame-whatsapp]").forEach((ancla) => {
    ancla.setAttribute("href", hrefWa(datos.whatsapp));
  });
  document.querySelectorAll("[data-educame-telefono]").forEach((nodo) => {
    ponerNumero(nodo, datos.whatsapp);
  });
  document.querySelectorAll("[data-educame-email]").forEach((ancla) => {
    ancla.setAttribute("href", "mailto:" + datos.email);
    ancla.textContent = datos.email;
  });
}

function pintarMatricula(datos) {
  document.querySelectorAll("[data-matricula-formulario]").forEach((ancla) => {
    ancla.setAttribute("href", datos.formulario_url);
  });
  document.querySelectorAll("[data-matricula-whatsapp]").forEach((ancla) => {
    const tipo = ancla.getAttribute("data-matricula-whatsapp");
    const telefono = tipo === "alterno" ? datos.whatsapp_alterno : datos.whatsapp_principal;
    ancla.setAttribute("href", hrefWa(telefono));
    ponerNumero(ancla.querySelector("[data-matricula-telefono]"), telefono);
  });
  document.querySelectorAll("[data-matricula-email]").forEach((ancla) => {
    if (datos.email) {
      ancla.setAttribute("href", "mailto:" + datos.email);
      ancla.textContent = datos.email;
      ancla.hidden = false;
    } else {
      ancla.hidden = true;
    }
  });
}

function aviso(nombre, texto) {
  const nodo = document.querySelector(`[data-contactos-mensaje="${nombre}"]`);
  if (nodo) nodo.textContent = texto;
}

function habilitarFormularios(si) {
  document.querySelectorAll("[data-form-contactos]").forEach((formulario) => {
    const fieldset = formulario.querySelector("fieldset");
    const boton = formulario.querySelector("[data-contactos-guardar]");
    if (fieldset) fieldset.disabled = !si;
    if (boton) boton.disabled = !si;
  });
}

function actualizarAccesoFormularios(rol, estadoEducame, estadoMatricula, formularioEducame, formularioMatricula) {
  const esAdmin = String(rol || "").toLowerCase() === "administrador";
  habilitarFormularios(esAdmin);
  if (!esAdmin) return;
  if (formularioEducame) {
    aviso("educame", estadoEducame.error
      ? "No se pudieron leer los datos guardados: " + estadoEducame.error + ". Se muestran valores iniciales."
      : "Edita los contactos específicos de EDUCAME; no cambian los del Footer.");
  }
  if (formularioMatricula) {
    aviso("matricula", estadoMatricula.error
      ? "No se pudieron leer los datos guardados: " + estadoMatricula.error + ". Se muestran valores iniciales."
      : "Estos datos de Matrícula se guardan independientemente del Footer y EDUCAME.");
  }
}

async function leerTabla(tabla, columnas, valoresIniciales) {
  if (!supabase) return { datos: valoresIniciales, error: "Falta el cliente de Supabase." };
  const { data, error } = await supabase
    .from(tabla)
    .select(columnas)
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error(`No se pudieron leer los contactos de ${tabla}:`, error);
    return { datos: valoresIniciales, error: error.message };
  }
  return { datos: { ...valoresIniciales, ...(data || {}) }, error: "" };
}

async function guardarEducame(formulario) {
  const datos = {
    whatsapp: leerCampo(formulario, "whatsapp"),
    email: leerCampo(formulario, "email"),
  };
  if (!waValido(datos.whatsapp) || !correoValido(datos.email)) {
    aviso("educame", "Verifica un WhatsApp salvadoreño de 8 dígitos y un correo válido.");
    return;
  }
  if (!supabase) {
    aviso("educame", "No se puede guardar: falta el cliente de Supabase.");
    return;
  }
  aviso("educame", "Guardando contactos de EDUCAME…");
  const { error } = await supabase.from("educame_cms").upsert({ id: 1, ...datos });
  if (error) {
    console.error("No se pudieron guardar los contactos de EDUCAME:", error);
    aviso("educame", "No se pudo guardar: " + error.message + ". Revisa la migración cms-contactos-programas.sql y el acceso Admin.");
    return;
  }
  pintarEducame(datos);
  aviso("educame", "Contactos de EDUCAME guardados.");
}

async function guardarMatricula(formulario) {
  const datos = {
    whatsapp_principal: leerCampo(formulario, "whatsapp_principal"),
    whatsapp_alterno: leerCampo(formulario, "whatsapp_alterno"),
    email: leerCampo(formulario, "email"),
    formulario_url: leerCampo(formulario, "formulario_url"),
  };
  if (
    !waValido(datos.whatsapp_principal) ||
    !waValido(datos.whatsapp_alterno) ||
    (datos.email && !correoValido(datos.email)) ||
    !urlHttps(datos.formulario_url)
  ) {
    aviso("matricula", "Verifica ambos WhatsApp salvadoreños, el correo opcional y una URL HTTPS del formulario.");
    return;
  }
  if (!supabase) {
    aviso("matricula", "No se puede guardar: falta el cliente de Supabase.");
    return;
  }
  aviso("matricula", "Guardando contactos de Matrícula…");
  const { error } = await supabase.from("matricula_cms").upsert({
    id: 1,
    ...datos,
    email: datos.email || null,
  });
  if (error) {
    console.error("No se pudieron guardar los contactos de Matrícula:", error);
    aviso("matricula", "No se pudo guardar: " + error.message + ". Revisa la migración cms-contactos-programas.sql y el acceso Admin.");
    return;
  }
  pintarMatricula(datos);
  aviso("matricula", "Contactos de Matrícula guardados.");
}

async function iniciar() {
  const formularioEducame = document.querySelector('[data-form-contactos="educame"]');
  const formularioMatricula = document.querySelector('[data-form-contactos="matricula"]');
  const requiereEducame = formularioEducame || document.querySelector("[data-educame-whatsapp], [data-educame-email]");
  const requiereMatricula = formularioMatricula || document.querySelector("[data-matricula-formulario], [data-matricula-whatsapp], [data-matricula-email]");
  let estadoEducame = { datos: EDUCAME_INICIAL, error: "" };
  let estadoMatricula = { datos: MATRICULA_INICIAL, error: "" };

  window.addEventListener("intiwo:auth-state-changed", (evento) => {
    actualizarAccesoFormularios(
      evento.detail && evento.detail.rol,
      estadoEducame,
      estadoMatricula,
      formularioEducame,
      formularioMatricula
    );
  });

  if (requiereEducame) {
    estadoEducame = await leerTabla("educame_cms", "whatsapp, email", EDUCAME_INICIAL);
    pintarEducame(estadoEducame.datos);
    if (formularioEducame) cargarFormulario(formularioEducame, estadoEducame.datos);
  }
  if (requiereMatricula) {
    estadoMatricula = await leerTabla(
      "matricula_cms",
      "whatsapp_principal, whatsapp_alterno, email, formulario_url",
      MATRICULA_INICIAL
    );
    pintarMatricula(estadoMatricula.datos);
    if (formularioMatricula) cargarFormulario(formularioMatricula, estadoMatricula.datos);
  }

  if (formularioEducame) {
    formularioEducame.addEventListener("submit", (evento) => {
      evento.preventDefault();
      guardarEducame(formularioEducame);
    });
  }
  if (formularioMatricula) {
    formularioMatricula.addEventListener("submit", (evento) => {
      evento.preventDefault();
      guardarMatricula(formularioMatricula);
    });
  }

  actualizarAccesoFormularios(
    window.INTIWO_ROL,
    estadoEducame,
    estadoMatricula,
    formularioEducame,
    formularioMatricula
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
