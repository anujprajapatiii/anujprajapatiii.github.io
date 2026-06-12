# Guide 1 — How to edit the UI and design

*Written for Anuj, who is not a developer. No coding knowledge assumed.*

## The one big idea

You never have to write code. This repo is built so that **Claude Code is
your developer** — your job is to describe what you want clearly, look at
the result, and say "yes" or "not quite, more like this." Everything is
saved in version history, so nothing you try is ever unrecoverable.

There are two ways to change the design:

1. **Tell Claude Code what you want** (works for everything — recommended)
2. **Edit a file yourself** (fine for tiny things like changing a word)

---

## Path 1: Tell Claude Code (recommended)

Open the Claude Code app, point it at this folder
(`~/Documents/GitHub/anujprajapatiii.github.io`), and describe the change.

### How to ask well

The quality of what you get back depends on how concrete your direction is.
Three levels, from weakest to strongest:

| Weak | Better | Best |
| --- | --- | --- |
| "Make it look nicer" | "Make the homepage feel warmer" | "Change the background to a warm off-white like #FAF6F0, and make headings bigger and bolder" |

Concrete things that always help:

- **Screenshots** — drop them into the `.reference/` folder in this repo
  and say "match the spacing in `.reference/my-screenshot.png`"
- **Links** — "I like how stripe.com does its footer"
- **Exact values** — a hex color (#1A1A2E), a font name (Söhne, Inter),
  "more space between sections"
- **What to leave alone** — "change only the homepage, don't touch Work"

### The review loop

Always ask Claude to **show you a preview before publishing**:

> "Show me a screenshot before you deploy."

Or look at it yourself: ask Claude to start the dev server (it runs
`corepack pnpm dev`), then open **http://localhost:4321** in your browser.
That's a private live preview on your machine — the public site doesn't
change until the change is pushed to GitHub.

When you're happy: *"Looks good, publish it."* The live site updates
itself about 1–2 minutes after every push (you can watch the progress under
the **Actions** tab on GitHub).

### Magic words for bigger design work

- **"Plan a design token session"** — this is the big one. The site's
  current look (colors, fonts) is a deliberate neutral placeholder. When
  you have your colors, fonts, and reference images ready, this session is
  where the site becomes *yours*. Bring: 2–3 sites you love, your brand
  colors if you have them, and a font direction.
- **"Update a color token"** — for one-off color changes; there's a
  built-in skill that keeps light mode, dark mode, and the style guide
  page consistent.

---

## Path 2: Edit it yourself (small changes only)

A map of where things live. Open files in any text editor (VS Code is
free), or even edit directly on github.com (pencil icon on any file).

| What you want to change | File |
| --- | --- |
| Your name, tagline, nav links, email | `src/data/site-config.ts` |
| Colors (light & dark mode) | `src/styles/global.css` — look for `--background`, `--accent`, etc. |
| Homepage text and sections | `src/pages/index.astro` |
| About page | `src/pages/about.astro` |
| Header / navigation bar | `src/components/layout/Header.astro` |
| Footer | `src/components/layout/Footer.astro` |
| Project cards (the tiles on Work) | `src/components/ProjectCard.astro` |

Rules of thumb for self-editing:

- **Text between tags is safe to change.** In `<h1>Anuj Prajapati</h1>`,
  the words are yours; the `<h1>` parts are structure — leave them.
- **Colors** live in `global.css` in a format called OKLCH. Easiest move:
  don't hand-edit these — ask Claude "change the accent color to [hex]"
  and it converts and updates dark mode too.
- **If something breaks**, don't panic. Tell Claude Code "the site looks
  broken after my last change, please fix it" — history has every working
  version.

## See the whole design system at a glance

The page **`/style-guide`** on your site (https://anujprajapatiii.github.io/style-guide)
shows every color, font size, and component in one place — in both light
and dark mode. Check it after any design change.

## What "design tokens" means (60-second version)

Instead of hard-coding "this button is blue" in fifty places, the site has
a short list of named decisions — `background`, `foreground` (text),
`accent` (links/highlights), `muted` (secondary text), `border` — each with
a light-mode and a dark-mode value. Change the token once, the whole site
follows. This is why one-sentence requests like "make the accent forest
green" work reliably.
