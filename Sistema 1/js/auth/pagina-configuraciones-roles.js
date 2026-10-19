/* INTIWO S1 | vistas de Configuraciones por rol | SH-04d */
(function () {
  const CLAVE_ROL = 'intiwo-rol';
  const VISTAS_POR_ROL = new Map([
    ['admin', 'administrador'],
    ['administrador', 'administrador'],
    ['docente', 'docente'],
    ['editor', 'editor'],
    ['academico', 'academico'],
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

    const botonera = document.querySelector('[data-config-botones]');
    if (botonera) {
      botonera.hidden = vista === 'sin-acceso' || vista === 'rol-desconocido';
    }
    const esStaff = vista === 'administrador' || vista === 'docente';
    document.querySelectorAll('[data-config-staff]').forEach((boton) => {
      boton.hidden = !esStaff;
    });
    document.querySelectorAll('[data-config-admin]').forEach((boton) => {
      boton.hidden = vista !== 'administrador';
    });

    if (descripcion) {
      descripcion.textContent = vista === 'sin-acceso'
        ? 'Inicia sesion con tu cuenta institucional para consultar las opciones disponibles.'
        : vista === 'rol-desconocido'
          ? 'No se pudo determinar que opciones corresponden a esta cuenta.'
          : vista === 'editor'
            ? 'Vista minima: ficha en Proyectos, tema (barra) y restablecer contrasena. No creas cuentas.'
            : vista === 'academico'
              ? 'Gestionas tus proyectos academicos desde Proyectos. No administras cuentas, codigos tecnicos ni ciclos.'
            : vista === 'docente'
              ? 'Puedes dar de alta editores, buscar alumnos ya dados de alta e incorporarlos a tu codigo, y desactivar los tuyos. No ves a otros docentes.'
              : 'Opciones de administrador: cuentas, buscar alumnos y docentes, grupos Tecnico/Academico y bajas logicas.';
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
