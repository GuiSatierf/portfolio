// Troque aqui seus contatos. Todo o site usa estes valores.
const CONTATO = {
  whatsapp: "5589981093145", // DDI + DDD + número, só dígitos
  whatsappLabel: "(89) 98109-3145",
  whatsappMensagem: "Olá, Guilherme! Vi seu portfólio e quero conversar sobre um projeto.",
  email: "guifreitas343@gmail.com",
  instagram: "zguifreitas", // sem o @
};

const links = {
  whatsapp: `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(CONTATO.whatsappMensagem)}`,
  email: `mailto:${CONTATO.email}`,
  instagram: `https://instagram.com/${CONTATO.instagram}`,
};

document.querySelectorAll("[data-link]").forEach((el) => {
  const href = links[el.dataset.link];
  if (!href) return;
  el.href = href;
  if (el.dataset.link === "whatsapp") {
    el.target = "_blank";
    el.rel = "noopener";
  }
});

const textos = { ...CONTATO, instagramLabel: `@${CONTATO.instagram}` };
document.querySelectorAll("[data-text]").forEach((el) => {
  const value = textos[el.dataset.text];
  if (value) el.textContent = value;
});

document.getElementById("ano").textContent = new Date().getFullYear();

// Animação de entrada ao rolar
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  reveals.forEach((el) => io.observe(el));
}

// Tema claro/escuro (o <head> já aplicou o salvo antes da pintura)
const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');
const syncThemeColor = () => themeMeta && (themeMeta.content = root.dataset.theme === "light" ? "#e6e4df" : "#17181a");
syncThemeColor();
document.getElementById("tema").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  syncThemeColor();
  try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
});
