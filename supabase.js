// Configuración del cliente Supabase
// Reemplaza estas comillas con las claves de tu panel de Supabase
const SUPABASE_URL = "TU_SUPABASE_URL_AQUI";
const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY_AQUI";

// Inicializar cliente (Solo funcionará cuando agregues tus credenciales reales)
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Lógica para alternar Modo Claro / Modo Oscuro
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggleBtn.textContent = newTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
});

// Lógica para el Menú Hamburguesa en móviles
const hamburgerBtn = document.getElementById('hamburger-toggle');
const navLinks = document.getElementById('nav-links');

hamburgerBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Función base para probar la carga desde Supabase cuando configuremos las tablas
async function cargarContenidoInicial() {
  if (!supabaseClient || SUPABASE_URL === "TU_SUPABASE_URL_AQUI") {
    document.getElementById('hero-title').textContent = "INTIWO - Instituto Nacional Técnico Industrial";
    document.getElementById('hero-subtitle').textContent = "Plataforma oficial en construcción. Falta conectar las claves de Supabase.";
    return;
  }
  
  console.log("Supabase listo para consultar datos.");
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarContenidoInicial);