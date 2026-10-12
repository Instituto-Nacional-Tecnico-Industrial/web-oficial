/* INTIWO S2 | archivo: panel-configuraciones-cuentas.js | para: acciones de acceso y registro de cuentas | BACKLOG SH-01e */

(function () {
  function actualizarEstado(status) {
    const panel = document.querySelector('.intiwo-menu-cuentas-panel');
    if (!panel) return;

    let nodo = panel.querySelector('.intiwo-menu-cuentas-status');
    if (!nodo) {
      nodo = document.createElement('p');
      nodo.className = 'intiwo-menu-cuentas-status';
      panel.appendChild(nodo);
    }

    const mensajes = {
      login: 'Acceso reservado para docentes, editores y administradores.',
      registro: 'El registro se gestiona por invitación institucional.',
    };

    nodo.textContent = mensajes[status] || 'Cuentas institucionales.';
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
