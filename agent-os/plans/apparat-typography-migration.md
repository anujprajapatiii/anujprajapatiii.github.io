# Apparat Typography Migration

## Status

Complete

## Context

The site currently uses TASA Orbiter for reading and Violet Sans for the
display step. The supplied KMR Apparat family contains three browser-ready
static WOFF2 cuts—Light, Regular, and Medium—and should replace both families
across the live portfolio.

The font files identify their cuts correctly by name, but their embedded CSS
weight classes are unconventional. The implementation will therefore map the
named files deliberately instead of exposing those internal numbers directly.
The supplied files contain copyright metadata but no embedded licence text or
licence URL. Anuj supplied Kimera EULA V2.00 and confirmed purchase of the Web
License. Section 8.2 permits embedding the original font software through
`@font-face` on one Licensee-owned website domain, with the fonts stored on
that domain's server. Section 9 prohibits converting, modifying, or renaming
the font software. The implementation will therefore copy the original WOFF2
files byte-for-byte, retain their filenames, and serve them with the site.

## Desired Outcome

Apparat is the portfolio's only interface and reading typeface. Display and
titles feel lighter, body copy remains comfortable, headings and genuine
labels retain quiet emphasis, and no Violet Sans or TASA asset, preload, live
documentation, or checker rule remains in the active system.

## Approach

Self-host the three supplied WOFF2 files unchanged and map them to an
intentional CSS hierarchy:

- Apparat Light → 300 for display and title.
- Apparat Regular → 400 for body and meta.
- Apparat Medium → 500 for headings, wordmark, labels, table headers, and
  strong emphasis.

Keep the mature five-size scale, line heights, spacing, colours, and zero-
tracking rule unchanged for the first pass. This isolates the typeface change
and lets browser review reveal real metric or legibility issues rather than
mixing a redesign into the migration. Code remains in the existing system
monospace stack because it is semantic code, not portfolio typography.

Use one measured Arial fallback across the three Apparat cuts. The supplied
faces share the same 515/1000 x-height and 949/-249/100 vertical metrics, which
maps to a 99.3145% size adjustment, 95.5550% ascent, 25.0719% descent, and
10.0690% line gap. Preload the three cuts because every standard page uses
Light for its main title, Regular for navigation or reading, and Medium for
the wordmark or headings above the fold.

Design direction:

- Colour: unchanged semantic light, dark, and page-palette tokens.
- Type: one Apparat family with three authored roles; size leads at large
  scale and weight leads only when steps sit close together.
- Layout: preserve the current grid, measure, spacing, and responsive rules;
  only correct wrapping or clipping proven to come from the new metrics.
- Signature: the portfolio becomes typographically monolithic—Apparat's
  character carries the hero, navigation, cards, prose, and interface without
  a contrasting display face.

## Scope

In:

- Add the supplied Apparat Light, Regular, and Medium WOFF2 assets.
- Replace the active TASA and Violet `@font-face`, fallback, token, and preload
  configuration.
- Remap type-role weights from 400/500/600 to 300/400/500 and prevent
  synthesised weights.
- Update live typography documentation, the convention checker, repository
  guidance, and the style guide.
- Remove the retired TASA/Violet font and licence assets from the repository.
- Review homepage, Work, Experiments, a project page, and the style guide in
  light/dark and desktop/mobile states.
- Start or reuse the local Astro preview for review.

Out:

- Changes to the five type sizes, line-height system, tracking, colour,
  spacing, grid, copy, content, or shader behavior unless Apparat exposes an
  actual clipping defect.
- Rewriting completed plans or historical learning notes that accurately
  describe earlier states of the site.
- Replacing the monospace stack used for inline code and code blocks.
- Modifying, converting, renaming, subsetting, or sending Apparat through a
  third-party font host.

## Files To Modify

- `src/assets/fonts/`: add three Apparat WOFF2 files and remove retired
  TASA/Violet assets.
- `src/styles/global.css`: define Apparat, its measured fallback, the new
  family token, and the 300/400/500 role mapping.
- `src/layouts/BaseLayout.astro`: replace old font imports and conditional
  display preload with Apparat preloads.
- `src/layouts/PageLayout.astro`: remove the retired display-preload prop.
- `src/pages/index.astro`: remove the retired display-preload request.
- `src/pages/style-guide.astro`: document and render the Apparat hierarchy.
- `scripts/check-conventions.mjs`: enforce only the new authored weights.
- `agent-os/conventions/styling.md`: make Apparat the durable typography
  convention.
- `AGENTS.md`: update the cross-agent stack guidance.

## Steps

- [x] Add the Apparat webfont assets and measured fallback.
- [x] Collapse the reading/display split into one Apparat family.
- [x] Remap every type role and named treatment to 300/400/500.
- [x] Remove old assets, preload plumbing, and live TASA/Violet references.
- [x] Update the style guide, checker, conventions, and repository guidance.
- [x] Run convention checks and production build; inspect emitted font files
  and preload URLs for duplicate downloads.
- [x] Start the local preview for representative light/dark and desktop/mobile
  review; retain the unchanged scale so any follow-up can isolate font metrics.
- [x] Record verification and mark the plan complete.

## Review

- Design: One family now carries the whole portfolio. Light 300 replaces the
  former display split and also carries titles; Regular 400 carries reading;
  Medium 500 carries the close-range hierarchy. Sizes, leading, zero tracking,
  colour, spacing, and grid remain unchanged so this is a clean font migration.
- Content: Public copy is unchanged. The internal style guide now documents
  Apparat and its role mapping.
- Architecture: Three original static WOFF2 files replace the TASA variable
  face and Violet static face. Standard pages preload the exact three hashed
  assets used by `@font-face`; the former conditional display-preload prop is
  gone. The total original font payload is 141,976 bytes.
- Verification: `pnpm check` and `pnpm build` pass. SHA-256 comparison confirms
  the repository and emitted WOFF2 files are byte-identical to Kimera's source
  files. Built routes contain exactly three matching preload URLs, with no
  TASA/Violet output. Apparat covers all 102 unique rendered characters in the
  current static site. The local preview is running at `127.0.0.1:4322` for
  visual review.

## Learnings

Commercial webfonts need their delivery constraints recorded alongside the
technical type rules. For Apparat, legal and technical correctness align:
original WOFF2 files, `@font-face`, same-domain hosting, no conversion or
subsetting, and hashes checked through the final build. Static font families
can still be grouped into one CSS family without altering their binaries; the
`@font-face` descriptors deliberately map the authored Light/Regular/Medium
cuts to the site's 300/400/500 hierarchy.
