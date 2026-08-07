#!/usr/bin/env node
/*
  Design-system guard.

  Every rule here was a real regression in this repo, not a hypothetical. They
  share one property: breaking them is INVISIBLE. `font-medium` looks fine in
  code and silently resolves to Buch 400 because no 500 exists in the licence;
  a mistyped scale name emits no CSS at all, so spacing collapses to zero and
  the build still passes. A reviewer cannot catch these by reading a diff.

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
    msg: "raw Tailwind text size — use the scale (text-display/h1/h2/h3/lead/body/small/label)",
  },
  {
    id: "no-call-site-type",
    test: /(?<![\w-])(?:tracking-[a-z]+|leading-[a-z0-9]+)(?![\w-])/,
    msg: "size, line-height and tracking live in the type token — never set them at a call site",
  },
  {
    /*
      Only two faces are licensed: Buch 400 and Halbfett 600. Any other weight
      is synthesised or silently snapped to one of those. `font-semibold` and
      `font-normal` are allowed — they map to real faces and are how inline
      emphasis (<strong>) is expressed, which no type step covers.
    */
    id: "unlicensed-weight",
    test: /(?<![\w-])font-(?:thin|extralight|light|medium|bold|extrabold|black)(?![\w-])|font-weight:\s*(?:100|200|300|500|700|800|900)\b/,
    msg: "that weight does not exist in the Söhne licence — only Buch 400 and Halbfett 600 are loaded",
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
    test: /(?<![\w-])mx-auto(?![\w-])/,
    only: (f) => f.startsWith("src/pages") || f.startsWith("src/components"),
    msg: "layout comes from primitives — compose Section > Container > Stack | Grid | Cluster",
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
