import { supabase } from "../supabase/cliente-supabase.js";
import { leerSesiones, cambiarA, salirDeEsta, quitarDelNavegador } from "./cuentas-sesiones.js";

function pintar() {
  const caja = document.querySelector("[data-sesiones-lista]");
  if (!caja) return;
  caja.replaceChildren();
  const lista = leerSesiones();
  if (!lista.length) {
    caja.textContent = "Aun no hay otras sesiones en este navegador. Inicia sesion con otra cuenta autorizada para anadirla.";
    return;
  }
  lista.forEach((fila) => {
    const articulo = document.createElement("article");
    articulo.className = "intiwo-cuentas-sesion";
    const texto = document.createElement("p");
    texto.textContent = (fila.nombre ? fila.nombre + " · " : "") + fila.email + (fila.rol ? " · " + fila.rol : "");
    articulo.appendChild(texto);
    const acciones = document.createElement("div");
    const usar = document.createElement("button");
    usar.type = "button";
    usar.className = "intiwo-config-baja";
    usar.textContent = "Usar";
    usar.addEventListener("click", async () => {
      if (!supabase) return;
      const { error } = await cambiarA(supabase, fila.id);
      if (error) {
        window.alert(error.message || "No se pudo cambiar de cuenta.");
        return;
      }
      window.location.reload();
    });
    const quitar = document.createElement("button");
    quitar.type = "button";
    quitar.className = "intiwo-config-baja";
    quitar.textContent = "Quitar del navegador";
    quitar.addEventListener("click", () => {
      quitarDelNavegador(fila.id);
      pintar();
    });
    acciones.appendChild(usar);
    acciones.appendChild(quitar);
    articulo.appendChild(acciones);
    caja.appendChild(articulo);
  });
}

function iniciar() {
  pintar();
  const salir = document.getElementById("intiwo-salir-cuenta");
  if (salir) {
    salir.addEventListener("click", async () => {
      await salirDeEsta(supabase);
      window.location.href = new URL("../cuentas/pagina-cuentas.html", window.location.href).href;
    });
  }
  window.addEventListener("intiwo:auth-state-changed", pintar);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
