/* =====================================================================
   HARITH WEBSITE OPTIMIZATION — interactions
   Vanilla JS. Progressive enhancement: the page is fully usable
   without this file. Nav, menu, accordion, reveal, and WhatsApp links
   all degrade gracefully.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG — the single source of truth. Change values here only.
     ------------------------------------------------------------------ */
  var CONFIG = {
    // WhatsApp number in INTERNATIONAL format, digits only.
    // No "+", spaces, parentheses, or dashes (wa.me requirement).
    whatsappNumber: "963937306331",

    // Default message used if a link is missing a data-wa-msg attribute.
    defaultMessage:
      "Hi Harith, I found your portfolio and would like to discuss a website project.",

    // Live deployed URL for the AURELION concept project.
    // Leave "" (empty) to keep the card pointing at the local case study
    // with no broken "live demo" link. Set it once AURELION is deployed,
    // e.g. "https://your-aurelion-url.netlify.app".
    aurelionLiveUrl: ""
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    setupWhatsAppLinks();
    setupLiveProjectLink();
    setupHeaderState();
    setupMobileMenu();
    setupAccordion();
    setupReveal();
  }

  /* ------------------------- dynamic year --------------------------- */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* --------------------- WhatsApp link builder ---------------------- */
  // Centralised + encoded. Every [data-wa] element gets its href rebuilt
  // from CONFIG.whatsappNumber + its data-wa-msg, so the number lives in
  // exactly one place. Falls back to the default message when none is set.
  function waUrl(message) {
    var text = encodeURIComponent(message || CONFIG.defaultMessage);
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + text;
  }

  function setupWhatsAppLinks() {
    var links = document.querySelectorAll("[data-wa]");
    links.forEach(function (link) {
      var msg = link.getAttribute("data-wa-msg") || CONFIG.defaultMessage;
      link.setAttribute("href", waUrl(msg));
      // Ensure new tab + security attributes even if markup is edited later.
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ------------------ AURELION live-project link -------------------- */
  // If a deployed URL is configured, add a "View Live Project" button next
  // to the case-study link. With no URL we never render a broken demo link.
  function setupLiveProjectLink() {
    if (!CONFIG.aurelionLiveUrl) return;
    var caseBtn = document.getElementById("aurelionCase");
    if (!caseBtn) return;

    var live = document.createElement("a");
    live.className = "btn btn-outline btn-arrow";
    live.href = CONFIG.aurelionLiveUrl;
    live.target = "_blank";
    live.rel = "noopener noreferrer";
    live.textContent = "View Live Project";
    caseBtn.insertAdjacentElement("afterend", live);
  }

  /* --------------------- header scrolled state ---------------------- */
  function setupHeaderState() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------- mobile menu ---------------------------- */
  function setupMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    var closeBtn = document.getElementById("menuClose");
    if (!toggle || !menu) return;

    var lastFocused = null;

    function close() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }
    function open() {
      lastFocused = document.activeElement;
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    toggle.addEventListener("click", function () {
      if (menu.hidden) open(); else close();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);

    // Close after choosing a destination
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    // Escape closes the menu
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) close();
    });

    // Reset if resized up to where the desktop nav reappears
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (m) {
      if (m.matches && !menu.hidden) close();
    });
  }

  /* --------------------------- accordion ---------------------------- */
  // Accessible disclosure with animated height.
  function setupAccordion() {
    var triggers = document.querySelectorAll(".acc-trigger");

    triggers.forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (isOpen) collapse(trigger, panel);
        else expand(trigger, panel);
      });
    });

    function expand(trigger, panel) {
      trigger.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      if (reduceMotion) return;
      var h = panel.scrollHeight;
      panel.style.height = "0px";
      void panel.offsetHeight; // reflow
      panel.style.height = h + "px";
      panel.addEventListener("transitionend", function done() {
        panel.style.height = "auto";
        panel.removeEventListener("transitionend", done);
      });
    }

    function collapse(trigger, panel) {
      trigger.setAttribute("aria-expanded", "false");
      if (reduceMotion) { panel.hidden = true; return; }
      panel.style.height = panel.scrollHeight + "px";
      void panel.offsetHeight;
      panel.style.height = "0px";
      panel.addEventListener("transitionend", function done() {
        panel.hidden = true;
        panel.style.height = "";
        panel.removeEventListener("transitionend", done);
      });
    }
  }

  /* ----------------------- reveal on scroll ------------------------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  }
})();
