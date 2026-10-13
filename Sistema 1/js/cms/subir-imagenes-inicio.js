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
    media.innerHTML = '';

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

  async function uploadToSupabaseStorage(file) {
    const supabase = window.supabase || null;
    if (!supabase || !supabase.storage) return null;

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    const bucket = 'inicio';
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'application/octet-stream'
    });

    if (error) {
      console.warn('[INTIWO Inicio] No se pudo subir la imagen al bucket remoto.', error);
      return null;
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
    return publicUrl;
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

    let src = URL.createObjectURL(file);
    try {
      const remoteUrl = await uploadToSupabaseStorage(file);
      if (remoteUrl) src = remoteUrl;
    } catch (error) {
      console.warn('[INTIWO Inicio] Fallback a preview local.', error);
    }

    setImageInBlock(bloque, src, file.name);
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

