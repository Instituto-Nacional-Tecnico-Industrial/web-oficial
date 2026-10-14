/* INTIWO S1 | render de bloques del Inicio para visitante y admin */
(function () {
  function sanitizar() {
    return window.INTIWO_SANITIZAR_TEXTO_CMS || null;
  }

  function textValue(value) {
    const api = sanitizar();
    if (api && typeof api.texto === "function") return api.texto(value);
    if (value === null || value === undefined) return "";
    return String(value);
  }

  function urlValue(value) {
    const api = sanitizar();
    if (api && typeof api.url === "function") return api.url(value);
    return textValue(value).trim();
  }

  function logRenderError(message, detail) {
    console.error("[INTIWO Inicio] " + message, detail);
  }

  function getTextos(bloque) {
    if (!bloque || typeof bloque !== "object") return {};
    if (bloque.textos && typeof bloque.textos === "object") return bloque.textos;
    return bloque;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = textValue(text);
    return element;
  }

  function renderCTA(texto, enlace) {
    const href = urlValue(enlace || "");
    const label = textValue(texto || "").trim();
    if (!href || !label) return null;
    const link = document.createElement("a");
    link.href = href;
    link.className = "intiwo-inicio-bloque__cta t-md";
    link.textContent = label;
    link.rel = "noopener noreferrer";
    if (href.startsWith("http")) {
      link.target = "_blank";
    }
    return link;
  }

  function aplicarAnimacionRender(bloque, section) {
    if (!section || !bloque) return section;
    const textos = getTextos(bloque);
    const animacion = textValue(bloque.animacion || textos.animacion || "").toLowerCase() || "ninguna";
    section.classList.remove("anim-fade", "anim-slide-up", "anim-parallax-suave");
    if (animacion === "fade") {
      section.classList.add("anim-fade");
    } else if (animacion === "slide-up") {
      section.classList.add("anim-slide-up");
    } else if (animacion === "parallax-suave") {
      section.classList.add("anim-parallax-suave");
    }
    return section;
  }

  function attachDragHandle(bloque) {
    if (!bloque || bloque.querySelector(".intiwo-inicio-bloque__handle")) return bloque;
    if (!esAdminInicio()) return bloque;

    const handle = document.createElement("div");
    handle.className = "intiwo-inicio-bloque__handle";
    handle.setAttribute("aria-label", "Arrastrar bloque");
    handle.title = "Arrastrar bloque";

    for (let index = 0; index < 3; index += 1) {
      const line = document.createElement("span");
      handle.appendChild(line);
    }

    bloque.insertBefore(handle, bloque.firstChild);
    return bloque;
  }

  function renderBanner(bloque) {
    const textos = getTextos(bloque);
    const section = attachDragHandle(createElement("section", "intiwo-inicio-bloque intiwo-inicio-bloque--banner"));
    const content = createElement("div", "intiwo-inicio-bloque__contenido");
    const media = document.createElement("div");
    media.className = "intiwo-inicio-bloque__media";

    if (bloque.color) {
      section.style.background = bloque.color;
    }
    aplicarAnimacionRender(bloque, section);

    const imageSource = urlValue(bloque.imagen || textos.imagen || "");
    if (imageSource) {
      const img = document.createElement("img");
      img.src = imageSource;
      img.alt = textValue(textos.titulo || bloque.titulo || "Imagen institucional");
      img.loading = "lazy";
      media.appendChild(img);
    }

    if (textos.titulo || bloque.titulo) {
      content.appendChild(createElement("h1", "intiwo-inicio-bloque__titulo t-xl", textos.titulo || bloque.titulo));
    }
    if (textos.subtitulo || bloque.subtitulo) {
      content.appendChild(createElement("p", "intiwo-inicio-bloque__subtitulo t-lg", textos.subtitulo || bloque.subtitulo));
    }
    if (textos.texto || bloque.texto) {
      content.appendChild(createElement("p", "intiwo-inicio-bloque__texto t-md", textos.texto || bloque.texto));
    }

    const cta = renderCTA(textos.cta || bloque.cta, textos.enlace || bloque.enlace);
    if (cta) content.appendChild(cta);

    if (media.childNodes.length > 0) section.appendChild(media);
    section.appendChild(content);
    return section;
  }

  function renderTextoImagen(bloque) {
    const textos = getTextos(bloque);
    const section = attachDragHandle(createElement("section", "intiwo-inicio-bloque intiwo-inicio-bloque--texto-imagen"));
    const textBlock = createElement("div", "intiwo-inicio-bloque__texto-columna");
    const media = document.createElement("div");
    media.className = "intiwo-inicio-bloque__media";

    if (bloque.color) {
      section.style.background = bloque.color;
    }
    aplicarAnimacionRender(bloque, section);

    const orientation = textValue(textos.orientacion || bloque.orientacion || "izquierda");
    if (orientation === "derecha") {
      section.classList.add("intiwo-inicio-bloque--imagen-derecha");
    }

    if (textos.titulo || bloque.titulo) {
      textBlock.appendChild(createElement("h2", "intiwo-inicio-bloque__titulo t-xl", textos.titulo || bloque.titulo));
    }
    if (textos.subtitulo || bloque.subtitulo) {
      textBlock.appendChild(createElement("p", "intiwo-inicio-bloque__subtitulo t-lg", textos.subtitulo || bloque.subtitulo));
    }
    if (textos.texto || bloque.texto) {
      textBlock.appendChild(createElement("p", "intiwo-inicio-bloque__texto t-md", textos.texto || bloque.texto));
    }

    const cta = renderCTA(textos.cta || bloque.cta, textos.enlace || bloque.enlace);
    if (cta) textBlock.appendChild(cta);

    const imageSource = urlValue(bloque.imagen || textos.imagen || "");
    if (imageSource) {
      const img = document.createElement("img");
      img.src = imageSource;
      img.alt = textValue(textos.titulo || bloque.titulo || "Imagen institucional");
      img.loading = "lazy";
      media.appendChild(img);
    }

    section.appendChild(textBlock);
    if (media.childNodes.length > 0) section.appendChild(media);
    return section;
  }

  function renderTresColumnas(bloque) {
    const textos = getTextos(bloque);
    const section = attachDragHandle(createElement("section", "intiwo-inicio-bloque intiwo-inicio-bloque--tres-columnas"));
    const header = createElement("div", "intiwo-inicio-bloque__header");
    const list = document.createElement("div");
    list.className = "intiwo-inicio-bloque__grid";

    if (bloque.color) {
      section.style.background = bloque.color;
    }
    aplicarAnimacionRender(bloque, section);

    if (textos.titulo || bloque.titulo) {
      header.appendChild(createElement("h2", "intiwo-inicio-bloque__titulo t-xl", textos.titulo || bloque.titulo));
    }
    if (textos.subtitulo || bloque.subtitulo) {
      header.appendChild(createElement("p", "intiwo-inicio-bloque__subtitulo t-lg", textos.subtitulo || bloque.subtitulo));
    }
    if (header.childNodes.length > 0) section.appendChild(header);

    const columnas = Array.isArray(textos.columnas) ? textos.columnas : Array.isArray(bloque.columnas) ? bloque.columnas : [];
    columnas.forEach((columna) => {
      const item = createElement("article", "intiwo-inicio-bloque__tarjeta");
      if (columna && typeof columna === "object") {
        if (columna.titulo || columna.title) {
          item.appendChild(createElement("h3", "intiwo-inicio-bloque__tarjeta-titulo t-lg", columna.titulo || columna.title));
        }
        if (columna.texto || columna.description || columna.body) {
          item.appendChild(createElement("p", "intiwo-inicio-bloque__tarjeta-texto t-sm", columna.texto || columna.description || columna.body));
        }
      } else if (columna) {
        item.appendChild(createElement("p", "intiwo-inicio-bloque__tarjeta-texto t-sm", columna));
      }
      list.appendChild(item);
    });

    if (list.childNodes.length > 0) section.appendChild(list);
    return section;
  }

  function renderBloque(bloque) {
    const plantilla = textValue(bloque && (bloque.plantilla || bloque.tipo || "banner")).toLowerCase();
    let nodo;
    switch (plantilla) {
      case "texto-imagen-der":
        nodo = renderTextoImagen(Object.assign({}, bloque, { orientacion: "derecha", plantilla: "texto-imagen-der" }));
        break;
      case "textoimagen":
      case "texto-imagen":
      case "texto-imagen-izq":
      case "texto_imagen":
        nodo = renderTextoImagen(Object.assign({}, bloque, { orientacion: "izquierda", plantilla: "texto-imagen-izq" }));
        break;
      case "trescolumnas":
      case "tres-columnas":
      case "tres_columnas":
        nodo = renderTresColumnas(bloque);
        break;
      case "banner":
      default:
        nodo = renderBanner(bloque);
        break;
    }
    if (nodo) {
      const textos = getTextos(bloque);
      nodo.dataset.id = textValue(bloque && bloque.id);
      nodo.dataset.plantilla = plantilla === "texto-imagen-der" ? "texto-imagen-der"
        : (plantilla === "texto-imagen-izq" || plantilla === "texto-imagen" || plantilla === "textoimagen" || plantilla === "texto_imagen")
          ? "texto-imagen-izq"
          : (plantilla === "tres-columnas" || plantilla === "trescolumnas" || plantilla === "tres_columnas")
            ? "tres-columnas"
            : "banner";
      nodo.dataset.orden = String(Number(bloque && bloque.orden) || "");
      nodo.dataset.color = textValue(bloque && bloque.color);
      nodo.dataset.imagen = textValue(bloque && (bloque.imagen || textos.imagen));
      nodo.dataset.animacion = textValue(bloque && bloque.animacion) || "ninguna";
    }
    return nodo;
  }

  function esAdminInicio() {
    const rolesAdmin = new Set(["administrador", "admin"]);
    const fuentes = [
      document.body && document.body.dataset && document.body.dataset.rol,
      window.INTIWO_ROL,
      window.__INTIWO_ROL__,
      sessionStorage.getItem("intiwo-rol"),
      localStorage.getItem("intiwo-rol")
    ];
    const valor = fuentes.find((item) => typeof item === "string" && item.trim().length > 0);
    return Boolean(
      document.body &&
      document.body.classList.contains("intiwo-editor-activo") &&
      valor &&
      rolesAdmin.has(String(valor).trim().toLowerCase())
    );
  }

  function renderBloqueVacioAdmin(tipo) {
    const bloque = attachDragHandle(createElement("section", "intiwo-inicio-bloque intiwo-inicio-bloque--vacio"));
    const etiqueta = createElement("span", "intiwo-inicio-bloque__etiqueta t-sm", tipo === "banner" ? "Banner vacío" : "Bloque vacío");
    const titulo = createElement("h3", "intiwo-inicio-bloque__titulo t-xl", "Bloque de contenido");
    const texto = createElement("p", "intiwo-inicio-bloque__texto t-md", "Añade texto, imagen o CTA desde el editor.");
    bloque.appendChild(etiqueta);
    bloque.appendChild(titulo);
    bloque.appendChild(texto);
    return bloque;
  }

  function renderBotonAgregarBloque() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "intiwo-admin-empty-add";
    button.setAttribute("aria-label", "Agregar bloque");

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/1999/xlink", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#i-plus");
    icon.appendChild(use);

    const label = document.createElement("span");
    label.textContent = "Agregar bloque";
    button.appendChild(icon);
    button.appendChild(label);

    button.addEventListener("click", () => {
      const root = document.getElementById("inicio-root");
      if (!root) return;

      const nuevoBloque = renderBloqueVacioAdmin("banner");
      nuevoBloque.dataset.orden = String(root.querySelectorAll(".intiwo-inicio-bloque").length + 1);
      const botonActual = root.querySelector(".intiwo-admin-empty-add");
      if (botonActual) {
        root.insertBefore(nuevoBloque, botonActual);
        botonActual.remove();
      } else {
        root.appendChild(nuevoBloque);
      }

      const nuevoBoton = renderBotonAgregarBloque();
      root.appendChild(nuevoBoton);
      if (window && typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new CustomEvent("intiwo:bloques-orden-cambiado", {
          detail: { bloques: Array.from(root.querySelectorAll('.intiwo-inicio-bloque')).map((bloque, index) => ({ id: bloque.dataset.id || 'bloque-' + (index + 1), orden: index + 1 })) }
        }));
      }
    });

    return button;
  }

  function renderBloquesInicio(contenido) {
    const root = document.getElementById("inicio-root");
    if (!root) {
      logRenderError("No se encontro el elemento #inicio-root para renderizar el contenido.", contenido);
      return;
    }

    if (!contenido || typeof contenido !== "object") {
      root.replaceChildren();
      if (esAdminInicio()) {
        root.appendChild(renderBloqueVacioAdmin("banner"));
        root.appendChild(renderBotonAgregarBloque());
        root.appendChild(renderBloqueVacioAdmin("banner"));
      }
      return;
    }

    const bloques = Array.isArray(contenido.bloques) ? contenido.bloques : [];

    if (!bloques.length) {
      root.replaceChildren();
      if (esAdminInicio()) {
        root.appendChild(renderBloqueVacioAdmin("banner"));
        root.appendChild(renderBotonAgregarBloque());
        root.appendChild(renderBloqueVacioAdmin("banner"));
      }
      return;
    }

    root.replaceChildren();
    bloques.forEach((bloque) => {
      try {
        const nodo = renderBloque(bloque);
        if (nodo) root.appendChild(nodo);
      } catch (error) {
        logRenderError("No se pudo renderizar un bloque del Inicio.", { bloque, error });
      }
    });

    if (esAdminInicio()) {
      const boton = renderBotonAgregarBloque();
      root.appendChild(boton);
    }
  }

  if (typeof window !== "undefined") {
    window.INTIWO_RENDER_BLOQUES_INICIO = renderBloquesInicio;
    window.addEventListener("intiwo:contenido-inicio-cargado", (event) => {
      const contenido = event && event.detail ? event.detail : null;
      renderBloquesInicio(contenido);
    });
  }
})();
