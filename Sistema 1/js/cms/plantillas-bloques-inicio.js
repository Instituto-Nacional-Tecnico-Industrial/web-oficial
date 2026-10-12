/* INTIWO S1 | archivo: plantillas-bloques-inicio.js | para: banner, texto-imagen-izq/der, tres-columnas | BACKLOG 0-19 */

(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  const BLOQUES_INICIO_PLANTILLAS = Object.freeze({
    banner: {
      tipo: 'banner',
      nombre: 'Banner institucional',
      descripcion: 'Encabezado con título, subtítulo, imagen y llamada a la acción.',
      campos: ['titulo', 'subtitulo', 'texto', 'imagen', 'cta', 'enlace', 'alineacion'],
      defaultData: {
        tipo: 'banner',
        titulo: 'Instituto Nacional Técnico Industrial',
        subtitulo: 'Formación técnica y vocacional para el desarrollo de El Salvador.',
        texto: '',
        imagen: '',
        cta: 'Inscríbete ahora',
        enlace: '../matricula/pagina-matricula-nuevo-ingreso.html',
        alineacion: 'centro'
      },
      crear: function () {
        return clone(this.defaultData);
      }
    },
    textoImagen: {
      tipo: 'textoImagen',
      nombre: 'Texto + imagen',
      descripcion: 'Bloque editorial con texto a la izquierda o derecha y una imagen acompañante.',
      campos: ['titulo', 'subtitulo', 'texto', 'imagen', 'orientacion', 'cta', 'enlace'],
      defaultData: {
        tipo: 'textoImagen',
        titulo: 'Nuestra propuesta educativa',
        subtitulo: '',
        texto: 'El Instituto forma bachilleres técnicos vocacionales con enfoque académico, técnico y social.',
        imagen: '',
        orientacion: 'izquierda',
        cta: 'Conoce más',
        enlace: '../oferta-academica/pagina-oferta-academica.html'
      },
      crear: function () {
        return clone(this.defaultData);
      }
    },
    tresColumnas: {
      tipo: 'tresColumnas',
      nombre: 'Tres columnas',
      descripcion: 'Bloque de tres tarjetas para destacar servicios, valores o mensajes institucionales.',
      campos: ['titulo', 'subtitulo', 'columnas'],
      defaultData: {
        tipo: 'tresColumnas',
        titulo: 'Lo que ofrecemos',
        subtitulo: 'Una experiencia educativa integral.',
        columnas: [
          {
            titulo: 'Bachillerato técnico',
            texto: 'Especialidades con enfoque práctico, tecnológico y profesional.',
            icono: ''
          },
          {
            titulo: 'Proyectos reales',
            texto: 'Los alumnos desarrollan soluciones concretas con aplicación directa en la industria.',
            icono: ''
          },
          {
            titulo: 'Apoyo institucional',
            texto: 'Atención académica, orientación y comunidad educativa.',
            icono: ''
          }
        ]
      },
      crear: function () {
        return clone(this.defaultData);
      }
    }
  });

  const api = {
    BLOQUES_INICIO_PLANTILLAS,
    obtenerPlantilla: function (tipo) {
      return BLOQUES_INICIO_PLANTILLAS[tipo] || null;
    },
    crearBloque: function (tipo) {
      const plantilla = this.obtenerPlantilla(tipo);
      if (!plantilla) {
        throw new Error('Tipo de bloque no encontrado: ' + tipo);
      }
      return plantilla.crear();
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
