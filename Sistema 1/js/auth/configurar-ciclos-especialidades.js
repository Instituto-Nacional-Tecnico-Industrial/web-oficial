import { supabase } from "../supabase/cliente-supabase.js";

const cycleSelect = document.getElementById("intiwo-config-ciclo-nombres");
const list = document.getElementById("intiwo-config-nombres-lista");
const status = document.getElementById("intiwo-config-ciclos-estado");
const currentButton = document.getElementById("intiwo-config-ciclo-actual");
let cycles = [];
let namesRequest = 0;

function setStatus(message) {
  if (status) status.textContent = message;
}

function renderNames(specialties, names) {
  if (!list) return;
  const currentNames = new Map(names.map((row) => [row.especialidad_id, row]));
  list.replaceChildren();

  specialties.forEach((specialty) => {
    const current = currentNames.get(specialty.id);
    const article = document.createElement("article");
    article.className = "intiwo-config-tarjeta";
    const heading = document.createElement("h4");
    heading.textContent = specialty.nombre;
    const prefix = document.createElement("p");
    prefix.textContent = `Identificador estable: ${specialty.slug} · Prefijo ${specialty.prefijo}`;
    const fullLabel = document.createElement("label");
    fullLabel.textContent = "Nombre visible";
    const fullInput = document.createElement("input");
    fullInput.type = "text";
    fullInput.required = true;
    fullInput.minLength = 2;
    fullInput.maxLength = 160;
    fullInput.value = current?.nombre || specialty.nombre;
    fullLabel.appendChild(fullInput);
    const shortLabel = document.createElement("label");
    shortLabel.textContent = "Nombre corto";
    const shortInput = document.createElement("input");
    shortInput.type = "text";
    shortInput.required = true;
    shortInput.minLength = 2;
    shortInput.maxLength = 80;
    shortInput.value = current?.nombre_corto || specialty.nombre_corto;
    shortLabel.appendChild(shortInput);
    const save = document.createElement("button");
    save.type = "button";
    save.className = "intiwo-pildora es-linea";
    save.textContent = "Guardar nombre de este ciclo";
    save.addEventListener("click", () => saveName(specialty, fullInput, shortInput, save));
    article.append(heading, prefix, fullLabel, shortLabel, save);
    list.appendChild(article);
  });
}

async function saveName(specialty, fullInput, shortInput, button) {
  if (!supabase || !cycleSelect) return;
  if (!fullInput.reportValidity() || !shortInput.reportValidity()) return;
  const year = Number(cycleSelect.value);
  if (!Number.isInteger(year) || year < 2026) {
    setStatus("Selecciona un ciclo lectivo válido antes de guardar.");
    return;
  }
  button.disabled = true;
  setStatus(`Guardando el nombre de ${specialty.prefijo} para ${year}…`);
  try {
    const { error } = await supabase.rpc("intiwo_admin_guardar_nombre_especialidad_ciclo", {
      p_especialidad_id: specialty.id,
      p_anio_lectivo: year,
      p_nombre: fullInput.value.trim(),
      p_nombre_corto: shortInput.value.trim()
    });
    if (error) throw error;
    setStatus(`Nombre de ${specialty.prefijo} actualizado para ${year}. Los demás ciclos no cambiaron.`);
  } catch (error) {
    console.error("No se pudo guardar el nombre histórico de la especialidad.", error);
    setStatus(`No se pudo guardar el nombre: ${error.message}`);
  } finally {
    button.disabled = false;
  }
}

async function loadNamesForSelectedCycle() {
  if (!supabase || !cycleSelect?.value || !list) return;
  const requestId = ++namesRequest;
  const year = Number(cycleSelect.value);
  if (!Number.isInteger(year) || year < 2026) {
    setStatus("Selecciona un ciclo lectivo válido.");
    return false;
  }
  setStatus("Cargando nombres del ciclo…");
  list.replaceChildren();
  try {
    const [specialtiesResult, namesResult] = await Promise.all([
      supabase.from("especialidades").select("id,slug,nombre,nombre_corto,prefijo,tipo,orden").order("orden"),
      supabase.from("especialidad_nombres")
        .select("especialidad_id,nombre,nombre_corto")
        .eq("anio_lectivo", year)
    ]);
    if (requestId !== namesRequest) return false;
    if (specialtiesResult.error) throw specialtiesResult.error;
    if (namesResult.error) throw namesResult.error;
    renderNames(specialtiesResult.data || [], namesResult.data || []);
    setStatus("");
    return true;
  } catch (error) {
    if (requestId !== namesRequest) return false;
    console.error("No se pudieron cargar los nombres históricos.", error);
    setStatus(`No se pudieron cargar los nombres: ${error.message}`);
    return false;
  }
}

function renderCycles() {
  if (!cycleSelect) return;
  const selected = Number(cycleSelect.value);
  cycleSelect.replaceChildren(...cycles.map((cycle) => {
    const option = document.createElement("option");
    option.value = String(cycle.anio);
    option.textContent = String(cycle.anio) + (cycle.es_actual ? " (actual)" : "");
    option.selected = cycle.anio === selected || (!selected && cycle.es_actual);
    return option;
  }));
}

async function init() {
  if (!cycleSelect || !list) return;
  try {
    if (!supabase) throw new Error("El cliente de Supabase no está configurado.");
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!auth.user) throw new Error("Inicia sesión como Administrador.");
    const { data: profile, error: profileError } = await supabase
      .from("perfiles")
      .select("rol,desactivado_en")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile || profile.desactivado_en || !["admin", "administrador"].includes(profile.rol)) {
      throw new Error("Esta función está disponible solo para Administradores.");
    }

    const { data, error } = await supabase
      .from("ciclos_lectivos")
      .select("anio,es_actual")
      .order("anio", { ascending: false });
    if (error) throw error;
    cycles = data || [];
    if (!cycles.length) throw new Error("No hay ciclos lectivos configurados.");
    renderCycles();
    cycleSelect.addEventListener("change", loadNamesForSelectedCycle);
    await loadNamesForSelectedCycle();
  } catch (error) {
    console.error("No se pudo abrir la gestión de ciclos.", error);
    setStatus(`No se pudo abrir la gestión de ciclos: ${error.message}`);
  }
}

const addCycleButton = document.getElementById("intiwo-config-ciclo-incorporar");
if (addCycleButton) {
  addCycleButton.addEventListener("click", async () => {
    if (!supabase || !cycles.length) return;
    addCycleButton.disabled = true;
    try {
      const nextYear = Math.max(...cycles.map((cycle) => cycle.anio)) + 1;
      const { error } = await supabase.rpc("intiwo_admin_crear_ciclo", { p_anio_lectivo: nextYear });
      if (error) throw error;
      const { data, error: loadError } = await supabase
        .from("ciclos_lectivos")
        .select("anio,es_actual")
        .order("anio", { ascending: false });
      if (loadError) throw loadError;
      cycles = data || [];
      renderCycles();
      cycleSelect.value = String(nextYear);
      if (await loadNamesForSelectedCycle()) {
        setStatus(`Se incorporó el ciclo ${nextYear} con los nombres heredados del anterior.`);
      }
    } catch (error) {
      console.error("No se pudo incorporar el siguiente ciclo lectivo.", error);
      setStatus(`No se pudo incorporar el ciclo: ${error.message}`);
    } finally {
      addCycleButton.disabled = false;
    }
  });
}

if (currentButton) {
  currentButton.addEventListener("click", async () => {
    if (!supabase || !cycleSelect?.value) return;
    currentButton.disabled = true;
    try {
      const { error } = await supabase.rpc("intiwo_admin_establecer_ciclo_actual", {
        p_anio_lectivo: Number(cycleSelect.value)
      });
      if (error) throw error;
      cycles = cycles.map((cycle) => ({ ...cycle, es_actual: cycle.anio === Number(cycleSelect.value) }));
      renderCycles();
      setStatus(`El ciclo ${cycleSelect.value} quedó marcado como actual.`);
    } catch (error) {
      console.error("No se pudo cambiar el ciclo actual.", error);
      setStatus(`No se pudo establecer el ciclo actual: ${error.message}`);
    } finally {
      currentButton.disabled = false;
    }
  });
}

init();
