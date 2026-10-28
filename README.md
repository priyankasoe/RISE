# RISE website

Website for the Robotics & Intelligent Systems Expo (RISE), run by the Autonomous Robotics Club of Purdue. RISE 3 is on Friday, December 4, 2026, at Stewart Center, Purdue University.

Built with React 19, React Router 7 and Vite 5. Plain CSS, no UI framework. The ASCII effects come from [`asciify-engine`](https://asciify.org).

## Setup

You need Node.js 20 or newer.

```sh
npm install
npm run dev       # local dev server at http://localhost:5173
npm run lint      # ESLint
npm run build     # production build in dist/
npm run preview   # serve the built dist/ locally
```

## Project structure

```
index.html                meta tags (filled in from src/data/event.js at build time), fonts
vite.config.js            the meta-tag plugin and the React vendor chunk
public/favicon.svg
src/
  data/event.js           date, venue, address, email, Instagram, nav links
  data/photos.js          past-event photo list for the "RISE so far" gallery
  data/trackArt.js        drawings for the Workshops challenge tracks
  assets/icons/           envelope and Instagram icons (Font Awesome Free)
  components/             Layout, Navbar, Footer, PageHeader and shared hooks
  pages/                  one file per route; Lab.jsx is a developer-only demo
  index.css               all site styles; colors, fonts and spacing are variables at the top
```

## Updating event details

Everything about the event lives in `src/data/event.js`: name, year, date, venue, address, email, Instagram and the nav links. Pages, page titles, the footer and the meta tags in `index.html` all read from it, so changing a value there updates the whole site. After changing it, run `npm run build` and check `dist/index.html`.

## Updating page content

Page text is in `src/pages/`. Some pages have lists at the top of the file that stay empty until details are confirmed. Fill them in and the page switches over on its own:

| File | Constant | When filled in |
|------|----------|----------------|
| `Schedule.jsx` | `SCHEDULE` | Shows a timed schedule instead of the "What's planned" list |
| `Speakers.jsx` | `SPEAKERS` | Shows the speaker list instead of the "being confirmed" message |
| `Sponsors.jsx` | `SPONSORS` | Shows a grid of sponsor logos |
| `Sponsors.jsx` | `TIERS_CONFIRMED` | Set to `true` to publish the sponsorship level table |

Please don't add placeholder names, logos or times. If something isn't confirmed, leave it out.

## Photos and icons

There are no photos from past events in the repo yet.

1. Use original photos from the organizers, not images cropped out of the sponsorship PDFs.
2. Export them as WebP (`cwebp -q 82 in.jpg -o out.webp`), around 1600px wide.
3. Put them in `public/images/events/` with descriptive names, like `rise-2024-quadruped-demo.webp`.
4. Add them to `GALLERY` in `src/data/photos.js` with their real width and height and alt text that describes the photo. The "RISE so far" gallery appears once the list isn't empty.

Icons are SVG files in `src/assets/icons/`, inlined by `src/components/Icon.jsx` so they take the text color. To add one, drop the SVG in that folder and add it to the `ICONS` map.

## How the ASCII effects are organized

All effects use the `asciify-engine` kit (`import { … } from 'asciify-engine/kit'`). Its documentation ships with the package: see `node_modules/asciify-engine/skills/asciify-engine/` (start with `references/components.md` and `references/kit.md`).

- **Mounting:** each effect is created in a React effect and destroyed on unmount. `src/components/useKit.js` does this for single effects. The kit pauses effects that are off screen, honors reduced motion, and falls back to the plain HTML without WebGL.
- **Cursor:** one site-wide cursor trail is mounted in `Layout.jsx`. Elements with their own pointer effects (the hero, the ocean, interactive page headers, the footer wordmark, the 404, the globe) are listed in `OWN_POINTER` there so the trail stays out of their way.
- **Headings:** page titles decode in through `useDecodeHeading.js`, which crossfades from the character version to the real text. Nav links, button labels and the home program titles scramble on hover through `scramble.js`.
- **Backgrounds:** page header fields are set by the `preset` prop on `PageHeader`. `textClear.js` keeps a background quiet only behind each line of text.
- **First screen:** `useFoldFit.js` adjusts spacing on inner pages so nothing is cut in half by the bottom of the first screen.
- **Lab:** `/lab` is a developer-only page (not linked anywhere) with kit components the site doesn't use yet. It loads separately from the rest of the site.

## Deployment

There's no deployment config in this repo. `npm run build` produces a static site in `dist/` that any static host can serve.

The site uses `BrowserRouter`, so the host has to send every path to `index.html`, or loading `/schedule` directly will 404. On Netlify or Vercel that's a one-line rewrite rule. GitHub Pages doesn't support rewrites; the usual workaround is copying `dist/index.html` to `dist/404.html` after building.

A `CNAME` file for `www.purduerise.org` was added and then removed in April 2026, and the sponsorship packet lists `risexpo.org`. Confirm which domain is live before adding one back.
