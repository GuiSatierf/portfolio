// Troque aqui seus contatos. Todo o site usa estes valores.
const CONTACT = Object.freeze({
  whatsapp: "5589981093145", // DDI + DDD + número, só dígitos
  whatsappLabel: "(89) 98109-3145",
  whatsappMessage: "Olá, Guilherme! Vi seu portfólio e quero conversar sobre um projeto.",
  email: "guifreitas343@gmail.com",
  instagram: "zguifreitas", // sem o @
});

const CONTACT_LINKS = Object.freeze({
  whatsapp: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`,
  email: `mailto:${CONTACT.email}`,
  instagram: `https://instagram.com/${CONTACT.instagram}`,
});

const CONTACT_TEXTS = Object.freeze({ ...CONTACT, instagramLabel: `@${CONTACT.instagram}` });

const THEME_COLORS = Object.freeze({ light: "#e6e4df", dark: "#17181a" });

const rootElement = document.documentElement;
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyContactLink(linkElement) {
  const href = CONTACT_LINKS[linkElement.dataset.link];
  if (!href) return;

  linkElement.href = href;
  if (linkElement.dataset.link !== "whatsapp") return;

  linkElement.target = "_blank";
  linkElement.rel = "noopener";
}

function applyContactText(textElement) {
  const text = CONTACT_TEXTS[textElement.dataset.text];
  if (!text) return;

  textElement.textContent = text;
}

function applyContacts() {
  document.querySelectorAll("[data-link]").forEach(applyContactLink);
  document.querySelectorAll("[data-text]").forEach(applyContactText);
}

function setCurrentYear() {
  const yearElement = document.getElementById("ano");
  if (!yearElement) return;

  yearElement.textContent = new Date().getFullYear();
}

// Animação de entrada ao rolar
function canAnimateReveal() {
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return "IntersectionObserver" in window && !prefersReducedMotion;
}

function revealOnIntersect(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("is-in");
    observer.unobserve(entry.target);
  });
}

function setupRevealAnimation() {
  if (!canAnimateReveal()) return;

  rootElement.classList.add("js-reveal");
  const observer = new IntersectionObserver(revealOnIntersect, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((revealElement) => observer.observe(revealElement));
}

// Tema claro/escuro (o <head> já aplicou o salvo antes da pintura)
function isLightTheme() {
  return rootElement.dataset.theme === "light";
}

function syncThemeColor() {
  if (!themeColorMeta) return;

  themeColorMeta.content = isLightTheme() ? THEME_COLORS.light : THEME_COLORS.dark;
}

function saveTheme(theme) {
  try {
    localStorage.setItem("tema", theme);
  } catch (error) {
    console.warn("[theme] Could not save theme preference", error);
  }
}

function toggleTheme() {
  rootElement.dataset.theme = isLightTheme() ? "dark" : "light";
  syncThemeColor();
  saveTheme(rootElement.dataset.theme);
}

function setupThemeToggle() {
  syncThemeColor();
  document.getElementById("tema")?.addEventListener("click", toggleTheme);
}

applyContacts();
setCurrentYear();
setupRevealAnimation();
setupThemeToggle();
