const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const cursorGlow = document.querySelector(".cursor-glow");

requestAnimationFrame(() => document.body.classList.add("loaded"));

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.transform = `translate(${event.clientX - 190}px, ${event.clientY - 190}px)`;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: "0px 0px -45px" });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 6, 4) * 55}ms`;
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || "";
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * (1 - Math.pow(1 - progress, 4)));
      counter.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const filterButtons = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projects.forEach((project) => {
      const categories = project.dataset.category.split(" ");
      project.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

document.querySelectorAll(".faq details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector(".form-status");
  if (status) status.textContent = "Thank you — your inquiry is ready. CraftedPixels will contact you soon.";
  form.reset();
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
