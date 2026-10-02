import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
const result = await build({
  entryPoints: ["src/curation.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
});
const { patterns, journeys, evidence, resolvePattern } = await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);
test("curated navigation has unique identities and valid alternatives", () => {
  assert.equal(new Set(patterns.map((p) => p.id)).size, patterns.length);
  assert.equal(new Set(patterns.map((p) => p.slug)).size, patterns.length);
  for (const p of patterns) {
    assert.equal(resolvePattern(p.slug)?.id, p.id);
    for (const id of p.alternatives)
      assert.ok(
        patterns.some((x) => x.id === id),
        `${p.id} → ${id}`,
      );
    for (const id of p.variantIds) assert.equal(resolvePattern(id)?.id, p.id);
  }
});
test("each journey pairs available patterns with handoff guidance", () => {
  for (const j of journeys) {
    assert.equal(j.ids.length, j.steps.length, j.id);
    for (const id of j.ids)
      assert.ok(
        patterns.some((p) => p.id === id),
        `${j.id}: ${id}`,
      );
  }
});
test("references retain provenance and limits", () => {
  assert.equal(new Set(evidence.map((s) => s.id)).size, evidence.length);
  for (const s of evidence) {
    assert.match(s.url, /^https:\/\//);
    assert.match(s.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(s.observed && s.limits && s.product);
  }
});
