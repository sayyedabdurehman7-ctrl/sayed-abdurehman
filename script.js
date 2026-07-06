const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
let previousScroll = window.scrollY;

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

window.addEventListener(
  "scroll",
  () => {
    const currentScroll = window.scrollY;
    header?.classList.toggle("scrolled", currentScroll > 30);
    header?.classList.toggle("hidden", currentScroll > previousScroll && currentScroll > 550 && !document.body.classList.contains("menu-open"));
    previousScroll = currentScroll;
  },
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -50px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (index < 3) element.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      const suffix = counter.dataset.suffix || "";
      const prefix = counter.dataset.prefix || "";
      const startedAt = performance.now();
      const duration = 1250;

      const update = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = Math.round(target * eased);
        counter.textContent = `${prefix}${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 },
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${active.target.id}`));
  },
  { rootMargin: "-30% 0px -55%", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

const filterButtons = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projects.forEach((project) => {
      const categories = project.dataset.category.split(" ");
      project.classList.toggle("hidden-project", filter !== "all" && !categories.includes(filter));
    });
  });
});

const testimonialStage = document.querySelector("[data-testimonials]");
const testimonials = [...document.querySelectorAll(".testimonial")];
const testimonialCurrent = document.querySelector("[data-current]");
const testimonialProgress = document.querySelector(".testimonial-progress i");
let activeTestimonial = 0;
let testimonialTimer;

const showTestimonial = (index) => {
  activeTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === activeTestimonial));
  if (testimonialCurrent) testimonialCurrent.textContent = String(activeTestimonial + 1).padStart(2, "0");
  if (testimonialProgress) testimonialProgress.style.transform = `translateX(${activeTestimonial * 100}%)`;
};

const restartTestimonialTimer = () => {
  window.clearInterval(testimonialTimer);
  testimonialTimer = window.setInterval(() => showTestimonial(activeTestimonial + 1), 7000);
};

document.querySelector("[data-next]")?.addEventListener("click", () => {
  showTestimonial(activeTestimonial + 1);
  restartTestimonialTimer();
});

document.querySelector("[data-prev]")?.addEventListener("click", () => {
  showTestimonial(activeTestimonial - 1);
  restartTestimonialTimer();
});

testimonialStage?.addEventListener("mouseenter", () => window.clearInterval(testimonialTimer));
testimonialStage?.addEventListener("mouseleave", restartTestimonialTimer);
restartTestimonialTimer();

const contactForm = document.querySelector("[data-contact-form]");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const values = new FormData(contactForm);
  const subject = encodeURIComponent(`Project inquiry — ${values.get("service")}`);
  const body = encodeURIComponent(
    `Hi PixelCraft Studio,\n\nMy name is ${values.get("name")} (${values.get("email")}).\n\nI'm interested in: ${values.get("service")}\n\nProject details:\n${values.get("message")}\n`,
  );
  const status = contactForm.querySelector(".form-status");
  if (status) status.textContent = "Your email app is opening with the project details ready to send.";
  window.setTimeout(() => {
    window.location.href = `mailto:hello@pixelcraftstudio.com?subject=${subject}&body=${body}`;
  }, 350);
});

const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.transform = `translate3d(${event.clientX - 260}px, ${event.clientY - 260}px, 0)`;
    },
    { passive: true },
  );
} else if (cursorGlow) {
  cursorGlow.remove();
}

const hero = document.querySelector(".hero");
const heroOrbit = document.querySelector(".hero-orbit");
if (hero && heroOrbit && window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    heroOrbit.style.transform = `translateY(-50%) translate3d(${x}px, ${y}px, 0)`;
  });
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
