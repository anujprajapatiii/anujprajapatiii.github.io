# Interaction Anatomy Experiment

## Status

Implemented

## Context

The Codex task **Portfolio Experiments** produced a finished standalone
interactive lesson in
`/Users/anujprajapati/Documents/ChatGPT/Cursor Teardown/`. Its final artifact
is no longer the early Cursor grid specimen: it is a responsive, accessible
web page called “Inside an Interactive Product Demo” that lets someone inspect
the stage, phone shell, screen, state, input events and motion of a small AI
chatbot.

The experiment currently lives outside the portfolio, has no public portfolio
route, and cannot participate in the typed content collection. Its state model
and interactions are valuable, but its standalone page shell and independent
visual system should not be copied into the portfolio cascade unchanged.

## Desired Outcome

- The experiment appears as a published entry on `/play` and has a native
  detail page at `/play/interaction-anatomy`.
- Its public title follows the two-word content rule: **Interaction Anatomy**.
- Its card description is short and concrete: **See how state turns actions
  into interface.**
- The working lesson is rebuilt as a native portfolio component rather than
  depending on another repository, deployment or iframe.
- The detail page uses the portfolio shell, metadata table, typography,
  spacing, prose and light/dark appearance behavior.
- The lesson inherits Apparat, the semantic colour system, spacing, square
  corners, surface hierarchy and light/dark modes.
- The interaction remains self-contained as a React island and works locally,
  on GitHub Pages, at desktop and phone widths.

## Approach

Rebuild the source as a native React island inside the shared experiment page:

1. Translate the source state machine, chat interaction, lesson tabs,
   annotations, playback and event log into a typed `InteractionAnatomyLab`
   component. React is appropriate here because the artifact is stateful;
   Astro still owns the surrounding static page.
2. Keep the component visually scoped, but map every colour, type, spacing,
   border and motion decision to the portfolio's semantic tokens. A small set
   of `--lab-*` aliases may clarify component roles, but each alias must resolve
   to an existing system token.
3. Place the component at full content width between the experiment header and
   its prose. The detail page remains responsible for title, metadata,
   navigation, light/dark appearance and reading layout.
4. Preserve the source's six layers and four app states. The annotation ring
   and connector are the one expressive device; all other surfaces stay quiet
   and square in the portfolio convention.
5. Add one optimized, browser-captured thumbnail for the Experiments index.
   The live component is the detail-page hero, so no redundant hero image is
   added.
6. Add concise native case-study copy explaining the layers, state loop, and
   implementation decisions.

## Scope

In:

- New published experiment: `Interaction Anatomy`.
- Native, typed React interaction component and scoped token-driven styles.
- Existing canvas texture, optimized and stored with the experiment assets.
- An explicit typed content flag that lets the shared Play route render this
  approved interactive component at full width.
- One optimized Experiments-index thumbnail.
- Native experiment prose, role, skills and publication metadata.
- Desktop, tablet, phone, keyboard, reduced-motion and interaction review.

Out:

- A separately deployed or iframe-hosted copy of the source artifact.
- Preserving the source's independent Apple-style palette, typography, rounded
  cards or page shell.
- Rewriting the already-approved lesson copy or interaction model.
- Homepage featuring or three-frame homepage previews. Homepage curation stays
  unchanged until Anuj explicitly chooses which existing item it should
  replace in the five-row preview.
- Changes to the other embedded experiments.

## Files To Modify

- `public/images/play/interaction-anatomy/canvas-texture.webp`: optimized
  authored texture used by the native stage.
- `public/images/play/interaction-anatomy/thumbnail.webp`: optimized index
  thumbnail captured from the final local render.
- `src/components/InteractionAnatomyLab.tsx`: native state, behavior and
  accessible interaction structure.
- `src/components/interaction-anatomy-lab.css`: scoped semantic-token styling,
  responsive composition and motion.
- `src/content/play/interaction-anatomy.md`: typed experiment metadata and
  native explanatory prose.
- `src/content.config.ts`: validate the explicit native experiment component.
- `src/pages/play/[...slug].astro`: render the native lab at full width for the
  matching typed entry.
- `agent-os/conventions/content.md`: document native experiment components.
- `agent-os/system-map.md`: record native interactive experiments as a Play
  content source.
- `agent-os/plans/interaction-anatomy-experiment.md`: implementation and review
  record.

## Steps

- [x] Port the source's state, lesson, chat, annotation, playback and logging
  behavior into a typed React island.
- [x] Translate the source visuals to Apparat and the portfolio semantic tokens
  without raw colour values or an independent component palette.
- [x] Add the explicit content flag and render the native lab at full width in
  the shared Play route.
- [x] Copy and optimize the existing texture without importing source Git
  history.
- [x] Add the draft `Interaction Anatomy` content entry and native case-study
  prose.
- [x] Render the native page locally and capture/optimize one representative
  thumbnail.
- [x] Verify every lesson tab, state control, chat send, playback, reset and
  annotation state in the native component.
- [x] Review the portfolio route in light/dark at desktop, tablet and phone
  widths, including keyboard navigation and reduced motion.
- [x] Publish the entry only after browser review passes.
- [x] Run `pnpm check`, `pnpm build` and `git diff --check`.
- [x] Update content conventions and the system map, then record final review
  findings here.

## Review

- Design: The lab reads as part of the portfolio rather than an embedded second
  site. Apparat, square edges, surface depth and semantic colours stay coherent
  in both appearance modes.
- Content: Title/description obey the two-word/eight-word rules, and prose adds
  context instead of repeating the live lesson.
- Accessibility: The tablist, controls, focus styles, announcements and
  reduced-motion behavior remain intact.
- Architecture: React owns only the stateful artifact; Astro owns the route,
  content and shared shell. Component CSS stays scoped and semantic.
- Verification: No horizontal overflow, broken asset, browser error, hydration
  error or regression to existing experiments.

### Findings

- The six lesson tabs, arrow-key tab navigation, annotation switch, four state
  controls, previous/next actions, live chat response, automatic playback and
  reset all passed in the hydrated route.
- Light and dark modes preserve the shared surface ladder and text hierarchy.
  The phone is intentionally framed with the muted semantic rule rather than
  the high-contrast inverse surface, which keeps dark mode comfortable.
- Desktop and the 390px phone layout have no horizontal overflow. The guide
  stacks below the stage, while the annotation ring remains visible and the
  larger connector/callout withdraw on the narrow layout.
- The browser reported no warnings or errors. `pnpm check`, `pnpm build`, and
  `git diff --check` all passed.

## Learnings

Update the content convention and system map because this establishes the
durable native-interactive experiment pattern: an explicit typed content flag,
a focused React island, and static Markdown prose around it. No separate learning
note is expected unless the implementation reveals a reusable constraint not
captured by the convention.
