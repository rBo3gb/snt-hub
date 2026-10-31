/*
 * Настройки контактов.
 * Замените значения на свои — они подставятся во все ссылки на странице.
 */
const CONTACTS = {
  telegram: "Ant_Shishk",              // без @, куда ведёт ссылка
  telegramDisplay: "snt_hub",          // без @, что видно на сайте
  whatsapp: "79629574141",             // только цифры
  max: "https://max.ru/u/f9LHodD0cOKhrMgB7TqAQbnVKpL1FBEVeNh7BCSqJ2XtUev40Wmx7AJauww",
  maxDisplay: "Написать в MAX",
  email: "2282022@bk.ru",              // куда реально приходят письма
  emailDisplay: "info@snt-hub.ru",     // что видно на сайте
  phone: "+79629574141",               // для tel:
  phoneDisplay: "+7 (962) 957-41-41"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyContacts() {
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.setAttribute("href", `tel:${CONTACTS.phone}`);
  });

  document.querySelectorAll(".header__phone, .contact-links a[href^=\"tel:\"] strong").forEach((element) => {
    element.textContent = CONTACTS.phoneDisplay;
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.setAttribute("href", `mailto:${CONTACTS.email}`);
  });

  document.querySelectorAll('.contact-links a[href^="mailto:"] strong').forEach((element) => {
    element.textContent = CONTACTS.emailDisplay || CONTACTS.email;
  });

  document.querySelectorAll('a[href^="https://t.me/"]').forEach((link) => {
    link.setAttribute("href", `https://t.me/${CONTACTS.telegram}`);
  });

  document.querySelectorAll('.contact-links a[href^="https://t.me/"] strong').forEach((element) => {
    element.textContent = `@${CONTACTS.telegramDisplay || CONTACTS.telegram}`;
  });

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    link.setAttribute("href", `https://wa.me/${CONTACTS.whatsapp}`);
  });

  document.querySelectorAll('.contact-links a[href^="https://wa.me/"] strong').forEach((element) => {
    element.textContent = CONTACTS.phoneDisplay;
  });

  document.querySelectorAll('a[href^="https://max.ru/"]').forEach((link) => {
    if (CONTACTS.max) link.setAttribute("href", CONTACTS.max);
    const title = link.querySelector("strong");
    if (title) title.textContent = CONTACTS.maxDisplay || "Написать в MAX";
  });
}

function initHeader() {
  const header = document.querySelector("[data-header]");
  const toTop = document.querySelector("[data-to-top]");

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });
  }
}

function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector("[data-nav-toggle]");

  if (!nav || !toggle) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
}

function initReveal() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));

  document.querySelectorAll(".problem-grid, .feature-grid, .pricing-grid, .steps, .support-grid").forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    });
  });

  if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function initPricing() {
  const planSelect = document.getElementById("plan");
  if (!planSelect) return;

  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;
      const option = Array.from(planSelect.options).find((item) =>
        item.textContent.trim().startsWith(plan)
      );

      if (option) planSelect.value = option.value;
    });
  });
}

function initFaq() {
  const details = Array.from(document.querySelectorAll(".accordion details"));

  details.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      details.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function initForm() {
  const form = document.getElementById("lead-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  const showStatus = (kind, html) => {
    status.className = `form-status is-visible is-${kind}`;
    status.innerHTML = html;
  };

  form.addEventListener("input", () => {
    status.className = "form-status";
    status.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const type = String(data.get("type") || "").trim();
    const plots = String(data.get("plots") || "").trim();
    const plan = String(data.get("plan") || "").trim();
    const comment = String(data.get("comment") || "").trim();

    const message = [
      "Заявка с сайта «СНТ-Хаб»",
      "",
      `Имя: ${name}`,
      `Телефон / Telegram: ${phone}`,
      `Тип сообщества: ${type}`,
      `Количество участков: ${plots || "не указано"}`,
      `Тариф: ${plan}`,
      `Комментарий: ${comment || "—"}`
    ].join("\n");

    const subject = `Заявка с сайта: ${name}`;
    const mailtoUrl = `mailto:${CONTACTS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    reachGoal("form_submit");

    if (CONTACTS.telegram) {
      const telegramUrl = `https://t.me/${CONTACTS.telegram}?text=${encodeURIComponent(message)}`;
      const popup = window.open(telegramUrl, "_blank");

      if (popup) {
        popup.opener = null;
        showStatus(
          "success",
          "Сообщение сформировано. Отправьте его в открывшемся окне Telegram — я получу заявку."
        );
      } else {
        showStatus(
          "success",
          `Telegram не открылся. <a href="${telegramUrl}" target="_blank" rel="noopener">Открыть чат вручную</a> или <a href="${mailtoUrl}">отправить на почту</a>.`
        );
      }
      return;
    }

    window.location.href = mailtoUrl;
    showStatus(
      "success",
      `Открываю почтовую программу. Если она не открылась — <a href="${mailtoUrl}">нажмите здесь</a>.`
    );
  });
}

function initYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

const METRIKA_ID = 113951839;

function reachGoal(name) {
  if (typeof window.ym === "function") window.ym(METRIKA_ID, "reachGoal", name);
}

function initAnalytics() {
  const goals = [
    ['a[href^="tel:"]', "phone_click"],
    ['a[href^="https://t.me/"]', "telegram_click"],
    ['a[href^="https://wa.me/"]', "whatsapp_click"],
    ['a[href^="https://max.ru/"]', "max_click"],
    ['a[href^="mailto:"]', "email_click"]
  ];

  goals.forEach(([selector, goal]) => {
    document.querySelectorAll(selector).forEach((link) => {
      link.addEventListener("click", () => reachGoal(goal));
    });
  });
}

applyContacts();
initHeader();
initNav();
initReveal();
initPricing();
initFaq();
initForm();
initAnalytics();
initYear();
