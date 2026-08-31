/* =========================================================
   Site JS — mobile nav, footer year, contact form
   ========================================================= */

// --- Contact form: Netlify Forms (no backend needed) -----------------
// Captures submissions in the Netlify dashboard and can email them to you.
// To receive submissions by email: Netlify site -> Forms -> Add notification
// -> Email notification -> roverram@roverram.com
// The form tag in index.html carries data-netlify="true"; Netlify detects it
// at deploy time. No endpoint URL or API key required.
// ----------------------------------------------------------------------

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

// Build the Netlify Forms POST body the way Netlify expects (form-urlencoded,
// with form-name + bot-field). AJAX so the user stays on the page.
function encode(data) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");
}

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
    "form-name": "contact",
    name: form.name.value,
    email: form.email.value,
    service: form.service.value,
    message: form.message.value,
    "bot-field": form["bot-field"] ? form["bot-field"].value : "",
  };

  status.textContent = "Sending…";
  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(data),
    });
    if (res.ok) {
      status.textContent = "Thanks! Your message is on its way — I'll reply soon.";
      status.classList.add("ok");
      form.reset();
    } else {
      throw new Error("submit failed");
    }
  } catch {
    status.textContent = "Something went wrong sending. Please email roverram@roverram.com directly.";
    status.classList.add("err");
  }
});
