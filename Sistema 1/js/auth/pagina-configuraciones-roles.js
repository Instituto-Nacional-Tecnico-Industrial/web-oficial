/* INTIWO S1 | vistas de Configuraciones por rol | SH-04d */
(function () {
  const CLAVE_ROL = 'intiwo-rol';
  const VISTAS_POR_ROL = new Map([
    ['admin', 'administrador'],
    ['administrador', 'administrador'],
    ['docente', 'docente'],
    ['editor', 'editor'],
  ]);

  function obtenerRolActual() {
    const fuentes = [
      document.body && document.body.dataset && document.body.dataset.rol,
      window.INTIWO_ROL,
      window.__INTIWO_ROL__,
      sessionStorage.getItem(CLAVE_ROL),
      localStorage.getItem(CLAVE_ROL),
    ];
    const valor = fuentes.find((fuente) => typeof fuente === 'string' && fuente.trim().length > 0);
    return valor ? valor.trim().toLowerCase() : '';
  }

  function actualizarVista() {
    const rol = obtenerRolActual();
    const vista = VISTAS_POR_ROL.get(rol) || (rol ? 'rol-desconocido' : 'sin-acceso');
    const descripcion = document.querySelector('[data-config-descripcion]');

    document.querySelectorAll('[data-config-vista]').forEach((seccion) => {
      seccion.hidden = seccion.dataset.configVista !== vista;
    });

    if (descripcion) {
      descripcion.textContent = vista === 'sin-acceso'
        ? 'Inicia sesión con tu cuenta institucional para consultar las opciones disponibles.'
        : vista === 'rol-desconocido'
          ? 'No se pudo determinar qué opciones corresponden a esta cuenta.'
          : `Opciones disponibles para el rol ${vista}.`;
    }
  }

  function iniciar() {
    actualizarVista();
    window.addEventListener('storage', actualizarVista);
    window.addEventListener('intiwo:auth-state-changed', actualizarVista);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
