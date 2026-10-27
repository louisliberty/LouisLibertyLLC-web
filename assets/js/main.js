/* Louis Liberty LLC — site script. Plain JavaScript, no build step. */

/* ------------------------------------------------------------------
   CONTACT FORM SETUP
   The form sends messages through Web3Forms (free, no server needed).
   1. Go to https://web3forms.com, enter info@louislibertyllc.com,
      and they email you an "Access Key".
   2. Paste that key between the quotes below.
   The key is safe to have in public code: it can only send mail to
   the address it was created for.
   Until a key is set, "Send Message" opens the visitor's own email
   app with their message filled in, addressed to CONTACT_EMAIL.
------------------------------------------------------------------- */
const WEB3FORMS_ACCESS_KEY = "76643574-3937-466b-96fa-c8a40371f62f";
const CONTACT_EMAIL = "info@louislibertyllc.com";

const CALENDLY_URL =
  "https://calendly.com/louislibertyllc/30min?hide_gdpr_banner=1&background_color=0a0a1a&text_color=e5e5e5&primary_color=d4af37";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = String(new Date().getFullYear());

/* ---------- Gold particle background ---------- */
(function particles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas && canvas.getContext("2d");
  if (!ctx || reduceMotion) return;

  let list = [];
  let width = 0;

  function setup() {
    width = window.innerWidth;
    canvas.width = width;
    canvas.height = window.innerHeight;
    const count = Math.floor(width / 10);
    list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedY: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5,
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of list) {
      p.y -= p.speedY;
      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  setup();
  frame();

  // Mobile browsers fire resize when the address bar hides; only rebuild on width changes.
  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth !== width) setup();
      else canvas.height = window.innerHeight;
    }, 150);
  });
})();

/* ---------- Fade-up reveal, staggered per section ---------- */
(function reveal() {
  const groups = document.querySelectorAll("[data-animate]");
  groups.forEach((group) => {
    group.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${0.1 + i * 0.15}s`;
    });
  });

  const show = (el) => el.classList.add("is-visible");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    groups.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -100px 0px" }
  );

  groups.forEach((group) => {
    if (group.dataset.animate === "load") requestAnimationFrame(() => show(group));
    else observer.observe(group);
  });
})();

/* ---------- Calendly inline booking ---------- */
(function calendly() {
  const box = document.getElementById("calendly-embed");
  if (!box) return;
  let tries = 0;
  const start = () => {
    if (window.Calendly) {
      box.innerHTML = "";
      window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: box });
    } else if (tries++ < 75) {
      setTimeout(start, 200);
    } else {
      box.innerHTML =
        '<p class="calendly-fallback"><a href="https://calendly.com/louislibertyllc/30min" target="_blank" rel="noopener">Open the booking calendar</a></p>';
    }
  };
  start();
})();

/* ---------- Toast ---------- */
let toastTimer;
function toast(title, body, isError) {
  const el = document.getElementById("toast");
  el.querySelector(".toast-title").textContent = title;
  el.querySelector(".toast-body").textContent = body;
  el.classList.toggle("is-error", Boolean(isError));
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 6000);
}

/* ---------- Contact form ---------- */
const ALLOWED_TLDS = [
  "com", "net", "org", "edu", "gov", "mil", "info", "biz", "us", "uk",
  "ca", "au", "de", "fr", "it", "es", "nl", "br", "mx", "jp", "kr",
  "cn", "in", "ru", "za", "ie", "nz", "se", "no", "dk", "fi", "at",
  "ch", "be", "pt", "pl", "cz", "io", "co", "me", "tv", "ai", "app",
  "dev", "tech", "online", "store", "site", "xyz", "club", "pro",
  "agency", "design", "studio", "media", "video", "film", "photography",
  "productions", "llc", "inc", "company",
];
const LOOKALIKES = [
  "gmail.co", "yahoo.co", "hotmail.co", "outlook.co", "aol.co",
  "icloud.co", "gmial.com", "gamil.com", "yahooo.com", "yaho.com",
  "hotmal.com", "outloo.com", "gmai.com", "gmil.com",
];

function emailError(value) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
  const domain = value.split("@")[1].toLowerCase();
  const parts = domain.split(".");
  const tld = parts[parts.length - 1];
  const name = parts.slice(0, -1).join(".");
  if (
    !/^[a-z]{2,}$/.test(tld) ||
    !ALLOWED_TLDS.includes(tld) ||
    LOOKALIKES.includes(domain) ||
    name.length < 2
  ) {
    return "Please enter a valid email address from a recognized provider";
  }
  return "";
}

function validate(data) {
  const errors = {};
  if (!data.firstName) errors.firstName = "First name is required";
  if (!data.lastName) errors.lastName = "Last name is required";
  const e = emailError(data.email);
  if (e) errors.email = e;
  if (data.message.length < 50) errors.message = "Message must be at least 50 characters";
  return errors;
}

(function contactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const idle = button.querySelector('[data-state="idle"]');
  const busy = button.querySelector('[data-state="busy"]');

  function showErrors(errors) {
    form.querySelectorAll("[data-error-for]").forEach((p) => {
      const key = p.dataset.errorFor;
      p.textContent = errors[key] || "";
      p.closest(".field").classList.toggle("has-error", Boolean(errors[key]));
    });
  }

  function setBusy(on) {
    button.disabled = on;
    idle.hidden = on;
    busy.hidden = !on;
  }

  // Clear a field's error as soon as the visitor edits it.
  form.addEventListener("input", (ev) => {
    const field = ev.target.closest(".field");
    if (field && field.classList.contains("has-error")) {
      field.classList.remove("has-error");
      field.querySelector(".field-error").textContent = "";
    }
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    if (fd.get("botcheck")) return; // spam bot filled the hidden box

    const data = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    const errors = validate(data);
    showErrors(errors);
    if (Object.keys(errors).length) {
      form.querySelector(".has-error input, .has-error textarea").focus();
      return;
    }

    const fullName = `${data.firstName} ${data.lastName}`;
    const subject = `New Contact Form Submission from ${fullName}`;

    if (!WEB3FORMS_ACCESS_KEY) {
      const body = `Name: ${fullName}\nEmail: ${data.email}\n\n${data.message}`;
      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: "Louis Liberty LLC Website",
          name: fullName,
          email: data.email,
          message: data.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || "Failed to send message");

      form.reset();
      toast("Message Sent", "Thank you for connecting. We will be in touch shortly.");
    } catch (err) {
      toast(
        "Error",
        `Your message couldn't be sent. Please try again, or email us at ${CONTACT_EMAIL}.`,
        true
      );
    } finally {
      setBusy(false);
    }
  });
})();
