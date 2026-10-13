/* INTIWO S2 | archivo: panel-configuraciones-cuentas.js | para: acciones de acceso y registro de cuentas | BACKLOG SH-01e */

(function () {
  function actualizarEstado(status) {
    const nodo = document.querySelector('[data-cuentas-mensaje]');
    if (!nodo) return;

    const mensajes = {
      login: 'El inicio de sesión con correo y contraseña todavía no está conectado.',
      registro: 'El registro requiere una invitación vigente. Si no tienes una, tu docente aún no te ha dado de alta.',
    };

    if (mensajes[status]) nodo.textContent = mensajes[status];
  }

  function inicializar() {
    document.querySelectorAll('[data-cuentas-accion]').forEach((boton) => {
      boton.addEventListener('click', () => {
        actualizarEstado(boton.dataset.cuentasAccion);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar, { once: true });
  } else {
    inicializar();
  }
})();
