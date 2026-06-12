# System Map

This is the operating map for Anuj Prajapati's personal website. It explains
how the site fits together and where to look before changing something. It
should grow as the system grows — update it when routes, subsystems, or
workflows change.

## Subsystems

| Area | What it does | Source of truth |
| --- | --- | --- |
| Public site shell | Shared layout, navigation, footer, theme, metadata | `src/layouts/`, `src/components/layout/`, `src/data/site-config.ts` |
| Work | Portfolio/case-study section at `/work` | `src/content/projects/`, rendered through `/work` routes |
| Design tokens | Color, type, radius tokens for light and dark mode | `src/styles/global.css` |
| Deployment | Static build published to GitHub Pages | `.github/workflows/deploy.yml` |
| Work orchestration | Strategy, plans, conventions, learnings | `agent-os/` |

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with intro and featured work |
| `/about` | Personal narrative and context |
| `/work` | Work index listing case studies |
| `/work/<slug>` | Case-study detail pages |
| `/style-guide` | Internal design-system reference page |

## Content Model

Content collections are defined in `src/content.config.ts`. Drafts must be
filtered before public rendering.

| Collection | Public route | Source |
| --- | --- | --- |
| Projects | `/work/<slug>` | `src/content/projects/*.{md,mdx}` |

## Commands

```bash
pnpm dev       # local dev server at localhost:4321
pnpm build     # production build to dist/
pnpm preview   # preview the production build
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow uses
`withastro/action@v3` to build and `actions/deploy-pages@v4` to publish to
GitHub Pages.

Before merging changes that affect routes, content schema, or layouts, run
`pnpm build`. For visual changes, also run `pnpm dev` and check the affected
route in a browser.
