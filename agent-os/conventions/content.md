# Content Conventions

## Public Terminology

- "Work" is the public name for the portfolio/case-study section.
- TODO(Anuj): add terminology as sections are added (Writing, Lab, etc.).

## Frontmatter Rules

- Every project file needs `title`, `description`, and `sortOrder`.
- `draft: true` keeps an entry out of all public listings and routes. New
  case studies start as drafts until reviewed in the browser.
- Slugs come from the filename: `src/content/projects/my-project.md` becomes
  `/work/my-project`. Use short, kebab-case filenames.
- Images for a project live in `public/images/work/<slug>/`.

## Voice

TODO(Anuj): notes on tone, tense, and how case studies should read. For
example: first person, plain language, outcomes before process.

## Adding a New Collection

1. Define the schema in `src/content.config.ts`.
2. Add the content folder under `src/content/`.
3. Add routes under `src/pages/`.
4. Update `agent-os/system-map.md` (routes + content model) and this file
   (terminology).
