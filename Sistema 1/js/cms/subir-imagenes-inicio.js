/* INTIWO S1 | archivo: subir-imagenes-inicio.js | para: validar/preview upload de imagenes del Inicio */
(function () {
  const ACCEPTED_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.svg'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  function fileHasAllowedExtension(fileName) {
    const extension = (fileName || '').split('.').pop()?.toLowerCase() || '';
    return ACCEPTED_EXTENSIONS.includes('.' + extension);
  }

  function getSelectedBlock() {
    return document.querySelector('.intiwo-inicio-bloque.is-selected') || document.querySelector('#inicio-root .intiwo-inicio-bloque');
  }

  function ensureMediaContainer(block) {
    let media = block.querySelector('.intiwo-inicio-bloque__media');
    if (!media) {
      media = document.createElement('div');
      media.className = 'intiwo-inicio-bloque__media';
      const contenido = block.querySelector('.intiwo-inicio-bloque__contenido');
      if (contenido) {
        block.insertBefore(media, contenido.nextSibling);
      } else {
        block.appendChild(media);
      }
    }
    return media;
  }

  function setImageInBlock(block, src, altText) {
    const media = ensureMediaContainer(block);
    media.replaceChildren();

    const img = document.createElement('img');
    img.src = src;
    img.alt = altText || 'Imagen del inicio';
    img.loading = 'lazy';
    img.className = 'intiwo-inicio-bloque__imagen';
    media.appendChild(img);
    block.dataset.imagen = src;
    block.setAttribute('data-imagen', src);
  }

  function buildInputFile() {
    const input = document.getElementById('intiwo-upload-inicio');
    if (input) return input;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'intiwo-upload-inicio';
    fileInput.accept = '.webp,.png,.jpg,.jpeg,.svg,image/webp,image/png,image/jpeg,image/svg+xml';
    fileInput.hidden = true;
    document.body.appendChild(fileInput);
    return fileInput;
  }

  function extensionArchivo(file) {
    const nombre = (file && file.name) || '';
    const ext = nombre.split('.').pop().toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
    if (ext === 'png' || ext === 'webp' || ext === 'svg') return ext;
    if (file && file.type === 'image/png') return 'png';
    if (file && file.type === 'image/webp') return 'webp';
    if (file && file.type === 'image/jpeg') return 'jpg';
    if (file && file.type === 'image/svg+xml') return 'svg';
    return '';
  }

  async function uploadToSupabaseStorage(file) {
    const supabase = window.intiwoSupabase || window.supabase || null;
    if (!supabase || !supabase.storage) {
      throw new Error('[INTIWO Inicio] Cliente Supabase no configurado para Storage.');
    }

    const ext = extensionArchivo(file);
    if (!ext) {
      throw new Error('[INTIWO Inicio] Extension de imagen no permitida.');
    }

    let fileName;
    if (crypto.randomUUID) {
      fileName = crypto.randomUUID() + '.' + ext;
    } else {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      const hex = Array.from(bytes, function (x) { return x.toString(16).padStart(2, '0'); }).join('');
      fileName = hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20) + '.' + ext;
    }
    const bucket = 'inicio';
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream'
    });

    if (error) {
      throw new Error('[INTIWO Inicio] No se pudo subir la imagen al bucket inicio.', { cause: error });
    }

    return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
  }

  async function handleSelectedFile(file) {
    if (!file) return;

    if (!file.type.startsWith('image/') && !fileHasAllowedExtension(file.name)) {
      window.alert('Solo se permiten archivos .webp, .png, .jpg, .jpeg o .svg.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      window.alert('La imagen excede el tamaño máximo permitido (5 MB).');
      return;
    }

    const bloque = getSelectedBlock();
    if (!bloque) {
      window.alert('Selecciona un bloque del Inicio antes de añadir una imagen.');
      return;
    }

    try {
      const remoteUrl = await uploadToSupabaseStorage(file);
      setImageInBlock(bloque, remoteUrl, file.name);
    } catch (error) {
      console.error('[INTIWO Inicio] Fallo la subida al bucket inicio.', error);
      window.alert('No se pudo subir la imagen. Inicia sesión como administrador e inténtalo de nuevo.');
    }
    const input = buildInputFile();
    input.value = '';
  }

  function bindToolbarAction() {
    const toolbarButton = document.querySelector('[data-accion="Imagen"]');
    if (!toolbarButton) return;

    const input = buildInputFile();
    toolbarButton.addEventListener('click', () => {
      if (!document.body.classList.contains('intiwo-editor-activo')) {
        document.body.classList.add('intiwo-editor-activo');
      }
      input.click();
    });

    input.addEventListener('change', (event) => {
      const [file] = event.target.files || [];
      handleSelectedFile(file);
    });
  }

  function iniciar() {
    bindToolbarAction();
    document.body.addEventListener('click', (event) => {
      const target = event.target.closest('.intiwo-inicio-bloque');
      if (!target) return;
      document.querySelectorAll('.intiwo-inicio-bloque').forEach((bloque) => bloque.classList.remove('is-selected'));
      target.classList.add('is-selected');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }

  window.INTIWO_SUBIR_IMAGENES_INICIO = {
    ACCEPTED_EXTENSIONS,
    MAX_FILE_SIZE,
    handleSelectedFile,
    getSelectedBlock,
    setImageInBlock
  };
})();

