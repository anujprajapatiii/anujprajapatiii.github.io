# Guide 2 — How to add projects and experiments

*Written for Anuj, who is not a developer. No coding knowledge assumed.*

## How projects work on this site

Every project is **one text file** in the folder `src/content/projects/`.
That's it. The file's name becomes its web address — `brand-refresh.md`
becomes `anujprajapatiii.github.io/work/brand-refresh` — and the site
automatically lists it on the Work page and (for the top 3) the homepage.

There's a working example to copy:
`src/content/projects/sample-case-study.md`.

## Anatomy of a project file

Each file has two parts:

### Part 1: The info block (top of the file, between the `---` lines)

```yaml
---
title: Rebranding Acme Co        # The project name shown everywhere
description: One-line summary    # Shows on the project card
role: Brand Designer             # Optional — your role on it
year: "2025"                     # Optional — keep the quote marks
skills:                          # Optional — list of tags
  - Brand identity
  - Campaign design
thumbnail: /images/work/acme/cover.png   # Optional — card image
sortOrder: 1                     # Lower number = appears first
draft: false                     # true = hidden from the live site
---
```

Only `title` and `description` are required. Everything else is optional.

### Part 2: The story (everything below the second `---`)

Plain text with simple formatting marks — this is called Markdown:

```md
## A section heading

Normal paragraph text. **Bold** for emphasis.

![What the image shows](/images/work/acme/poster.png "Caption under the image")

> A pull quote or client testimonial looks like this.

- A bullet
- Another bullet
```

A case-study structure that works (matches the sample file):
**The problem → The approach → The outcome.** Lead the outcome with
results — what changed for the users, the business, the numbers.

### Images

Put image files in `public/images/work/<project-name>/` (create the folder),
then reference them as `/images/work/<project-name>/picture.png` — note the
path starts at `/images`, without the `public` part.

## The easy way: let Claude Code do the assembly

You don't have to hand-build any of this. The fastest workflow:

1. **Dump your raw material somewhere** — old portfolio PDF, screenshots,
   a link, or just rough notes. Drop files into the `.reference/` folder,
   or paste text straight into chat.
2. **Say:** *"Create a new case study from this material. Keep it as a
   draft so I can review it first."*
3. Claude writes the file, places your images, and shows you a preview.
4. You read it like an editor — fix the voice, the claims, the emphasis.
   (You're the only one who knows what's true and what matters.)
5. **Say:** *"Publish it"* — Claude flips `draft: false` and pushes. The
   live site updates itself in about 2 minutes.

## The draft system (use it!)

`draft: true` in the info block means the project is invisible on the live
site, even if it gets published with other changes. Write freely, flip to
`false` only when it's ready. To check a draft, ask Claude to start the
preview server... drafts are hidden there too, so the honest way to review
one is: *"temporarily show me the draft in the preview."*

## What about experiments?

Right now the site has one content type: **projects**. For small or playful
things you have two options:

1. **Just add them as projects** with a lower `sortOrder` (bigger number =
   further down the list), and a role like "Experiment".
2. **Ask for a dedicated section:** *"Plan a Lab section for small
   experiments, separate from case studies."* This is already noted in
   `agent-os/parking-lot.md` as a future idea — asking for it makes it
   real. Worth doing once you have 3+ experiments to show; before that,
   option 1 is less maintenance.

## Removing or reordering

- **Hide a project:** set `draft: true` (it stays in the repo, off the site).
- **Delete a project:** delete the file (history keeps a copy forever).
- **Reorder:** change the `sortOrder` numbers — lowest shows first, and
  the homepage features the top three.
