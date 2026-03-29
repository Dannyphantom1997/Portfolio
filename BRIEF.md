# Portfolio Website — Build Brief

## Project Overview

Build a personal portfolio website for a Calgary-based freelance videographer and self-taught front-end developer. The site needs to showcase both video work and coding projects in a unified, confident visual identity.

---

## Design Reference & Inspiration

- Primary inspiration: https://loket.design/
- Mirror its minimal, editorial feel: generous whitespace, large fluid typography, clean section flow, restrained layout, no clutter
- The site should feel like a creative studio portfolio — not a developer resume

---

## Colour System

Use these exact values as CSS custom properties:

```css
:root {
  --color-bg: #ede9e1;      /* off-white background — use as page background */
  --color-accent: #d5fe00;  /* acid yellow-green — use for headings, highlights, interactive elements */
  --color-dark: #181818;    /* near-black — use for body text, borders, nav */
  --color-mid: #888880;     /* mid-tone — use for labels, captions, secondary text */
}
```

Background is `#ede9e1` throughout. Headings and key labels use `#d5fe00`. Body copy and UI elements use `#181818`.

---

## Typography

Keep the same font stack as loket.design — `font-family: sans-serif` as the base. Use fluid vw-based sizing for headings (reference the loket.design CSS variables for scale). No custom Google Fonts — system sans-serif only.

Apply loket.design's exact typographic scale logic:

| Token   | Size         |
|---------|--------------|
| H1      | ~6.67vw      |
| H2      | ~4.44vw      |
| H3      | ~2.22vw      |
| Body    | ~1.11vw      |
| Labels  | ~1.04vw      |

---

## CSS Variable Reference (from loket.design)

```css
:root {
  --space-side-padding: calc(50 / 19.2 * 1vw);
  --font-s-h1: 6.6666666667vw;
  --font-lh-h1: 6.6666666667vw;
  --font-ls-h1: -.3125vw;
  --font-s-h2: 4.4444444444vw;
  --font-lh-h2: 4.8611111111vw;
  --font-ls-h2: -.1736111111vw;
  --font-s-h3: 2.2222222222vw;
  --font-lh-h3: 2.4vw;
  --font-ls-h3: -.0694444444vw;
  --font-s-h4: 1.3888888889vw;
  --font-lh-h4: 1.8055555556vw;
  --font-ls-h4: -.0347222222vw;
  --font-s-p1: 1.1111111111vw;
  --font-lh-p1: 1.5277777778vw;
  --font-ls-p1: 0vw;
  --font-s-label: 1.0416666667vw;
  --font-lh-label: 1.0416666667vw;
  --font-ls-label: .0138888889vw;
  --font-s-nav: 1.1111111111vw;
  --font-lh-nav: 1.5277777778vw;
  --font-ls-nav: 0vw;
  --font-s-button: 1.3888888889vw;
  --font-lh-button: 1.8055555556vw;
  --font-ls-button: -.0347222222vw;
}
```

---

## Site Structure

Single-page layout with the following sections:

### 1. Nav
- Name/logo left, links right (Work, Code, About, Contact)
- Fixed or sticky
- Dark text `#181818` on `#ede9e1` background

### 2. Hero
- Full-width, large H1 name + one-line descriptor
- Minimal — no hero image
- Heading in `#d5fe00`

### 3. Video Work
- Grid of video project cards
- Each card: project title, client/category label, thumbnail placeholder (16:9 ratio)
- 3–4 items

### 4. Coding Work
- Similar card grid for dev projects
- Each card: project name, tech stack tags, short description, live link + GitHub link

### 5. About
- Two-column layout: short bio paragraph left, sparse skills/tools list right

### 6. Contact
- Email address displayed large
- Social links: LinkedIn, GitHub, Instagram

### 7. Footer
- Minimal: name + year + location

---

## Interactions & Motion

- Subtle scroll-triggered fade-ins for sections (CSS only or minimal JS IntersectionObserver)
- Hover states on cards: slight scale or underline reveal — nothing heavy
- No cursor effects, no parallax, no full-page transitions
- Selection highlight:

```css
::selection {
  background: #d5fe00;
  color: #181818;
}
```

---

## Technical Requirements

- Vanilla HTML, CSS, JavaScript — no frameworks
- File structure: `index.html` + `style.css` + `main.js`
- Mobile responsive — stack to single column below 768px, switch typography from vw to rem at breakpoint
- No external dependencies except placeholder images (e.g. `https://picsum.photos/800/450`)
- Semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- All section IDs for smooth scroll nav

---

## Tone

Confident, editorial, unhurried. The site represents someone who shoots commercial video and builds real client websites — not a student project. Clean enough to show to any creative agency or studio on day one.

---

## Do Not

- No `border-radius` on cards — sharp corners only
- No gradients
- No box shadows (use 1px solid border instead if needed)
- No emoji in UI
- No purple, blue, or coral accent colours
- No Google Fonts or external font imports
- No framework boilerplate (React, Vue, etc.)

---

## Session Usage

Start each Claude Code session with:

> "Read BRIEF.md and continue building the portfolio site according to the spec."

This keeps context consistent across sessions without re-explaining the design system each time.
