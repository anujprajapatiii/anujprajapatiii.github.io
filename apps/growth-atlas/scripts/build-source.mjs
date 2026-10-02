import fs from "node:fs";
import path from "node:path";
import { deflateRawSync } from "node:zlib";
import { build } from "esbuild";
const built = await build({
  entryPoints: ["src/curation.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
});
const { patterns } = await import(
  "data:text/javascript;base64," +
    Buffer.from(built.outputFiles[0].text).toString("base64")
);
const advanced = new Set([3, 11, 12, 20, 24, 35, 36, 57, 74, 77, 88, 97]);
const table = Array.from({ length: 256 }, (_, n) => {
  for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc(b) {
  let c = 0xffffffff;
  for (const n of b) c = table[(c ^ n) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function zip(files) {
  const parts = [],
    central = [];
  let offset = 0;
  for (const [name, input] of Object.entries(files)) {
    const data = Buffer.isBuffer(input) ? input : Buffer.from(input);
    const nameBytes = Buffer.from(name);
    const compressed = deflateRawSync(data, { level: 9 });
    const checksum = crc(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(8, 8);
    header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBytes.length, 26);
    parts.push(header, nameBytes, compressed);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(8, 10);
    directory.writeUInt32LE(checksum, 16);
    directory.writeUInt32LE(compressed.length, 20);
    directory.writeUInt32LE(data.length, 24);
    directory.writeUInt16LE(nameBytes.length, 28);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, nameBytes);
    offset += header.length + nameBytes.length + compressed.length;
  }
  const directory = Buffer.concat(central),
    end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, directory, end]);
}
const originalPackage = JSON.parse(fs.readFileSync("package.json", "utf8"));
const baseFiles = {};
for (const file of [
  "Demo.tsx",
  "AdvancedDemos.tsx",
  "DemoRuntime.tsx",
  "ui.tsx",
  "style.css",
])
  baseFiles["src/" + file] = fs.readFileSync("src/" + file);
baseFiles["src/catalog.ts"] = fs
  .readFileSync("src/catalog.ts", "utf8")
  .split("\n")
  .slice(0, 2)
  .join("\n");
baseFiles["src/curation.ts"] =
  "import type {Pattern} from './catalog';\nexport type CuratedPattern=Pattern & {states:string[]};\n";
baseFiles["tsconfig.json"] = fs.readFileSync("tsconfig.json");
baseFiles["vite.config.ts"] =
  "import {defineConfig} from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({plugins:[react()]});\n";
baseFiles["src/vite-env.d.ts"] = '/// <reference types="vite/client" />\n';
baseFiles["index.html"] =
  '<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Growth pattern prototype</title><link rel="icon" href="/favicon.svg"/></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>';
baseFiles["public/favicon.svg"] = fs.readFileSync("public/favicon.svg");
for (const file of fs.readdirSync("public/fonts"))
  baseFiles["public/fonts/" + file] = fs.readFileSync("public/fonts/" + file);
baseFiles[".gitignore"] = "node_modules/\ndist/\n*.tsbuildinfo\n.env*\n";
fs.rmSync("public/source", { recursive: true, force: true });
fs.mkdirSync("public/source", { recursive: true });
for (const p of patterns) {
  const files = { ...baseFiles };
  files["package.json"] = JSON.stringify(
    {
      name: "growth-pattern-" + p.slug,
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: { dev: "vite --host 0.0.0.0", build: "tsc -b && vite build" },
      dependencies: originalPackage.dependencies,
      devDependencies: Object.fromEntries(
        Object.entries(originalPackage.devDependencies).filter(
          ([k]) => k !== "@playwright/test",
        ),
      ),
    },
    null,
    2,
  );
  files["src/pattern.json"] = JSON.stringify(p, null, 2);
  files["src/App.tsx"] =
    `import {DemoRuntime} from './DemoRuntime';\nimport Demo from './${advanced.has(p.id) ? "AdvancedDemos" : "Demo"}';\nimport pattern from './pattern.json';\nimport type {CuratedPattern} from './curation';\nexport default function App(){const p=pattern as CuratedPattern;return <main style={{maxWidth:630,margin:'40px auto',padding:'0 18px'}}><DemoRuntime pattern={p}><Demo p={p}/></DemoRuntime></main>;}\n`;
  files["src/main.tsx"] =
    "import {createRoot} from 'react-dom/client';\nimport App from './App';\nimport './style.css';\ncreateRoot(document.getElementById('root')!).render(<App/>);\n";
  files["README.md"] =
    `# ${p.title}\n\nRunnable React + Base UI prototype from Growth Atlas.\n\n## Run\n\n- npm install\n- npm run dev\n- npm run build\n\n## Adapt\n\nEdit src/pattern.json for copy and configuration. The active pattern ID is ${p.id}. Its renderer lives in src/${advanced.has(p.id) ? "AdvancedDemos" : "Demo"}.tsx. Shared accessible controls are in src/ui.tsx. Responsive grayscale presentation is in src/style.css. Font license files are included in public/fonts.\n\nDemoRuntime supplies workspace context and simulated async request states. Choose a role, slow connection, or next-request failure under Explore conditions. Successful retries keep the original inputs. Replace the local simulator with your real API and server-side authorization before shipping.\n\nThis code does not send emails, collect payments, create accounts, or request provider authorization. Use provider-confirmed results in production. The original demo is an interpretation, not a reproduction of the referenced products. No performance uplift is claimed. Dependencies retain their own licenses.\n\n## Purpose\n${p.job}\n\n## Trigger\n${p.trigger}\n\n## Design rationale\n${p.insight}\n\n## Avoid\n${p.avoid}\n\n## References\n${p.sources.map((s) => `- ${s.product}: ${s.title} — ${s.url} (reviewed ${s.checkedAt})\n  ${s.observed}\n  Limit: ${s.limits}`).join("\n")}\n`;
  fs.writeFileSync(`public/source/${p.slug}.zip`, zip(files));
}
fs.writeFileSync(
  "public/source/manifest.json",
  JSON.stringify(
    patterns.map((p) => ({
      id: p.id,
      title: p.title,
      path: `${process.env.BASE_PATH || "/"}source/${p.slug}.zip`,
    })),
    null,
    2,
  ),
);
console.log(`Prepared ${patterns.length} runnable source packages.`);
