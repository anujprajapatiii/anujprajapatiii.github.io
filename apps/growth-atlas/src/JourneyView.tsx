import { useCallback, useRef, useState } from "react";
import { Check, RotateCcw, Smartphone, Monitor, Download } from "lucide-react";
import { patterns, type Journey } from "./curation";
import {
  DemoRuntime,
  emptyContext,
  type DemoSnapshot,
  type JourneyContext,
} from "./DemoRuntime";
import Demo from "./Demo";
import AdvancedDemo, { advancedIds } from "./AdvancedDemos";
import { download } from "./ui";
export function PatternPreview({
  id,
  initial,
  context,
  onChange,
  onComplete,
}: {
  id: number;
  initial?: DemoSnapshot;
  context?: JourneyContext;
  onChange?: (v: DemoSnapshot) => void;
  onComplete?: () => void;
}) {
  const p = patterns.find((p) => p.id === id)!;
  return (
    <DemoRuntime
      pattern={p}
      initial={initial}
      context={context}
      onChange={onChange}
      onComplete={onComplete}
    >
      {advancedIds.has(id) ? <AdvancedDemo p={p} /> : <Demo p={p} />}
    </DemoRuntime>
  );
}
function applyContext(
  id: number,
  s: DemoSnapshot,
  c: JourneyContext,
): JourneyContext {
  const next = { ...c };
  if (s.email) next.email = s.email;
  if (id === 5 && s.choice) next.template = s.choice;
  if (id === 25) next.sources = s.checks || [];
  if (id === 43 && s.name) next.view = s.name;
  if (id === 13 && s.name) next.workspace = s.name;
  if (id === 31 && s.people?.length)
    next.project = s.people[s.people.length - 1];
  if (
    [3, 4, 73].includes(id) &&
    s.choice &&
    ["Starter", "Team", "Business"].includes(s.choice)
  )
    next.plan = s.choice;
  if ([3, 54, 59].includes(id) && s.amount) next.seats = s.amount;
  if (id === 54) next.annual = !!s.annual;
  if (id === 58) next.addOns = s.checks || [];
  if (id === 24) {
    next.invitees = s.people || [];
    next.invitationRoles = Object.fromEntries(
      (s.invitations || []).map((x) => [x.email, x.role]),
    );
  }
  if (id === 23 && s.rows) next.records = Math.max(0, s.rows.length - 1);
  if (id === 35 && s.name) next.report = s.name;
  if (id === 44) next.goal = `${s.amount} ${s.choice}`;
  return next;
}
function ready(id: number, s: DemoSnapshot) {
  const p = patterns.find((x) => x.id === id)!;
  if (["checklist", "milestone"].includes(p.kind) && id !== 74)
    return s.checks?.length === p.items.length;
  if (p.kind === "connect" && id !== 97) return (s.checks?.length || 0) > 0;
  if (p.kind === "share") return s.link === true;
  if (p.kind === "calculator") return true;
  return !!s.done;
}
export default function JourneyView({
  journey,
  onExit,
  onPattern,
}: {
  journey: Journey;
  onExit: () => void;
  onPattern: (id: number) => void;
}) {
  const [step, setStep] = useState(0),
    [context, setContext] = useState<JourneyContext>(emptyContext),
    [snapshots, setSnapshots] = useState<Record<number, DemoSnapshot>>({}),
    [completed, setCompleted] = useState<number[]>([]),
    [skipped, setSkipped] = useState<number[]>([]),
    [mobile, setMobile] = useState(false),
    [revision, setRevision] = useState(0),
    [finished, setFinished] = useState(false);
  const id = journey.ids[step],
    p = patterns.find((x) => x.id === id)!;
  const onChange = useCallback(
    (value: DemoSnapshot) => setSnapshots((prev) => ({ ...prev, [id]: value })),
    [id],
  );
  function advance(skip = false) {
    if (skip) setSkipped((prev) => [...new Set([...prev, id])]);
    else {
      setCompleted((prev) => [...new Set([...prev, id])]);
      setSkipped((prev) => prev.filter((x) => x !== id));
      setContext((c) => applyContext(id, snapshots[id] || {}, c));
    }
    if (step === journey.ids.length - 1) setFinished(true);
    else setStep(step + 1);
  }
  function reset() {
    setStep(0);
    setContext(emptyContext);
    setSnapshots({});
    setCompleted([]);
    setSkipped([]);
    setFinished(false);
    setRevision((n) => n + 1);
  }
  return (
    <section className="journey-workbench">
      <div className="journey-intro">
        <button className="text-button" onClick={onExit}>
          All journeys
        </button>
        <span className="eyebrow">CONNECTED JOURNEY · {journey.persona}</span>
        <h1>{journey.title}</h1>
        <p>{journey.description}</p>
      </div>
      <div className="journey-layout">
        <aside className="journey-outline">
          <div className="journey-entry">
            <small>ENTRY CONDITION</small>
            <p>{journey.entry}</p>
          </div>
          <ol>
            {journey.ids.map((id, i) => (
              <li key={id}>
                <button
                  className={step === i && !finished ? "active" : ""}
                  onClick={() => {
                    setStep(i);
                    setFinished(false);
                  }}
                  aria-current={step === i ? "step" : undefined}
                >
                  <span>
                    {completed.includes(id) ? (
                      <Check size={14} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <div>
                    {patterns.find((p) => p.id === id)!.title}
                    {skipped.includes(id) && <small>Skipped</small>}
                  </div>
                </button>
              </li>
            ))}
          </ol>
          <button className="text-button" onClick={reset}>
            <RotateCcw size={14} />
            Reset journey
          </button>
        </aside>
        <div className="journey-main">
          {finished ? (
            <div className="journey-finished">
              <Check size={30} />
              <span className="eyebrow">JOURNEY REVIEW</span>
              <h2>
                {completed.length === journey.ids.length
                  ? "The flow is complete."
                  : "Your walkthrough is ready to review."}
              </h2>
              <p>
                {completed.length} completed steps · {skipped.length} skipped.
                All changes stayed in this local preview.
              </p>
              <p>{journey.exit}</p>
              <button
                className="primary"
                onClick={() =>
                  download(
                    `${journey.id}-walkthrough.json`,
                    JSON.stringify(
                      {
                        journey: journey.title,
                        context,
                        completed,
                        skipped,
                        steps: snapshots,
                      },
                      null,
                      2,
                    ),
                    "application/json",
                  )
                }
              >
                <Download size={16} />
                Download this walkthrough
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setStep(0);
                  setFinished(false);
                }}
              >
                Revisit the steps
              </button>
            </div>
          ) : (
            <>
              <div className="journey-step-heading">
                <div>
                  <span className="eyebrow">
                    STEP {step + 1} OF {journey.ids.length}
                  </span>
                  <h2>{p.title}</h2>
                </div>
                <div className="device-tools">
                  <button
                    className={!mobile ? "active" : ""}
                    aria-label="Desktop preview"
                    onClick={() => setMobile(false)}
                  >
                    <Monitor size={17} />
                  </button>
                  <button
                    className={mobile ? "active" : ""}
                    aria-label="Mobile preview"
                    onClick={() => setMobile(true)}
                  >
                    <Smartphone size={17} />
                  </button>
                </div>
              </div>
              <div className="journey-reason">
                <p>{journey.steps[step].why}</p>
                <small>{journey.steps[step].handoff}</small>
                <button className="text-button" onClick={() => onPattern(id)}>
                  Read this pattern’s rationale
                </button>
              </div>
              <div className={`journey-demo ${mobile ? "narrow" : ""}`}>
                <PatternPreview
                  key={`${journey.id}-${id}-${revision}`}
                  id={id}
                  initial={snapshots[id]}
                  context={context}
                  onChange={onChange}
                />
              </div>
              <div className="journey-navigation">
                <button
                  className="secondary"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                >
                  Previous step
                </button>
                <button className="text-button" onClick={() => advance(true)}>
                  Skip this step
                </button>
                <button
                  className="primary"
                  disabled={!ready(id, snapshots[id] || {})}
                  onClick={() => advance()}
                >
                  {step === journey.ids.length - 1
                    ? "Finish journey"
                    : "Save step & continue"}
                </button>
              </div>
              {!ready(id, snapshots[id] || {}) && (
                <p className="journey-hint">
                  Complete the interaction to carry its result forward, or
                  explicitly skip this step.
                </p>
              )}
            </>
          )}
        </div>
        <aside className="journey-context">
          <span className="eyebrow">CARRIED THROUGH THIS JOURNEY</span>
          <h3>{context.workspace} workspace</h3>
          {[
            ["Identity", context.email || "Not set"],
            ["Template", context.template || "Not selected"],
            ["Sources", context.sources.join(", ") || "None"],
            ["Saved view", context.view || "Not saved"],
            ["Project", context.project || "Not created"],
            ["Plan", context.plan],
            ["Paid seats", String(context.seats)],
            ["Billing", context.annual ? "Annual" : "Monthly"],
            ["Add-ons", context.addOns.join(", ") || "None"],
            ["Invitees", context.invitees.join(", ") || "None"],
            ["Imported records", String(context.records)],
            ["Report", context.report || "Not created"],
            ["Goal", context.goal || "Not set"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <p>
            Context updates when you save a step. It stays in this open journey
            and is cleared on reset.
          </p>
        </aside>
      </div>
    </section>
  );
}
