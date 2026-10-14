/* INTIWO S1 | S1-15: texto plano; no ejecutar script pegado */
(function () {
  function texto(value) {
    if (value === null || value === undefined) return '';
    var bruto = String(value);
    if (!bruto) return '';
    var doc = new DOMParser().parseFromString(bruto, 'text/html');
    var plano = doc && doc.body ? (doc.body.textContent || '') : bruto;
    return plano.replace(/\u0000/g, '').replace(/\s+/g, ' ').trim();
  }

  function url(value) {
    var plano = texto(value);
    if (!plano) return '';
    var bajo = plano.toLowerCase();
    if (bajo.indexOf('javascript:') === 0 || bajo.indexOf('data:') === 0 || bajo.indexOf('vbscript:') === 0) {
      return '';
    }
    if (/^https?:\/\//i.test(plano) || plano.charAt(0) === '/' || /^mailto:/i.test(plano) || /^tel:/i.test(plano)) {
      return plano;
    }
    return '';
  }

  function antesDeInnerHtml(html) {
    return texto(html);
  }

  var api = { texto: texto, url: url, antesDeInnerHtml: antesDeInnerHtml };

  if (typeof window !== 'undefined') {
    window.INTIWO_SANITIZAR_TEXTO_CMS = api;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
