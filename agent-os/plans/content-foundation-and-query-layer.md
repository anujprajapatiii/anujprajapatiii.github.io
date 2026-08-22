# Content Foundation and Query Layer

## Status

Complete

## Context

Work and Experiments already use Astro content collections, but each page
currently repeats its own draft filtering, `sortOrder` sorting, and slicing.
The shared schema also mixes universal case-study fields with
Experiment-specific preview and embed fields. This is manageable at the
current size, but it makes future sorting, filtering, and homepage curation
more fragile than they need to be.

The content model should mature without becoming a tag system. The agreed
foundation is deliberately small: one publication state, one publication
date, one primary Work type, and an explicit featured order.

## Desired Outcome

- Work supports predictable filtering by one primary type: `brand`,
  `campaign`, or `product`.
- Work and Experiments support deterministic newest, oldest, and curated
  ordering from authored data rather than page-local rules.
- Homepage curation is explicit and independent from publication recency.
- Pages consume centralized, typed content queries instead of duplicating
  collection logic.
- Work and Experiments share only genuine fundamentals while keeping their
  specialized fields separate.
- Existing public routes, content, palettes, embeds, and visual presentation
  continue to work.

## Approach

### 1. Minimal shared content foundation

Create a shared Zod base with:

- `title`
- `description`
- `status`: `draft | published | archived`
- `publishedAt`: required date used for chronological sorting and display year
- `featured`: boolean, default `false`
- `featuredOrder`: optional number, valid only for featured items
- `media`: optional nested `thumbnail` and `hero` paths
- `palette`

Keep `role` and `skills` as optional display metadata. They do not participate
in filtering.

### 2. Specialized collection schemas

- Projects extend the base with one required `type`: `brand`, `campaign`, or
  `product`.
- Experiments extend the base with `previews`, `liveUrl`, `embedUrl`, and
  `embedOnPhone`.
- Experiments do not receive a type system until real content demonstrates a
  useful need for one.

### 3. Central query layer

Add typed content helpers that own publication filtering and ordering:

- `getPublishedProjects({ type?, sort?, limit? })`
- `getFeaturedProjects(limit?)`
- `getPublishedExperiments({ sort?, limit? })`
- `getFeaturedExperiments(limit?)`

Supported sorting remains intentionally small:

- `newest`: `publishedAt` descending
- `oldest`: `publishedAt` ascending
- `curated`: `featuredOrder` ascending

Every comparator receives a stable final tie-breaker from the content ID so
build output never depends on filesystem order.

Featured queries should fail clearly during the build if an included item has
no `featuredOrder` or two items use the same position.

### 4. Migrate existing content

- Replace `draft` with `status`.
- Replace `year` with `publishedAt`; detail pages derive the displayed year
  from the date.
- Replace general `sortOrder` with homepage-specific `featured` and
  `featuredOrder` where an item belongs on the homepage.
- Move `thumbnail` and `heroImage` into `media`.
- Assign current Work examples:
  - Northwind Rebrand: `brand`
  - Lantern Campaign: `campaign`
  - Atlas Onboarding: `product`
  - Sample Case Study: `product`
- Preserve the current homepage sequences with `featuredOrder` during the
  migration. Existing year-only placeholders receive a neutral date within
  their authored year; ordering ties are resolved deterministically rather
  than inventing unsupported chronology.

### 5. Move pages onto the query layer

- Homepage asks for featured Work and featured Experiments.
- `/work` asks for all published projects, newest first.
- `/play` asks for all published experiments, newest first.
- Dynamic detail routes ask for published content through the same shared
  publication rule.
- Components read the nested media object through page props; their visual API
  can remain flat where that keeps presentation components simple.

## Scope

In:

- Minimal shared base schema and separate Project/Experiment extensions.
- Initial Work types: Brand, Campaign, Product.
- Status, publication date, featured curation, and nested media fields.
- Central typed query and sorting helpers.
- Migration of all existing Work and Experiment frontmatter.
- Homepage, index, and detail routes migrated to the query helpers.
- Build-time validation for invalid or duplicate featured positions.
- Documentation updates for the content model and authoring workflow.

Out:

- Tags, topics, disciplines, or multi-select taxonomies.
- Interactive filtering or sorting UI.
- Search, pagination, related-project recommendations, or analytics.
- A CMS or external database.
- New project or experiment content.
- Route renaming (`/work` and `/play` remain unchanged).
- Any visual redesign of the homepage, listings, cards, or detail pages.
- Deleting current content or media assets.

## Files To Modify

- `src/content.config.ts`: define the shared base and specialized collection
  schemas.
- `src/lib/content/project-types.ts`: own the three stable type IDs and display
  labels.
- `src/lib/content/queries.ts`: centralize publication, filtering, curation,
  sorting, and cross-entry validation.
- `src/content/projects/*.{md,mdx}`: migrate Work frontmatter and assign types.
- `src/content/play/*.{md,mdx}`: migrate Experiment frontmatter and homepage
  curation.
- `src/pages/index.astro`: replace page-local collection queries with featured
  helpers.
- `src/pages/work/index.astro`: use the published Work query.
- `src/pages/play/index.astro`: use the published Experiments query.
- `src/pages/work/[...slug].astro`: use the shared publication rule and new
  date/media fields.
- `src/pages/play/[...slug].astro`: use the shared publication rule and new
  date/media fields.
- `agent-os/system-map.md`: document the query layer as the path between
  content collections and public routes.
- `agent-os/conventions/content.md`: document the minimal frontmatter contract
  and the rule for adding a future project type.
- `agent-os/conventions/architecture.md`: make the shared query layer the
  required route for public content access.
- `AGENTS.md`: replace the retired `data.draft` guidance with the durable query
  layer rule.

## Steps

- [x] Add controlled project types and their display labels.
- [x] Refactor the content schema into a shared base plus Project and
  Experiment extensions.
- [x] Add deterministic content query and sorting helpers.
- [x] Migrate all Project and Experiment frontmatter.
- [x] Replace homepage, index, and detail page collection calls with the query
  helpers.
- [x] Update system and content documentation.
- [x] Run `pnpm check` and `pnpm build`.
- [x] Review the homepage, `/work`, `/play`, and representative detail routes
  in light and dark modes.

## Review

- Design: Homepage curation remains Sample, Northwind, Atlas, Lantern for Work
  and Weathering, Voxel, Type Specimen, Monsoon, Generative Grid for
  Experiments. Light and dark treatments remain intact.
- Content: All ten entries have a required status and publication date. All
  four Work entries have exactly one valid type; Experiments have none.
- Architecture: Only `src/lib/content/queries.ts` calls `getCollection()`.
  Public routes contain no publication filters, ad hoc ordering, or collection
  limits.
- Verification: `pnpm check` and `pnpm build` pass. Browser review covered `/`,
  `/work`, `/play`, `/work/sample-case-study`, and `/play/weathering`, including
  the Weathering live embed and a dark-mode homepage pass.

## Learnings

Updated `agent-os/conventions/content.md`,
`agent-os/conventions/architecture.md`, `agent-os/system-map.md`, and
`AGENTS.md`. No separate learning note is needed; the reusable rules are now
captured in the durable conventions.
