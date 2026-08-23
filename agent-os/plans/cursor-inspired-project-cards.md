# Cursor-Inspired Project Cards

## Status

Archived — interaction model superseded by `whole-card-project-interaction.md`

## Context

The shared portfolio card is currently one large anchor: media first, then a
20px title and 16px description. Its surface, rule, title, and description all
lift together on hover. That makes the entire card feel like a large button.

Cursor's current "Stay on the frontier" cards use a different hierarchy. The
card is a quiet, borderless surface rather than the link itself. Copy comes
first, media comes last, and a dedicated inline CTA is the only navigational
element and the only element whose hover treatment changes. At the inspected
desktop breakpoint, both title and body use the same 16px / 24px regular type;
primary versus secondary colour carries their hierarchy.

The named section currently lives on `https://cursor.com/`, although the
original brief linked the enterprise route.

## Desired Outcome

Homepage featured cards and the Work and Play listing cards share one
Cursor-inspired anatomy while remaining native to this portfolio's tokens:

- quiet borderless card surface;
- copy first and media last;
- title and description both use the existing `text-body` role, separated by
  primary and secondary colour rather than size or local weight;
- a dedicated CTA link is the only link in the card;
- only the CTA changes on hover/focus/press; the card surface, media, title,
  and description remain still;
- CTAs remain unambiguous to assistive technology even where their visible
  labels repeat.

## Approach

Refactor `ProjectCard` from an outer anchor to a semantic card container. Put
the heading and description in a copy group, follow them with a dedicated
`View case study →` or `View experiment →` link, then place the media at the
bottom. Let the copy group grow so CTA and media edges align across cards with
different description lengths.

Use only existing semantic colour and spacing tokens. Keep the site's square
corners. Remove the card from the global interaction list and delete its
surface/rule/text lift declarations. Add the CTA itself to the shared
interaction mechanism so keyboard, press, and pointer states stay consistent
without making the card a full hover target.

Give the inset media its own semantic border now that the outer card no longer
has one. Preserve the existing 5:3 media ratio and responsive grid spans.

## Scope

In:

- Shared project/experiment card used by Homepage Featured Projects, Work,
  and Play listing grids.
- Card typography roles, copy/media order, CTA labels, accessible link naming,
  surface treatment, and link-only interaction.
- Light and dark theme verification.
- Style-guide and styling-convention documentation for the new card anatomy.

Out:

- Homepage Experiments preview rows in `PlayPreviewList`; their whole-row
  interaction drives the adjacent preview pane and is not the shared card.
- Case-study page layouts or content.
- New colour, spacing, type, radius, or motion tokens.
- Changes to project thumbnails or project copy.

## Files To Modify

- `src/components/ProjectCard.astro`: change the semantic/link structure,
  type roles, CTA label, and media order.
- `src/styles/global.css`: implement the borderless surface, flexible internal
  layout, media border, and CTA-only interaction; remove whole-card lift rules.
- `src/pages/style-guide.astro`: update the card/surface specimen so the
  documented system matches production.
- `agent-os/conventions/styling.md`: record the durable card hierarchy,
  typography, and interaction boundary.
- `agent-os/plans/cursor-inspired-project-cards.md`: track implementation and
  review status.

## Steps

- [x] Refactor `ProjectCard` into a non-link card container with copy, CTA,
  and media regions.
- [x] Apply `text-body` to title and description; use semantic primary and
  secondary colour for hierarchy.
- [x] Add context-aware visible CTA copy for Work versus Play and a unique
  accessible label containing the item title.
- [x] Rebuild card CSS around a borderless surface, inset bordered media, and
  equal-height internal alignment.
- [x] Remove `.project-card` from the shared interaction selector and delete
  the whole-card lift values; wire only `.project-card__link` into it.
- [x] Update the style guide and styling convention.
- [x] Run convention checks and production build.
- [x] Review Home, Work, and Play in light and dark modes; audit the existing
  mobile grid rules and verify the interaction and link target boundaries.

## Review

- Design: The implemented card matches the reference anatomy: copy first,
  dedicated CTA, inset media last, borderless outer surface, and no card-wide
  lift. Portfolio semantic colours and square corners remain intact.
- Content: Work cards read `View case study`; Play cards read `View
  experiment`. Each repeated visible label has a unique accessible name that
  includes the item title.
- Architecture: One shared component still serves the existing Home, Work,
  and Play 24-track grids; no page-specific variant was introduced.
- Verification: `pnpm check` and `pnpm build` pass. Browser review covered
  Home, Work, and Play in light and dark themes; the unchanged base grid span
  keeps cards single-column below the tablet breakpoint. Computed styles
  confirm a 16px / 24px / 400 title and body, a borderless outer card, a 1px
  media rule, and exactly one anchor per card.

## Learnings

The durable rule now lives in `agent-os/conventions/styling.md`: a card surface
is not automatically an interaction target. Repeated visible CTA labels need
item-specific accessible names when the card title is no longer inside the
anchor.
