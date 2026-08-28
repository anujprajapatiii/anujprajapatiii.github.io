#!/usr/bin/env node
/*
  Design-system guard.

  Every rule here was a real regression in this repo, not a hypothetical. They
  share one property: breaking them is INVISIBLE. An unsupported font weight
  is silently synthesised; a mistyped scale name emits no CSS at all, so
  spacing collapses to zero and the build still passes. A reviewer cannot
  catch these by reading a diff.

  It can protect declared token contrast pairs. Reading measure, perceptual
  state difference and other visual relationships still need a browser review.

  Run: pnpm check
*/
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { designBundleDrift } from "./sync-design-bundle.mjs";

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
    msg: "raw Tailwind text size — use a role (text-display/title/heading/body)",
  },
  {
    /*
      The scale is four role-based sizes. Old tag-shaped and retired names now
      match no token, so Tailwind emits nothing and the element silently
      inherits its parent's size — exactly the failure mode this file exists
      for.
    */
    id: "retired-type-step",
    test: /(?<![\w-])text-(?:h1|h2|h3|small|meta|lead|label)(?![\w-])/,
    msg: "that type name was retired — use display, title, heading or body (.label and .type-reading are treatments)",
  },
  {
    id: "no-call-site-type",
    test: /(?<![\w-])(?:tracking-[a-z]+|leading-[a-z0-9]+)(?![\w-])/,
    msg: "size, line-height and tracking live in the type token — never set them at a call site",
  },
  {
    /*
      The approved weights belong to roles and treatments in global.css. Even
      an allowed weight is still a local override when written in component
      markup, so keep it out of call sites.
    */
    id: "no-call-site-weight",
    test: /(?<![\w-])font-(?:normal|medium|semibold)(?![\w-])/,
    only: (f) => !f.endsWith(".css"),
    msg: "font weight belongs to a type role or named treatment in global.css — do not set it at a call site",
  },
  {
    /*
      Apparat supplies three authored cuts mapped to Light 300, Regular 400 and
      Medium 500. Restricting the checker to those weights prevents synthetic
      faces and keeps the hierarchy intentional.
    */
    id: "unapproved-weight",
    test: /(?<![\w-])font-(?:thin|extralight|light|semibold|bold|extrabold|black)(?![\w-])|font-weight:\s*(?:100|200|600|700|800|900)\b/,
    msg: "that weight is outside the approved Apparat hierarchy — use Light 300, Regular 400 or Medium 500",
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
      Geometry follows function, but it still belongs to the system. The
      approved roles cover modest controls, genuinely circular/capsule forms
      and physical device silhouettes. Tailwind radius utilities bypass those
      roles, while a literal border-radius silently creates a new shape.
    */
    id: "semantic-radius",
    test: /(?<![\w-])rounded[\w\-.[\]]*|border-radius\s*:/,
    skip: /border-radius\s*:\s*var\(--radius-(?:control|round|device)\)\s*;/,
    msg: "use an approved semantic radius token (control, round, or device); arbitrary radius utilities and literal values are not allowed",
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
    id: "action-link-component",
    test: /class(?::list)?=(?:"|'|\{)[^"']*(?<![\w-])btn(?:--[a-z-]+)?(?![\w-])/,
    only: (f) => f.endsWith(".astro") && !f.endsWith("ActionLink.astro"),
    msg: "public links presented as actions use ActionLink.astro instead of hand-authored btn classes",
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

function report(file, line, id, found, message) {
  failures += 1;
  console.error(`${file}:${line}  [${id}]  ${found}`);
  console.error(`    ${message}\n`);
}

function withoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "))
    .replace(/\/\/.*$/gm, "");
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

/*
  CSS accepts an unknown custom property and only fails when it is consumed,
  so a typo is invisible to both Astro and the browser console. Inventory every
  local definition and reference. Base UI owns the four allowlisted properties
  at runtime; all other references must resolve inside this repository.
*/
const RUNTIME_CUSTOM_PROPERTIES = new Set([
  "--active-tab-left",
  "--active-tab-right",
  "--active-tab-width",
  "--transform-origin",
]);
const customPropertyDefinitions = new Set();
const customPropertyReferences = [];

for (const file of FILES) {
  const source = withoutComments(readFileSync(file, "utf8"));
  for (const match of source.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
    customPropertyDefinitions.add(match[1]);
  }
  for (const match of source.matchAll(/@property\s+(--[a-z0-9-]+)/gi)) {
    customPropertyDefinitions.add(match[1]);
  }
  for (const match of source.matchAll(/\.setProperty\(\s*["'](--[a-z0-9-]+)["']/gi)) {
    customPropertyDefinitions.add(match[1]);
  }
  for (const match of source.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
    customPropertyReferences.push({ file, source, name: match[1], index: match.index });
  }
}

for (const reference of customPropertyReferences) {
  if (
    customPropertyDefinitions.has(reference.name) ||
    RUNTIME_CUSTOM_PROPERTIES.has(reference.name)
  ) continue;
  report(
    reference.file,
    lineAt(reference.source, reference.index),
    "undefined-token",
    reference.name,
    "custom-property references must resolve locally or be documented in the runtime allowlist",
  );
}

/* Medium is an authored face, but component/treatment CSS still references the
   shared type role so a future hierarchy change cannot leave local 500s behind.
   Font-face declarations and the token definitions themselves are foundations,
   not call sites. */
for (const file of FILES.filter((candidate) => candidate.endsWith(".css"))) {
  const source = withoutComments(readFileSync(file, "utf8"));
  let inFontFace = false;
  let fontFaceDepth = 0;
  source.split("\n").forEach((line, index) => {
    if (line.includes("@font-face")) inFontFace = true;
    if (inFontFace) {
      fontFaceDepth += (line.match(/{/g) ?? []).length;
      fontFaceDepth -= (line.match(/}/g) ?? []).length;
      if (fontFaceDepth <= 0 && line.includes("}")) inFontFace = false;
      return;
    }
    if (line.trimStart().startsWith("--")) return;
    const match = line.match(/font-weight:\s*(?:300|400|500)\b/);
    if (match) {
      report(
        file,
        index + 1,
        "tokenized-type-weight",
        match[0],
        "shared treatments use a type-role weight token instead of a numeric call-site value",
      );
    }
  });
}

/* Keep authored motion timings at token definitions. The 1ms reduced-motion
   duration is the standards-aligned exception that effectively disables an
   animation without removing its end state. */
for (const file of FILES.filter((candidate) => candidate.endsWith(".css"))) {
  const source = withoutComments(readFileSync(file, "utf8"));
  source.split("\n").forEach((line, index) => {
    if (line.trimStart().startsWith("--")) return;
    if (/animation-duration:\s*1ms\s*!important/.test(line)) return;
    const match = line.match(/(?:animation(?:-duration|-delay)?|transition-duration)\s*:[^;]*\b\d+(?:ms|s)\b/);
    if (match) {
      report(
        file,
        index + 1,
        "tokenized-motion",
        match[0],
        "authored motion durations and delays belong in named motion tokens",
      );
    }
  });
}

/* ProjectCard is reused under a section heading and directly under a page
   title. Listing pages must opt into h2; the component keeps h3 as its nested
   default for the homepage and style guide. */
for (const file of ["src/pages/work/index.astro", "src/pages/play/index.astro"]) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/<ProjectCard\b[\s\S]*?\/>/g)) {
    if (/\bheadingLevel="h2"/.test(match[0])) continue;
    report(
      file,
      lineAt(source, match.index),
      "project-card-heading",
      "<ProjectCard>",
      "top-level Work and Experiments cards use h2 headings",
    );
  }
}

const projectCard = readFileSync("src/components/ProjectCard.astro", "utf8");
if (!/headingLevel\?:\s*"h2"\s*\|\s*"h3"/.test(projectCard) || !/headingLevel\s*=\s*"h3"/.test(projectCard)) {
  report(
    "src/components/ProjectCard.astro",
    1,
    "project-card-heading-contract",
    "headingLevel",
    "ProjectCard accepts h2/h3 and defaults to the nested h3 level",
  );
}

/* Shared site furniture opts into one named, layout-neutral hit-area contract. */
const HIT_TARGET_COUNTS = new Map([
  ["src/components/layout/Header.astro", 2],
  ["src/components/layout/Footer.astro", 4],
  ["src/components/layout/ThemeToggle.astro", 1],
]);
for (const [file, minimum] of HIT_TARGET_COUNTS) {
  const source = readFileSync(file, "utf8");
  const count = source.match(/site-hit-target/g)?.length ?? 0;
  if (count < minimum) {
    report(
      file,
      1,
      "site-hit-target",
      `${count}/${minimum}`,
      "every shared navigation, footer, wordmark, and theme control uses the enlarged hit-area contract",
    );
  }
}
const globalCss = readFileSync("src/styles/global.css", "utf8");
if (
  !/\.site-hit-target::after\s*{[\s\S]*?width:\s*max\(100%,\s*var\(--control-height-touch\)\);[\s\S]*?height:\s*max\(100%,\s*var\(--control-height-touch\)\);/.test(globalCss)
) {
  report(
    "src/styles/global.css",
    1,
    "site-hit-target-contract",
    ".site-hit-target::after",
    "the layout-neutral pseudo-element must expose at least the touch control size in both axes",
  );
}

/* The public and React button runtimes stay separate, but both must expose the
   neutral state contract that prevents call-site and palette drift. */
const actionLinkSource = readFileSync("src/components/ActionLink.astro", "utf8");
if (
  !/type ActionLinkVariant = "primary" \| "secondary" \| "link"/.test(actionLinkSource) ||
  !/class:list=\{\["btn", `btn--\$\{variant\}`/.test(actionLinkSource)
) {
  report(
    "src/components/ActionLink.astro",
    1,
    "action-link-contract",
    "ActionLink",
    "the public action-link component owns the complete primary/secondary/link class contract",
  );
}

const reactButtonSource = readFileSync("src/components/ui/button.tsx", "utf8");
for (const requirement of [
  /loading\?: boolean/,
  /aria-busy=\{loading \|\| undefined\}/,
  /data-loading=\{loading \? "" : undefined\}/,
  /focusableWhenDisabled=\{loading \|\| focusableWhenDisabled\}/,
]) {
  if (requirement.test(reactButtonSource)) continue;
  report(
    "src/components/ui/button.tsx",
    1,
    "button-loading-contract",
    requirement.source,
    "Button loading must retain geometry, expose busy state and remain focusable while blocking repeat activation",
  );
}

const uiControlsCss = readFileSync("src/styles/ui-controls.css", "utf8");
const buttonStateCssContracts = [
  {
    file: "src/styles/global.css",
    source: globalCss,
    test: /\.btn--primary:active\s*\{[\s\S]*?--lift-surface-on:\s*var\(--button-primary-background-active\)/,
    found: ".btn--primary:active",
  },
  {
    file: "src/styles/global.css",
    source: globalCss,
    test: /@media \(pointer: coarse\)\s*\{[\s\S]*?\.btn:not\(\.btn--link\)[\s\S]*?min-height:\s*var\(--control-height-touch\)/,
    found: "coarse-pointer .btn",
  },
  {
    file: "src/styles/ui-controls.css",
    source: uiControlsCss,
    test: /@media \(pointer: coarse\)\s*\{[\s\S]*?\.ui-button,[\s\S]*?min-height:\s*var\(--control-height-touch\)/,
    found: "coarse-pointer .ui-button",
  },
  {
    file: "src/styles/ui-controls.css",
    source: uiControlsCss,
    test: /\.ui-button--primary:active:not\(:disabled\):not\(\[data-disabled\]\)\s*\{[\s\S]*?background:\s*var\(--button-primary-background-active\)/,
    found: ".ui-button--primary:active",
  },
  {
    file: "src/styles/ui-controls.css",
    source: uiControlsCss,
    test: /\.ui-button\[data-loading\]\s*\{[\s\S]*?cursor:\s*progress/,
    found: ".ui-button[data-loading]",
  },
  {
    file: "src/styles/ui-controls.css",
    source: uiControlsCss,
    test: /\.ui-button--quiet:disabled:not\(\[data-loading\]\),[\s\S]*?background:\s*transparent/,
    found: "disabled quiet-button hierarchy",
  },
];
for (const contract of buttonStateCssContracts) {
  if (contract.test.test(withoutComments(contract.source))) continue;
  report(
    contract.file,
    1,
    "button-state-contract",
    contract.found,
    "public and React buttons require distinct pressed, loading and coarse-pointer states",
  );
}

/* Base UI is an implementation detail of the local wrappers. If an experiment
   imports it directly, keyboard behaviour and component APIs can drift without
   any visual warning. */
for (const file of FILES.filter((candidate) => !candidate.startsWith("src/components/ui/"))) {
  const source = withoutComments(readFileSync(file, "utf8"));
  for (const match of source.matchAll(/from\s+["'](@base-ui\/react[^"']*)["']/g)) {
    report(
      file,
      lineAt(source, match.index),
      "base-ui-boundary",
      match[1],
      "import Base UI only inside src/components/ui; experiments and demo recipes use the local wrappers",
    );
  }
}

/* Shared component visuals have one owner. Experiment-local styles may lay
   components out through their own wrapper, but cannot reach into `.ui-*`
   selectors to change a primitive's colours, type or interaction states. */
const SHARED_UI_STYLE_OWNERS = new Set([
  "src/styles/ui-controls.css",
  "src/styles/demo-recipes.css",
]);
for (const file of FILES.filter(
  (candidate) => candidate.endsWith(".css") && !SHARED_UI_STYLE_OWNERS.has(candidate),
)) {
  const source = withoutComments(readFileSync(file, "utf8"));
  source.split("\n").forEach((line, index) => {
    const match = line.match(/\.ui-[a-z0-9_-]+/i);
    if (!match) return;
    report(
      file,
      index + 1,
      "shared-ui-style-owner",
      match[0],
      "shared `.ui-*` selectors are styled only in the central primitive or recipe stylesheets",
    );
  });
}

/* Contrast is a token contract, so protect it at the source instead of relying
   on a screenshot audit to rediscover the same drift. These checks cover the
   default and fully-remapped Blue structural palettes; Sage inherits the
   default text and interactive-boundary roles. */
function extractTokenRule(source, selector) {
  const start = source.indexOf(`${selector} {`);
  if (start === -1) return "";
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  return "";
}

function tokenProperties(rule) {
  return new Map(
    [...rule.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

function mergeTokenMaps(...maps) {
  return new Map(maps.flatMap((map) => [...map]));
}

function resolveToken(tokens, name, trail = []) {
  if (trail.includes(name)) return null;
  const value = tokens.get(name);
  if (!value) return null;
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/i)?.[1];
  return reference ? resolveToken(tokens, reference, [...trail, name]) : null;
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrastRatio(first, second) {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const baseRootTokens = tokenProperties(extractTokenRule(globalCss, ":root"));
const baseDarkTokens = tokenProperties(extractTokenRule(globalCss, ".dark"));
const blueCss = readFileSync("src/styles/themes/blue.css", "utf8");
const blueRootTokens = tokenProperties(extractTokenRule(blueCss, ':root[data-palette="blue"]'));
const blueDarkTokens = tokenProperties(extractTokenRule(blueCss, '.dark[data-palette="blue"]'));

const contrastThemes = new Map([
  ["default light", baseRootTokens],
  ["default dark", mergeTokenMaps(baseRootTokens, baseDarkTokens)],
  ["blue light", mergeTokenMaps(baseRootTokens, blueRootTokens)],
  ["blue dark", mergeTokenMaps(baseRootTokens, baseDarkTokens, blueRootTokens, blueDarkTokens)],
]);
const contrastContracts = [
  { role: "--text-tertiary", surfaces: ["--bg-primary", "--bg-quaternary"], minimum: 4.5 },
  { role: "--text-placeholder", surfaces: ["--bg-primary", "--bg-quaternary"], minimum: 4.5 },
  { role: "--border-interactive", surfaces: ["--bg-primary", "--bg-quaternary"], minimum: 3 },
  { role: "--border-hover", surfaces: ["--bg-primary-hover", "--bg-quaternary-hover"], minimum: 3 },
];

for (const [theme, tokens] of contrastThemes) {
  for (const contract of contrastContracts) {
    const foreground = resolveToken(tokens, contract.role);
    for (const surface of contract.surfaces) {
      const background = resolveToken(tokens, surface);
      if (!foreground || !background) {
        report(
          "src/styles/global.css",
          1,
          "contrast-token-resolution",
          `${theme}: ${contract.role} / ${surface}`,
          "contrast contracts must resolve through semantic tokens to literal primitive colours",
        );
        continue;
      }
      const ratio = contrastRatio(foreground, background);
      if (ratio + Number.EPSILON >= contract.minimum) continue;
      report(
        "src/styles/global.css",
        1,
        "token-contrast",
        `${theme}: ${contract.role} / ${surface} = ${ratio.toFixed(2)}:1`,
        `this semantic pair must remain at or above ${contract.minimum.toFixed(1)}:1`,
      );
    }
  }
}

/* Button roles are intentionally neutral and are reviewed only in the default
   light/dark appearances. Sage and Blue button direction remains unscoped. */
const neutralButtonRoles = [
  "--button-primary-background",
  "--button-primary-background-hover",
  "--button-primary-background-active",
  "--button-primary-foreground",
  "--button-secondary-background-hover",
  "--button-secondary-background-active",
  "--button-secondary-foreground",
  "--button-secondary-foreground-hover",
  "--button-secondary-border",
  "--button-secondary-border-hover",
  "--button-secondary-border-active",
  "--button-quiet-foreground",
  "--button-quiet-foreground-hover",
  "--button-disabled-background",
  "--button-disabled-foreground",
  "--button-disabled-border",
];
for (const tokens of [baseRootTokens, baseDarkTokens]) {
  for (const role of neutralButtonRoles) {
    if (/^var\(--neutral-(?:black|white|\d+)\)$/.test(tokens.get(role) ?? "")) continue;
    report(
      "src/styles/global.css",
      1,
      "neutral-button-role",
      role,
      "button component roles must map directly to neutral primitives in both light and dark appearance",
    );
  }
}

const buttonContrastThemes = new Map([
  ["default light", baseRootTokens],
  ["default dark", mergeTokenMaps(baseRootTokens, baseDarkTokens)],
]);
const buttonContrastContracts = [
  {
    foreground: "--button-primary-foreground",
    backgrounds: [
      "--button-primary-background",
      "--button-primary-background-hover",
      "--button-primary-background-active",
    ],
  },
  {
    foreground: "--button-secondary-foreground",
    backgrounds: ["--bg-primary", "--bg-quaternary", "--button-secondary-background-active"],
  },
  {
    foreground: "--button-secondary-foreground-hover",
    backgrounds: ["--button-secondary-background-hover"],
  },
  {
    foreground: "--button-quiet-foreground",
    backgrounds: ["--bg-primary", "--bg-quaternary"],
  },
];

for (const [theme, tokens] of buttonContrastThemes) {
  for (const contract of buttonContrastContracts) {
    const foreground = resolveToken(tokens, contract.foreground);
    for (const role of contract.backgrounds) {
      const background = resolveToken(tokens, role);
      if (!foreground || !background) {
        report(
          "src/styles/global.css",
          1,
          "button-contrast-token-resolution",
          `${theme}: ${contract.foreground} / ${role}`,
          "button text and surfaces must resolve to literal neutral primitives",
        );
        continue;
      }
      const ratio = contrastRatio(foreground, background);
      if (ratio + Number.EPSILON >= 4.5) continue;
      report(
        "src/styles/global.css",
        1,
        "button-token-contrast",
        `${theme}: ${contract.foreground} / ${role} = ${ratio.toFixed(2)}:1`,
        "enabled button text must remain at or above 4.5:1",
      );
    }
  }

  const primaryStates = [
    "--button-primary-background",
    "--button-primary-background-hover",
    "--button-primary-background-active",
  ].map((role) => resolveToken(tokens, role));
  if (primaryStates.every(Boolean) && new Set(primaryStates).size === primaryStates.length) continue;
  report(
    "src/styles/global.css",
    1,
    "button-state-distinction",
    `${theme}: ${primaryStates.join(" / ")}`,
    "primary rest, hover and pressed surfaces must resolve to three distinct neutral colours",
  );
}

for (const file of designBundleDrift()) {
  report(
    file,
    1,
    "design-bundle-parity",
    "generated output differs",
    "run pnpm sync:design-bundle after changing canonical colour sources",
  );
}

if (failures) {
  console.error(`✗ ${failures} design-system violation${failures === 1 ? "" : "s"}.`);
  console.error("  Rules: agent-os/conventions/styling.md");
  process.exit(1);
}
console.log(
  `✓ design system clean (${FILES.length} files, ${RULES.length} pattern rules + structural audits)`,
);
