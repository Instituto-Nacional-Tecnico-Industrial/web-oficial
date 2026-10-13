import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1";

const REDIRECT =
  "https://instituto-nacional-tecnico-industrial.github.io/web-oficial/Sistema%201/paginas/cuentas/pagina-cuentas.html";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;

function json(cuerpo: Record<string, unknown>, status = 200) {
  return Response.json(cuerpo, { status });
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return new Response("ok");
    if (req.method !== "POST") return json({ error: "Metodo no permitido" }, 405);

    const { data: userData, error: userError } = await ctx.supabase.auth.getUser();
    const user = userData && userData.user;
    if (userError || !user) return json({ error: "Sesion invalida" }, 401);

    // Mismo chequeo que el navegador (RLS + auth.uid()). supabaseAdmin a veces
    // no queda cableado con las claves nuevas y devolvía 403 falso.
    const { data: esAdmin, error: adminErr } = await ctx.supabase.rpc("intiwo_es_admin");
    const correoSesion = String(user.email || "").trim().toLowerCase();
    const esMatriz = correoSesion === "intiwo11543@gmail.com";
    if (adminErr) {
      return json({ error: "No se pudo comprobar el rol: " + adminErr.message }, 400);
    }
    if (!esAdmin && !esMatriz) {
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

    const db = ctx.supabase;
    const { data: pendiente } = await db
      .from("invitaciones_correo")
      .select("id")
      .eq("email", email)
      .is("usado_en", null)
      .is("revocado_en", null)
      .maybeSingle();

    if (!pendiente) {
      const { error: insertError } = await db.from("invitaciones_correo").insert({
        email,
        rol_destino: rol,
        invitado_por: user.id,
      });
      if (insertError) return json({ error: insertError.message }, 400);
    }

    const { error: inviteError } = await ctx.supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: REDIRECT,
      data: { rol },
    });

    if (inviteError) {
      const texto = inviteError.message || "";
      if (!/already/i.test(texto)) return json({ error: texto }, 400);
      const { error: recError } = await ctx.supabaseAdmin.auth.resetPasswordForEmail(email, {
        redirectTo: REDIRECT,
      });
      if (recError) return json({ error: recError.message }, 400);
    }

    return json({ ok: true });
  }),
};
