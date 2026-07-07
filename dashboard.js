const dashMenu = document.querySelector("[data-dash-menu]");
const sidebar = document.querySelector("[data-sidebar]");
const toast = document.querySelector("[data-dash-toast]");
let toastTimer;

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
};

dashMenu?.addEventListener("click", () => {
  const isOpen = sidebar?.classList.toggle("open");
  dashMenu.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".dash-nav button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".dash-nav button").forEach((item) => item.classList.toggle("active", item === button));
    showToast(`${button.textContent.trim().replace(/\d+$/, "")} view selected`);
    if (window.innerWidth <= 900) sidebar?.classList.remove("open");
  });
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

const leadFilters = document.querySelectorAll("[data-lead-filter]");
const leadRows = document.querySelectorAll("[data-lead-status]");
leadFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.leadFilter;
    leadFilters.forEach((item) => item.classList.toggle("active", item === button));
    leadRows.forEach((row) => row.classList.toggle("hidden", filter !== "all" && row.dataset.leadStatus !== filter));
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") sidebar?.classList.remove("open");
});
