/* INTIWO S1 | archivo: plantillas-bloques-inicio.js | para: banner, texto-imagen-izq/der, tres-columnas | BACKLOG 0-19 */

(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function textoDesdeValor(value) {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  const PLANTILLAS_CANONICAS = Object.freeze({
    banner: 'banner',
    'texto-imagen-izq': 'texto-imagen-izq',
    'texto-imagen-der': 'texto-imagen-der',
    'tres-columnas': 'tres-columnas'
  });

  function crearBloqueCanonico(plantilla, overrides) {
    const base = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'bloque-' + Date.now() + '-' + Math.random().toString(16).slice(2),
      plantilla: plantilla,
      orden: 0,
      textos: {
        titulo: '',
        subtitulo: '',
        texto: '',
        cta: '',
        enlace: ''
      },
      color: '',
      imagen: '',
      animacion: 'ninguna',
      capas: []
    };

    if (plantilla === 'banner') {
      base.textos = {
        titulo: 'Instituto Nacional Técnico Industrial',
        subtitulo: 'Formación técnica y vocacional para el desarrollo de El Salvador.',
        texto: '',
        cta: 'Inscríbete ahora',
        enlace: '../matricula/pagina-matricula-nuevo-ingreso.html'
      };
      base.color = '#f1f5eb';
    }

    if (plantilla === 'texto-imagen-izq' || plantilla === 'texto-imagen-der') {
      base.textos = {
        titulo: 'Nuestra propuesta educativa',
        subtitulo: '',
        texto: 'El Instituto forma bachilleres técnicos vocacionales con enfoque académico, técnico y social.',
        cta: 'Conoce más',
        enlace: '../oferta-academica/pagina-oferta-academica.html'
      };
      base.img = '';
      base.color = '#f8fafc';
    }

    if (plantilla === 'tres-columnas') {
      base.textos = {
        titulo: 'Lo que ofrecemos',
        subtitulo: 'Una experiencia educativa integral.',
        texto: ''
      };
      base.columnas = [
        { titulo: 'Bachillerato técnico', texto: 'Especialidades con enfoque práctico, tecnológico y profesional.', icono: '' },
        { titulo: 'Proyectos reales', texto: 'Los alumnos desarrollan soluciones concretas con aplicación directa en la industria.', icono: '' },
        { titulo: 'Apoyo institucional', texto: 'Atención académica, orientación y comunidad educativa.', icono: '' }
      ];
      base.color = '#eef7ef';
    }

    return Object.assign(base, clone(overrides || {}));
  }

  const BLOQUES_INICIO_PLANTILLAS = Object.freeze({
    banner: {
      tipo: 'banner',
      nombre: 'Banner institucional',
      descripcion: 'Encabezado con título, subtítulo, imagen y llamada a la acción.',
      campos: ['titulo', 'subtitulo', 'texto', 'imagen', 'cta', 'enlace', 'alineacion'],
      defaultData: crearBloqueCanonico('banner'),
      crear: function () {
        return clone(this.defaultData);
      }
    },
    'texto-imagen-izq': {
      tipo: 'texto-imagen-izq',
      nombre: 'Texto + imagen (izquierda)',
      descripcion: 'Bloque editorial con texto a la izquierda y imagen acompañante.',
      campos: ['titulo', 'subtitulo', 'texto', 'imagen', 'cta', 'enlace'],
      defaultData: crearBloqueCanonico('texto-imagen-izq'),
      crear: function () {
        return clone(this.defaultData);
      }
    },
    'texto-imagen-der': {
      tipo: 'texto-imagen-der',
      nombre: 'Texto + imagen (derecha)',
      descripcion: 'Bloque editorial con texto a la derecha y imagen acompañante.',
      campos: ['titulo', 'subtitulo', 'texto', 'imagen', 'cta', 'enlace'],
      defaultData: crearBloqueCanonico('texto-imagen-der'),
      crear: function () {
        return clone(this.defaultData);
      }
    },
    'tres-columnas': {
      tipo: 'tres-columnas',
      nombre: 'Tres columnas',
      descripcion: 'Bloque de tres tarjetas para destacar servicios, valores o mensajes institucionales.',
      campos: ['titulo', 'subtitulo', 'columnas'],
      defaultData: crearBloqueCanonico('tres-columnas'),
      crear: function () {
        return clone(this.defaultData);
      }
    }
  });

  function normalizarPlantilla(tipo) {
    const valor = textoDesdeValor(tipo || '').trim().toLowerCase();
    if (valor === 'banner') return 'banner';
    if (valor === 'textoimagen' || valor === 'texto-imagen' || valor === 'texto_imagen' || valor === 'texto-imagen-izq' || valor === 'texto-imagen-der') {
      return valor === 'texto-imagen-der' ? 'texto-imagen-der' : 'texto-imagen-izq';
    }
    if (valor === 'trescolumnas' || valor === 'tres-columnas' || valor === 'tres_columnas') return 'tres-columnas';
    return 'banner';
  }

  function normalizarBloque(bloque, index) {
    const plantilla = normalizarPlantilla(bloque && (bloque.plantilla || bloque.tipo || 'banner'));
    const base = crearBloqueCanonico(plantilla, { orden: Number.isInteger(index) ? index : 0 });

    const fuentes = [
      bloque && bloque.textos ? bloque.textos : {},
      bloque || {}
    ];
    const textos = Object.assign({}, base.textos, ...fuentes.map((obj) => obj && typeof obj === 'object' ? obj : {}));

    const normalizado = clone(base);
    normalizado.id = bloque && bloque.id ? String(bloque.id) : base.id;
    normalizado.plantilla = plantilla;
    normalizado.orden = Number.isFinite(Number(bloque && bloque.orden)) ? Number(bloque.orden) : Number(index || 0);
    normalizado.textos = {
      titulo: textoDesdeValor(textos.titulo || textos.title || '').trim(),
      subtitulo: textoDesdeValor(textos.subtitulo || textos.subtitle || '').trim(),
      texto: textoDesdeValor(textos.texto || textos.body || textos.descripcion || '').trim(),
      cta: textoDesdeValor(textos.cta || '').trim(),
      enlace: textoDesdeValor(textos.enlace || textos.href || '').trim()
    };
    normalizado.color = textoDesdeValor(bloque && (bloque.color || bloque.fondo) || '').trim();
    normalizado.imagen = textoDesdeValor(bloque && (bloque.imagen || bloque.image || bloque.src) || '').trim();
    normalizado.animacion = textoDesdeValor((bloque && bloque.animacion) || 'ninguna').trim() || 'ninguna';
    normalizado.capas = Array.isArray(bloque && bloque.capas) ? clone(bloque.capas) : [];

    if (plantilla === 'texto-imagen-izq' || plantilla === 'texto-imagen-der') {
      const orientacion = (bloque && (bloque.orientacion || bloque.alineacion) || (plantilla.includes('der') ? 'derecha' : 'izquierda')).toString().toLowerCase();
      normalizado.orientacion = orientacion === 'derecha' ? 'derecha' : 'izquierda';
      normalizado.plantilla = orientacion === 'derecha' ? 'texto-imagen-der' : 'texto-imagen-izq';
    }

    if (plantilla === 'tres-columnas') {
      normalizado.columnas = Array.isArray(bloque && bloque.columnas) ? clone(bloque.columnas) : clone(base.columnas);
    }

    if (plantilla === 'banner') {
      normalizado.alineacion = (bloque && (bloque.alineacion || bloque.align) || 'centro').toString().toLowerCase();
    }

    return normalizado;
  }

  const api = {
    PLANTILLAS_CANONICAS,
    BLOQUES_INICIO_PLANTILLAS,
    normalizarBloque,
    normalizarContenido: function (contenido) {
      const entrada = contenido && typeof contenido === 'object' ? contenido : { bloques: [] };
      const bloques = Array.isArray(entrada.bloques) ? entrada.bloques.map((bloque, index) => normalizarBloque(bloque, index)) : [];
      return { bloques: bloques };
    },
    obtenerPlantilla: function (tipo) {
      const clave = normalizarPlantilla(tipo);
      return BLOQUES_INICIO_PLANTILLAS[clave] || null;
    },
    crearBloque: function (tipo) {
      const clave = normalizarPlantilla(tipo);
      const plantilla = this.obtenerPlantilla(clave);
      if (!plantilla) {
        throw new Error('Tipo de bloque no encontrado: ' + tipo);
      }
      return normalizarBloque(plantilla.defaultData, 0);
    }
  };

  if (typeof window !== 'undefined') {
    window.INTIWO_BLOQUES_INICIO_PLANTILLAS = BLOQUES_INICIO_PLANTILLAS;
    window.INTIWO_BLOQUES_INICIO = api;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
