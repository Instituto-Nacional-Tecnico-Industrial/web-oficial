/* INTIWO S1 | visibilidad del acceso de edición CMS | solo Inicio */
(function () {
  const ROLES_ADMINISTRADOR = new Set(['administrador', 'admin']);
  const CLAVE_ROL = 'intiwo-rol';

  function obtenerRolActual() {
    const fuentes = [
      document.body && document.body.dataset && document.body.dataset.rol,
      window.INTIWO_ROL,
      window.__INTIWO_ROL__,
      sessionStorage.getItem(CLAVE_ROL),
      localStorage.getItem(CLAVE_ROL),
    ];
    const valor = fuentes.find((rol) => typeof rol === 'string' && rol.trim().length > 0);
    return valor ? valor.trim().toLowerCase() : '';
  }

  function aplicarVisibilidad() {
    const boton = document.querySelector('#intiwo-editar');
    if (boton) boton.hidden = !ROLES_ADMINISTRADOR.has(obtenerRolActual());
  }

  function iniciar() {
    aplicarVisibilidad();
    window.addEventListener('storage', aplicarVisibilidad);
    window.addEventListener('intiwo:auth-state-changed', aplicarVisibilidad);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
