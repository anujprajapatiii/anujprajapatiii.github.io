#!/usr/bin/env node
/*
  Design-system guard.

  Every rule here was a real regression in this repo, not a hypothetical. They
  share one property: breaking them is INVISIBLE. An unsupported font weight
  is silently synthesised; a mistyped scale name emits no CSS at all, so
  spacing collapses to zero and the build still passes. A reviewer cannot
  catch these by reading a diff.

  What this cannot check: contrast ratios, reading measure, and anything
  visual. Those still need measuring in a browser — see agent-os/conventions.

  Run: pnpm check
*/
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const FILES = globSync("src/**/*.{astro,css,ts,tsx}", { cwd: process.cwd() });

/* A rule matches a line and explains itself. `skip` exempts known-good lines. */
const RULES = [
  {
    id: "spacing-scale",
    test: /(?<![\w-])(?:(?:sm|md|lg|xl):)?(?:p|px|py|pt|pb|ps|pe|m|mx|my|mt|mb|ms|me|gap|gap-x|gap-y|space-x|space-y)-\d+(?![\w.\-])/,
    // documented exception: optical padding inside a text run
    skip: /px-1\.5|py-0\.5/,
    msg: "raw Tailwind spacing step — use the named scale (p-md, gap-sm, py-xl) or a semantic role (p-card, px-gutter)",
  },
  {
    id: "type-scale",
    test: /(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])(?![\w-])/,
    msg: "raw Tailwind text size — use the scale (text-display/h1/h2/h3/body/small)",
  },
  {
    /*
      The scale went from eight steps to six. These two names now match no
      token, so Tailwind emits nothing for them and the element silently
      inherits its parent's size — the class looks right in the diff and does
      nothing on the page. Exactly the failure mode this file exists for.
    */
    id: "retired-type-step",
    test: /(?<![\w-])text-(?:lead|label)(?![\w-])/,
    msg: "that step was removed — intros are text-body, metadata is text-small (.label is still the uppercase treatment)",
  },
  {
    id: "no-call-site-type",
    test: /(?<![\w-])(?:tracking-[a-z]+|leading-[a-z0-9]+)(?![\w-])/,
    msg: "size, line-height and tracking live in the type token — never set them at a call site",
  },
  {
    /*
      TASA Orbiter is variable, but this design deliberately uses only Regular
      400, Medium 500 and Semibold 600. Restricting the checker to those three
      keeps the hierarchy intentional instead of treating the whole axis as a
      grab bag.
    */
    id: "unapproved-weight",
    test: /(?<![\w-])font-(?:thin|extralight|light|bold|extrabold|black)(?![\w-])|font-weight:\s*(?:100|200|300|700|800|900)\b/,
    msg: "that weight is outside the approved TASA Orbiter hierarchy — use Regular 400, Medium 500 or Semibold 600",
  },
  {
    /*
      The value must be exactly zero or `normal`. Matching on a leading "0"
      is not enough: `0.08em` starts with one, and an earlier version of this
      rule passed it silently.
    */
    id: "tracking-zero",
    test: /letter-spacing:\s*(?!normal\b)(?!0(?:\.0+)?(?:px|em|rem|%)?\s*[;}])/,
    msg: "tracking is 0 everywhere, by decision — no per-size letter-spacing",
  },
  {
    /*
      Corners are square by decision, and the radius tokens are gone. That
      makes a stray `rounded-*` worse than a no-op: with no --radius-* key to
      find, Tailwind falls back to its OWN built-in scale, so the class curves
      the corner at a value nothing in this repo declares. Catch the utility
      and the raw property alike.
    */
    id: "no-radius",
    test: /(?<![\w-])rounded[\w\-.[\]]*|border-radius\s*:/,
    msg: "corners are square everywhere, by decision — no rounded-* utility, no border-radius",
  },
  {
    id: "logical-properties",
    test: /(?<![\w-])(?:margin|padding|border)-(?:left|right)\b|(?<![\w-])(?:ml|mr|pl|pr)-[\w.]+|(?<![\w-])border-[lr]-\d/,
    msg: "use logical properties (padding-inline-start, ps-*, border-s-*) so the layout mirrors in RTL",
  },
  {
    id: "no-alpha-colour",
    test: /(?<![\w-])(?:text|border|bg)-[a-z-]+\/\d+/,
    msg: "alpha-diluted colour invents an undeclared token and costs contrast — use a real token",
  },
  {
    id: "no-raw-hex",
    test: /#[0-9a-fA-F]{3,8}\b/,
    // primitives are defined in global.css; the style guide documents them as data
    only: (f) => !f.endsWith("global.css") && !f.endsWith("style-guide.astro"),
    msg: "raw hex in a component — colours come from semantic tokens",
  },
  {
    id: "no-inline-layout",
    test: /(?<![\w-])mx-auto(?![\w-])|style=(?:"[^"]*(?:display\s*:\s*(?:grid|flex)|grid-(?:template-columns|column)\s*:|max-width\s*:|(?:padding|margin)-(?:block|inline)\s*:)[^"]*"|'[^']*(?:display\s*:\s*(?:grid|flex)|grid-(?:template-columns|column)\s*:|max-width\s*:|(?:padding|margin)-(?:block|inline)\s*:)[^']*')/,
    only: (f) => (f.startsWith("src/pages") || f.startsWith("src/components")) && !f.endsWith("style-guide.astro"),
    msg: "layout comes from primitives — compose Section > Container > Stack | Grid | Cluster",
  },
  {
    id: "grid-primitive",
    test: /(?<![\w-])(?:grid-cols-[\w.[\]-]+|col-span-[\w.[\]-]+|col-start-[\w.[\]-]+)(?![\w-])/,
    only: (f) => f.startsWith("src/pages/"),
    msg: "public-page columns belong to GridItem — use its typed span/start props instead of raw grid utilities",
  },
  {
    id: "retired-grid-api",
    test: /<Grid\b[^>]*\b(?:min|gap)=/,
    only: (f) => f.endsWith(".astro"),
    msg: "Grid is the 24-track structural grid — replace the retired auto-fit min/gap props with GridItem spans",
  },
  {
    id: "primitive-gap-name",
    test: /<(?:Stack|Cluster)\b[^>]*\bgap="(?!(?:2xs|xs|sm|md|lg|xl|2xl)")[^"]+"/,
    only: (f) => f.endsWith(".astro"),
    msg: "Stack/Cluster gaps map literally to spacing tokens — use 2xs, xs, sm, md, lg, xl or 2xl",
  },
  {
    /*
      A bare <table> renders — it just renders as the browser's default, with
      no rules, no cell padding and no header treatment. That is the failure
      this repo keeps hitting: valid output that silently ignores the system.
      Markdown tables are fine and are not matched here; they are styled by
      `.prose table` and never appear in a source file.
    */
    id: "table-standard",
    test: /<table\b/,
    only: (f) => !f.endsWith("DataTable.astro"),
    msg: "use DataTable.astro — a bare <table> ships without the site's table treatment",
  },
  {
    /*
      `class="btn"` with no variant is the button system's silent failure. The
      base is deliberately a bare box — transparent border, inherited colour —
      so a variant-less button renders as unstyled text with padding, which
      reads as "a link that hasn't been styled yet" rather than as a bug. It
      passes the build, passes review, and ships.

      Matched on the markup, not on the CSS: the class list is where the
      variant goes missing. `.btn--*` on its own line inside global.css never
      matches, because the pattern needs a `btn` token first.
    */
    id: "button-variant",
    test: /class(?::list)?=(?:"|'|\{")[^"']*(?<![\w-])btn(?![\w-])(?![^"']*(?<![\w-])btn--(?:primary|secondary|link)(?![\w-]))/,
    only: (f) => f.endsWith(".astro"),
    msg: "btn needs a variant — btn--primary, btn--secondary or btn--link (the base alone is an unstyled box)",
  },
  {
    id: "no-eyebrow",
    test: /(?<![\w-])eyebrow(?![\w-])/,
    msg: "eyebrows were removed from the design; section headings are real headings",
  },
];

let failures = 0;
for (const file of FILES) {
  const lines = readFileSync(file, "utf8").split("\n");
  /*
    Track block-comment state. This repo quotes its own banned patterns inside
    explanatory comments constantly, so a naive line check flags the very
    documentation that explains the rule.
  */
  let inBlockComment = false;
  lines.forEach((line, i) => {
    const t = line.trim();
    const opens = line.includes("/*") && !line.includes("*/");
    const wasInComment = inBlockComment;
    if (opens) inBlockComment = true;
    else if (inBlockComment && line.includes("*/")) inBlockComment = false;
    if (wasInComment || opens) return;
    if (t.startsWith("*") || t.startsWith("/*") || t.startsWith("//") || t.startsWith("#")) return;
    for (const rule of RULES) {
      if (rule.only && !rule.only(file)) continue;
      if (rule.skip && rule.skip.test(line)) continue;
      const m = line.match(rule.test);
      if (m) {
        failures++;
        console.error(`${file}:${i + 1}  [${rule.id}]  ${m[0]}`);
        console.error(`    ${rule.msg}\n`);
      }
    }
  });
}

if (failures) {
  console.error(`✗ ${failures} design-system violation${failures === 1 ? "" : "s"}.`);
  console.error("  Rules: agent-os/conventions/styling.md");
  process.exit(1);
}
console.log(`✓ design system clean (${FILES.length} files, ${RULES.length} rules)`);
