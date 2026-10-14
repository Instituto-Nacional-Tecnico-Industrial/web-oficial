/* INTIWO | Configuraciones por botones */
(function () {
  function abrir(id) {
    document.querySelectorAll("[data-config-abrir]").forEach((boton) => {
      boton.classList.toggle("es-activo", boton.getAttribute("data-config-abrir") === id);
    });
    document.querySelectorAll("[data-config-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-config-panel") !== id;
    });
  }

  function iniciar() {
    document.querySelectorAll("[data-config-abrir]").forEach((boton) => {
      boton.addEventListener("click", () => abrir(boton.getAttribute("data-config-abrir")));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
