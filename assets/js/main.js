/* =========================================================
   Site JS — mobile nav, footer year, contact form
   ========================================================= */

// --- Editable config -------------------------------------------------
// Option A: Formspree (free tier, no backend needed).
//   1. Make a free account at https://formspree.io
//   2. Create a form, copy its endpoint URL (looks like https://formspree.io/f/xxxxxx)
//   3. Paste it between the quotes below. Leave as "" to use the mailto fallback instead.
const FORMSPREE_ENDPOINT = "";

// Fallback email used when no Formspree endpoint is set (opens user's mail app)
const FALLBACK_EMAIL = "you@example.com";  // TODO: your real email
// ----------------------------------------------------------------------

// If a Formspree endpoint is set, point the form at it so it also works
// without JavaScript (progressive enhancement).
if (FORMSPREE_ENDPOINT) {
  form.action = FORMSPREE_ENDPOINT;
  form.method = "POST";
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// --- Editable pricing config -----------------------------------
// Base service price per make (full synthetic + OEM filter + labor)
const SERVICE_PRICES = {
  mini: 139,
  audi: 169,
  landrover: 229,
  porsche: 379,
};
const FREE_MILES = 15;        // travel free within this radius
const PER_MILE = 1.5;         // $ per mile beyond FREE_MILES
const MULTI_DISCOUNT = 20;    // $ off when a 2nd vehicle is booked
// ---------------------------------------------------------------

const qMake = document.getElementById("qMake");
const qMiles = document.getElementById("qMiles");
const qMulti = document.getElementById("qMulti");
const qService = document.getElementById("qService");
const qTravel = document.getElementById("qTravel");
const qTotal = document.getElementById("qTotal");

function calcQuote() {
  const base = SERVICE_PRICES[qMake.value] || 0;
  const miles = Math.max(0, parseInt(qMiles.value, 10) || 0);
  const travel = miles <= FREE_MILES ? 0 : Math.round((miles - FREE_MILES) * PER_MILE);
  const multi = qMulti.checked ? MULTI_DISCOUNT : 0;
  const total = base + travel - multi;
  qService.textContent = "$" + base;
  qTravel.textContent = "$" + travel + (travel === 0 ? " (free)" : "");
  qTotal.textContent = "$" + total;
}
[qMake, qMiles, qMulti].forEach((el) => el.addEventListener("input", calcQuote));
calcQuote();
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "form-status";

  // Basic validation
  if (!form.name.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
    status.textContent = "Please fill in name, email, and message.";
    status.classList.add("err");
    return;
  }

  const data = {
    name: form.name.value,
    email: form.email.value,
    service: form.service.value,
    message: form.message.value,
    _gotcha: form._gotcha ? form._gotcha.value : "",
  };

  if (FORMSPREE_ENDPOINT) {
    status.textContent = "Sending…";
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        status.textContent = "Thanks! Your message is on its way. I'll reply soon.";
        status.classList.add("ok");
        form.reset();
      } else {
        throw new Error("submit failed");
      }
    } catch {
      status.textContent = "Something went wrong. Please email me directly — thanks!";
      status.classList.add("err");
    }
  } else {
    // mailto fallback
    const subject = encodeURIComponent("New inquiry: " + (data.service || "General"));
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`
    );
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email app… if nothing happened, email " + FALLBACK_EMAIL;
    status.classList.add("ok");
    form.reset();
  }
});
