# LouisLibertyLLC.com

The website for Louis Liberty LLC. It's a plain static site (HTML, CSS and JavaScript) with no build step and no server. Any static host can serve this folder as is.

## What's where

| File | What it is |
|---|---|
| `index.html` | The whole page: text, sections, portfolio, contact form |
| `assets/css/styles.css` | All styling |
| `assets/js/main.js` | Gold particles, fade-in animations, Calendly booking widget, contact form |
| `assets/img/` | Logo and portfolio screenshots |
| `404.html` | "Page not found" page |
| `custom-website/` | Hidden flyer maker at /custom-website/ (not indexed by search engines). Design flyers in HTML and save them as 1080×1350 PNGs |
| `robots.txt`, `sitemap.xml`, `favicon.*`, `apple-touch-icon.png` | Search engine and browser-tab files |

## Common edits

- **Change wording:** edit the text in `index.html`.
- **Add a portfolio item:** copy one `<article class="card portfolio-card">` block in `index.html`, put the new screenshot in `assets/img/`, and update the image path and title.
- **Change the booking link:** edit `CALENDLY_URL` at the top of `assets/js/main.js`.

## Flyers (/custom-website/)

Each flyer is an `<article class="flyer-card">` block in `custom-website/index.html`. To make a new one, copy a block, change the text, and give its `.flyer` a new `data-filename`. The **Download** button saves it as a PNG at Facebook's feed size. The page has a `noindex` tag and isn't linked from the main site.

## Contact form

The form sends messages through [Web3Forms](https://web3forms.com), a free form-to-email service.

Submissions are emailed to info@louislibertyllc.com. The Access Key is set in `WEB3FORMS_ACCESS_KEY` at the top of `assets/js/main.js`. It's safe to be public, since it can only send to that one address. If it's ever removed, "Send Message" falls back to opening the visitor's email app with their message pre-filled.

## Preview locally

Open a terminal in this folder and run `python3 -m http.server`, then visit http://localhost:8000.
