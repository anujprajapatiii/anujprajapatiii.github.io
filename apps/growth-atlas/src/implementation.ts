import Demo from "./Demo.tsx?raw";
import Advanced from "./AdvancedDemos.tsx?raw";
import Runtime from "./DemoRuntime.tsx?raw";
import Controls from "./ui.tsx?raw";
import type { CuratedPattern } from "./curation";
export const implementationFiles: Record<string, string> = {
  "Demo.tsx": Demo,
  "AdvancedDemos.tsx": Advanced,
  "DemoRuntime.tsx": Runtime,
  "ui.tsx": Controls,
};
export function usageCode(p: CuratedPattern) {
  return `import { DemoRuntime } from './DemoRuntime';\nimport Demo from './${[3, 11, 12, 20, 24, 35, 36, 57, 74, 77, 88, 97].includes(p.id) ? "AdvancedDemos" : "Demo"}';\nimport pattern from './pattern.json';\nimport type { CuratedPattern } from './curation';\nimport './style.css';\n\nexport default function ${p.slug
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(
      "",
    )}() {\n  const configuration = pattern as CuratedPattern;\n  return (\n    <DemoRuntime\n      pattern={configuration}\n      onChange={(state) => { /* Connect to your draft state */ }}\n      onComplete={() => { /* Local preview is complete */ }}\n    >\n      <Demo p={configuration} />\n    </DemoRuntime>\n  );\n}\n\n// DemoRuntime provides editable workspace context, role checks,\n// and a local async request simulator. Replace these local boundaries\n// with your own API, server authorization, and verified outcomes.\n// No third-party products, messages, payments, or accounts are connected.\n`;
}
