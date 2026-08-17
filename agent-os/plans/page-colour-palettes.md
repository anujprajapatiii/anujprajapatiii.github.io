# Page Colour Palettes

## Status

Complete

## Context

The portfolio currently has one site palette with two appearance modes: light
and dark. Projects and experiments need an independent authored colour identity
without coupling that identity to the visitor's light/dark preference or
requiring component-level colour overrides.

The first use is a monochrome blue treatment for the Sample Case Study,
inspired by the supplied Notion developer-page reference: a pale blue canvas,
deep blue primary content, softer blue secondary content, and white/light-blue
elevated surfaces.

## Desired Outcome

- Light/dark remains a visitor-controlled appearance mode.
- A page can independently opt into an authored palette such as `blue`.
- The Sample Case Study uses the blue palette in both light and dark mode.
- Existing components inherit the page palette through their current semantic
  tokens; pages do not carry one-off colour classes.
- Adding a future palette has a small, documented contract: register its name,
  add one isolated semantic mapping file, and opt pages into it.

## Approach

- Treat **appearance mode** and **page palette** as separate axes:
  - `.dark` continues to represent light/dark mode and remains controlled by
    the existing toggle and OS preference.
  - `data-palette="<name>"` on `<html>` represents the page's authored palette.
- Add a typed palette registry shared by content validation and layout props.
  Use `default` and `blue` initially; unknown frontmatter values fail the
  content build rather than silently falling back.
- Add optional `palette` frontmatter to the shared case-study schema. Project
  and Play detail routes pass it through `PageLayout` to `BaseLayout`; ordinary
  Astro pages can pass the same prop directly.
- Keep the base canonical token contract stable. The blue palette lives in its
  own CSS file and remaps general background, text, icon, border, interaction,
  shader, and decorative roles for both light and dark.
- Preserve error, success, warning, and info roles as semantic status colours.
  The monochrome treatment governs the page shell and content rather than
  erasing meaningful state distinctions.
- Use the blue primitive ramp rather than raw colours. The initial 100–600
  family supported the light mode; review then justified extending it through
  900 so the dark mode could have genuinely deep blue canvases and surfaces.

## Scope

In:

- A reusable, type-safe page-palette mechanism.
- A self-contained blue light/dark semantic mapping.
- Blue palette applied to `sample-case-study.md` only.
- Palette support for both Work and Play detail templates.
- Style-guide, styling-convention, and system-map documentation.
- Contrast, responsive, light/dark, and production-build verification.

Out:

- A visitor-facing palette selector; visitors continue to choose only light or
  dark mode.
- Applying blue to the Work index, project cards, or any other project.
- Layout, typography, content, image, or component redesigns.
- Copying the Notion page's navigation, illustration, or page structure.
- Section-level palettes inside one page.

## Files To Modify

- `src/data/page-palettes.ts`: typed registry for valid authored palettes.
- `src/content.config.ts`: optional validated `palette` field for case studies.
- `src/layouts/BaseLayout.astro`: render the page palette on `<html>`.
- `src/layouts/PageLayout.astro`: accept and forward the palette prop.
- `src/pages/work/[...slug].astro`: forward project palette data.
- `src/pages/play/[...slug].astro`: forward experiment palette data.
- `src/content/projects/sample-case-study.md`: opt the sample project into
  `blue`.
- `src/styles/themes/blue.css`: blue semantic mappings for light and dark.
- `src/styles/global.css`: import the page-theme mapping layer.
- `src/pages/style-guide.astro`: document available page palettes and the
  mapping model.
- `agent-os/conventions/styling.md`: record the mode/palette separation and
  theme authoring rules.
- `agent-os/system-map.md`: include the page-palette subsystem and source files.

## Steps

- [x] Add the typed palette registry and schema field.
- [x] Pass palette identity through the shared layouts and both detail routes.
- [x] Add the isolated blue light/dark semantic mappings.
- [x] Apply `palette: blue` to the Sample Case Study.
- [x] Document the system in the style guide and durable project conventions.
- [x] Run the convention checker and production build.
- [x] Review the Sample Case Study in light and dark, including contrast,
  theme-toggle behaviour, horizontal overflow, and responsive-layout risk.

## Review

- Design: Browser review confirmed a pale-blue light canvas with deep-blue
  content and a separately authored deep-blue dark canvas with pale content.
  The supplied reference informed tonal hierarchy only; layout and type remain
  the portfolio's own.
- Content: A repository audit confirmed the Sample Case Study is the only
  content entry with `palette: blue`.
- Architecture: Generated HTML emits `data-palette="blue"` for Sample and
  `data-palette="default"` for control pages. Components remain unaware of
  palette names and continue to consume their existing semantic tokens.
- Verification: The 14-rule convention checker passed across 32 source files,
  the 15-page Astro production build passed, and the blue mapping contains no
  literal colours. Measured title/reading contrast is 11.24:1/11.24:1 in light
  and 15.70:1/9.90:1 in dark. Browser checks found no console errors
  or horizontal overflow, the light/dark toggle preserved the blue palette,
  and an Atlas control page retained the default palette. The browser's
  temporary phone-width override remained at its default dimensions; the new
  theme stylesheet contains custom-property remaps only and therefore changes
  no responsive geometry.

## Learnings

Updated `agent-os/conventions/styling.md` and `agent-os/system-map.md`. No
separate learning note was needed: the durable rule is the documented split
between visitor-controlled appearance mode and authored page palette.

## Follow-up — Extended Blue Ramp

Anuj requested a deeper blue range after reviewing the first implementation.

- [x] Extend the blue primitive family from 100–600 to 100–900.
- [x] Use the darker stops for blue-theme solid/hover roles in light mode.
- [x] Move the blue dark-mode canvas, surfaces, disabled states, and borders
  onto the extended range.
- [x] Re-run contrast, build, and light/dark browser verification.

The added stops are `blue-700 #001d64`, `blue-800 #001147`, and
`blue-900 #00062a`. The dark canvas now uses 900, elevated/secondary surfaces
use 800, and interactive lifts move through 700. Light mode keeps its pale
canvas and uses the deeper stops for solid and hover roles.

## Follow-up — Dark Reading Refinement

After reviewing the deeper dark mode, Anuj requested a quieter, fully
monochrome reading hierarchy.

- [x] Remove near-white text and neutral-white hover mappings from blue dark.
- [x] Separate primary/title text from long-form reading text semantically.
- [x] Move dark borders onto the quieter 700–800 end of the ramp.
- [x] Pull Shiki code blocks back into the monochrome semantic palette.
- [x] Re-run contrast, build, and light/dark browser verification.

Dark titles and primary controls now use blue-200, while long-form body and
secondary text use blue-300. Resting borders use blue-700 and hover borders use
blue-600 against the blue-900 canvas. Shiki's inline grey theme is overridden
only in blue dark mode, using blue-800 for its surface and blue-300 for code
text. Light-mode computed colours remain unchanged.
