import { supabase } from "../supabase/cliente-supabase.js";

const currentLabel = document.getElementById("intiwo-oferta-ciclo-actual");
const status = document.getElementById("intiwo-oferta-ciclo-estado");
const keysBySlug = new Map([
  ["automotriz", "automotriz"],
  ["mecanica-industrial", "mecanica"],
  ["sistemas-electricos", "electricos"],
  ["electronica", "electronica"],
  ["desarrollo-software", "software"],
  ["infraestructura-tecnologica", "itsi"],
  ["general", "general"]
]);

function setStatus(message) {
  if (!status) return;
  status.textContent = message;
  status.hidden = !message;
}

async function loadCurrentSpecialtyNames() {
  try {
    if (!supabase) throw new Error("El cliente de Supabase no está configurado.");
    const { data: cycle, error: cycleError } = await supabase
      .from("ciclos_lectivos")
      .select("anio")
      .eq("es_actual", true)
      .maybeSingle();
    if (cycleError) throw cycleError;
    if (!cycle) throw new Error("No se ha marcado un ciclo lectivo actual.");
    if (currentLabel) currentLabel.textContent = `Oferta académica vigente · Ciclo ${cycle.anio}`;

    const { data, error } = await supabase
      .from("especialidad_nombres")
      .select("nombre,especialidad:especialidades!inner(slug)")
      .eq("anio_lectivo", cycle.anio);
    if (error) throw error;
    const names = new Map((data || []).map((row) => [
      keysBySlug.get(row.especialidad.slug),
      row.nombre
    ]));
    names.forEach((name, key) => {
      if (!key) return;
      const pill = document.querySelector(`.intiwo-pildora-esp[data-esp="${key}"]`);
      const pillLabel = pill?.querySelector("span:last-child");
      const articleHeading = document.querySelector(`[data-oferta-ficha="${key}"] h2`);
      if (pillLabel) pillLabel.textContent = name;
      if (articleHeading) articleHeading.textContent = name;
    });
    const missing = [...keysBySlug.entries()]
      .filter(([slug]) => slug !== "general")
      .some(([, key]) => !names.has(key));
    if (missing) setStatus(`Faltan nombres guardados para algunas especialidades del ciclo ${cycle.anio}; se muestran los nombres base.`);
  } catch (error) {
    console.error("No se pudo cargar el ciclo/nombre histórico de Oferta.", error);
    setStatus(`No se pudo confirmar el ciclo o cargar los nombres históricos: ${error.message}`);
  }
}

loadCurrentSpecialtyNames();
