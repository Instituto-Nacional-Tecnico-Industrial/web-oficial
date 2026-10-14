/* INTIWO S1 | archivo: guardar-contenido-inicio.js | para: validar y normalizar JSON antes del upsert */

(function () {
  function toText(value) {
    var api = typeof window !== 'undefined' ? window.INTIWO_SANITIZAR_TEXTO_CMS : null;
    if (api && typeof api.texto === 'function') return api.texto(value);
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  function toUrl(value) {
    var api = typeof window !== 'undefined' ? window.INTIWO_SANITIZAR_TEXTO_CMS : null;
    if (api && typeof api.url === 'function') return api.url(value);
    return toText(value);
  }

  function normalizarPlantilla(tipo) {
    const valor = toText(tipo).toLowerCase();
    if (valor === 'banner') return 'banner';
    if (valor === 'texto-imagen-izq' || valor === 'textoimagenizq' || valor === 'texto-imagen' || valor === 'textoimagen' || valor === 'texto_imagen') return 'texto-imagen-izq';
    if (valor === 'texto-imagen-der' || valor === 'textoimagender') return 'texto-imagen-der';
    if (valor === 'tres-columnas' || valor === 'trescolumnas' || valor === 'tres_columnas') return 'tres-columnas';
    return 'banner';
  }

  function extraerTextosBloqueDesdeDOM(bloque) {
    if (!bloque) return { titulo: '', subtitulo: '', texto: '', cta: '', enlace: '' };

    const titulo = bloque.querySelector('.intiwo-inicio-bloque__titulo');
    const subtitulo = bloque.querySelector('.intiwo-inicio-bloque__subtitulo');
    const texto = bloque.querySelector('.intiwo-inicio-bloque__texto');
    const cta = bloque.querySelector('.intiwo-inicio-bloque__cta');

    return {
      titulo: toText(titulo ? titulo.textContent : ''),
      subtitulo: toText(subtitulo ? subtitulo.textContent : ''),
      texto: toText(texto ? texto.textContent : ''),
      cta: toText(cta ? cta.textContent : ''),
      enlace: toUrl(cta && cta.href ? cta.href : '')
    };
  }

  function inferirPlantillaBloque(bloque) {
    if (!bloque) return 'banner';
    const clases = bloque.className || '';
    if (String(clases).includes('tres-columnas')) return 'tres-columnas';
    if (String(clases).includes('imagen-derecha')) return 'texto-imagen-der';
    if (String(clases).includes('texto-imagen')) return 'texto-imagen-izq';
    return 'banner';
  }

  function serializarBloquesDesdeDOM(rootSelector) {
    const root = typeof document !== 'undefined'
      ? document.querySelector(rootSelector || '#inicio-root')
      : null;

    if (!root) return { bloques: [] };

    const bloques = Array.from(root.querySelectorAll('.intiwo-inicio-bloque')).map((bloque, index) => {
      const plantilla = normalizarPlantilla(
        bloque.dataset.plantilla || inferirPlantillaBloque(bloque) || 'banner'
      );
      const textos = extraerTextosBloqueDesdeDOM(bloque);
      const imagen = bloque.querySelector('img');

      return {
        id: toText(bloque.dataset.id || 'bloque-' + (index + 1)),
        plantilla: plantilla,
        orden: Number(bloque.dataset.orden || (index + 1)),
        textos: textos,
        color: toText(bloque.dataset.color || bloque.style.background || ''),
        imagen: normalizarUrlImagen(toText((imagen && imagen.src) || bloque.dataset.imagen || '')),
        animacion: toText(bloque.dataset.animacion || 'ninguna') || 'ninguna',
        capas: Array.from(bloque.children).filter((nodo) => nodo.nodeType === 1).map((nodo, layerIndex) => ({
          id: 'capa-' + (layerIndex + 1),
          clase: nodo.className || '',
          orden: layerIndex + 1
        }))
      };
    });

    return { bloques: bloques };
  }

  function normalizarBloqueParaGuardar(bloque, index) {
    if (!bloque || typeof bloque !== 'object') {
      return {
        id: 'bloque-' + (index + 1),
        plantilla: 'banner',
        orden: index,
        textos: { titulo: '', subtitulo: '', texto: '', cta: '', enlace: '' },
        color: '',
        imagen: '',
        animacion: 'ninguna',
        capas: []
      };
    }

    const tipo = normalizarPlantilla(bloque.plantilla || bloque.tipo || 'banner');
    const orientacion = toText(bloque.orientacion || bloque.alineacion || '').toLowerCase();
    const plantilla = tipo === 'texto-imagen-der' || orientacion === 'derecha'
      ? 'texto-imagen-der'
      : tipo === 'texto-imagen-izq' || orientacion === 'izquierda'
        ? 'texto-imagen-izq'
        : 'banner';

    const normalizado = {
      id: toText(bloque.id || 'bloque-' + (index + 1)),
      plantilla: plantilla,
      orden: Number.isFinite(Number(bloque.orden)) ? Number(bloque.orden) : index,
      textos: {
        titulo: toText((bloque.textos && bloque.textos.titulo) || bloque.titulo || ''),
        subtitulo: toText((bloque.textos && bloque.textos.subtitulo) || bloque.subtitulo || ''),
        texto: toText((bloque.textos && bloque.textos.texto) || bloque.texto || ''),
        cta: toText((bloque.textos && bloque.textos.cta) || bloque.cta || ''),
        enlace: toUrl((bloque.textos && bloque.textos.enlace) || bloque.enlace || '')
      },
      color: toText(bloque.color || ''),
      imagen: normalizarUrlImagen(toUrl(bloque.imagen || '')),
      animacion: toText(bloque.animacion || 'ninguna') || 'ninguna',
      capas: Array.isArray(bloque.capas) ? bloque.capas.map((capa) => ({ ...capa })) : []
    };

    if (plantilla === 'banner') {
      normalizado.alineacion = toText(bloque.alineacion || 'centro').toLowerCase() || 'centro';
    }

    if (plantilla === 'texto-imagen-izq' || plantilla === 'texto-imagen-der') {
      normalizado.orientacion = plantilla === 'texto-imagen-der' ? 'derecha' : 'izquierda';
    }

    if (plantilla === 'tres-columnas') {
      normalizado.columnas = Array.isArray(bloque.columnas) ? JSON.parse(JSON.stringify(bloque.columnas)) : [];
    }

    return normalizado;
  }

  function clienteSupabase() {
    return (typeof window !== 'undefined' && (window.intiwoSupabase || window.supabase)) || null;
  }

  function normalizarUrlImagen(url) {
    if (!url) return '';
    if (/^(blob:|data:)/i.test(url)) return '';
    return url;
  }

  function normalizarContenidoParaGuardar(contenido) {
    const entrada = contenido && typeof contenido === 'object' && !Array.isArray(contenido)
      ? contenido
      : { bloques: [] };

    const bloques = Array.isArray(entrada.bloques)
      ? entrada.bloques.map((bloque, index) => normalizarBloqueParaGuardar(bloque, index))
      : [];

    return { bloques: bloques };
  }

  async function guardarContenidoInicio(rootSelector) {
    const contenido = serializarBloquesDesdeDOM(rootSelector);
    const validado = normalizarContenidoParaGuardar(contenido);
    const sb = clienteSupabase();

    if (!sb) {
      throw new Error('[INTIWO Inicio] Cliente Supabase no configurado; no se publica en contenido_inicio.');
    }

    const { error } = await sb
      .from('contenido_inicio')
      .upsert({ id: 1, contenido: validado }, { onConflict: 'id' });

    if (error) {
      throw new Error('[INTIWO Inicio] No se pudo guardar contenido_inicio.', { cause: error });
    }

    if (typeof window !== 'undefined') {
      window.INTIWO_INICIO_CONTENIDO_PUBLICADO = validado;
      window.dispatchEvent(new CustomEvent('intiwo:contenido-inicio-guardado', { detail: validado }));
    }

    return validado;
  }

  function validarContenidoParaGuardar(contenido) {
    return normalizarContenidoParaGuardar(contenido);
  }

  if (typeof window !== 'undefined') {
    window.INTIWO_GUARDAR_CONTENIDO_INICIO = {
      serializarBloquesDesdeDOM,
      normalizarBloqueParaGuardar,
      normalizarContenidoParaGuardar,
      guardarContenidoInicio,
      validarContenidoParaGuardar
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      serializarBloquesDesdeDOM,
      normalizarBloqueParaGuardar,
      normalizarContenidoParaGuardar,
      guardarContenidoInicio,
      validarContenidoParaGuardar
    };
  }
})();
