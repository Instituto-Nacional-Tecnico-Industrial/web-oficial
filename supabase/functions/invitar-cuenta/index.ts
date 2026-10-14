import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1";

const REDIRECT =
  "https://instituto-nacional-tecnico-industrial.github.io/web-oficial/Sistema%201/paginas/cuentas/pagina-definir-contrasena.html";

const DOMINIOS = /@(inti|clases)\.edu\.sv$/i;
const MATRIZ = "intiwo11543@gmail.com";

function json(cuerpo: Record<string, unknown>, status = 200) {
  return Response.json(cuerpo, { status });
}

function limpiaNombre(valor: unknown) {
  return String(valor || "").replace(/\s+/g, " ").trim();
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return new Response("ok");
    if (req.method !== "POST") return json({ error: "Metodo no permitido" }, 405);

    const { data: userData, error: userError } = await ctx.supabase.auth.getUser();
    const user = userData && userData.user;
    if (userError || !user) return json({ error: "Sesion invalida" }, 401);

    const { data: rolSesion, error: rolErr } = await ctx.supabase.rpc("intiwo_rol_actual");
    const correoSesion = String(user.email || "").trim().toLowerCase();
    const esMatriz = correoSesion === MATRIZ;
    const esAdmin = rolSesion === "administrador" || esMatriz;
    const esDocente = rolSesion === "docente";
    if (rolErr) {
      return json({ error: "No se pudo comprobar el rol: " + rolErr.message }, 400);
    }

    let cuerpo: Record<string, unknown>;
    try {
      cuerpo = await req.json();
    } catch {
      return json({ error: "JSON invalido" }, 400);
    }

    const accion = String(cuerpo.accion || "invitar").toLowerCase();
    if (accion === "baja") {
      return bajaCuenta(ctx, user.id, correoSesion, esAdmin, esDocente, String(cuerpo.id || ""));
    }

    const email = String(cuerpo.email || "").trim().toLowerCase();
    const rol = String(cuerpo.rol || "").trim().toLowerCase();
    const nombres = limpiaNombre(cuerpo.nombres);
    const apellidos = limpiaNombre(cuerpo.apellidos);
    if (nombres.length < 2 || apellidos.length < 2) {
      return json({ error: "Escribe nombres y apellidos" }, 400);
    }
    if (email === MATRIZ) {
      return json({ error: "Esa cuenta matriz ya existe" }, 400);
    }
    const puedeAdmin = esMatriz && rol === "administrador";
    const puedeStaff = esAdmin && (rol === "docente" || rol === "editor");
    const puedeAlumno = esDocente && rol === "editor";
    if (!puedeAdmin && !puedeStaff && !puedeAlumno) {
      return json({ error: "No tienes permiso para esta invitacion" }, 403);
    }
    if (!DOMINIOS.test(email)) {
      return json({ error: "Usa un correo @inti.edu.sv o @clases.edu.sv" }, 400);
    }
    if (rol !== "administrador" && rol !== "docente" && rol !== "editor") {
      return json({ error: "Rol no permitido" }, 400);
    }
    if (rol === "editor" && !/^[0-9]+@/.test(email)) {
      return json({ error: "El editor debe tener el NIE en la parte local del correo" }, 400);
    }

    const db = ctx.supabase;
    const codigoId = String(cuerpo.codigo_id || "").trim();
    if (rol === "editor") {
      if (!codigoId) return json({ error: "Elige el codigo del grupo (ejemplo DS2B)" }, 400);
      const { data: codigo, error: codigoErr } = await db
        .from("codigos")
        .select("id, docente_id, desactivado_en")
        .eq("id", codigoId)
        .maybeSingle();
      if (codigoErr) return json({ error: codigoErr.message }, 400);
      if (!codigo || codigo.desactivado_en) return json({ error: "Ese codigo no existe o esta inactivo" }, 400);
      if (esDocente && codigo.docente_id !== user.id) {
        return json({ error: "Ese codigo no te pertenece" }, 403);
      }
    } else if (codigoId) {
      return json({ error: "Solo el editor se vincula a un codigo" }, 400);
    }

    let pendienteQuery = db
      .from("invitaciones_correo")
      .select("id")
      .eq("email", email)
      .is("usado_en", null)
      .is("revocado_en", null);
    if (rol === "editor") pendienteQuery = pendienteQuery.eq("codigo_id", codigoId);
    else pendienteQuery = pendienteQuery.is("codigo_id", null);
    const { data: pendiente } = await pendienteQuery.maybeSingle();

    const fila: Record<string, unknown> = {
      email,
      rol_destino: rol,
      invitado_por: user.id,
      nombres,
      apellidos,
      nombre: nombres + " " + apellidos,
      codigo_id: rol === "editor" ? codigoId : null,
    };

    if (pendiente) {
      const { error: updError } = await db.from("invitaciones_correo").update(fila).eq("id", pendiente.id);
      if (updError) return json({ error: updError.message }, 400);
    } else {
      const { error: insertError } = await db.from("invitaciones_correo").insert(fila);
      if (insertError) return json({ error: insertError.message }, 400);
    }

    const { error: inviteError } = await ctx.supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: REDIRECT,
      data: { rol, nombres, apellidos },
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

async function bajaCuenta(
  ctx: { supabase: any; supabaseAdmin: any },
  actorId: string,
  correoSesion: string,
  esAdmin: boolean,
  esDocente: boolean,
  invitacionId: string,
) {
  if (!invitacionId) return json({ error: "Falta la cuenta" }, 400);

  const { data: fila, error: filaError } = await ctx.supabase
    .from("invitaciones_correo")
    .select("id, email, rol_destino, invitado_por, usado_por, usado_en, revocado_en, codigo_id")
    .eq("id", invitacionId)
    .maybeSingle();
  if (filaError) return json({ error: filaError.message }, 400);
  if (!fila) return json({ error: "No se encontro esa alta" }, 404);
  if (fila.email === MATRIZ) return json({ error: "La cuenta matriz no se puede dar de baja" }, 403);
  if (fila.email === correoSesion || fila.usado_por === actorId) {
    return json({ error: "No puedes darte de baja a ti mismo" }, 403);
  }

  let docenteDelCodigo = false;
  if (esDocente && fila.rol_destino === "editor" && fila.codigo_id) {
    const { data: codigo } = await ctx.supabase
      .from("codigos")
      .select("docente_id")
      .eq("id", fila.codigo_id)
      .maybeSingle();
    docenteDelCodigo = Boolean(codigo && codigo.docente_id === actorId);
  }
  const esEditorInvitado = fila.rol_destino === "editor" && fila.invitado_por === actorId;
  if (esAdmin) {
    /* admin baja admin/docente/editor ajenos */
  } else if (esDocente && (esEditorInvitado || docenteDelCodigo)) {
    /* docente baja editores de sus codigos */
  } else {
    return json({ error: "No tienes permiso para esta baja" }, 403);
  }

  if (fila.rol_destino === "administrador" && fila.usado_por) {
    const { count } = await ctx.supabaseAdmin
      .from("perfiles")
      .select("id", { count: "exact", head: true })
      .eq("rol", "administrador")
      .is("desactivado_en", null);
    if ((count || 0) <= 1) {
      return json({ error: "No se puede dar de baja al ultimo administrador" }, 403);
    }
  }

  const { error: revError } = await ctx.supabase
    .from("invitaciones_correo")
    .update({ revocado_en: new Date().toISOString() })
    .eq("id", fila.id);
  if (revError) return json({ error: revError.message }, 400);

  if (fila.usado_por) {
    const { error: desError } = await ctx.supabaseAdmin
      .from("perfiles")
      .update({ desactivado_en: new Date().toISOString() })
      .eq("id", fila.usado_por);
    if (desError) return json({ error: desError.message }, 400);
    await ctx.supabaseAdmin.auth.admin.updateUserById(fila.usado_por, {
      ban_duration: "876000h",
    });
    if (fila.codigo_id) {
      await ctx.supabaseAdmin
        .from("miembro_codigo")
        .update({ desactivado_en: new Date().toISOString() })
        .eq("perfil_id", fila.usado_por)
        .eq("codigo_id", fila.codigo_id);
    }
  }

  return json({ ok: true });
}
