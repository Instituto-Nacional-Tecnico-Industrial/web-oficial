/* INTIWO S1 | toolbar de edición CMS para Inicio | solo admin */
(function () {
  const ROLES_ADMINISTRADOR = new Set(['administrador', 'admin']);
  const CLAVE_ROL = 'intiwo-rol';
  const BOTON_EDITAR_ID = 'intiwo-editar';
  const BARRA_TOOLBAR_ID = 'admin-toolbar';
  const PREVIEW_MOBILE_CLASS = 'intiwo-preview-movil';
  const SORTABLE_HANDLE_SELECTOR = '.intiwo-inicio-bloque__handle';
  const ANIMACIONES_INICIO = [
    { value: 'ninguna', label: 'Ninguna' },
    { value: 'fade', label: 'Fade' },
    { value: 'slide-up', label: 'Slide up' },
    { value: 'parallax-suave', label: 'Parallax suave' }
  ];
  const PALETA_INSTITUCIONAL = [
    '#539507',
    '#37393B',
    '#282A2C',
    '#0F0F0F',
    '#F2F0EB',
    '#EAB308',
    '#166534',
    '#EA580C',
    '#0000FF',
    '#64748B',
    '#E61010',
    '#BD813F',
    '#FFFFFF'
  ];

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

  function crearBotonAccion(etiqueta, iconoId, accion) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'intiwo-admin-toolbar__action';
    button.setAttribute('aria-label', etiqueta);
    button.dataset.accion = etiqueta;

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + iconoId);
    icon.appendChild(use);

    const label = document.createElement('span');
    label.textContent = etiqueta;

    button.appendChild(icon);
    button.appendChild(label);
    button.addEventListener('click', accion);
    return button;
  }

  function crearPanelColor() {
    const panel = document.createElement('div');
    panel.className = 'intiwo-admin-toolbar__color-panel';
    panel.setAttribute('aria-label', 'Paleta de colores del inicio');

    const swatches = document.createElement('div');
    swatches.className = 'intiwo-admin-toolbar__swatches';

    PALETA_INSTITUCIONAL.forEach((color) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'intiwo-admin-toolbar__swatch';
      swatch.style.background = color;
      swatch.title = color;
      swatch.setAttribute('aria-label', 'Aplicar color ' + color);
      swatch.addEventListener('click', () => {
        const bloque = document.querySelector('.intiwo-inicio-bloque.is-selected') || document.querySelector('#inicio-root .intiwo-inicio-bloque');
        if (bloque) {
          bloque.style.background = color;
          bloque.dataset.color = color;
          bloque.classList.add('is-selected');
        }

        const inputColor = panel.querySelector('input[type="color"]');
        if (inputColor) inputColor.value = color;
      });
      swatches.appendChild(swatch);
    });

    const inputColor = document.createElement('input');
    inputColor.type = 'color';
    inputColor.value = '#539507';
    inputColor.className = 'intiwo-admin-toolbar__input-color';
    inputColor.setAttribute('aria-label', 'Color personalizado');
    inputColor.addEventListener('input', (event) => {
      const color = event.target.value;
      const bloque = document.querySelector('.intiwo-inicio-bloque.is-selected') || document.querySelector('#inicio-root .intiwo-inicio-bloque');
      if (bloque) {
        bloque.style.background = color;
        bloque.dataset.color = color;
      }
    });

    panel.appendChild(swatches);
    panel.appendChild(inputColor);
    return panel;
  }

  function obtenerBloqueActivo() {
    return document.querySelector('.intiwo-inicio-bloque.is-selected') || document.querySelector('#inicio-root .intiwo-inicio-bloque');
  }

  function obtenerCapasBloque(bloque) {
    if (!bloque) return [];
    return Array.from(bloque.children).filter((element) => element.nodeType === 1);
  }

  function seleccionarCapaActual(capa) {
    const bloque = capa && capa.closest('.intiwo-inicio-bloque');
    if (!bloque) return;

    obtenerCapasBloque(bloque).forEach((element) => element.classList.remove('is-layer-selected'));
    capa.classList.add('is-layer-selected');
  }

  function moverCapa(direction) {
    const bloque = obtenerBloqueActivo();
    if (!bloque) return;

    const capas = obtenerCapasBloque(bloque);
    const actual = capas.find((element) => element.classList.contains('is-layer-selected')) || capas[0];
    if (!actual || capas.length < 2) return;

    const indexActual = capas.indexOf(actual);
    const nextIndex = direction === 'forward' ? Math.min(capas.length - 1, indexActual + 1) : Math.max(0, indexActual - 1);
    if (nextIndex === indexActual) return;

    const target = capas[nextIndex];
    const parent = actual.parentNode;
    if (direction === 'forward') {
      parent.insertBefore(actual, target.nextSibling);
    } else {
      parent.insertBefore(actual, target);
    }
    seleccionarCapaActual(actual);
  }

  function crearPanelCapa() {
    const panel = document.createElement('div');
    panel.className = 'intiwo-admin-toolbar__layer-panel';
    panel.setAttribute('aria-label', 'Capas dentro del bloque');

    const buttonForward = document.createElement('button');
    buttonForward.type = 'button';
    buttonForward.className = 'intiwo-admin-toolbar__layer-button';
    buttonForward.textContent = 'Adelante';
    buttonForward.addEventListener('click', () => moverCapa('forward'));

    const buttonBackward = document.createElement('button');
    buttonBackward.type = 'button';
    buttonBackward.className = 'intiwo-admin-toolbar__layer-button';
    buttonBackward.textContent = 'Atrás';
    buttonBackward.addEventListener('click', () => moverCapa('backward'));

    panel.appendChild(buttonBackward);
    panel.appendChild(buttonForward);
    return panel;
  }

  function aplicarAnimacionBloque(bloque, animacion) {
    if (!bloque) return;

    const animacionNormalizada = ANIMACIONES_INICIO.some((item) => item.value === animacion) ? animacion : 'ninguna';
    const clases = ['anim-fade', 'anim-slide-up', 'anim-parallax-suave'];
    bloque.classList.remove(...clases);
    bloque.dataset.animacion = animacionNormalizada;

    if (animacionNormalizada === 'fade') {
      bloque.classList.add('anim-fade');
    } else if (animacionNormalizada === 'slide-up') {
      bloque.classList.add('anim-slide-up');
    } else if (animacionNormalizada === 'parallax-suave') {
      bloque.classList.add('anim-parallax-suave');
    }

    const selector = document.querySelector('.intiwo-admin-toolbar__anim-select');
    if (selector) {
      selector.value = animacionNormalizada;
    }
  }

  function crearPanelAnimacion() {
    const panel = document.createElement('div');
    panel.className = 'intiwo-admin-toolbar__anim-panel';
    panel.setAttribute('aria-label', 'Animación del bloque');

    const label = document.createElement('label');
    label.className = 'intiwo-admin-toolbar__anim-label';
    label.textContent = 'Animación';

    const select = document.createElement('select');
    select.className = 'intiwo-admin-toolbar__anim-select';
    select.setAttribute('aria-label', 'Seleccionar animación del bloque');

    ANIMACIONES_INICIO.forEach(({ value, label: texto }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = texto;
      select.appendChild(option);
    });

    select.addEventListener('change', (event) => {
      const bloque = obtenerBloqueActivo();
      if (!bloque) return;
      aplicarAnimacionBloque(bloque, event.target.value);
    });

    panel.appendChild(label);
    panel.appendChild(select);
    return panel;
  }

  function actualizarEstadoGuardar() {
    const guardarBoton = document.querySelector('[data-accion="Guardar"]');
    if (!guardarBoton) return;

    const root = document.getElementById('inicio-root');
    const preview = root && root.parentElement && root.parentElement.classList.contains('intiwo-preview-shell') ? root.parentElement : root;
    const previewActiva = document.body.classList.contains(PREVIEW_MOBILE_CLASS);

    if (!previewActiva) {
      guardarBoton.disabled = false;
      guardarBoton.title = 'Guardar';
      guardarBoton.classList.remove('is-disabled');
      guardarBoton.setAttribute('aria-disabled', 'false');
      return;
    }

    const hayOverflow = preview ? preview.scrollWidth > preview.clientWidth + 1 : false;
    guardarBoton.disabled = hayOverflow;
    guardarBoton.classList.toggle('is-disabled', hayOverflow);
    guardarBoton.setAttribute('aria-disabled', String(hayOverflow));
    guardarBoton.title = hayOverflow ? 'No se puede guardar: el bloque desborda el ancho de 360px' : 'Guardar';
  }

  function toggleVistaMovil() {
    const root = document.getElementById('inicio-root');
    const shell = root && root.parentElement && root.parentElement.classList.contains('intiwo-preview-shell') ? root.parentElement : null;

    if (!root) return;

    const contenedor = shell || document.createElement('div');
    if (!shell) {
      contenedor.className = 'intiwo-preview-shell';
      root.parentNode.insertBefore(contenedor, root);
      contenedor.appendChild(root);
    }

    const activo = document.body.classList.toggle(PREVIEW_MOBILE_CLASS);
    const botonMovil = document.querySelector('[data-accion="Vista móvil"]');
    if (botonMovil) {
      botonMovil.setAttribute('aria-pressed', String(activo));
      botonMovil.classList.toggle('is-active', activo);
    }

    actualizarEstadoGuardar();
    if (activo) {
      requestAnimationFrame(actualizarEstadoGuardar);
      setTimeout(actualizarEstadoGuardar, 100);
    }
  }

  function montarToolbar() {
    const toolbar = document.getElementById(BARRA_TOOLBAR_ID);
    if (toolbar) return toolbar;

    const contenedor = document.createElement('div');
    contenedor.id = BARRA_TOOLBAR_ID;
    contenedor.className = 'intiwo-admin-toolbar';
    contenedor.setAttribute('role', 'toolbar');
    contenedor.setAttribute('aria-label', 'Herramientas del editor del inicio');
    contenedor.hidden = true;

    const acciones = [
      { label: 'Plantilla', icono: 'i-layout-template', accion: () => {} },
      { label: 'Color', icono: 'i-palette', accion: () => {} },
      { label: 'Imagen', icono: 'i-image', accion: () => {} },
      { label: 'Texto', icono: 'i-type', accion: () => {} },
      { label: 'Capa', icono: 'i-layers', accion: () => {} },
      { label: 'Animación', icono: 'i-sparkles', accion: () => {} },
      { label: 'Vista móvil', icono: 'i-layout-template', accion: toggleVistaMovil },
      { label: 'Guardar', icono: 'i-save', accion: async () => {
        const botonGuardar = document.querySelector('[data-accion="Guardar"]');
        if (botonGuardar && botonGuardar.disabled) {
          return;
        }

        const apiGuardar = window.INTIWO_GUARDAR_CONTENIDO_INICIO;
        if (!apiGuardar || typeof apiGuardar.guardarContenidoInicio !== 'function') {
          window.alert('No se pudo publicar el Inicio.');
          return;
        }

        if (botonGuardar) botonGuardar.disabled = true;
        try {
          const contenidoGuardado = await apiGuardar.guardarContenidoInicio('#inicio-root');
          window.INTIWO_INICIO_CONTENIDO_PUBLICADO = contenidoGuardado;
          window.INTIWO_INICIO_EDITOR_SNAPSHOT = contenidoGuardado;
          document.body.classList.remove(PREVIEW_MOBILE_CLASS);
          setModoEditorActivo(false);
        } catch (error) {
          console.error('[INTIWO Inicio] Fallo el upsert de contenido_inicio.', error);
          window.alert('No se pudo publicar el Inicio. Inicia sesión como administrador e inténtalo de nuevo.');
          if (botonGuardar) botonGuardar.disabled = false;
        }
      } },
      { label: 'Cancelar', icono: 'i-x', accion: () => {
        document.body.classList.remove(PREVIEW_MOBILE_CLASS);
        restaurarContenidoAnterior();
        setModoEditorActivo(false);
      } },
    ];

    acciones.forEach(({ label, icono, accion }) => {
      contenedor.appendChild(crearBotonAccion(label, icono, accion));
    });

    contenedor.appendChild(crearPanelColor());
    contenedor.appendChild(crearPanelAnimacion());
    contenedor.appendChild(crearPanelCapa());

    const target = document.querySelector('main#inicio-root') || document.body;
    target.insertAdjacentElement('afterend', contenedor);

    const root = document.getElementById('inicio-root');
    if (root) {
      root.addEventListener('click', (event) => {
        const bloque = event.target.closest('.intiwo-inicio-bloque');
        if (!bloque) return;
        document.querySelectorAll('.intiwo-inicio-bloque').forEach((element) => element.classList.remove('is-selected'));
        bloque.classList.add('is-selected');

        const selectAnimacion = document.querySelector('.intiwo-admin-toolbar__anim-select');
        if (selectAnimacion) {
          const valorActual = bloque.dataset.animacion || 'ninguna';
          selectAnimacion.value = ANIMACIONES_INICIO.some((item) => item.value === valorActual) ? valorActual : 'ninguna';
        }

        const capa = event.target.closest('.intiwo-inicio-bloque__media, .intiwo-inicio-bloque__contenido, .intiwo-inicio-bloque__texto-columna, .intiwo-inicio-bloque__header, .intiwo-inicio-bloque__grid, .intiwo-inicio-bloque__cta');
        if (capa) {
          seleccionarCapaActual(capa);
        }
      });
    }

    return contenedor;
  }

  function obtenerContenidoActual() {
    const guardado = window.INTIWO_INICIO_CONTENIDO_PUBLICADO;
    if (guardado && typeof guardado === 'object' && Array.isArray(guardado.bloques)) {
      return { bloques: guardado.bloques };
    }
    return { bloques: [] };
  }

  function restaurarContenidoAnterior() {
    const contenido = window.INTIWO_INICIO_EDITOR_SNAPSHOT || obtenerContenidoActual();
    window.dispatchEvent(new CustomEvent('intiwo:contenido-inicio-cargado', {
      detail: contenido
    }));
    window.INTIWO_INICIO_EDITOR_SNAPSHOT = null;
  }

  function sincronizarOrdenBloques(root) {
    if (!root) return [];

    const bloques = Array.from(root.querySelectorAll('.intiwo-inicio-bloque'));
    const ordenActual = bloques.map((bloque, index) => {
      const orden = index + 1;
      bloque.dataset.orden = String(orden);
      bloque.style.order = String(orden);
      return {
        id: bloque.dataset.id || 'bloque-' + orden,
        orden: orden,
        plantilla: bloque.dataset.plantilla || 'banner'
      };
    });

    window.INTIWO_INICIO_BLOQUES = ordenActual;
    window.dispatchEvent(new CustomEvent('intiwo:bloques-orden-cambiado', {
      detail: { bloques: ordenActual }
    }));
    return ordenActual;
  }

  function limpiarCssArbitrario() {
    const selectores = [
      'textarea[id*="css" i]',
      'textarea[name*="css" i]',
      'textarea[aria-label*="css" i]',
      'textarea[class*="css" i]',
      'textarea[data-css]',
      '.intiwo-admin-custom-css',
      '.intiwo-admin-css-textarea',
      '[data-editor-css]'
    ];

    selectores.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    });
  }

  function inicializarSortableInicio() {
    const root = document.getElementById('inicio-root');
    if (!root || typeof window.Sortable === 'undefined') return;
    if (root.dataset.sortableBound === 'true') return;

    root.dataset.sortableBound = 'true';
    new window.Sortable(root, {
      animation: 150,
      handle: SORTABLE_HANDLE_SELECTOR,
      draggable: '.intiwo-inicio-bloque',
      ghostClass: 'intiwo-inicio-bloque--dragging',
      filter: '.intiwo-admin-empty-add',
      onUpdate: function () {
        sincronizarOrdenBloques(root);
      }
    });
  }

  function setModoEditorActivo(activo) {
    document.body.classList.toggle('intiwo-editor-activo', activo);
    const toolbar = document.getElementById(BARRA_TOOLBAR_ID) || montarToolbar();
    toolbar.hidden = !activo;

    if (activo) {
      window.INTIWO_INICIO_EDITOR_SNAPSHOT = obtenerContenidoActual();
      actualizarEstadoGuardar();
      inicializarSortableInicio();
      sincronizarOrdenBloques(document.getElementById('inicio-root'));
      window.addEventListener('resize', actualizarEstadoGuardar);
    } else {
      window.removeEventListener('resize', actualizarEstadoGuardar);
      setTimeout(actualizarEstadoGuardar, 0);
    }

    window.dispatchEvent(new CustomEvent('intiwo:contenido-inicio-cargado', {
      detail: obtenerContenidoActual()
    }));

    const boton = document.querySelector('#' + BOTON_EDITAR_ID);
    if (boton) {
      boton.setAttribute('aria-pressed', String(activo));
      boton.classList.toggle('is-active', activo);
      const icon = boton.querySelector('svg');
      if (icon) {
        icon.innerHTML = activo ? '<use href="#i-x"></use>' : '<use href="#i-pencil"></use>';
      }
      const texto = boton.querySelector('span');
      if (texto) {
        texto.textContent = activo ? 'Cerrar' : 'Editar';
      }
    }
  }

  function aplicarVisibilidad() {
    const boton = document.querySelector('#' + BOTON_EDITAR_ID);
    const rolActual = obtenerRolActual();
    const esAdmin = ROLES_ADMINISTRADOR.has(rolActual);

    if (boton) boton.hidden = !esAdmin;

    if (!esAdmin) {
      document.body.classList.remove('intiwo-editor-activo');
      const toolbar = document.getElementById(BARRA_TOOLBAR_ID);
      if (toolbar) toolbar.hidden = true;
      return;
    }

    if (boton && !boton.dataset.enlazado) {
      boton.dataset.enlazado = 'true';
      boton.addEventListener('click', () => {
        const activo = !document.body.classList.contains('intiwo-editor-activo');
        setModoEditorActivo(activo);
      });
    }

    if (!document.body.classList.contains('intiwo-editor-activo')) {
      const toolbar = document.getElementById(BARRA_TOOLBAR_ID) || montarToolbar();
      toolbar.hidden = true;
    }
  }

  function iniciar() {
    limpiarCssArbitrario();
    window.addEventListener('intiwo:contenido-inicio-cargado', (event) => {
      const detalle = event && event.detail ? event.detail : null;
      if (detalle && typeof detalle === 'object' && Array.isArray(detalle.bloques)) {
        window.INTIWO_INICIO_CONTENIDO_PUBLICADO = detalle;
      }
    });
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
