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
  landrover: 229,
};
const FREE_MILES = 15;        // travel free within this radius
const PER_MILE = 1.5;         // $ per mile beyond FREE_MILES
// ---------------------------------------------------------------

const qMake = document.getElementById("qMake");
const qMiles = document.getElementById("qMiles");
const qService = document.getElementById("qService");
const qTravel = document.getElementById("qTravel");
const qTotal = document.getElementById("qTotal");

function calcQuote() {
  const base = SERVICE_PRICES[qMake.value] || 0;
  const miles = Math.max(0, parseInt(qMiles.value, 10) || 0);
  const travel = miles <= FREE_MILES ? 0 : Math.round((miles - FREE_MILES) * PER_MILE);
  const total = base + travel;
  qService.textContent = "$" + base;
  qTravel.textContent = "$" + travel + (travel === 0 ? " (free)" : "");
  qTotal.textContent = "$" + total;
}
[qMake, qMiles].forEach((el) => el.addEventListener("input", calcQuote));
calcQuote();
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

// Native Netlify Forms submission. We only run client-side validation here,
// then let the browser POST natively (Netlify handles the rest and redirects
// to the action URL). AJAX fetch is avoided because Netlify's bot/spam layer
// often rejects it.
form.addEventListener("submit", (e) => {
  status.textContent = "";
  status.className = "form-status";
  if (!form.name.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
    e.preventDefault();
    status.textContent = "Please fill in name, email, and message.";
    status.classList.add("err");
  }
  // If valid, do nothing — the browser submits natively to /success.html.
});
