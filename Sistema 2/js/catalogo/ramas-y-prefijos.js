/* INTIWO S2 | prefijo + nivel + seccion = DS2B | BACKLOG S2N-02c */
window.INTIWO_RAMAS = {
  automotriz: { tipo: "tecnico", prefijo: "MA", etiqueta: "Mantenimiento Automotriz" },
  mecanica: { tipo: "tecnico", prefijo: "MI", etiqueta: "Mecanica Industrial" },
  electricos: { tipo: "tecnico", prefijo: "SE", etiqueta: "Sistemas Electricos y Energia Renovable" },
  electronica: { tipo: "tecnico", prefijo: "EL", etiqueta: "Electronica" },
  software: { tipo: "tecnico", prefijo: "DS", etiqueta: "Desarrollo de Software" },
  itsi: { tipo: "tecnico", prefijo: "IT", etiqueta: "Infraestructura Tecnologica y Sistemas Informaticos" },
  precalculo: { tipo: "academico", prefijo: "PC", etiqueta: "Precalculo" },
  ciudadania: { tipo: "academico", prefijo: "CV", etiqueta: "Ciudadania y valores" },
  ciencias: { tipo: "academico", prefijo: "CT", etiqueta: "Ciencias y tecnologia" },
  ingles: { tipo: "academico", prefijo: "IN", etiqueta: "Ingles" },
  literatura: { tipo: "academico", prefijo: "LL", etiqueta: "Lenguaje y Literatura" }
};

window.intiwoConstruirClave = function (prefijo, nivel, seccion) {
  var n = String(nivel || "");
  var s = String(seccion || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(prefijo || "")) return "";
  if (!/^[123]$/.test(n)) return "";
  if (!/^[A-Z]$/.test(s)) return "";
  return prefijo + n + s;
};
