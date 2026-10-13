/* INTIWO S1 | carga el JSON canonico de contenido_inicio */
import { supabase } from "../supabase/cliente-supabase.js";

async function cargarBloquesInicio() {
  const inicio = document.getElementById("inicio-root");
  if (!inicio) {
    throw new Error("[INTIWO Inicio] No se encontro el elemento #inicio-root.");
  }

  const inicioCarga = performance.now();
  const skeleton = document.createElement("div");
  skeleton.className = "intiwo-inicio-skeleton";
  skeleton.setAttribute("aria-hidden", "true");

  const bloquePrincipal = document.createElement("div");
  bloquePrincipal.className = "intiwo-inicio-skeleton__principal";
  skeleton.append(bloquePrincipal);

  for (let i = 0; i < 3; i += 1) {
    const linea = document.createElement("div");
    linea.className = "intiwo-inicio-skeleton__linea";
    skeleton.append(linea);
  }

  inicio.setAttribute("aria-busy", "true");
  inicio.replaceChildren(skeleton);

  let contenidoPublicado = null;
  try {
    const { data, error } = await supabase
      .from("contenido_inicio")
      .select("contenido")
      .maybeSingle();

    if (error) {
      throw new Error("[INTIWO Inicio] No se pudo consultar contenido_inicio.", { cause: error });
    }

    if (data) {
      const contenido = data.contenido;
      if (
        !contenido ||
        typeof contenido !== "object" ||
        Array.isArray(contenido) ||
        !Array.isArray(contenido.bloques)
      ) {
        throw new Error("[INTIWO Inicio] contenido_inicio.contenido no cumple el contrato { bloques: [...] }.");
      }

      if (contenido.bloques.length > 0) contenidoPublicado = contenido;
    }
  } finally {
    const duracionRestante = 200 - (performance.now() - inicioCarga);
    if (duracionRestante > 0) {
      await new Promise((resolve) => setTimeout(resolve, duracionRestante));
    }

    inicio.replaceChildren();
    inicio.removeAttribute("aria-busy");
  }

  const detalle = contenidoPublicado || { bloques: [] };
  window.dispatchEvent(new CustomEvent("intiwo:contenido-inicio-cargado", {
    detail: detalle
  }));
}

cargarBloquesInicio().catch((error) => {
  console.error("[INTIWO Inicio] Fallo la carga del contenido publicado.", error);
});
