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
| Content queries | Published filtering, recency, type filtering, and homepage curation | `src/lib/content/queries.ts`, `src/lib/content/project-types.ts` |
| Experiments | Published Play entries with shared detail routes, neutral media fallbacks, and optional live links or embeds | `src/content/play/`, `src/content.config.ts`, `src/pages/play/` |
| Interface primitives | Accessible shared controls, including Supported Buttons, Switch and Tabs; experiments retain their own state and page-specific composition, while Candidate components require live proof | `src/components/ui/`, `src/components/SwitchSpecimen.tsx`, `src/components/TabsSpecimen.tsx`, `src/styles/ui-controls.css`, `agent-os/conventions/experiment-interfaces.md` |
| Design tokens | Base color, type, spacing, and container tokens; light/dark appearance modes | `src/styles/global.css` |
| Page palettes | Authored per-page semantic colour remaps, independent of light/dark mode | `src/data/page-palettes.ts`, `src/styles/themes/`, layout palette props |
| Theme-aware media | Selects matched light and dark imagery while preserving shared layout and accessibility semantics | `src/components/ThemeImage.astro` |
| Layout primitives | One 1300px page container plus Section/Stack/Cluster and a typed 24-track Grid/GridItem system | `src/components/primitives/`, CSS in `src/styles/global.css` |
| Deployment | Static build published to GitHub Pages | `.github/workflows/deploy.yml` |
| Design exploration | Isolated worktree and branch workflow for comparing alternatives, selecting one, and cleaning temporary lab code before merge | `agent-os/conventions/design-exploration.md`, `agent-os/plans/design-exploration-template.md` |
| Pull-request review | Non-deploying convention, focused Tabs browser-behaviour, and production-build checks plus a human design-review checklist | `.github/workflows/checks.yml`, `tests/tabs.spec.ts`, `.github/pull_request_template.md` |
| Work orchestration | Strategy, plans, conventions, learnings | `agent-os/` |

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with intro and featured work |
| `/about` | Personal narrative and context |
| `/work` | Work index listing case studies |
| `/work/<slug>` | Case-study detail pages |
| `/play` | Experiments index |
| `/play/<slug>` | Experiment detail pages with optional live links and embeds |
| `/style-guide` | Internal design-system reference page |

## Content Model

Content collections are defined in `src/content.config.ts`. Public routes use
the typed query layer rather than calling `getCollection()` directly. Only
entries with `status: published` are rendered. `publishedAt` drives recency,
while `featured` and `featuredOrder` independently curate the homepage. Work
has one controlled primary type (`brand`, `campaign`, or `product`);
Experiments deliberately have no taxonomy. Both collections can opt into a
validated authored colour palette with the `palette` frontmatter field; the
default keeps the site palette.

Play entries can optionally link to or embed a live tool. The shared route
owns the page structure, content model, Apparat typography, semantic tokens,
and light/dark behavior around that authored content.

| Collection | Public route | Source |
| --- | --- | --- |
| Projects | `/work/<slug>` | `src/content/projects/*.{md,mdx}` |
| Play | `/play/<slug>` | `src/content/play/*.{md,mdx}` |

## Commands

```bash
pnpm dev       # local dev server at localhost:4321
pnpm build     # production build to dist/
pnpm preview   # preview the production build
pnpm test:switch # focused Chromium Switch behavior and geometry suite
pnpm test:tabs # focused Chromium behavior and scalability suite
```

## Change Workflow

`main` is the approved, deployable portfolio. Non-trivial changes start with an
approved plan and are developed on a separate branch. Design questions with
several alternatives use a Codex worktree, a short-lived exploration branch,
and a temporary `/lab/<topic>` comparison route. Only the selected direction
survives cleanup and review.

Pull requests into `main` run `.github/workflows/checks.yml`. The workflow
installs the locked dependencies, runs `pnpm check`, exercises the Supported
Switch and Tabs contracts in Chromium, and builds the production site without
deploying it. Temporary lab routes and rejected alternatives are removed
before the pull request is ready to merge.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow uses
`withastro/action@v3` to build and `actions/deploy-pages@v4` to publish to
GitHub Pages.

Pull requests do not deploy. They use `.github/workflows/checks.yml` to catch
convention, supported-component behavior, or production-build failures before
merge.

Before merging changes that affect routes, content schema, or layouts, run
`pnpm build`. For visual changes, also run `pnpm dev` and check the affected
route in a browser.
