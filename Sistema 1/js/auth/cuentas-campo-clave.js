/* INTIWO | ojo Lucide y generador de clave (UX de referencia, HTML no Python) */
const LETRAS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMEROS = "0123456789";
const SIGNOS = "!@#$%^&*()_+-=";

function elegir(fuente, cantidad) {
  let texto = "";
  for (let i = 0; i < cantidad; i += 1) {
    texto += fuente.charAt(Math.floor(Math.random() * fuente.length));
  }
  return texto;
}

export function generarClaveSegura() {
  const crudo = (elegir(LETRAS, 3) + elegir(NUMEROS, 3) + elegir(SIGNOS, 3)).split("");
  for (let i = crudo.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = crudo[i];
    crudo[i] = crudo[j];
    crudo[j] = tmp;
  }
  return crudo.join("");
}

export function enlazarOjos(raiz) {
  (raiz || document).querySelectorAll("[data-ojo-clave]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const caja = document.getElementById(boton.getAttribute("data-ojo-clave"));
      if (!caja) return;
      const visible = caja.type === "text";
      caja.type = visible ? "password" : "text";
      boton.setAttribute("aria-pressed", visible ? "false" : "true");
      boton.setAttribute("aria-label", visible ? "Mostrar contrasena" : "Ocultar contrasena");
      const uso = boton.querySelector("use");
      if (uso) uso.setAttribute("href", visible ? "#i-eye" : "#i-eye-off");
    });
  });
}

export function enlazarGenerador(boton, campoA, campoB) {
  if (!boton || !campoA || !campoB) return;
  boton.addEventListener("click", () => {
    const clave = generarClaveSegura();
    campoA.value = clave;
    campoB.value = clave;
    campoA.type = "password";
    campoB.type = "text";
    const ojo = document.querySelector("[data-ojo-clave='" + campoB.id + "']");
    if (ojo) {
      ojo.setAttribute("aria-pressed", "true");
      const uso = ojo.querySelector("use");
      if (uso) uso.setAttribute("href", "#i-eye-off");
    }
  });
}
