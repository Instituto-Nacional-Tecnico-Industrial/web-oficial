/* INTIWO S2 | same Supabase project client as S1 | runtime-configured, publishable key only */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./configuracion-runtime.js";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("[INTIWO Supabase] Falta configuración runtime; el cliente no se inicializó.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
