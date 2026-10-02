import { useState, useEffect } from "react";
import { useDemoRuntime } from "./DemoRuntime";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import {
  ArrowRight,
  Check,
  CheckCheck,
  Plus,
  ArrowUpRight,
  Lock,
  Link2,
  FileText,
  Users,
  Mail,
  BarChart3,
  ChevronLeft,
  Download,
  Upload,
  ChevronRight,
  ShieldCheck,
  Copy,
  X,
} from "lucide-react";
import type { Pattern } from "./catalog";
import { CheckRow, Toggle, Range, Meter, Pick, download, copyText } from "./ui";
const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(v);
function Choices({
  items,
  value,
  set,
}: {
  items: string[];
  value: string;
  set: (v: string) => void;
}) {
  return (
    <RadioGroup
      className="choices"
      value={value}
      onValueChange={(v) => set(String(v))}
    >
      {items.map((x, i) => (
        <label className="choice" key={x}>
          <Radio.Root value={x} className="radio">
            <Radio.Indicator className="radio-dot" />
          </Radio.Root>
          <span>{x}</span>
          <span className="choice-index">0{i + 1}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
function Result({
  title,
  children,
  onBack,
}: {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="result" role="status">
      <span className="result-icon">
        <CheckCheck size={25} />
      </span>
      <h3>{title}</h3>
      <div className="result-copy">{children}</div>
      {onBack && (
        <button className="secondary" onClick={onBack}>
          Edit your choice
        </button>
      )}
    </div>
  );
}
const csv =
  "Account,Owner,Status\nNorthstar,Alex,Active\nMeridian,Sam,In review\nArc Studio,Jules,Active";
export function parseCSV(input: string) {
  const lines: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quote = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quote && input[i + 1] === '"') {
        value += '"';
        i++;
      } else quote = !quote;
    } else if (c === "," && !quote) {
      row.push(value);
      value = "";
    } else if ((c === "\n" || c === "\r") && !quote) {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(value);
      if (row.some((x) => x.trim())) lines.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (quote) throw new Error("Close the quoted field before importing.");
  row.push(value);
  if (row.some((x) => x.trim())) lines.push(row);
  return lines;
}
export default function Demo({ p }: { p: Pattern }) {
  const runtime = useDemoRuntime();
  const initial = runtime.initial;
  const [done, setDone] = useState(initial?.done || false),
    [step, setStep] = useState(initial?.step || 0),
    [choice, setChoice] = useState(
      initial?.choice ||
        (["pricing", "downgrade"].includes(p.kind) &&
        p.items.includes(runtime.context.plan)
          ? runtime.context.plan
          : p.items[0]),
    ),
    [checks, setChecks] = useState<string[]>(initial?.checks || []),
    [name, setName] = useState(
      initial?.name ||
        (p.id === 35
          ? runtime.context.report
          : p.id === 13
            ? runtime.context.workspace === "Acme"
              ? ""
              : runtime.context.workspace
            : p.id === 31
              ? runtime.context.project || runtime.context.template
              : ""),
    ),
    [email, setEmail] = useState(initial?.email || runtime.context.email),
    [extra, setExtra] = useState(initial?.extra || ""),
    [error, setError] = useState(""),
    [amount, setAmount] = useState(
      initial?.amount || ([54, 59].includes(p.id) ? runtime.context.seats : 12),
    ),
    [hours, setHours] = useState(3),
    [cost, setCost] = useState(45),
    [annual, setAnnual] = useState(initial?.annual ?? runtime.context.annual),
    [count, setCount] = useState(initial?.count ?? 3),
    [query, setQuery] = useState(""),
    [rows, setRows] = useState<string[][]>(initial?.rows || []),
    [raw, setRaw] = useState(""),
    [people, setPeople] = useState<string[]>(initial?.people || []),
    [message, setMessage] = useState(initial?.message || ""),
    [link, setLink] = useState(initial?.link || false);
  const toggle = (item: string, v: boolean) =>
    setChecks((prev) =>
      v
        ? [...prev.filter((x) => x !== item), item]
        : prev.filter((x) => x !== item),
    );
  useEffect(() => {
    runtime.report({
      done,
      step,
      choice,
      checks,
      name,
      email,
      extra,
      amount,
      annual,
      count,
      rows,
      people,
      message,
      link,
    });
  }, [
    done,
    step,
    choice,
    checks,
    name,
    email,
    extra,
    amount,
    annual,
    count,
    rows,
    people,
    message,
    link,
  ]);
  const next = () => {
    setError("");
    setDone(true);
    runtime.complete();
  };
  const action = (label: string, fn = next, disabled = false) => (
    <button
      className="primary demo-action"
      disabled={disabled || runtime.busy}
      onClick={() => runtime.run(label, fn)}
    >
      {label}
    </button>
  );
  const monthlyPrice =
    runtime.context.plan === "Starter"
      ? 0
      : runtime.context.plan === "Business"
        ? 49
        : 19;
  const planPrice = annual ? monthlyPrice * 0.8 : monthlyPrice;
  const endDate = new Date(Date.now() + 14 * 86400000).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" },
  );
  const resumeDate = new Date(
    new Date().setMonth(new Date().getMonth() + Number.parseInt(choice || "1")),
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  let content: React.ReactNode;
  switch (p.kind) {
    case "calculator":
      content = (
        <>
          <div className="range-stack">
            <Range
              label={p.items[0]}
              value={amount}
              onChange={setAmount}
              max={100}
            />
            <Range
              label={p.items[1]}
              value={hours}
              onChange={setHours}
              max={20}
            />
            <Range
              label={p.items[2]}
              value={cost}
              onChange={setCost}
              min={10}
              max={200}
              unit="$"
            />
          </div>
          <div className="calculation">
            <span>Estimated annual capacity value</span>
            <strong>{money(amount * hours * cost * 48)}</strong>
            <small>{amount * hours * 48} hours / year · 48 working weeks</small>
          </div>
          <p className="fine-print">
            Assumes {hours} hours saved per person each week. Gross capacity
            estimate, before software and implementation costs.
          </p>
          {action(done ? "Estimate saved" : "Save this estimate", () => {
            download(
              "capacity-estimate.txt",
              `${p.title}\nPeople: ${amount}\nHours/person/week: ${hours}\nHourly cost: $${cost}\nAnnual gross capacity: ${money(amount * hours * cost * 48)}\nAssumption: 48 weeks/year; excludes software and implementation costs.`,
            );
            setDone(true);
          })}
        </>
      );
      break;
    case "lead":
      content = done ? (
        <Result
          title={
            p.id === 70 ? "Extension request prepared" : "Your request is ready"
          }
          onBack={() => setDone(false)}
        >
          <p>
            Prepared for <strong>{email}</strong>.
          </p>
          <p>
            {name} · {extra}
          </p>
          <p>
            This is a local prototype. No account, request, or email was sent.
          </p>
          <button
            className="secondary"
            onClick={() =>
              download(
                "request.txt",
                `${p.title}\nEmail: ${email}\n${p.items[1]}: ${name}\n${p.items[2]}: ${extra}`,
              )
            }
          >
            <Download size={15} /> Download your request
          </button>
        </Result>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !extra.trim()) {
              setError("Complete each field to continue.");
              return;
            }
            runtime.run("Submit request", next);
          }}
        >
          <label className="field">
            {p.items[0]}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </label>
          <label className="field">
            {p.items[1]}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                p.items[1].includes("name") ? "Acme team" : "Your team"
              }
            />
          </label>
          <label className="field">
            {p.items[2]}
            <textarea
              required
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="A little context helps…"
              rows={2}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="primary demo-action" type="submit">
            {p.id === 11 ? "Create demo account" : "Prepare request"}
            <ArrowRight size={16} />
          </button>
          <p className="fine-print">
            Sandbox only. Your details stay in this open demo.
          </p>
        </form>
      );
      break;
    case "quiz":
      content = done ? (
        <Result
          title="A starting point, picked for you"
          onBack={() => setDone(false)}
        >
          <p>
            You chose <strong>{choice}</strong>.
          </p>
          <div className="recommend">
            <strong>
              {p.items.indexOf(choice) === 0
                ? "A focused personal workspace"
                : p.items.indexOf(choice) === 1
                  ? "A collaborative team workspace"
                  : "A workspace built to scale"}
            </strong>
            <p>
              {p.items.indexOf(choice) === 0
                ? "Start with one project and three useful tasks."
                : p.items.indexOf(choice) === 1
                  ? "Start with a shared project, clear owners, and a weekly review."
                  : "Start with a team template, role permissions, and a rollout checklist."}
            </p>
          </div>
        </Result>
      ) : (
        <>
          <Choices items={p.items} value={choice} set={setChoice} />
          {action("See my starting point")}
        </>
      );
      break;
    case "checklist":
      content = (
        <>
          <Meter
            value={(checks.length / p.items.length) * 100}
            label={`${checks.length} of ${p.items.length} complete`}
          />
          <div className="checklist">
            {p.items.map((x, i) => (
              <CheckRow
                key={x}
                label={x}
                checked={checks.includes(x)}
                onChange={(v) => toggle(x, v)}
                detail={
                  checks.includes(x)
                    ? "Complete"
                    : `Step ${i + 1} · ready when you are`
                }
              />
            ))}
          </div>
          {checks.length === p.items.length ? (
            <div className="inline-success" role="status">
              <CheckCheck size={18} /> All set. Your next step is ready.
            </div>
          ) : (
            <p className="fine-print">
              Mark each step as you try the flow. Progress is local to this
              demo.
            </p>
          )}
        </>
      );
      break;
    case "wizard":
      content = done ? (
        <Result
          title={p.id === 88 ? "Story draft prepared" : "Your setup is ready"}
          onBack={() => {
            setDone(false);
            setStep(2);
          }}
        >
          <div className="review-row">
            <span>Name</span>
            <strong>{name}</strong>
          </div>
          <div className="review-row">
            <span>Focus</span>
            <strong>{choice}</strong>
          </div>
          <p>
            {p.id === 88
              ? "Your draft is ready for review; nothing has been published."
              : "Your local workspace preview is configured. Nothing was created outside this demo."}
          </p>
        </Result>
      ) : (
        <>
          <div className="steps">
            {p.items.map((x, i) => (
              <span key={x} className={i <= step ? "active" : ""}>
                {i < step ? <Check size={12} /> : i + 1}
              </span>
            ))}
          </div>
          <p className="step-label">
            Step {step + 1} of 3 · {p.items[step]}
          </p>
          {step === 0 ? (
            <label className="field">
              {p.items[0]}
              <input
                placeholder="e.g. Customer onboarding"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          ) : step === 1 ? (
            <Choices
              items={[
                "Coordinate a team",
                "Track a project",
                "Automate routine work",
              ]}
              value={choice}
              set={setChoice}
            />
          ) : (
            <div className="review">
              <div className="review-row">
                <span>Name</span>
                <strong>{name}</strong>
              </div>
              <div className="review-row">
                <span>Focus</span>
                <strong>{choice}</strong>
              </div>
              <div className="review-row">
                <span>Visibility</span>
                <strong>Private workspace</strong>
              </div>
            </div>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="button-row">
            {step > 0 && (
              <button className="secondary" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={15} />
                Back
              </button>
            )}
            {action(step === 2 ? "Confirm setup" : "Continue", () => {
              if (step === 0 && !name.trim()) {
                setError("Give your workspace a name to continue.");
                return;
              }
              setError("");
              if (step === 0) setChoice("Coordinate a team");
              step === 2 ? setDone(true) : setStep(step + 1);
            })}
          </div>
        </>
      );
      break;
    case "import":
      {
        const isExport = p.id === 80;
        content = done ? (
          <Result
            title={
              isExport
                ? "Your export is downloaded"
                : `${rows.length - 1} records imported`
            }
            onBack={() => setDone(false)}
          >
            <p>
              {isExport
                ? "The sample CSV contains your visible account, owner, and status columns."
                : "Your validated records are now shown in this demo workspace."}
            </p>
            <Table rows={rows} />
          </Result>
        ) : (
          <>
            <div className="dropzone">
              <FileText size={26} />
              <strong>{isExport ? "Workspace records" : "Import a CSV"}</strong>
              <p>
                {isExport
                  ? "Preview your data, then take it with you."
                  : "Account, Owner, Status · maximum 100 KB"}
              </p>
              {!isExport && (
                <label className="secondary file-label">
                  <Upload size={14} />
                  Choose file
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 100000) {
                        setError("Choose a CSV under 100 KB.");
                        return;
                      }
                      setRaw(await file.text());
                      setRows([]);
                      setError("");
                    }}
                  />
                </label>
              )}
              <button
                className="text-button"
                onClick={() => {
                  setRaw(csv);
                  setRows(parseCSV(csv));
                  setError("");
                }}
              >
                {isExport ? "Preview sample export" : "Use sample data"}
              </button>
            </div>
            {raw && !rows.length && (
              <button
                className="secondary full"
                onClick={() => {
                  try {
                    const parsed = parseCSV(raw);
                    if (
                      parsed.length < 2 ||
                      parsed[0].join(",").toLowerCase() !==
                        "account,owner,status" ||
                      parsed.some(
                        (r) => r.length !== 3 || r.some((c) => !c.trim()),
                      )
                    )
                      throw new Error(
                        "Use Account, Owner, Status headers and three non-empty values in each row.",
                      );
                    setRows(parsed);
                    setError("");
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                Validate & preview
              </button>
            )}
            {rows.length > 0 && <Table rows={rows} />}
            <p className="error" role="alert">
              {error}
            </p>
            {action(
              isExport
                ? "Download CSV"
                : `Import ${Math.max(0, rows.length - 1)} records`,
              () => {
                if (isExport) download("workspace-export.csv", csv, "text/csv");
                next();
              },
              !rows.length,
            )}
          </>
        );
      }
      break;
    case "invite":
      content = done ? (
        <Result
          title={
            p.id === 20
              ? "Invitation accepted in preview"
              : "Invitations prepared"
          }
          onBack={() => setDone(false)}
        >
          <p>
            {p.id === 20
              ? "You are previewing membership in the Acme workspace."
              : `${people.length} invitation${people.length === 1 ? "" : "s"} ready for review.`}
          </p>
          <div className="invited-list">
            {people.map((x) => (
              <div key={x}>
                <Mail size={15} />
                {x}
                <span>Prepared</span>
              </div>
            ))}
          </div>
          <p>No email has been sent from this demo.</p>
        </Result>
      ) : (
        <>
          <div className="workspace-chip">
            <span className="avatar">A</span>
            <div>
              <strong>{runtime.company} workspace</strong>
              <small>Private · Member access</small>
            </div>
            <Users size={19} />
          </div>
          <form
            className="inline-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (people.includes(email.trim())) {
                setError("That person is already on your list.");
                return;
              }
              setPeople([...people, email.trim()]);
              setEmail("");
              setError("");
            }}
          >
            <label className="field">
              Teammate email
              <input
                type="email"
                required
                placeholder="teammate@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button
              className="secondary"
              aria-label="Add teammate"
              type="submit"
            >
              <Plus size={18} />
            </button>
          </form>
          <button
            className="text-button"
            onClick={() => {
              setPeople(p.items);
              setError("");
            }}
          >
            Add sample teammates
          </button>
          <p role="alert" className="error">
            {error}
          </p>
          {people.map((x) => (
            <div key={x} className="person-row">
              <span className="avatar small">{x[0].toUpperCase()}</span>
              <span>{x}</span>
              <button
                className="icon-button"
                aria-label={`Remove ${x}`}
                onClick={() => setPeople(people.filter((y) => y !== x))}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {action(
            p.id === 20
              ? "Accept sample invitation"
              : `Prepare ${people.length || ""} invitation${people.length === 1 ? "" : "s"}`,
            next,
            people.length === 0,
          )}
          <p className="fine-print">
            No emails sent. In a live product, confirm seat costs before
            sending.
          </p>
        </>
      );
      break;
    case "connect":
      content = (
        <>
          <div className="integrations">
            {p.items.map((x, i) => (
              <div className="integration" key={x}>
                <span className="app-icon">{x.slice(0, 1)}</span>
                <div>
                  <strong>{x}</strong>
                  <small>
                    {checks.includes(x)
                      ? "Connected · 3 sample records"
                      : "Read-only · selected workspace"}
                  </small>
                </div>
                <button
                  className={checks.includes(x) ? "connected" : "secondary"}
                  onClick={() =>
                    runtime.run(
                      checks.includes(x)
                        ? "Disconnect source"
                        : "Connect source",
                      () => toggle(x, !checks.includes(x)),
                    )
                  }
                >
                  {checks.includes(x) ? (
                    <>
                      <Check size={14} />
                      Disconnect
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            ))}
          </div>
          {checks.length > 0 && (
            <div className="sync-preview">
              <span className="eyebrow">SYNC PREVIEW</span>
              <p>
                {checks.length * 3} sample records available from{" "}
                {checks.join(", ")}.
              </p>
              <Meter value={100} label="Sample sync complete" />
            </div>
          )}
          <p className="fine-print">
            Simulated connections. No external permissions are requested.
          </p>
        </>
      );
      break;
    case "template":
      content = done ? (
        <Result
          title={
            p.id === 83
              ? "Contribution draft created"
              : "Template added to your preview"
          }
          onBack={() => setDone(false)}
        >
          <p>
            <strong>{choice}</strong> is ready to adapt.
          </p>
          <div className="sample-board">
            {["To do", "In progress", "Done"].map((x, i) => (
              <div key={x}>
                <small>{x}</small>
                <span>
                  {
                    [
                      "Define the outcome",
                      "Assign an owner",
                      "Review the result",
                    ][i]
                  }
                </span>
              </div>
            ))}
          </div>
          <p>This sample keeps your existing workspace intact.</p>
        </Result>
      ) : (
        <>
          <div className="template-list">
            {p.items.map((x, i) => (
              <button
                key={x}
                className={`template-option ${choice === x ? "selected" : ""}`}
                onClick={() => setChoice(x)}
                aria-pressed={choice === x}
              >
                <span className="template-art">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <strong>{x}</strong>
                  <small>
                    {i + 3} stages · {i + 5} example tasks
                  </small>
                </span>
                {choice === x ? (
                  <Check size={17} />
                ) : (
                  <ChevronRight size={17} />
                )}
              </button>
            ))}
          </div>
          <div className="preview-box">
            <small>INSIDE THIS TEMPLATE</small>
            <div>
              {["Plan the work", "Assign ownership", "Track progress"].map(
                (x) => (
                  <span key={x}>
                    <Check size={12} />
                    {x}
                  </span>
                ),
              )}
            </div>
          </div>
          {action(
            p.id === 83 ? "Create contribution draft" : "Use this template",
          )}
        </>
      );
      break;
    case "tour":
      content = done ? (
        <Result
          title="You’re ready to explore"
          onBack={() => {
            setStep(0);
            setDone(false);
          }}
        >
          <p>You’ve seen {p.items.join(", ").toLowerCase()}.</p>
          <p>Start with one real project and build from there.</p>
        </Result>
      ) : (
        <>
          <div className="tour-window">
            <div className="window-toolbar">
              <i />
              <i />
              <i />
              <span>acme.workspace</span>
            </div>
            <div className="tour-shell">
              <div className="tour-nav">
                <i />
                <i />
                <i />
              </div>
              <div className="tour-body">
                <strong>{p.items[step]}</strong>
                {[0, 1, 2].map((i) => (
                  <div className={i === step ? "tour-highlight" : ""} key={i}>
                    <span className="mini-square" />
                    <span>
                      {["Customer launch", "Weekly report", "Team handoff"][i]}
                    </span>
                    {i === step && <ArrowUpRight size={13} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="tour-caption">
            <span className="step-pill">
              {step + 1} / {p.items.length}
            </span>
            <div>
              <h4>{p.items[step]}</h4>
              <p>
                {
                  [
                    "Start with a clear view of the work that matters.",
                    "Add context so your team can take the next step.",
                    "Review the result and decide what to do next.",
                  ][step]
                }
              </p>
            </div>
          </div>
          <div className="button-row">
            <button className="text-button" onClick={() => setDone(true)}>
              Skip tour
            </button>
            {action(step === p.items.length - 1 ? "Finish tour" : "Next", () =>
              step === p.items.length - 1 ? setDone(true) : setStep(step + 1),
            )}
          </div>
        </>
      );
      break;
    case "create":
      content = (
        <>
          {!people.length ? (
            <div className="empty-project">
              <span className="empty-illustration">
                <FileText size={30} />
                <Plus size={15} />
              </span>
              <h3>A little structure goes a long way.</h3>
              <p>
                {runtime.context.template
                  ? `Start from your ${runtime.context.template} template.`
                  : "Start with one project. The details can follow."}
              </p>
            </div>
          ) : (
            <div className="created-projects">
              {people.map((x, i) => (
                <div className="project-row" key={i}>
                  <span className="app-icon">
                    <FileText size={19} />
                  </span>
                  <div>
                    <strong>{x}</strong>
                    <small>Created just now · Private</small>
                  </div>
                  <Check size={16} />
                </div>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              runtime.run("Create project", () => {
                setPeople([...people, name.trim()]);
                setName("");
                setMessage("Project created in this demo.");
                next();
              });
            }}
          >
            <label className="field">
              Project name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customer onboarding"
              />
            </label>
            <button type="submit" className="primary demo-action">
              Create project
              <Plus size={16} />
            </button>
          </form>
          <p className="fine-print" role="status">
            {message || "Private by default. You can invite your team later."}
          </p>
        </>
      );
      break;
    case "search":
      {
        const filtered = p.items.filter((x) =>
          x.toLowerCase().includes(query.toLowerCase()),
        );
        content = done ? (
          <Result
            title={p.id === 16 ? "Join request prepared" : "Action opened"}
            onBack={() => setDone(false)}
          >
            <p>
              <strong>{choice}</strong>
            </p>
            {p.id === 16 ? (
              <p>An admin would review your request before granting access.</p>
            ) : (
              <label className="field">
                Give this action a name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Weekly planning"
                />
              </label>
            )}
            {p.id !== 16 && (
              <button
                className="secondary"
                disabled={!name.trim()}
                onClick={() => setMessage(`“${name}” saved in this preview.`)}
              >
                Save action
              </button>
            )}
            <p role="status">{message}</p>
          </Result>
        ) : (
          <>
            <label className="field">
              {p.id === 16 ? "Find a workspace" : "Find an action"}
              <input
                autoComplete="off"
                placeholder="Start typing…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="search-results">
              {filtered.map((x) => (
                <button
                  key={x}
                  onClick={() => {
                    setChoice(x);
                    setDone(true);
                  }}
                >
                  <span>{x}</span>
                  <ArrowRight size={16} />
                </button>
              ))}
              {!filtered.length && <p>No matches. Try another keyword.</p>}
            </div>
            <p className="fine-print">
              Tab through results and press Enter to choose.
            </p>
          </>
        );
      }
      break;
    case "segment":
      content = (
        <>
          <Choices
            items={p.items}
            value={choice}
            set={(v) => {
              setChoice(v);
              setDone(false);
            }}
          />
          <div className="filtered-preview">
            <div className="review-row">
              <strong>{choice}</strong>
              <small>{p.items.indexOf(choice) + 2} matching projects</small>
            </div>
            {[
              "Customer launch",
              "Website refresh",
              "Product release",
              "Client portal",
            ]
              .slice(0, p.items.indexOf(choice) + 2)
              .map((x, i) => (
                <div className="data-row" key={x}>
                  <span>{x}</span>
                  <span className="status-pill">
                    {i % 2 ? "In progress" : "In review"}
                  </span>
                </div>
              ))}
          </div>
          <label className="field">
            View name
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDone(false);
              }}
              placeholder="My weekly focus"
            />
          </label>
          {action(done ? "View saved" : "Save view", next, !name.trim())}
          {done && (
            <p className="inline-success" role="status">
              <Check size={16} /> “{name}” saved with the {choice.toLowerCase()}{" "}
              filter.
            </p>
          )}
        </>
      );
      break;
    case "notification":
      content = (
        <>
          <div className="preference-list">
            {p.items.map((x) => (
              <Toggle
                key={x}
                label={x}
                checked={checks.includes(x)}
                onChange={(v) => {
                  toggle(x, v);
                  setDone(false);
                }}
                detail={checks.includes(x) ? "Enabled" : "Off"}
              />
            ))}
          </div>
          {action(done ? "Preferences saved" : "Save preferences")}
          {done && (
            <p className="fine-print" role="status">
              {checks.length
                ? `${checks.length} optional updates enabled.`
                : "All optional updates are off."}{" "}
              Saved in this preview.
            </p>
          )}
        </>
      );
      break;
    case "digest":
      content = (
        <>
          <div className="digest-preview">
            <Mail size={22} />
            <span className="eyebrow">YOUR WORKSPACE, IN BRIEF</span>
            <h3>{runtime.context.report || "A week of forward motion."}</h3>
            <div className="digest-stats">
              <span>
                <b>12</b>completed
              </span>
              <span>
                <b>4</b>in review
              </span>
              <span>
                <b>2</b>new projects
              </span>
            </div>
          </div>
          <Pick
            label="Delivery cadence"
            value={choice}
            options={p.items}
            onChange={(v) => {
              setChoice(v);
              setDone(false);
            }}
          />
          <label className="field">
            Recipient email
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDone(false);
              }}
              placeholder="you@company.com"
            />
          </label>
          <Toggle
            label="Enable delivery"
            detail="Monday, 9:00 AM UTC when scheduled"
            checked={annual}
            onChange={(v) => {
              setAnnual(v);
              setDone(false);
            }}
          />
          {action(done ? "Schedule saved" : "Save schedule", () => {
            if (annual && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              setError("Enter a valid recipient email.");
              return;
            }
            setError("");
            next();
          })}
          <p className="error" role="alert">
            {error}
          </p>
          {done && (
            <p className="fine-print" role="status">
              {annual && choice !== "Only when I ask"
                ? `${choice} delivery prepared for ${email}.`
                : "Automatic delivery is off."}{" "}
              No messages will be sent.
            </p>
          )}
        </>
      );
      break;
    case "goal":
      content = (
        <>
          <Pick
            label="What will you measure?"
            value={choice}
            options={p.items}
            onChange={(v) => {
              setChoice(v);
              setDone(false);
            }}
          />
          <Range
            label="Target this week"
            value={amount}
            onChange={(v) => {
              setAmount(v);
              setDone(false);
            }}
            max={50}
          />
          <div className="goal-summary">
            <span className="eyebrow">{choice.toUpperCase()}</span>
            <strong>
              {Math.min(count, amount)}
              <span> / {amount}</span>
            </strong>
            <Meter
              value={Math.min(100, (count / amount) * 100)}
              label={`${Math.round(Math.min(100, (count / amount) * 100))}% of your weekly goal`}
            />
            <button
              className="secondary"
              disabled={count >= amount}
              onClick={() => setCount(count + 1)}
            >
              <Plus size={14} />
              Log progress
            </button>
          </div>
          {action(done ? "Goal saved" : "Save goal")}
          {done && (
            <p className="fine-print" role="status">
              Your {amount}-{choice.toLowerCase()} goal is saved in this demo.
            </p>
          )}
        </>
      );
      break;
    case "milestone":
      content = (
        <>
          <div className="milestone-art">
            <div className="rings">
              <CheckCheck size={34} />
            </div>
            <span className="eyebrow">A MOMENT WORTH NOTICING</span>
            <h3>
              {checks.length === p.items.length
                ? "Look how far you’ve come."
                : "Good work adds up."}
            </h3>
          </div>
          <div className="checklist">
            {p.items.map((x) => (
              <CheckRow
                key={x}
                label={x}
                checked={checks.includes(x)}
                onChange={(v) => toggle(x, v)}
              />
            ))}
          </div>
          <Meter
            value={(checks.length / p.items.length) * 100}
            label={`${checks.length} of ${p.items.length} milestones reached`}
          />
          {checks.length === p.items.length && (
            <div className="inline-success" role="status">
              <CheckCheck size={17} />
              Milestone reached. Ready for the next chapter.
            </div>
          )}
        </>
      );
      break;
    case "feedback":
    case "survey":
      content = done ? (
        <Result title="Thanks for the context" onBack={() => setDone(false)}>
          <p>
            You selected <strong>{choice}</strong>.
          </p>
          <p>{extra || "Your response helps shape the next step."}</p>
          <div className="recommend">
            <strong>A useful next step</strong>
            <p>
              {choice.toLowerCase().includes("notification")
                ? "Open notification preferences and reduce optional updates."
                : choice.toLowerCase().includes("plan") ||
                    choice.toLowerCase().includes("budget")
                  ? "Review a smaller plan with clear limits and pricing."
                  : choice.toLowerCase().includes("integration")
                    ? "Review available integrations and the permissions they need."
                    : "Try a focused workflow with one project, one owner, and one measurable outcome."}
            </p>
          </div>
          <p>Feedback is captured only in this open demo.</p>
        </Result>
      ) : (
        <>
          <Choices items={p.items} value={choice} set={setChoice} />
          <label className="field">
            Anything to add? <small>Optional</small>
            <textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Tell us a little more…"
              rows={3}
            />
          </label>
          {action("Submit feedback")}
        </>
      );
      break;
    case "pricing":
    case "downgrade":
      content = done ? (
        <Result
          title={
            p.kind === "downgrade"
              ? "Plan change previewed"
              : "Your plan selection is ready"
          }
          onBack={() => setDone(false)}
        >
          <p>
            <strong>{choice}</strong> ·{" "}
            {money([0, 19, 49][p.items.indexOf(choice)] * (annual ? 0.8 : 1))} /
            seat / month{annual ? ", billed annually" : ""}.
          </p>
          <p>
            {p.kind === "downgrade"
              ? "A live product would apply this at the end of your current billing period and explain any lost capabilities."
              : "Review your seat count and billing details before purchasing."}
          </p>
          <p>No subscription has changed.</p>
        </Result>
      ) : (
        <>
          <Toggle
            label="Annual billing"
            detail="20% lower monthly equivalent"
            checked={annual}
            onChange={setAnnual}
          />
          <div className="plans">
            {p.items.map((x, i) => (
              <button
                key={x}
                className={`plan ${choice === x ? "selected" : ""}`}
                onClick={() => setChoice(x)}
                aria-pressed={choice === x}
              >
                <span>
                  {x}
                  {i === 1 && <small>For growing teams</small>}
                </span>
                <strong>
                  {money([0, 19, 49][i] * (annual ? 0.8 : 1))}
                  <small>/ seat / mo</small>
                </strong>
                <span className="plan-features">
                  <span>{[3, 25, "Unlimited"][i]} projects</span>
                  <span>
                    {
                      [
                        "Basic reporting",
                        "Team reporting",
                        "Advanced analytics",
                      ][i]
                    }
                  </span>
                  <span>
                    {["Community help", "Email support", "Priority support"][i]}
                  </span>
                </span>
                {annual && i > 0 && (
                  <small>
                    {money([0, 19, 49][i] * 0.8 * 12)} / seat billed yearly
                  </small>
                )}
                <span className="plan-select">
                  {choice === x ? (
                    <>
                      <Check size={14} />
                      Selected
                    </>
                  ) : (
                    "Choose plan"
                  )}
                </span>
              </button>
            ))}
          </div>
          {p.kind === "downgrade" && (
            <p className="fine-print">
              Downgrading may remove advanced analytics and lower your project
              limit. Export affected data first.
            </p>
          )}
          {action(
            p.kind === "downgrade"
              ? "Preview plan change"
              : "Continue with " + choice,
          )}
        </>
      );
      break;
    case "upgrade":
    case "paywall":
      content = done ? (
        <Result
          title="Team plan unlocked in preview"
          onBack={() => setDone(false)}
        >
          <div className="unlocked">
            <BarChart3 size={25} />
            <strong>Team performance</strong>
            <div className="bars">
              {[30, 50, 42, 70, 63, 90, 78].map((n, i) => (
                <i style={{ height: n }} key={i} />
              ))}
            </div>
            <small>Illustrative report · sample data</small>
          </div>
          <p>No purchase was made. This is the paid-state preview.</p>
        </Result>
      ) : (
        <>
          <div className="premium-preview">
            <div className="bars muted-bars">
              {[25, 48, 38, 65, 70, 93, 76].map((n, i) => (
                <i style={{ height: n }} key={i} />
              ))}
            </div>
            <span className="premium-lock">
              <Lock size={18} />
              Team feature preview
            </span>
          </div>
          <div className="benefits">
            {p.items.map((x) => (
              <span key={x}>
                <Check size={15} />
                {x}
              </span>
            ))}
          </div>
          <div className="review-row">
            <span>Team plan</span>
            <strong>$19 / seat / month</strong>
          </div>
          {action("Try the upgraded state")}
          <p className="fine-print">
            Sandbox only · no charge or subscription change
          </p>
        </>
      );
      break;
    case "limit":
      {
        const used = Math.min(count + 19, 25);
        content = (
          <>
            <div className="usage-total">
              <strong>
                {used}
                <span> / 25</span>
              </strong>
              <span>active projects</span>
            </div>
            <Meter
              value={(used / 25) * 100}
              label={`${25 - used} projects remaining`}
            />
            <div className="usage-details">
              <div className="review-row">
                <span>Current plan</span>
                <strong>Team</strong>
              </div>
              <div className="review-row">
                <span>Existing projects</span>
                <strong>Always accessible</strong>
              </div>
            </div>
            {used < 25 ? (
              <button
                className="secondary full"
                onClick={() => setCount(count + 1)}
              >
                <Plus size={15} />
                Create a sample project
              </button>
            ) : (
              <div className="inline-success">
                Project limit reached. Existing work remains available.
              </div>
            )}
            {done ? (
              <div className="recommend" role="status">
                <strong>Business plan preview</strong>
                <p>
                  Unlimited projects · $49 / seat / month. Your current
                  workspace stays unchanged.
                </p>
                <button className="text-button" onClick={() => setDone(false)}>
                  Keep current plan
                </button>
              </div>
            ) : (
              action("Explore a higher limit")
            )}
          </>
        );
      }
      break;
    case "annual":
      content = (
        <>
          <Toggle
            label="Bill annually"
            detail="20% lower monthly equivalent; billed yearly"
            checked={annual}
            onChange={(v) => {
              setAnnual(v);
              setDone(false);
            }}
          />
          <div className="price-hero">
            <span>{runtime.context.plan} plan</span>
            <strong>
              ${planPrice}
              <small> / seat / month</small>
            </strong>
            <p>
              {annual
                ? `${money(planPrice * 12)} per seat billed once a year.`
                : `${money(monthlyPrice)} per seat billed every month.`}
            </p>
          </div>
          <Range
            label="Seats"
            value={amount}
            onChange={(v) => {
              setAmount(v);
              setDone(false);
            }}
            min={1}
            max={50}
          />
          <div className="review-row">
            <span>{annual ? "Annual charge" : "Monthly charge"}</span>
            <strong>{money(planPrice * amount * (annual ? 12 : 1))}</strong>
          </div>
          {action("Review billing", () => setDone(true))}
          {done && (
            <div className="recommend" role="status">
              <strong>
                {money(planPrice * amount * (annual ? 12 : 1))}{" "}
                {annual ? "per year" : "per month"} for {amount} seats
              </strong>
              <p>Billing preview only. No payment is collected.</p>
            </div>
          )}
        </>
      );
      break;
    case "seat":
      content = (
        <>
          <div className="seat-avatars">
            {["A", "S", "J", "M", "+"].map((x) => (
              <span className="avatar" key={x}>
                {x}
              </span>
            ))}
          </div>
          <Range
            label="Paid team seats"
            value={amount}
            onChange={(v) => {
              setAmount(v);
              setDone(false);
            }}
            min={1}
            max={100}
          />
          <div className="review-row">
            <span>Price per seat</span>
            <strong>$19 / month</strong>
          </div>
          <div className="review-row">
            <span>Guest viewers</span>
            <strong>Free · view only</strong>
          </div>
          <div className="seat-total">
            <span>Your monthly total</span>
            <strong>{money(amount * 19)}</strong>
          </div>
          {action(done ? "Seat plan saved" : "Review seat allocation")}
          {done && (
            <div className="recommend" role="status">
              <strong>{amount} paid seats selected</strong>
              <p>
                Total recurring cost: {money(amount * 19)} per month before tax.
                This preview makes no billing changes.
              </p>
            </div>
          )}
        </>
      );
      break;
    case "addon":
      content = (
        <>
          <div className="addon-list">
            {p.items.map((x, i) => (
              <CheckRow
                key={x}
                label={x}
                detail={`$${[15, 25, 10][i]} / workspace / month`}
                checked={checks.includes(x)}
                onChange={(v) => {
                  toggle(x, v);
                  setDone(false);
                }}
              />
            ))}
          </div>
          <div className="review-row">
            <span>
              Base {runtime.context.plan} subscription · {runtime.context.seats}{" "}
              seats
            </span>
            <strong>
              {money(monthlyPrice * runtime.context.seats)} / month
            </strong>
          </div>
          <div className="seat-total">
            <span>New monthly total</span>
            <strong>
              {money(
                monthlyPrice * runtime.context.seats +
                  checks.reduce(
                    (sum, x) => sum + [15, 25, 10][p.items.indexOf(x)],
                    0,
                  ),
              )}
            </strong>
          </div>
          {action(
            done ? "Selection reviewed" : "Review add-ons",
            next,
            !checks.length,
          )}
          {done && (
            <p className="fine-print" role="status">
              Selected: {checks.join(", ")}. No purchase was made.
            </p>
          )}
        </>
      );
      break;
    case "billing":
      content = done ? (
        <Result title="Billing review complete" onBack={() => setDone(false)}>
          <p>
            Team plan · 5 seats · <strong>$95 / month</strong> before tax.
          </p>
          <p>Invoice recipient: {email}.</p>
          <p>
            No payment processed. A live checkout would require a payment
            provider’s confirmation.
          </p>
        </Result>
      ) : (
        <>
          <div className="invoice">
            <div className="review-row">
              <strong>Team plan</strong>
              <span>5 seats × $19</span>
            </div>
            <div className="review-row">
              <span>Billing cycle</span>
              <span>Monthly</span>
            </div>
            <div className="review-row total">
              <strong>Recurring subtotal</strong>
              <strong>$95.00</strong>
            </div>
            <small>
              Tax calculated in a live checkout. Renews monthly until canceled.
            </small>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!annual) {
                setError("Confirm that you reviewed the recurring price.");
                return;
              }
              runtime.run("Submit request", next);
            }}
          >
            <label className="field">
              Invoice email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@company.com"
              />
            </label>
            <CheckRow
              label="I have reviewed the recurring price"
              checked={annual}
              onChange={setAnnual}
            />
            <p className="error" role="alert">
              {error}
            </p>
            <button className="primary demo-action" type="submit">
              Confirm demo review
              <ShieldCheck size={16} />
            </button>
          </form>
        </>
      );
      break;
    case "trial":
      content = (
        <>
          <div className="trial-banner">
            <span className="trial-day">
              7<span>days left</span>
            </span>
            <div>
              <strong>Your evaluation is halfway through.</strong>
              <p>Sample 14-day trial · Day 7</p>
            </div>
          </div>
          <Meter value={50} label="7 of 14 evaluation days elapsed" />
          <div className="checklist">
            {p.items.map((x) => (
              <CheckRow
                key={x}
                label={x}
                checked={checks.includes(x)}
                onChange={(v) => toggle(x, v)}
              />
            ))}
          </div>
          {action("Review trial outcome", () => setDone(true))}
          {done && (
            <div className="recommend" role="status">
              <strong>
                {checks.length} of {p.items.length} evaluation steps complete
              </strong>
              <p>
                {checks.length === p.items.length
                  ? "Your team is ready to compare a paid plan with the value you experienced."
                  : "Finish the remaining steps to evaluate value before making a purchase."}
              </p>
            </div>
          )}
        </>
      );
      break;
    case "cancel":
      content = done ? (
        <Result
          title={message || "Cancellation confirmed in preview"}
          onBack={() => {
            setDone(false);
            setStep(0);
          }}
        >
          <p>
            {message
              ? "Your workspace stays active on its current plan."
              : `Your workspace stays available until ${endDate} in this example, then moves to read-only access.`}
          </p>
          <p>Nothing changed outside this demo.</p>
        </Result>
      ) : step === 0 ? (
        <>
          <Choices
            items={[...p.items, "Prefer not to say"]}
            value={choice}
            set={setChoice}
          />
          <p className="fine-print">
            Your answer is optional. You can continue without sharing more.
          </p>
          {action("Continue to cancellation", () => setStep(1))}
          <button
            className="text-button full"
            onClick={() => {
              setMessage("Your plan is unchanged");
              next();
            }}
          >
            Keep my plan
          </button>
        </>
      ) : (
        <>
          <div className="review">
            <h3>Here’s what happens next.</h3>
            <p>
              Access continues through {endDate} in this illustrative billing
              schedule. Afterward, projects become read-only and paid
              automations stop.
            </p>
            <p>You can export your data before your plan ends.</p>
          </div>
          <button
            className="secondary full"
            onClick={() => {
              setMessage("Your plan is unchanged");
              next();
            }}
          >
            Keep my plan
          </button>
          {action("Confirm cancellation", () => {
            setMessage("");
            next();
          })}
          <button className="text-button full" onClick={() => setStep(0)}>
            Back to reason
          </button>
        </>
      );
      break;
    case "pause":
      content = done ? (
        <Result
          title={message || "Pause scheduled in preview"}
          onBack={() => {
            setDone(false);
            setMessage("");
          }}
        >
          <p>
            {message
              ? "Your subscription would end after the current billing period."
              : `Pause length: ${choice}. Your data is preserved in read-only mode during the pause.`}
          </p>
          <p>
            {message
              ? "No further charges would be made."
              : `Billing resumes on ${resumeDate} at $95/month in this illustrative schedule.`}
          </p>
          <p>No real subscription changed.</p>
        </Result>
      ) : (
        <>
          <Choices items={p.items} value={choice} set={setChoice} />
          <div className="review">
            <strong>A pause, with clear boundaries.</strong>
            <p>
              Read-only access while paused. Billing automatically resumes on{" "}
              {resumeDate} at $95 / month.
            </p>
          </div>
          {action("Preview this pause")}
          <button
            className="text-button full"
            onClick={() => {
              setMessage("Cancellation preview");
              next();
            }}
          >
            Cancel subscription instead
          </button>
        </>
      );
      break;
    case "referral":
      content = (
        <>
          <div className="referral-reward">
            <div>
              <span>YOUR PEER GETS</span>
              <strong>1 month</strong>
              <small>on a qualifying Team plan</small>
            </div>
            <Plus size={20} />
            <div>
              <span>YOU GET</span>
              <strong>1 month</strong>
              <small>after their first paid month</small>
            </div>
          </div>
          <div className="copy-field">
            <code>{link ? "Link revoked" : "atlas.example/r/acme-team"}</code>
            <button
              className="icon-button"
              disabled={link}
              aria-label="Copy sample referral link"
              onClick={async () =>
                setMessage(
                  (await copyText("https://atlas.example/r/acme-team"))
                    ? "Sample link copied. This example URL is not live."
                    : "Copy unavailable. Select the link text manually.",
                )
              }
            >
              <Copy size={17} />
            </button>
          </div>
          <div className="fine-print">
            Illustrative link only. Reward applies to a new workspace after its
            first paid month. No contact is sent.
          </div>
          <button
            className="secondary full"
            onClick={() => {
              setLink(!link);
              setMessage(
                link ? "New sample link activated." : "Sample link revoked.",
              );
            }}
          >
            {link ? "Create a new sample link" : "Revoke link"}
          </button>
          <div className="referral-status">
            <span>
              <b>{count - 3}</b>sample referrals
            </span>
            <button
              className="text-button"
              disabled={link}
              onClick={() => {
                setCount(count + 1);
                setMessage("A sample referral was added to the tracker.");
              }}
            >
              Simulate a referral
              <ArrowRight size={13} />
            </button>
          </div>
          <p role="status" className="fine-print">
            {message}
          </p>
        </>
      );
      break;
    case "share":
      content = (
        <>
          <div className="shared-report">
            <span className="eyebrow">WORKSPACE REPORT</span>
            <h3>One team. A clearer picture.</h3>
            <div className="bars">
              {[32, 50, 38, 65, 70, 87, 76].map((n, i) => (
                <i key={i} style={{ height: n }} />
              ))}
            </div>
          </div>
          <Pick
            label="Link permissions"
            value={choice}
            options={p.items}
            onChange={(v) => {
              setChoice(v);
              setDone(false);
            }}
          />
          <Toggle
            label="Enable workspace link"
            detail="Workspace members only"
            checked={link}
            onChange={(v) => {
              setLink(v);
              setDone(false);
            }}
          />
          {action(
            "Copy sample link",
            async () => {
              setMessage(
                (await copyText(
                  `https://atlas.example/shared/weekly-report?access=${encodeURIComponent(choice)}`,
                ))
                  ? `Copied. ${choice} access for workspace members. This is an example URL.`
                  : "Copy unavailable. Use the displayed example URL.",
              );
              setDone(true);
            },
            !link,
          )}
          {done && (
            <p className="fine-print" role="status">
              {message}
            </p>
          )}
          <p className="fine-print">
            Sample URL: atlas.example/shared/weekly-report. Toggle off to revoke
            in this demo.
          </p>
        </>
      );
      break;
    case "reward":
      content = (
        <>
          <div className="reward-header">
            <span className="avatar">A</span>
            <div>
              <strong>Acme’s referral</strong>
              <small>Example workspace</small>
            </div>
            <span className="status-pill">
              {step < 2 ? "Pending" : "Eligible"}
            </span>
          </div>
          <div className="reward-steps">
            {p.items.map((x, i) => (
              <div key={x} className={i <= step ? "active" : ""}>
                <span>{i <= step ? <Check size={14} /> : i + 1}</span>
                <p>{x}</p>
              </div>
            ))}
          </div>
          {step < 2 ? (
            action("Simulate next milestone", () => setStep(step + 1))
          ) : done ? (
            <div className="inline-success" role="status">
              <CheckCheck size={17} /> One month of credit claimed in this
              preview.
            </div>
          ) : (
            action("Claim sample credit")
          )}
          <p className="fine-print">
            Sample reward. In production, verify eligibility before issuing
            credit.
          </p>
        </>
      );
      break;
    case "winback":
      content = done ? (
        <Result title="Your next step is ready" onBack={() => setDone(false)}>
          <p>
            <strong>{choice}</strong>
          </p>
          <div className="recommend">
            <strong>
              {choice === p.items[0]
                ? "2 projects waiting for a decision"
                : choice === p.items[1]
                  ? "A lighter weekly workflow"
                  : "A fresh weekly target"}
            </strong>
            <p>
              {choice === p.items[0]
                ? "Customer launch and Website refresh are ready for review."
                : choice === p.items[1]
                  ? "Start with a three-stage board: Plan, Do, Review."
                  : "Try completing three important handoffs this week."}
            </p>
          </div>
        </Result>
      ) : (
        <>
          <div className="return-note">
            <span className="eyebrow">WELCOME BACK, ALEX</span>
            <h3>Your next chapter starts small.</h3>
            <p>
              3 open projects · 2 pending reviews · your workspace is intact.
            </p>
          </div>
          <Choices items={p.items} value={choice} set={setChoice} />
          {action("Pick up from here")}
        </>
      );
      break;
    default:
      content = <p>Choose a pattern to explore.</p>;
  }
  return (
    <div className={`demo-card demo-${p.kind}`}>
      <div className="demo-brand">
        <span className="acme-mark">a</span>
        <span>
          {runtime.company || "Acme"}
          <span className="brand-dot">.</span>
        </span>
        <span className="demo-workspace">WORKSPACE</span>
      </div>
      <div className="demo-intro">
        <h2>{p.headline}</h2>
        <p>{p.description}</p>
      </div>
      {content}
    </div>
  );
}
function Table({ rows }: { rows: string[][] }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {rows[0]?.map((x, i) => (
              <th key={i}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((r, i) => (
            <tr key={i}>
              {r.map((x, j) => (
                <td key={j}>{x}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
