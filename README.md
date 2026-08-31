# RoverRam — At-Home Oil Changes

A clean, responsive static website for RoverRam, a mobile oil-change service for European cars (Land Rover, Mini Cooper, Audi & Porsche). No build step, no backend required.

## Preview locally
```
cd sidehustle-site
python3 -m http.server 8000
```
Then open http://localhost:8000

## What to edit (all clearly marked "PLACEHOLDER")
- `index.html` — text content: business name, headline, services, about, contact details.
- `assets/css/styles.css` — top of file has `:root` variables. Change `--accent` to rebrand the whole site.
- `assets/js/main.js` — set `FORMSPREE_ENDPOINT` to make the contact form actually deliver messages (free at formspree.io), or leave it blank to use the email fallback. Also update `FALLBACK_EMAIL`.

## Contact form options
1. **Formspree (recommended, free):** create a form at formspree.io, paste the endpoint URL into `FORMSPREE_ENDPOINT` in main.js. Messages arrive in your inbox.
2. **Email fallback:** if left blank, submitting opens the visitor's email app pre-filled to `FALLBACK_EMAIL`.

## Deploy (free)
- **Netlify / Cloudflare Pages / GitHub Pages:** drag the folder in, or push to a repo. No build command needed.
- Custom domain: set it in the host's dashboard.

## Optional upgrades
- Add a real photo in the About section (replace the placeholder box with `<img>`).
- Add a Calendly/booking link (commented out in the contact section).
- Add a Google Maps embed for your service area.
