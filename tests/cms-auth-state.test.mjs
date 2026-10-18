import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

function deferred() {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function createSupabase(pendingRead) {
  return {
    from() {
      const query = {
        select() {
          return query;
        },
        eq() {
          return query;
        },
        maybeSingle() {
          return pendingRead.promise;
        },
      };
      return query;
    },
  };
}

function createWindow() {
  const listeners = new Map();
  return {
    INTIWO_ROL: "",
    addEventListener(type, listener) {
      const handlers = listeners.get(type) || [];
      handlers.push(listener);
      listeners.set(type, handlers);
    },
    dispatch(type, event) {
      for (const listener of listeners.get(type) || []) listener(event);
    },
  };
}

function loadCmsModule(relativePath, document, window, supabase) {
  const modulePath = path.resolve(process.cwd(), ...relativePath);
  const source = readFileSync(modulePath, "utf8");
  const withoutImport = source.replace(
    /^import\s+\{\s*supabase\s*\}\s+from\s+["'][^"']+["'];\r?\n/m,
    ""
  );
  assert.notEqual(withoutImport, source, `Expected a Supabase import in ${modulePath}`);
  vm.runInNewContext(withoutImport, { document, window, supabase, console });
}

function createForm() {
  const fieldset = { disabled: true };
  const button = { disabled: true };
  const fields = new Map();
  return {
    fieldset,
    button,
    elements: {
      namedItem(name) {
        if (!fields.has(name)) fields.set(name, { value: "" });
        return fields.get(name);
      },
    },
    querySelector(selector) {
      if (selector === "fieldset") return fieldset;
      if (selector === "[data-footer-guardar]" || selector === "[data-contactos-guardar]") return button;
      return null;
    },
    addEventListener() {},
  };
}

function createMessage() {
  return { textContent: "" };
}

test("Footer CMS applies an Admin role event received during its Supabase read", async () => {
  const pendingRead = deferred();
  const form = createForm();
  const message = createMessage();
  const window = createWindow();
  const document = {
    readyState: "complete",
    querySelector(selector) {
      if (selector === "[data-form-footer]") return form;
      if (selector === "[data-footer-mensaje]") return message;
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };

  loadCmsModule(["Sistema 1", "js", "cms", "cargar-footer-cms.js"], document, window, createSupabase(pendingRead));
  window.INTIWO_ROL = "administrador";
  window.dispatch("intiwo:auth-state-changed", { detail: { rol: "administrador" } });

  assert.equal(form.fieldset.disabled, false);
  assert.equal(form.button.disabled, false);

  pendingRead.resolve({ data: null, error: null });
  await new Promise((resolve) => setImmediate(resolve));
});

test("EDUCAME and Matricula CMS apply an Admin role event during their Supabase reads", async () => {
  const pendingRead = deferred();
  const educameForm = createForm();
  const matriculaForm = createForm();
  const messages = {
    educame: createMessage(),
    matricula: createMessage(),
  };
  const window = createWindow();
  const document = {
    readyState: "complete",
    querySelector(selector) {
      if (selector === '[data-form-contactos="educame"]') return educameForm;
      if (selector === '[data-form-contactos="matricula"]') return matriculaForm;
      const messageMatch = selector.match(/^\[data-contactos-mensaje="(educame|matricula)"\]$/);
      return messageMatch ? messages[messageMatch[1]] : null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-form-contactos]") return [educameForm, matriculaForm];
      return [];
    },
  };

  loadCmsModule(
    ["Sistema 1", "js", "cms", "cargar-contactos-programas-cms.js"],
    document,
    window,
    createSupabase(pendingRead)
  );
  window.INTIWO_ROL = "administrador";
  window.dispatch("intiwo:auth-state-changed", { detail: { rol: "administrador" } });

  assert.equal(educameForm.fieldset.disabled, false);
  assert.equal(educameForm.button.disabled, false);
  assert.equal(matriculaForm.fieldset.disabled, false);
  assert.equal(matriculaForm.button.disabled, false);

  pendingRead.resolve({ data: null, error: null });
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
});
