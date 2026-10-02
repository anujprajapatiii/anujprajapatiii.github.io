# Growth Atlas

Live at https://anujprajapatiii.github.io/growth-atlas/. This app is built by the parent repository and published through its `.github/workflows/deploy.yml` on pushes to `main`.

A working reference of 45 curated B2B SaaS growth patterns, 10 connected journeys, and 44 official references across 28 products. Built with React, TypeScript, Vite, and Base UI. The responsive grayscale demos are original interpretations of documented behaviors; references distinguish vendor documentation from editorial rationale and do not claim measured growth uplift. The integration recovery pattern remains explicitly labeled as an editorial proposal without a direct verified reference.

## Develop

- `npm ci`
- `npm run dev`
- `npm run build`
- `npm test`

The build generates a runnable source ZIP for each pattern in `public/source/`, then compiles the site. Generated archives are not committed. Each ZIP includes the actual React renderers, shared Base UI controls, local fonts and licenses, responsive styles, configuration, and a Vite starter. The archive generator clears previous outputs to avoid shipping retired packages.

For a local build matching the Pages project URL, run `BASE_PATH=/growth-atlas/ npm run build`, then `npx vite preview --base /growth-atlas/`. The parent build sets the base path to `/growth-atlas/`. Hash routes preserve direct pattern and journey links without a server rewrite.

## Content and behavior

`src/curation.ts` defines the active collection, grouped variants, decision guidance, and journeys. `src/catalog.ts` retains the original index for metadata and supported legacy links. `src/evidence.json` records official URLs, review dates, documented behavior, relevant patterns, and limitations. `src/Demo.tsx` and `src/AdvancedDemos.tsx` implement the interactions. `src/DemoRuntime.tsx` provides local context, asynchronous loading, failure/retry, and role conditions. `src/JourneyView.tsx` carries selected workspace, template, source, view, project, plan, seats, invitees, and reporting context between steps.

Saved patterns persist in this browser's localStorage. Demo state resets on reopening. Journey state persists while the journey is open and can be exported as JSON; it is cleared on reset. Deep links use `#pattern/<slug>` and `#journey/<id>`. CSV import validates row structure before local import, and export produces real sample files.

All demos are local simulations. They do not send invitations, process payments, authorize integrations, or create accounts. Replace request simulation with real services and enforce authorization and validation on the server before production use. Example prices and activity counts are illustrative.

Two optional WebMCP tools register when the browser supports `document.modelContext`: `search_growth_patterns` and `open_growth_pattern`. Unsupported browsers retain the full visible UI. Native WebMCP validation requires a supported runtime.

`npm test` checks curated navigation, journey references, and evidence provenance. The earlier browser walkthrough in `tests/interactive.mjs` targets the original catalog and is retained as a historical development script; it does not validate the current collection.
