import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outputDirectory = path.resolve(process.env.PAGES_OUTPUT_DIR || path.join(repositoryRoot, "_site"));
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl || !publishableKey) {
  throw new Error("Configure GitHub Actions Variables SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY before deploying.");
}

const parsedUrl = new URL(supabaseUrl);
if (parsedUrl.protocol !== "https:" || parsedUrl.username || parsedUrl.password) {
  throw new Error("SUPABASE_URL must be an HTTPS URL without embedded credentials.");
}
if (!publishableKey.startsWith("sb_publishable_")) {
  throw new Error("SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key.");
}

fs.mkdirSync(outputDirectory, { recursive: true });
for (const system of ["Sistema 1", "Sistema 2"]) {
  const sourceDirectory = path.join(repositoryRoot, system);
  const targetDirectory = path.join(outputDirectory, system);
  fs.mkdirSync(targetDirectory, { recursive: true });
  for (const directory of ["compartido", "css", "iconos", "js", "paginas"]) {
    fs.cpSync(
      path.join(sourceDirectory, directory),
      path.join(targetDirectory, directory),
      { recursive: true },
    );
  }

  const configPath = path.join(targetDirectory, "js", "supabase", "configuracion-runtime.js");
  const configSource = [
    `export const SUPABASE_URL = ${JSON.stringify(supabaseUrl)};`,
    `export const SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(publishableKey)};`,
    "",
  ].join("\n");
  fs.writeFileSync(configPath, configSource, { encoding: "utf8", flag: "w" });
}

fs.writeFileSync(
  path.join(outputDirectory, "index.html"),
  '<!doctype html><html lang="es"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=Sistema%201/paginas/inicio/pagina-inicio-cms.html"><title>INTIWO</title><a href="Sistema%201/paginas/inicio/pagina-inicio-cms.html">Abrir INTIWO</a></html>\n',
  "utf8",
);
