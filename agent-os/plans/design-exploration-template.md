# [Exploration Name]

## Status

Planned

## Design Question

What single decision is this exploration meant to answer?

## Why It Matters

What visitor, content, or portfolio problem should the decision improve?

## Shared Constraints

What must stay the same across every direction?

- Real content:
- Existing design tokens and primitives:
- Required information or actions:
- Accessibility requirements:
- Responsive contexts:
- Appearance and motion modes:

## Directions

Each direction should test a distinct idea rather than a cosmetic variation.

| Direction | Idea being tested | Expected strength | Possible weakness |
| --- | --- | --- | --- |
| A |  |  |  |
| B |  |  |  |
| C |  |  |  |

Add or remove rows to match the exploration.

## Comparison Surface

- Worktree starting point: clean `main`
- Branch: `codex/explore-[topic]`
- Temporary route: `/lab/[topic]`
- Temporary components: `src/components/lab/[topic]/`

## Evaluation Criteria

What will determine whether a direction succeeds?

- Information hierarchy:
- Fit with the portfolio's visual direction:
- Real-content resilience:
- Mobile and desktop behaviour:
- Light and dark appearance:
- Interaction and keyboard behaviour:
- Motion and reduced-motion behaviour, if relevant:
- Complexity introduced:

## Scope

In:

- Build and compare the named directions in an isolated worktree.
- Record the review and decision.
- Promote only the selected direction after approval.

Out:

- Unrelated redesigns.
- Publishing the temporary lab route.
- Keeping rejected components in production.
- Merging before a direction is approved and cleaned.

## Review Notes

### Direction A

- Works well:
- Concerns:

### Direction B

- Works well:
- Concerns:

### Direction C

- Works well:
- Concerns:

## Decision

- Selected direction:
- Why it was selected:
- Useful ideas retained from other directions:
- Ideas deliberately rejected:

## Cleanup Before Pull Request

- [ ] Selected direction moved into the production component.
- [ ] Rejected variants removed.
- [ ] Temporary `/lab/` route removed.
- [ ] Temporary lab components, styles, assets, and imports removed.
- [ ] No unrelated changes included.
- [ ] Responsive and appearance states reviewed again after cleanup.
- [ ] `pnpm check` passes.
- [ ] `pnpm build` passes.

## Learnings

What durable design or workflow knowledge should be captured?
