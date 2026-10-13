import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REDIRECT =
  "https://instituto-nacional-tecnico-industrial.github.io/web-oficial/Sistema%201/paginas/cuentas/pagina-cuentas.html";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;

function json(cuerpo: unknown, status = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Metodo no permitido" }, 405);

  const url = Deno.env.get("SUPABASE_URL") || "";
  const anon = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const authHeader = req.headers.get("Authorization") || "";

  const comoUsuario = createClient(url, anon, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await comoUsuario.auth.getUser();
  if (userError || !userData.user) return json({ error: "Sesion invalida" }, 401);

  const admin = createClient(url, service);
  const { data: perfil } = await admin
    .from("perfiles")
    .select("rol, desactivado_en")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!perfil || perfil.desactivado_en || perfil.rol !== "administrador") {
    return json({ error: "Solo el administrador puede invitar" }, 403);
  }

  let cuerpo: { email?: string; rol?: string };
  try {
    cuerpo = await req.json();
  } catch {
    return json({ error: "JSON invalido" }, 400);
  }

  const email = String(cuerpo.email || "").trim().toLowerCase();
  const rol = String(cuerpo.rol || "").trim().toLowerCase();
  if (!DOMINIOS.test(email)) {
    return json({ error: "Usa un correo @inti.edu.sv o @clases.edu.sv" }, 400);
  }
  if (rol !== "docente" && rol !== "editor") {
    return json({ error: "Rol no permitido" }, 400);
  }
  if (rol === "editor" && !/^[0-9]+@/.test(email)) {
    return json({ error: "El editor debe tener el NIE en la parte local del correo" }, 400);
  }

  const { data: pendiente } = await admin
    .from("invitaciones_correo")
    .select("id")
    .eq("email", email)
    .is("usado_en", null)
    .is("revocado_en", null)
    .maybeSingle();

  if (!pendiente) {
    const { error: insertError } = await admin.from("invitaciones_correo").insert({
      email,
      rol_destino: rol,
      invitado_por: userData.user.id,
    });
    if (insertError) return json({ error: insertError.message }, 400);
  }

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: REDIRECT,
    data: { rol },
  });

  if (inviteError) {
    return json({ error: inviteError.message }, 400);
  }

  return json({ ok: true });
});
