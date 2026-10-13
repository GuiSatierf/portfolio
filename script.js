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

// A cena tem 4 capítulos; a rolagem dentro dela vira uma posição de 0 a 4.
const SCENE_CHAPTERS = 4;

const rootElement = document.documentElement;
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

// Entrada ao rolar: cada bloco aparece quando chega na tela, com o atraso que o HTML pedir (data-delay)
function applyRevealDelay(revealElement) {
  const delay = Number(revealElement.dataset.delay);
  if (!delay) return;

  revealElement.style.transitionDelay = `${delay}ms`;
}

function revealOnIntersect(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("is-in");
    observer.unobserve(entry.target);
  });
}

function setupRevealAnimation() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  rootElement.classList.add("js-reveal");
  const observer = new IntersectionObserver(revealOnIntersect, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((revealElement) => {
    applyRevealDelay(revealElement);
    observer.observe(revealElement);
  });
}

// Barra fina no topo que enche conforme a página desce
function setupProgressBar() {
  const bar = document.querySelector(".progress");
  if (!bar) return;

  const render = () => {
    const total = rootElement.scrollHeight - innerHeight;
    const ratio = total > 0 ? window.scrollY / total : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  };
  addEventListener("scroll", render, { passive: true });
  addEventListener("resize", render);
  render();
}

// Cena presa na tela: a rolagem controla em que ponto da história o negócio fictício está
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function readScenePosition(scene, stage) {
  const travel = scene.offsetHeight - stage.offsetHeight;
  if (travel <= 0) return SCENE_CHAPTERS;

  return clamp01(-scene.getBoundingClientRect().top / travel) * SCENE_CHAPTERS;
}

function applySceneStep(stepElement, position) {
  const from = Number(stepElement.dataset.at);
  const until = stepElement.dataset.until ? Number(stepElement.dataset.until) : Infinity;
  stepElement.classList.toggle("on", position >= from && position < until);
}

function applySceneTitle(titleElement, chapter) {
  const own = Number(titleElement.dataset.chapter);
  titleElement.classList.toggle("on", own === chapter);
  titleElement.classList.toggle("past", own < chapter);
}

function tickFill(own, chapter, progressInChapter) {
  if (own < chapter) return 1;
  if (own > chapter) return 0;

  return progressInChapter;
}

function applySceneTick(tickElement, chapter, progressInChapter) {
  const own = Number(tickElement.dataset.chapter);
  tickElement.style.setProperty("--fill", String(tickFill(own, chapter, progressInChapter)));
}

function setupScene() {
  const scene = document.querySelector(".scene");
  const stage = document.querySelector(".scene-stage");
  if (!scene || !stage || prefersReducedMotion) return;

  const steps = [...scene.querySelectorAll("[data-at]")];
  const titles = [...scene.querySelectorAll(".scene-title")];
  const ticks = [...scene.querySelectorAll(".tick")];
  rootElement.classList.add("js-scene");

  let frameRequested = false;
  const render = () => {
    frameRequested = false;
    const position = readScenePosition(scene, stage);
    const chapter = Math.min(SCENE_CHAPTERS - 1, Math.floor(position));
    const progressInChapter = position >= SCENE_CHAPTERS ? 1 : position - chapter;

    scene.dataset.chapter = String(chapter);
    steps.forEach((step) => applySceneStep(step, position));
    titles.forEach((title) => applySceneTitle(title, chapter));
    ticks.forEach((tick) => applySceneTick(tick, chapter, progressInChapter));
  };
  const requestRender = () => {
    if (frameRequested) return;

    frameRequested = true;
    requestAnimationFrame(render);
  };
  addEventListener("scroll", requestRender, { passive: true });
  addEventListener("resize", requestRender);
  render();
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
setupProgressBar();
setupScene();
setupThemeToggle();
