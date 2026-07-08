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

const packageModal = document.querySelector("[data-package-modal]");
const packageForm = document.querySelector("[data-package-form]");
const packageStatus = packageForm?.querySelector(".form-status");

const getInquiries = () => JSON.parse(localStorage.getItem("craftedpixelsInquiries") || "[]");
const saveInquiries = (items) => localStorage.setItem("craftedpixelsInquiries", JSON.stringify(items));

document.querySelectorAll(".choose-package").forEach((button) => {
  button.addEventListener("click", () => {
    if (!packageModal || !packageForm) return;
    packageForm.package.value = button.dataset.package || "";
    packageForm.sku.value = button.dataset.sku || "";
    if (packageStatus) packageStatus.textContent = "";
    packageModal.classList.add("open");
    packageModal.setAttribute("aria-hidden", "false");
    packageForm.name.focus();
  });
});

document.querySelector("[data-close-modal]")?.addEventListener("click", () => {
  packageModal?.classList.remove("open");
  packageModal?.setAttribute("aria-hidden", "true");
});

packageModal?.addEventListener("click", (event) => {
  if (event.target !== packageModal) return;
  packageModal.classList.remove("open");
  packageModal.setAttribute("aria-hidden", "true");
});

packageForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const inquiry = {
    id: Date.now(),
    name: packageForm.name.value.trim(),
    email: packageForm.email.value.trim(),
    whatsapp: packageForm.whatsapp.value.trim(),
    package: packageForm.package.value,
    sku: packageForm.sku.value,
    message: packageForm.message.value.trim(),
    date: new Date().toLocaleString(),
  };
  saveInquiries([inquiry, ...getInquiries()]);
  if (packageStatus) packageStatus.textContent = "Inquiry saved. We will contact you soon.";
  packageForm.reset();
  setTimeout(() => {
    packageModal?.classList.remove("open");
    packageModal?.setAttribute("aria-hidden", "true");
  }, 900);
});

const testimonialGrid = document.querySelector(".testimonial-grid");
let testimonialCards = [...document.querySelectorAll(".testimonial")];
const testimonialPrev = document.querySelector("[data-testimonial-prev]");
const testimonialNext = document.querySelector("[data-testimonial-next]");
const testimonialCurrent = document.querySelector("[data-testimonial-current]");
const testimonialTotal = document.querySelector(".testimonial-controls span");
const reviewModal = document.querySelector("[data-review-modal]");
const reviewForm = document.querySelector("[data-review-form]");
const reviewStatus = reviewForm?.querySelector(".form-status");
let activeTestimonial = 0;

const getReviews = () => JSON.parse(localStorage.getItem("craftedpixelsReviews") || "[]");
const saveReviews = (reviews) => localStorage.setItem("craftedpixelsReviews", JSON.stringify(reviews));
const initialsFromName = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CP";
const stars = (rating) => "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);

const createReviewCard = (review) => {
  const card = document.createElement("article");
  card.className = "testimonial reveal";
  card.innerHTML = `<div class="client-row"><span class="avatar">${initialsFromName(review.name)}</span><div><strong>${review.name}</strong><small>${review.role}</small></div></div><div class="rating">${stars(Number(review.rating))}</div><p>“${review.message}”</p>`;
  return card;
};

getReviews().forEach((review) => testimonialGrid?.appendChild(createReviewCard(review)));
testimonialCards = [...document.querySelectorAll(".testimonial")];

const showTestimonial = (index, direction = "next") => {
  if (!testimonialCards.length) return;
  activeTestimonial = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === activeTestimonial);
    card.classList.toggle("slide-back", cardIndex === activeTestimonial && direction === "prev");
  });
  if (testimonialCurrent) testimonialCurrent.textContent = String(activeTestimonial + 1).padStart(2, "0");
  if (testimonialTotal) testimonialTotal.innerHTML = `<b data-testimonial-current>${String(activeTestimonial + 1).padStart(2, "0")}</b> / ${String(testimonialCards.length).padStart(2, "0")}`;
};

testimonialNext?.addEventListener("click", () => showTestimonial(activeTestimonial + 1, "next"));
testimonialPrev?.addEventListener("click", () => showTestimonial(activeTestimonial - 1, "prev"));
showTestimonial(0);

document.querySelector("[data-open-review]")?.addEventListener("click", () => {
  reviewModal?.classList.add("open");
  reviewModal?.setAttribute("aria-hidden", "false");
  if (reviewStatus) reviewStatus.textContent = "";
  reviewForm?.name.focus();
});

document.querySelector("[data-close-review]")?.addEventListener("click", () => {
  reviewModal?.classList.remove("open");
  reviewModal?.setAttribute("aria-hidden", "true");
});

reviewModal?.addEventListener("click", (event) => {
  if (event.target !== reviewModal) return;
  reviewModal.classList.remove("open");
  reviewModal.setAttribute("aria-hidden", "true");
});

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const review = {
    name: reviewForm.name.value.trim(),
    role: reviewForm.role.value.trim(),
    rating: reviewForm.rating.value,
    message: reviewForm.message.value.trim(),
  };
  saveReviews([...getReviews(), review]);
  testimonialGrid?.appendChild(createReviewCard(review));
  testimonialCards = [...document.querySelectorAll(".testimonial")];
  showTestimonial(testimonialCards.length - 1, "next");
  if (reviewStatus) reviewStatus.textContent = "Thank you! Your review has been added.";
  reviewForm.reset();
  setTimeout(() => {
    reviewModal?.classList.remove("open");
    reviewModal?.setAttribute("aria-hidden", "true");
  }, 1100);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
