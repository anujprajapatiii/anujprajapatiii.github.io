/*
  Authored display order and mapping labels for /style-guide. Actual values are
  always rendered from CSS custom properties; global.css remains the design
  system source of truth. Update this manifest when token names or mappings
  change.
*/

export const styleGuideHeadings = [
  { depth: 2, slug: "foundations", text: "Foundations" },
  { depth: 3, slug: "colour", text: "Colour system" },
  { depth: 3, slug: "typography", text: "Typography" },
  { depth: 3, slug: "spacing", text: "Spacing" },
  { depth: 3, slug: "surfaces", text: "Surfaces and interaction" },
  { depth: 2, slug: "layout", text: "Layout" },
  { depth: 3, slug: "composition", text: "Composition" },
  { depth: 2, slug: "components", text: "Components" },
  { depth: 3, slug: "actions", text: "Actions" },
  { depth: 3, slug: "tables", text: "Tables" },
  { depth: 3, slug: "experiment-interfaces", text: "Experiment interfaces" },
  { depth: 2, slug: "reference", text: "Reference" },
  { depth: 3, slug: "page-palettes", text: "Page palettes" },
  { depth: 3, slug: "primitive-colours", text: "Primitive colours" },
  { depth: 3, slug: "semantic-tokens", text: "Semantic tokens" },
  { depth: 3, slug: "compatibility-aliases", text: "Compatibility aliases" },
] as const;

export const styleGuideChapters = [
  {
    index: "01",
    slug: "foundations",
    title: "Foundations",
    description: "Colour, type, spacing, and material rules.",
  },
  {
    index: "02",
    slug: "layout",
    title: "Layout",
    description: "Container, measure, and the 24-track grid.",
  },
  {
    index: "03",
    slug: "components",
    title: "Components",
    description: "Actions, tables, and experiment interfaces.",
  },
  {
    index: "04",
    slug: "reference",
    title: "Reference",
    description: "Complete palettes, token mappings, and aliases.",
  },
] as const;

export const coreColourRoles = [
  { name: "background", label: "Canvas" },
  { name: "muted", label: "Inset" },
  { name: "card", label: "Raised" },
  { name: "foreground", label: "Primary text" },
  { name: "accent", label: "Interactive text" },
  { name: "border", label: "Structural rule" },
] as const;

export const primitiveFamilies = [
  {
    name: "Neutral",
    prefix: "neutral",
    swatches: [
      "black", "900", "800", "700", "600", "500", "400", "375",
      "350", "325", "300", "200", "150", "100", "white",
    ],
  },
  {
    name: "Brown",
    prefix: "brown",
    swatches: ["600", "500", "400", "300", "200", "100", "50"],
  },
  {
    name: "Amber",
    prefix: "amber",
    swatches: ["400", "300", "200", "100"],
  },
  {
    name: "Blue",
    prefix: "blue",
    swatches: [
      "950", "900", "800", "700", "600", "500", "400", "350",
      "300", "200", "100", "50",
    ],
  },
  {
    name: "Green",
    prefix: "green",
    swatches: ["400", "300", "200", "100"],
  },
  {
    name: "Sage",
    prefix: "sage",
    swatches: ["900", "700", "500"],
  },
  {
    name: "Red",
    prefix: "red",
    swatches: ["400", "300", "200", "100"],
  },
  {
    name: "Yellow",
    prefix: "yellow",
    swatches: ["600", "500", "400", "300", "200", "100"],
  },
] as const;

const backgroundTokens = [
  { name: "primary", light: "neutral-150", dark: "neutral-800" },
  { name: "secondary", light: "neutral-200", dark: "neutral-900" },
  { name: "tertiary", light: "yellow-500", dark: "yellow-500" },
  { name: "quaternary", light: "neutral-100", dark: "neutral-700" },
  { name: "primary-hover", light: "neutral-100", dark: "neutral-700" },
  { name: "secondary-hover", light: "neutral-150", dark: "neutral-800" },
  { name: "tertiary-hover", light: "yellow-600", dark: "yellow-400" },
  { name: "quaternary-hover", light: "neutral-white", dark: "neutral-600" },
  { name: "black-solid", light: "neutral-800", dark: "neutral-100" },
  { name: "black-solid-hover", light: "neutral-black", dark: "neutral-white" },
  { name: "disabled", light: "neutral-200", dark: "neutral-600" },
  { name: "disabled-alt", light: "neutral-100", dark: "neutral-700" },
  { name: "accent-primary", light: "sage-500", dark: "sage-700" },
  { name: "accent-primary-hover", light: "sage-700", dark: "sage-500" },
  { name: "accent-solid", light: "sage-500", dark: "sage-700" },
  { name: "accent-solid-hover", light: "sage-700", dark: "sage-500" },
  { name: "error-primary", light: "red-100", dark: "red-100" },
  { name: "error-primary-hover", light: "red-200", dark: "red-200" },
  { name: "error-secondary", light: "red-300", dark: "red-300" },
  { name: "error-secondary-hover", light: "red-400", dark: "red-400" },
  { name: "success-primary", light: "green-100", dark: "green-100" },
  { name: "success-primary-hover", light: "green-200", dark: "green-200" },
  { name: "success-secondary", light: "green-300", dark: "green-300" },
  { name: "success-secondary-hover", light: "green-400", dark: "green-400" },
  { name: "warning-primary", light: "yellow-200", dark: "yellow-200" },
  { name: "warning-primary-hover", light: "yellow-300", dark: "yellow-300" },
  { name: "warning-secondary", light: "yellow-400", dark: "yellow-400" },
  { name: "warning-secondary-hover", light: "yellow-500", dark: "yellow-500" },
  { name: "info-primary", light: "blue-100", dark: "blue-100" },
  { name: "info-primary-hover", light: "blue-200", dark: "blue-200" },
  { name: "info-secondary", light: "blue-400", dark: "blue-400" },
  { name: "info-secondary-hover", light: "blue-500", dark: "blue-500" },
] as const;

const textTokens = [
  { name: "primary", light: "neutral-600", dark: "neutral-200" },
  { name: "secondary", light: "neutral-400", dark: "neutral-300" },
  { name: "tertiary", light: "neutral-375", dark: "neutral-325" },
  { name: "primary-hover", light: "neutral-900", dark: "neutral-100" },
  { name: "secondary-hover", light: "neutral-600", dark: "neutral-200" },
  { name: "tertiary-hover", light: "neutral-400", dark: "neutral-300" },
  { name: "disabled", light: "neutral-300", dark: "neutral-500" },
  { name: "disabled-alt", light: "neutral-200", dark: "neutral-400" },
  { name: "placeholder", light: "neutral-375", dark: "neutral-325" },
  { name: "accent-primary", light: "neutral-white", dark: "neutral-150" },
  { name: "accent-secondary", light: "sage-500", dark: "sage-500" },
  { name: "accent-primary-hover", light: "neutral-white", dark: "neutral-white" },
  { name: "accent-secondary-hover", light: "sage-700", dark: "sage-500" },
  { name: "error-primary", light: "red-400", dark: "red-100" },
  { name: "error-secondary", light: "red-300", dark: "red-200" },
  { name: "error-primary-hover", light: "red-400", dark: "red-100" },
  { name: "error-secondary-hover", light: "red-400", dark: "red-100" },
  { name: "success-primary", light: "green-400", dark: "green-100" },
  { name: "success-secondary", light: "green-300", dark: "green-200" },
  { name: "success-primary-hover", light: "green-400", dark: "green-100" },
  { name: "success-secondary-hover", light: "green-400", dark: "green-100" },
  { name: "warning-primary", light: "yellow-600", dark: "yellow-200" },
  { name: "warning-secondary", light: "yellow-500", dark: "yellow-300" },
  { name: "warning-primary-hover", light: "yellow-600", dark: "yellow-100" },
  { name: "warning-secondary-hover", light: "yellow-600", dark: "yellow-200" },
  { name: "info-primary", light: "blue-600", dark: "blue-200" },
  { name: "info-secondary", light: "blue-500", dark: "blue-300" },
  { name: "info-primary-hover", light: "blue-600", dark: "blue-100" },
  { name: "info-secondary-hover", light: "blue-600", dark: "blue-200" },
] as const;

const iconTokens = textTokens.map((token) => {
  switch (token.name) {
    case "accent-primary":
      return { ...token, light: "sage-500", dark: "sage-500" };
    case "accent-secondary":
      return { ...token, light: "sage-700", dark: "sage-700" };
    case "accent-primary-hover":
      return { ...token, light: "sage-700", dark: "sage-500" };
    case "accent-secondary-hover":
      return { ...token, light: "sage-900", dark: "sage-500" };
    default:
      return token;
  }
});

const borderTokens = [
  { name: "primary", light: "neutral-300", dark: "neutral-500" },
  { name: "interactive", light: "neutral-350", dark: "neutral-350" },
  { name: "secondary", light: "sage-500", dark: "sage-700" },
  { name: "tertiary", light: "neutral-200", dark: "neutral-600" },
  { name: "primary-solid", light: "neutral-800", dark: "neutral-100" },
  { name: "disabled", light: "neutral-200", dark: "neutral-600" },
  { name: "disabled-alt", light: "neutral-100", dark: "neutral-700" },
  { name: "accent-primary", light: "sage-500", dark: "sage-500" },
  { name: "accent-secondary", light: "sage-700", dark: "sage-700" },
  { name: "error-primary", light: "red-300", dark: "red-200" },
  { name: "error-secondary", light: "red-100", dark: "red-400" },
  { name: "success-primary", light: "green-300", dark: "green-200" },
  { name: "success-secondary", light: "green-100", dark: "green-400" },
  { name: "warning-primary", light: "yellow-500", dark: "yellow-300" },
  { name: "warning-secondary", light: "yellow-300", dark: "yellow-600" },
  { name: "info-primary", light: "blue-400", dark: "blue-300" },
  { name: "info-secondary", light: "blue-200", dark: "blue-600" },
] as const;

export const semanticGroups = [
  {
    name: "Background",
    tokens: backgroundTokens.map((token) => ({ ...token, name: `bg-${token.name}` })),
  },
  {
    name: "Text",
    tokens: textTokens.map((token) => ({ ...token, name: `text-${token.name}` })),
  },
  {
    name: "Icon",
    tokens: iconTokens.map((token) => ({ ...token, name: `icon-${token.name}` })),
  },
  {
    name: "Border",
    tokens: borderTokens.map((token) => ({ ...token, name: `border-${token.name}` })),
  },
  {
    name: "Portfolio-specific",
    tokens: [
      { name: "background-primary", light: "bg-primary", dark: "bg-primary" },
      { name: "background-secondary", light: "bg-secondary", dark: "bg-secondary" },
      { name: "background-alternate", light: "bg-black-solid", dark: "bg-black-solid" },
      { name: "background-alternate-hover", light: "bg-black-solid-hover", dark: "bg-black-solid-hover" },
      { name: "background-hover", light: "bg-primary-hover", dark: "bg-primary-hover" },
      { name: "background-elevated", light: "bg-quaternary", dark: "bg-quaternary" },
      { name: "background-elevated-hover", light: "bg-quaternary-hover", dark: "bg-quaternary-hover" },
      { name: "text-interactive", light: "text-primary-hover", dark: "text-primary-hover" },
      { name: "text-reading", light: "text-secondary", dark: "text-secondary" },
      { name: "text-alternate", light: "neutral-100", dark: "neutral-800" },
      { name: "border-hover", light: "neutral-400", dark: "neutral-300" },
      { name: "decorative-accent", light: "sage-500", dark: "sage-500" },
      { name: "lighting-highlight", light: "neutral-white", dark: "neutral-500" },
      { name: "lighting-shade", light: "neutral-300", dark: "neutral-black" },
    ],
  },
  {
    name: "Button component",
    tokens: [
      { name: "button-primary-background", light: "neutral-500", dark: "neutral-300" },
      { name: "button-primary-background-hover", light: "neutral-700", dark: "neutral-200" },
      { name: "button-primary-background-active", light: "neutral-black", dark: "neutral-white" },
      { name: "button-primary-foreground", light: "neutral-100", dark: "neutral-800" },
      { name: "button-secondary-background-hover", light: "neutral-100", dark: "neutral-700" },
      { name: "button-secondary-background-active", light: "neutral-200", dark: "neutral-900" },
      { name: "button-secondary-foreground", light: "neutral-600", dark: "neutral-200" },
      { name: "button-secondary-foreground-hover", light: "neutral-900", dark: "neutral-100" },
      { name: "button-secondary-border", light: "neutral-350", dark: "neutral-350" },
      { name: "button-secondary-border-hover", light: "neutral-400", dark: "neutral-300" },
      { name: "button-secondary-border-active", light: "neutral-600", dark: "neutral-200" },
      { name: "button-quiet-foreground", light: "neutral-400", dark: "neutral-300" },
      { name: "button-quiet-foreground-hover", light: "neutral-600", dark: "neutral-200" },
      { name: "button-disabled-background", light: "neutral-100", dark: "neutral-700" },
      { name: "button-disabled-foreground", light: "neutral-300", dark: "neutral-500" },
      { name: "button-disabled-border", light: "neutral-200", dark: "neutral-600" },
    ],
  },
] as const;

export const typeScale = [
  { name: "display", class: "text-display", size: "clamp(40px → 64px) / 1.02", weight: "Apparat Regular 400", sample: "Display" },
  { name: "title", class: "text-title", size: "36px / 1.08", weight: "Apparat Regular 400", sample: "Page or section title" },
  { name: "heading", class: "text-heading", size: "20px / 1.3", weight: "Apparat Medium 500", sample: "Shared heading" },
  { name: "body", class: "text-body", size: "14px / 1.5", weight: "Apparat Regular 400", sample: "Body, metadata, captions, and compact interface text." },
] as const;

export const spacingScale = [
  { name: "3xs", value: "0.25rem", px: "4px" },
  { name: "2xs", value: "0.5rem", px: "8px" },
  { name: "xs", value: "0.75rem", px: "12px" },
  { name: "sm", value: "1rem", px: "16px" },
  { name: "md", value: "1.5rem", px: "24px" },
  { name: "lg", value: "2rem", px: "32px" },
  { name: "xl", value: "3rem", px: "48px" },
  { name: "2xl", value: "4rem", px: "64px" },
  { name: "3xl", value: "6rem", px: "96px" },
  { name: "4xl", value: "8rem", px: "128px" },
] as const;

export const semanticSpacing = [
  { name: "gutter", value: "20px — page inset and safe-area floor" },
  { name: "section", value: "clamp(48px → 96px) — section rhythm" },
  { name: "stack", value: "16px — stacked content" },
  { name: "card", value: "16px — card interior" },
  { name: "grid", value: "10px — structural grid gutter" },
] as const;

export const containers = [
  { name: "page", value: "81.25rem", description: "1300px content / 1340px outer cap with gutters" },
  { name: "measure", value: "36rem", description: "576px reading measure" },
] as const;

export const aliases = [
  { name: "background", to: "background-primary" },
  { name: "foreground", to: "text-primary" },
  { name: "card", to: "background-elevated" },
  { name: "muted", to: "background-secondary" },
  { name: "muted-foreground", to: "text-secondary" },
  { name: "accent", to: "text-interactive" },
  { name: "accent-foreground", to: "text-alternate" },
  { name: "border", to: "border-primary" },
  { name: "ring", to: "border-hover" },
] as const;

export const pagePaletteRows = [
  {
    name: "Default",
    id: "default",
    light: "neutral-150 / neutral-600 / sage-500",
    dark: "neutral-800 / neutral-200 / sage-500",
    use: "Site default",
  },
  {
    name: "Blue",
    id: "blue",
    light: "blue-100 / blue-600 / blue-400",
    dark: "blue-900 / blue-200 / blue-300",
    use: "Available · currently unused",
  },
  {
    name: "Sage accent",
    id: "sage",
    light: "neutral-150 / neutral-600 / sage-500",
    dark: "neutral-800 / neutral-200 / sage-500",
    use: "Available · currently unused",
  },
] as const;

export const interactionFoundations = [
  {
    name: "Control geometry",
    description: "Compact for precise pointers; touch targets grow without changing the visual hierarchy.",
    rows: [
      { token: "--control-height-compact", value: "32px" },
      { token: "--control-height-touch", value: "48px" },
      { token: "--control-icon-size", value: "16px" },
      { token: "--control-switch-width / height", value: "32px / 20px" },
      { token: "--control-switch-thumb", value: "16px" },
    ],
  },
  {
    name: "Functional corners",
    description: "Structural surfaces stay square; curvature is reserved for controls and physical forms.",
    rows: [
      { token: "--radius-control", value: "6px" },
      { token: "--radius-round", value: "round geometry" },
      { token: "--radius-device", value: "32px" },
    ],
  },
  {
    name: "Motion",
    description: "Immediate feedback, restrained settling, and a reduced-motion path.",
    rows: [
      { token: "--motion-none", value: "0ms" },
      { token: "--motion-feedback", value: "140ms" },
      { token: "--motion-theme", value: "300ms" },
      { token: "--motion-settle", value: "340ms" },
    ],
  },
] as const;
