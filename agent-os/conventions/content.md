# Content Conventions

## Public Terminology

- "Work" is the public name for the portfolio/case-study section.
- "Experiments" is the public name for the existing Play collection and
  `/play` route. Keep the internal collection and URL stable; only the visible
  label uses Experiments.
- TODO(Anuj): add terminology as sections are added (Writing, Lab, etc.).

## Frontmatter Rules

- Every entry needs `title`, `description`, `status`, and `publishedAt`.
- `status` is `draft`, `published`, or `archived`. Only `published` content is
  included by the public query helpers and static routes. New entries start as
  drafts until reviewed in the browser.
- Write `publishedAt` as `YYYY-MM-DD`. Pages derive the display year from this
  date; do not add a separate `year` field.
- Slugs come from the filename: `src/content/projects/my-project.md` becomes
  `/work/my-project`. Use short, kebab-case filenames.
- Images for a project live in `public/images/work/<slug>/`.
- Image references live under `media.thumbnail` and `media.hero`.

## Work Types

- Every Work entry has exactly one primary `type`: `brand`, `campaign`, or
  `product`.
- Types are stable IDs defined with their display labels in
  `src/lib/content/project-types.ts`.
- Do not add tags, topics, disciplines, or multiple types to approximate
  nuance. The body, role, and skills can describe it without becoming filter
  dimensions.
- Add a new type only when several real projects need it and a reader would
  benefit from filtering by it.
- Experiments have no type system until their real content demonstrates a
  durable need for one.

## Homepage Curation

- `featured: true` makes published content eligible for the homepage.
- Every featured entry needs a unique positive `featuredOrder` within its
  collection.
- Publication recency and homepage narrative order are independent. Do not
  reintroduce a general collection-wide `sortOrder`.

## Content Queries

- Public pages use the typed helpers in `src/lib/content/queries.ts`.
- Keep `getCollection()`, publication filtering, sorting, limits, and featured
  validation inside that query layer rather than repeating them in routes.
- Supported orderings are intentionally limited to newest, oldest, and
  curated.

## Voice

TODO(Anuj): notes on tone, tense, and how case studies should read. For
example: first person, plain language, outcomes before process.

## Adding a New Collection

1. Define the schema in `src/content.config.ts`.
2. Add the content folder under `src/content/`.
3. Add typed public queries under `src/lib/content/`.
4. Add routes under `src/pages/`.
5. Update `agent-os/system-map.md` (routes + content model) and this file
   (terminology).
