# Design Exploration

Use this workflow when a design question needs several real alternatives
before one is chosen. Examples include five footer directions, three project
card structures, or two different homepage rhythms.

The goal is simple: experiment freely without changing the approved site.

## The Plain-Language Model

- **`main` is the approved portfolio.** It should always be safe to build and
  publish.
- **A worktree is a separate studio.** It contains another working copy of the
  portfolio, so an experiment cannot disturb the normal local checkout.
- **A branch is the experiment's name and history.** Use a clear name such as
  `codex/explore-footer`.
- **A commit is a saved checkpoint.** Committing on an exploration branch does
  not publish the site.
- **A pull request is the final review.** It shows exactly what would change in
  `main`.
- **Merging is approval.** Only the chosen, cleaned implementation reaches
  `main` and becomes eligible for deployment.

Codex worktrees are documented in the
[official OpenAI guide](https://learn.chatgpt.com/docs/environments/git-worktrees).

## Default Workflow

### 1. Frame one design question

Write down the decision being made, the shared constraints, and how the
options will be compared. Copy
`agent-os/plans/design-exploration-template.md` for any exploration that
affects multiple files or shared public behaviour.

Do not start with “make five random versions.” Give every variant a meaningful
idea to test, while holding content and technical constraints constant.

### 2. Start a worktree from clean `main`

In a new Codex task, choose **Worktree** under the composer and use `main` as
the starting branch. Do not include unrelated local changes.

Use one worktree for one design question. Attach a branch such as
`codex/explore-footer` before saving commits. In the Codex app, use **Create
branch here**. If the task needs to return to the usual local checkout, use
**Hand off** rather than trying to open the same branch in two places.

### 3. Build a temporary comparison surface

Keep the approved production component unchanged while exploring. Put
temporary alternatives under:

```text
src/components/lab/<topic>/
```

Show them together on a temporary route such as:

```text
src/pages/lab/<topic>.astro
```

The temporary route exists only on the exploration branch. It is not a new
public section of the portfolio and must be removed before merging.

Use the same real content, tokens, primitives, and available space for every
alternative. A fair comparison changes the idea being tested, not the inputs.

### 4. Compare the relevant states

For visual interface work, review at minimum:

- narrow mobile and wide desktop layouts;
- light and dark appearance;
- real content, including awkward or long content where relevant;
- hover, press, keyboard focus, and disabled states when interactive;
- reduced motion when the exploration adds animation; and
- the surrounding page context, not only an isolated component crop.

Record observations in the exploration plan. Screenshots are useful evidence,
but the running page remains the source for interaction and responsiveness.

### 5. Save the exploration

Commit when the comparison is ready. A useful checkpoint message describes
the decision state, for example:

```text
Explore five footer directions
```

This is a save point on the exploration branch, not a release.

### 6. Choose and clean

After Anuj chooses a direction:

- move only the selected implementation into the production component;
- delete the rejected variants;
- delete the temporary comparison route and lab folder;
- remove unused styles, assets, and imports;
- update the exploration plan with the decision and reasoning; and
- run the narrowest relevant checks plus the full production build.

The pull request should contain the final decision, not the temporary showroom.
If rejected directions are worth remembering, keep screenshots and a concise
decision note instead of shipping dead components.

### 7. Review before merge

Open a pull request into `main`. The pull-request checks run the design-system
convention checker and the Astro production build. Complete the design review
checklist, inspect the final diff, and merge only after approval.

## Footer Example

For five footer directions, use:

```text
one worktree
one branch: codex/explore-footer
one temporary route: /lab/footer
five alternatives shown under equal conditions
one selected production footer before merge
```

Do not create five branches for five versions of the same component. Keeping
them together makes side-by-side comparison easier and prevents the variants
from quietly drifting onto different foundations.

## When Several Worktrees Make Sense

Use separate worktrees only when the explorations are genuinely independent,
large enough to change many of the same files, or intentionally assigned to
different parallel tasks. For example, a homepage restructure and a separate
case-study navigation experiment may deserve their own worktrees.

When unsure, use one. More worktrees add coordination and cleanup work.

## Recovery Rules

- If no option works, discard the exploration worktree or branch. `main`
  remains unchanged.
- If the exploration may be revisited, keep its branch until the decision is
  settled and retain screenshots or notes.
- Do not use a stash as the main archive for design work. Named branches and
  commits are easier to see, explain, and recover.
- Never merge a temporary `/lab/` route, rejected variant, or unrelated change
  into `main`.

## Prompt Pattern

Use this as a starting request:

```text
Create this exploration in a worktree based on clean main. Explore [number]
meaningfully different directions for [design question]. Do not modify the
production component yet. Show the alternatives together on a temporary lab
page using the same real content, design tokens, and layout constraints.

Compare the relevant mobile, desktop, light, dark, focus, and motion states.
Do not choose a winner or merge anything. Run the relevant checks and show me
the comparison for review.
```
