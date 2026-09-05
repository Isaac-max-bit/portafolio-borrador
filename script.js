// Portfolio JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // ---------- DOM Elements ----------
  const header = document.querySelector("header");
  const navLinks = document.querySelectorAll(".nav-link");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const heroSubtitle = document.getElementById("rotating-profession");
  const ctaBtn = document.querySelector(".cta-btn");
  const hireBtns = document.querySelectorAll(".hire-btn");
  const aboutBtn = document.querySelector(".about-btn");
  const socialIcons = document.querySelectorAll(".social-icon");
  const yearSpan = document.getElementById("year");

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ---------- Typewriter Effect ----------
  const professions = [
    "Asistente en desarrollo de software",
    "Frontend Desarrollador",
    "Backend Desarrollador",
    "UI/UX Entusiasta",
    "Solucionador de problemas",
    "Innovador Tecnológico",
    "Aprendiz de por vida",
  ];

  let professionIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function typeWriter() {
    if (!heroSubtitle) return;

    const currentProfession = professions[professionIndex];

    if (isDeleting) {
      heroSubtitle.innerHTML =
        currentProfession.substring(0, charIndex - 1) +
        '<span class="cursor">|</span>';
      charIndex--;
      typingSpeed = 75;
    } else {
      heroSubtitle.innerHTML =
        currentProfession.substring(0, charIndex + 1) +
        '<span class="cursor">|</span>';
      charIndex++;
      typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentProfession.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      professionIndex = (professionIndex + 1) % professions.length;
      typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // ---------- Mobile Menu ----------
  function toggleMobileMenu() {
    const isActive = hamburger?.classList.toggle("active");
    navMenu?.classList.toggle("active");
    hamburger?.setAttribute("aria-expanded", String(!!isActive));
    document.body.style.overflow = navMenu?.classList.contains("active")
      ? "hidden"
      : "";
  }

  // ---------- Smooth Scroll Navigation ----------
  function smoothScroll(event) {
    event.preventDefault();
    const targetId = this.getAttribute("href");

    if (targetId && targetId.startsWith("#")) {
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header?.offsetHeight || 80;
        const offsetTop = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });

        if (navMenu?.classList.contains("active")) {
          toggleMobileMenu();
        }

        updateActiveNavLink(targetId);
      }
    }
  }

  function updateActiveNavLink(activeId) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === activeId) {
        link.classList.add("active");
      }
    });
  }

  // ---------- Scroll Handling (single consolidated listener) ----------
  const sections = document.querySelectorAll("section[id]");
  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Header background on scroll
    if (scrollY > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    // Active nav link based on section in view
    const scrollPosition = scrollY + (header?.offsetHeight || 80) + 10;
    let activeSection = null;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeSection = section;
      }
    });

    if (activeSection) {
      updateActiveNavLink("#" + activeSection.getAttribute("id"));
    } else if (scrollPosition < 200) {
      updateActiveNavLink("#home");
    }
  }

  function optimizedScrollHandler() {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ---------- Intersection Observer for fade-in animations ----------
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  function setupAnimations() {
    const animatedElements = document.querySelectorAll(
      ".hero-stats .stat, .about-highlights .highlight, .floating-card, .social-icon",
    );

    animatedElements.forEach((el, index) => {
      if (!prefersReducedMotion) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.05}s`;
      }
      animationObserver.observe(el);
    });
  }

  // ---------- Animate skill bars when scrolled into view ----------
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const target = fill.getAttribute("data-width") || "0";
          fill.style.width = target + "%";
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.4 },
  );

  document
    .querySelectorAll(".skill-fill")
    .forEach((fill) => skillObserver.observe(fill));

  // ---------- Button Ripple + Actions ----------
  function handleButtonClick(event) {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    if (
      button.classList.contains("hire-btn") &&
      button.classList.contains("primary")
    ) {
      const contactSection = document.querySelector("#contact");
      contactSection?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }

  // ---------- Notifications ----------
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
<i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
<span>${message}</span>
`;

    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.add("show"));

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3500);
  }

  // ---------- Keyboard Navigation ----------
  function handleKeyboard(event) {
    if (event.key === "Escape" && navMenu?.classList.contains("active")) {
      toggleMobileMenu();
    }
  }

  // ---------- Resize Handling ----------
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth >= 769 && navMenu?.classList.contains("active")) {
        toggleMobileMenu();
      }
    }, 250);
  }

  // ---------- Contact Form (EmailJS) ----------
  // IMPORTANT: replace these three placeholders with your real EmailJS
  // credentials (https://dashboard.emailjs.com) before this form can send
  // real emails. Until then, the form will show a friendly warning
  // instead of failing silently.
  const EMAILJS_PUBLIC_KEY = "A1GiQXAGLl5lSxgNA";
  const EMAILJS_SERVICE_ID = "service_abc123";
  const EMAILJS_TEMPLATE_ID = "template_z1cwnde";
  const emailjsConfigured = ![
    EMAILJS_PUBLIC_KEY,
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
  ].some((v) => v.startsWith("TU_"));

  if (emailjsConfigured && window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitButton = this.querySelector(".submit-btn");
      const originalButtonHTML = submitButton.innerHTML;

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification("Por favor, completa todos los campos.", "error");
        return;
      }

      if (!emailjsConfigured) {
        showNotification(
          "El formulario aún no está conectado a un servicio de correo. Configura tus credenciales de EmailJS en script.js.",
          "error",
        );
        return;
      }

      try {
        submitButton.disabled = true;
        submitButton.innerHTML = `<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>`;

        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this);

        showNotification(
          "¡Mensaje enviado correctamente! Te responderé lo antes posible.",
          "success",
        );
        this.reset();
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        showNotification(
          "No fue posible enviar el mensaje. Inténtalo nuevamente.",
          "error",
        );
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
      }
    });
  }

  // ---------- Event Listeners ----------
  hamburger?.addEventListener("click", toggleMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  [ctaBtn, ...hireBtns, aboutBtn].forEach((btn) => {
    btn?.addEventListener("click", handleButtonClick);
  });

  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.1)";
    });
    icon.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  window.addEventListener("scroll", optimizedScrollHandler, { passive: true });
  window.addEventListener("resize", handleResize);
  document.addEventListener("keydown", handleKeyboard);

  document.addEventListener("click", (event) => {
    if (
      navMenu?.classList.contains("active") &&
      !navMenu.contains(event.target) &&
      !hamburger?.contains(event.target)
    ) {
      toggleMobileMenu();
    }
  });

  // ---------- Init ----------
  function init() {
    if (heroSubtitle) {
      if (prefersReducedMotion) {
        heroSubtitle.textContent = professions[0];
      } else {
        typeWriter();
      }
    }

    setupAnimations();
    onScroll();

    setTimeout(() => document.body.classList.add("loaded"), 100);
  }

  init();
});
