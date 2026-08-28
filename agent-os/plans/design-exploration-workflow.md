# Design Exploration Workflow

## Status

Planned

## Context

Portfolio design explorations currently happen in the local checkout and can
accumulate directly on `main`. That makes it harder to compare several valid
directions, keep unfinished work away from the live site, or return to a known
good state without developer-level Git knowledge.

The repository already has the foundations for a safer workflow: Git, Codex
worktrees, an internal style guide, design-system checks, and deployment that
runs only from `main`. The missing piece is a small, documented review path
that connects those tools.

## Desired Outcome

Anuj can open one design question, explore several alternatives side by side,
review them in realistic states, choose a direction, and merge only the chosen
implementation. Unfinished or rejected directions never alter the live site,
and the process remains understandable without memorising Git commands.

## Approach

Use one worktree and one short-lived branch per design question. Build multiple
alternatives together on a temporary comparison page inside that worktree,
using real content and existing design tokens. Save work with commits on the
exploration branch, select a direction, remove rejected variants and temporary
comparison code, and then open a pull request containing only the final change.

Treat `main` as the deployable source of truth. Add pull-request checks so the
existing convention check and Astro production build run before a change is
merged, instead of first running after a push to `main`.

## Scope

In:

- Document the plain-language lifecycle: `main` -> worktree -> exploration
  branch -> comparison -> decision -> cleanup -> pull request -> merge.
- Add a reusable design-exploration plan template with a design question,
  shared constraints, variant list, comparison criteria, decision, and cleanup
  checklist.
- Add a pull-request validation workflow that runs `pnpm check` and
  `pnpm build` without deploying.
- Add a concise pull-request design review checklist covering responsive
  layouts, light/dark appearance, keyboard focus, real content, and cleanup of
  temporary variants.
- Document when to use one comparison branch versus several parallel
  worktrees.
- Update the system map so future agents follow the same workflow.

Out:

- Changing the current footer or creating footer variants now.
- Moving, committing, or rewriting the uncommitted work currently on `main`.
- Adding Storybook or another component-explorer dependency.
- Adding a third-party preview-hosting service.
- Changing GitHub repository settings or branch-protection rules on Anuj's
  behalf.
- Keeping unfinished design alternatives in the production site.

## Files To Modify

- `agent-os/conventions/design-exploration.md`: durable, plain-language
  workflow and examples.
- `agent-os/plans/README.md`: link the reusable exploration-plan shape from the
  existing planning guidance.
- `agent-os/plans/design-exploration-template.md`: copyable design-comparison
  template.
- `.github/workflows/checks.yml`: non-deploying validation for pull requests.
- `.github/pull_request_template.md`: small review and cleanup checklist.
- `agent-os/system-map.md`: record the exploration and review workflow.

## Steps

- [ ] Confirm the existing uncommitted `main` work has been reviewed and
      secured before starting implementation; handling that work is a separate
      action requiring Anuj's direction.
- [ ] Write the design-exploration convention in plain language.
- [ ] Add the reusable exploration-plan template.
- [ ] Add pull-request checks and the design review checklist.
- [ ] Update the system map.
- [ ] Verify the new workflow configuration and document a footer example.

## Review

- Design: The workflow supports side-by-side comparison without prescribing a
  visual direction.
- Content: Instructions are understandable to a designer with limited coding
  experience.
- Architecture: Exploration code is temporary; approved components and tokens
  remain in their existing source-of-truth locations.
- Verification: Validate workflow syntax, run `pnpm check`, and run
  `pnpm build` after implementation.

## Learnings

Capture durable workflow decisions in
`agent-os/conventions/design-exploration.md`; no separate learning note is
expected unless the first real exploration reveals a new reusable pattern.
