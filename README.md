# RoverRam — At-Home Oil Changes for European Cars

Static website for RoverRam: mobile oil changes at the customer's home/office,
specializing in Land Rover, Mini Cooper, Audi & Porsche. No build step, no backend.

Business details (live on site):
- Email: roverram@roverram.com
- Phone: (360) 410-4044
- Base: Bellingham, WA (Whatcom County)
- Domain: roverram.com (registered via Squarespace Domains)

## Local preview
```
cd sidehustle-site
python3 -m http.server 8000
```
Open http://localhost:8000

## Site structure
- index.html        — hero, services, specs, instant quote, how-it-works, about, contact
- assets/css/styles.css — theme (--accent = green at top of :root)
- assets/js/main.js     — pricing config, quote calculator, contact form, nav

## What to edit
- Pricing: top of assets/js/main.js -> SERVICE_PRICES, FREE_MILES, PER_MILE, MULTI_DISCOUNT
- Brand color: --accent in assets/css/styles.css
- Contact details: index.html contact section (email/phone/area) + success.html
- Booking link: the Calendly href in index.html contact section
- Service-area map: the `q=` query in the map iframe src (index.html)

## Current feature status (as of last session)
- [x] Hero, services, Euro-spec credibility section, how-it-works, about, contact
- [x] Instant quote calculator (vehicle + distance from Bellingham, travel free <=15mi, $1.50/mi after)
- [x] Contact form via Netlify Forms -> emails roverram@roverram.com (verified working)
- [x] Calendly booking button -> https://calendly.com/roverram-roverram/60mins (60-min slot)
- [x] Bellingham service-area Google Map embed
- [x] Deployed on Netlify, custom domain roverram.com, HTTPS live, email working
- [ ] About photo (placeholder box still says "YOUR PHOTO HERE")
- [ ] Google Business Profile for local SEO (off-site, not in repo)

## Contact form (DONE — working)
Uses **Netlify Forms** (no backend, no extra account). Submissions go to
Netlify -> Forms and are emailed to roverram@roverram.com via an email
notification (set up in Netlify: Forms -> Add notification -> Email).
- Form tag in index.html: `data-netlify="true" netlify-honeypot="bot-field" action="/success.html"`
- Success redirect: success.html
- Spam: hidden `bot-field` honeypot (Netlify drops filled ones)
- JS only does client-side validation; the browser POSTs natively
  (AJAX fetch was rejected by Netlify's spam layer — don't switch back).
- If a deploy shows a 404 on /success.html, do Deploys -> Clear cache and
  deploy site (stale edge cache).

## Deploy & DNS (DONE — record of how it was set up)
Hosting: Netlify. Repo: https://github.com/therealmacoy360/roverram
Live URL (before custom domain): https://6a94d0c599ce0cbc7f76faa7--thunderous-valkyrie-734960.netlify.app/

Steps taken:
1. gh CLI already authenticated as therealmacoy360 -> `gh repo create roverram --public`
2. Pushed site (netlify.toml present: publish=".", no build command).
3. Netlify: Add new site -> Import from GitHub -> roverram -> Deploy.
4. Netlify Domain management -> Add domain -> roverram.com.
   Netlify assigned DNS nameservers:
     dns1.p08.nsone.net
     dns2.p08.nsone.net
     dns3.p08.nsone.net
     dns4.p08.nsone.net
5. BEFORE switching nameservers, added Google Workspace MX records in Netlify DNS
   (so email kept working):
     @ MX aspmx.l.google.com  priority 1
     @ MX alt1.aspmx.l.google.com priority 5
     @ MX alt2.aspmx.l.google.com priority 5
     @ MX alt3.aspmx.l.google.com priority 10
     @ MX alt4.aspmx.l.google.com priority 10
   Plus CNAME www -> 6a94d0c599ce0cbc7f76faa7--thunderous-valkyrie-734960.netlify.app
6. Squarespace Domains (account.squarespace.com -> Domains -> roverram.com ->
   Nameservers) -> replaced the 4 squarespacedns.com with Netlify's 4 nsone.net.
7. Result: roverram.com = Primary domain (Netlify DNS); www auto-redirects to primary.
   Email verified working after switch.

Notes:
- Google Domains migrated to Squarespace Domains; DNS is managed at account.squarespace.com.
- SSL cert provisions automatically after DNS goes active (can take minutes to ~24h).
  While provisioning, browsers show "website is private" / "not secure" — wait it out.
- If cert stalls >24h: add a CAA record in Netlify DNS allowing letsencrypt.org / digicert.com.

## Optional upgrades (remaining)
- Add a real photo in the About section (replace placeholder box with <img>).
- Create a Google Business Profile for local SEO ("oil change Bellingham").
- Consider a small cost/margin tracker page.
