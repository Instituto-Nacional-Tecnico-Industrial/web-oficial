/* INTIWO S1 | cliente publico; URL/clave inyectadas en Pages */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./configuracion-runtime.js";

export const supabase = (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

if (supabase) window.intiwoSupabase = supabase;
