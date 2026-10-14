/* INTIWO S2 | GitHub, Drive, YouTube, globo/red (web y Pages) | BACKLOG S2N-03b */
(function () {
  var ICONOS = {
    github: "#i-github",
    drive: "#i-drive",
    youtube: "#i-youtube",
    web: "#i-globe"
  };

  function hostDe(url) {
    var bruto = String(url || "").trim();
    if (!bruto) return "";
    if (/^(javascript|data|file|blob):/i.test(bruto)) return "";
    var texto = bruto;
    if (!/^https?:\/\//i.test(texto)) texto = "https://" + texto;
    try {
      var u = new URL(texto);
      if (u.protocol !== "http:" && u.protocol !== "https:") return "";
      return String(u.hostname || "").replace(/^www\./i, "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function plataforma(url) {
    var h = hostDe(url);
    if (!h) return "web";
    if (h === "github.com" || h === "gist.github.com" || h === "raw.githubusercontent.com" || h === "github.io" || h.slice(-10) === ".github.io") {
      return "github";
    }
    if (h === "drive.google.com" || h === "docs.google.com" || h === "sheets.google.com" || h === "slides.google.com") {
      return "drive";
    }
    if (h === "youtube.com" || h === "m.youtube.com" || h === "youtu.be" || h === "music.youtube.com" || h === "youtube-nocookie.com") {
      return "youtube";
    }
    return "web";
  }

  function lineasUrl(texto) {
    return String(texto || "").split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) {
      if (!l) return false;
      if (/^(javascript|data|file|blob):/i.test(l)) return false;
      return /^(https?:\/\/|www\.)/i.test(l) || l.indexOf(".") !== -1;
    });
  }

  window.intiwoPlataformaUrl = plataforma;
  window.intiwoIconoPlataforma = function (urlOPlat) {
    var clave = ICONOS[urlOPlat] ? urlOPlat : plataforma(urlOPlat);
    return ICONOS[clave] || ICONOS.web;
  };
  window.intiwoLineasUrl = lineasUrl;
})();
