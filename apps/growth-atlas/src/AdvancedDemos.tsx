import { useEffect, useState, type ReactNode } from "react";
import {
  Check,
  FileText,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
  Download,
} from "lucide-react";
import { CheckRow, Meter, Pick, Range, download } from "./ui";
import { useDemoRuntime } from "./DemoRuntime";
import type { CuratedPattern } from "./curation";
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
function Frame({ p, children }: { p: CuratedPattern; children: ReactNode }) {
  const r = useDemoRuntime();
  return (
    <div className={`demo-card advanced-demo demo-${p.kind}`}>
      <div className="demo-brand">
        <span className="acme-mark">a</span>
        <span>{r.company || "Acme"}.</span>
        <span className="demo-workspace">WORKSPACE</span>
      </div>
      <div className="demo-intro">
        <h2>
          {p.id === 57 ? `Review your ${r.context.plan} plan.` : p.headline}
        </h2>
        <p>{p.description}</p>
      </div>
      {children}
    </div>
  );
}
function Success({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="outcome-box" role="status">
      <Check size={20} />
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
export const advancedIds = new Set([
  3, 11, 12, 20, 24, 35, 36, 57, 74, 77, 88, 97,
]);
export default function AdvancedDemo({ p }: { p: CuratedPattern }) {
  return (
    <Frame p={p}>
      {p.id === 3 ? (
        <PlanFinder />
      ) : p.id === 11 ? (
        <Account />
      ) : p.id === 12 ? (
        <Personalization />
      ) : p.id === 20 ? (
        <AcceptInvite />
      ) : p.id === 24 ? (
        <InviteTeam />
      ) : p.id === 35 ? (
        <ReportBuilder />
      ) : p.id === 36 ? (
        <Automation />
      ) : p.id === 57 ? (
        <Billing />
      ) : p.id === 74 ? (
        <ValueRecap />
      ) : p.id === 77 ? (
        <PaymentRecovery />
      ) : p.id === 88 ? (
        <Story />
      ) : (
        <Reconnect />
      )}
    </Frame>
  );
}
function Account() {
  const r = useDemoRuntime();
  const [email, setEmail] = useState(r.initial?.email || r.context.email),
    [name, setName] = useState(r.initial?.name || ""),
    [step, setStep] = useState(r.initial?.step || 0),
    [code, setCode] = useState(""),
    [error, setError] = useState("");
  useEffect(
    () => r.report({ email, name, step, done: step === 2 }),
    [email, name, step],
  );
  return step === 2 ? (
    <Success title="Identity verified in this preview">
      <p>
        {name} · {email}
      </p>
      <p>
        You can now create or join a workspace. No real account was created.
      </p>
      <button
        className="secondary"
        onClick={() => {
          setStep(0);
          setCode("");
        }}
      >
        Use another address
      </button>
    </Success>
  ) : step === 1 ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code !== "246810") {
          setError(
            "That code does not match. Use the sample code below or request another.",
          );
          return;
        }
        r.run("Verify email", () => {
          setStep(2);
          r.complete();
        });
      }}
    >
      <div className="callout">
        <Mail size={20} />
        <p>
          Verification preview for <strong>{email}</strong>. No message was
          sent.
        </p>
      </div>
      <label className="field">
        Six-digit verification code
        <input
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          autoComplete="one-time-code"
        />
      </label>
      <p className="fine-print">
        Demo code: <strong>246810</strong>
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="primary full" type="submit">
        Verify address
      </button>
      <div className="button-row">
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setCode("");
            setError("A new sample code is ready: 246810.");
          }}
        >
          Request another code
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => setStep(0)}
        >
          Change email
        </button>
      </div>
    </form>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        r.run("Send verification", () => {
          setStep(1);
          setError("");
        });
      }}
    >
      <label className="field">
        Your name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Alex Morgan"
        />
      </label>
      <label className="field">
        Work email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="alex@company.com"
        />
      </label>
      <button className="primary full" type="submit">
        Continue with email
      </button>
      <p className="fine-print">
        Verification comes before workspace access. This demo uses a visible
        sample code.
      </p>
    </form>
  );
}
function PlanFinder() {
  const r = useDemoRuntime();
  const [team, setTeam] = useState(r.initial?.amount || 5),
    [needs, setNeeds] = useState(r.initial?.checks || []),
    [done, setDone] = useState(r.initial?.done || false);
  const plan = needs.includes("SSO & audit history")
    ? "Business"
    : team > 3 || needs.length
      ? "Team"
      : "Starter";
  useEffect(
    () => r.report({ amount: team, checks: needs, choice: plan, done }),
    [team, needs, plan, done],
  );
  return (
    <>
      <Range
        label="People doing the work"
        value={team}
        onChange={(n) => {
          setTeam(n);
          setDone(false);
        }}
        min={1}
        max={30}
      />
      {["Scheduled reports", "Shared permissions", "SSO & audit history"].map(
        (x) => (
          <CheckRow
            key={x}
            label={x}
            checked={needs.includes(x)}
            onChange={(v) => {
              setNeeds(v ? [...needs, x] : needs.filter((y) => y !== x));
              setDone(false);
            }}
          />
        ),
      )}
      <button
        className="primary full"
        onClick={() => {
          setDone(true);
          r.complete();
        }}
      >
        Find a starting plan
      </button>
      {done && (
        <Success title={`${plan} matches the needs you selected`}>
          <p>
            {plan === "Business"
              ? "SSO and audit controls need the Business tier."
              : plan === "Team"
                ? "Your team size or collaboration needs fit the Team tier."
                : "For up to three people with basic needs, Starter is a useful place to begin."}
          </p>
          <p>Recommendation only. Compare all plans before deciding.</p>
        </Success>
      )}
    </>
  );
}
function Personalization() {
  const r = useDemoRuntime();
  const [role, setRole] = useState(r.initial?.choice || "Operations"),
    [done, setDone] = useState(false);
  const defaults: Record<string, string[]> = {
    Operations: ["Intake", "Assigned", "Complete"],
    "Product & design": ["Discovery", "Design", "Review"],
    "Sales & success": ["Qualified", "Handoff", "Onboarded"],
  };
  useEffect(() => r.report({ choice: role, done }), [role, done]);
  return (
    <>
      <Pick
        label="Your primary work"
        value={role}
        options={Object.keys(defaults)}
        onChange={(v) => {
          setRole(v);
          setDone(false);
        }}
      />
      <div className="preview-box">
        <small>YOUR STARTING WORKFLOW</small>
        <div>
          {defaults[role].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <p className="fine-print">
          These defaults change with your choice. You can rename every stage
          later.
        </p>
      </div>
      <button
        className="primary full"
        onClick={() =>
          r.run("Save workspace preference", () => {
            setDone(true);
            r.complete();
          })
        }
      >
        Use these defaults
      </button>
      {done && (
        <p role="status" className="inline-success">
          {role} defaults selected. Your role does not restrict your access.
        </p>
      )}
    </>
  );
}
function AcceptInvite() {
  const r = useDemoRuntime();
  const [token, setToken] = useState("Valid"),
    [accepted, setAccepted] = useState(r.initial?.done || false),
    [address, setAddress] = useState(r.context.invitees[0] || "alex@acme.test"),
    [current, setCurrent] = useState(
      r.context.email || r.context.invitees[0] || "alex@acme.test",
    );
  const [note, setNote] = useState("");
  useEffect(
    () => r.report({ email: address, choice: token, done: accepted }),
    [address, token, accepted],
  );
  return accepted ? (
    <Success title="Invitation accepted">
      <p>
        <strong>{address}</strong> has the{" "}
        {r.context.invitationRoles[address] || "Member"} role in {r.company} in
        this preview.
      </p>
      <button
        className="secondary"
        onClick={() => {
          setAccepted(false);
          setNote("Membership removed in this local preview.");
        }}
      >
        Leave preview workspace
      </button>
    </Success>
  ) : (
    <>
      <Pick
        label="Invitation condition"
        value={token}
        options={["Valid", "Expired", "Revoked"]}
        onChange={(v) => {
          setToken(v);
          setNote("");
        }}
      />
      <div className="workspace-chip">
        <span className="avatar">{r.company[0]}</span>
        <div>
          <strong>{r.company} workspace</strong>
          <small>
            Invited as {r.context.invitationRoles[address] || "Member"} ·{" "}
            {address}
          </small>
        </div>
        <Users size={18} />
      </div>
      {token !== "Valid" ? (
        <div className="callout">
          <Lock size={20} />
          <div>
            <strong>This invitation is {token.toLowerCase()}.</strong>
            <p>No workspace access has been granted.</p>
            <button
              className="secondary"
              onClick={() =>
                r.run("Request a fresh invitation", () => {
                  setToken("Valid");
                  setNote(
                    "A fresh sample invitation is ready. No email was sent.",
                  );
                })
              }
            >
              Request a fresh invitation
            </button>
          </div>
        </div>
      ) : (
        <>
          <label className="field">
            Signed-in email
            <input
              type="email"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </label>
          {current !== address && (
            <p className="error" role="alert">
              This invitation belongs to {address}. Switch to that account to
              accept.
            </p>
          )}
          <button
            className="primary full"
            disabled={current !== address}
            onClick={() =>
              r.run("Accept invitation", () => {
                setAccepted(true);
                r.complete();
              })
            }
          >
            Join {r.company}
          </button>
          <button
            className="text-button full"
            onClick={() => {
              setToken("Revoked");
              setNote("Invitation declined in this preview.");
            }}
          >
            Decline invitation
          </button>
        </>
      )}
      <p className="fine-print" role="status">
        {note}
      </p>
    </>
  );
}
function InviteTeam() {
  const r = useDemoRuntime();
  const [email, setEmail] = useState(""),
    [role, setRole] = useState("Member"),
    [members, setMembers] = useState<
      { email: string; role: string; status: string }[]
    >(
      r.initial?.invitations ||
        (r.initial?.people || []).map((email) => ({
          email,
          role: "Member",
          status: "Pending",
        })),
    ),
    [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(r.initial?.done || false);
  useEffect(
    () =>
      r.report({
        invitations: members,
        people: members.map((x) => x.email),
        choice: role,
        done: confirmed,
      }),
    [members, role, confirmed],
  );
  return (
    <>
      <div className="review-row">
        <span>Paid capacity</span>
        <strong>{r.context.seats} seats · viewers are free</strong>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            members.some((x) => x.email.toLowerCase() === email.toLowerCase())
          ) {
            setError("This address is already on the list.");
            return;
          }
          setMembers([
            ...members,
            { email: email.trim(), role, status: "Draft" },
          ]);
          setEmail("");
          setError("");
          setConfirmed(false);
        }}
      >
        <label className="field">
          Teammate email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sam@company.com"
          />
        </label>
        <Pick
          label="Invitation role"
          value={role}
          options={["Viewer", "Member", "Admin"]}
          onChange={setRole}
        />
        <button className="secondary full" type="submit">
          <Plus size={15} />
          Add to review
        </button>
      </form>
      <p className="error" role="alert">
        {error}
      </p>
      {members.length === 0 && (
        <p className="empty-inline">
          No invitations yet. Add one person and choose their access.
        </p>
      )}
      {members.map((m, i) => (
        <div className="invite-review" key={m.email}>
          <div>
            <strong>{m.email}</strong>
            <small>
              {m.role} · {m.status}
            </small>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setMembers(members.filter((_, n) => n !== i));
              setConfirmed(false);
            }}
          >
            {m.status === "Pending" ? "Revoke" : "Remove"}
          </button>
        </div>
      ))}
      {members.filter((m) => m.role !== "Viewer").length > r.context.seats && (
        <p className="error">
          This selection exceeds the planned paid capacity. Review seat
          allocation before sending.
        </p>
      )}
      <button
        className="primary full"
        disabled={
          !members.some((m) => m.status === "Draft") ||
          members.filter((m) => m.role !== "Viewer").length > r.context.seats
        }
        onClick={() =>
          r.run("Send invitations", () => {
            setMembers(members.map((m) => ({ ...m, status: "Pending" })));
            setConfirmed(true);
            r.complete();
          })
        }
      >
        Confirm invitations
      </button>
      {confirmed && (
        <p className="inline-success" role="status">
          Invitations are pending in this preview. No messages were sent.
          Pending invitations can be revoked.
        </p>
      )}
    </>
  );
}
function ReportBuilder() {
  const r = useDemoRuntime();
  const [name, setName] = useState(r.initial?.name || r.context.report),
    [question, setQuestion] = useState(
      r.initial?.choice || "Which accounts need attention?",
    ),
    [range, setRange] = useState(r.initial?.extra || "Last 30 days"),
    [built, setBuilt] = useState(r.initial?.done || false),
    [error, setError] = useState("");
  useEffect(
    () => r.report({ name, choice: question, extra: range, done: built }),
    [name, question, range, built],
  );
  const rows =
    question === "Which accounts need attention?"
      ? [
          ["Meridian", "7 days without an owner"],
          ["Northstar", "Renewal in 14 days"],
        ]
      : question === "Where are handoffs slowing down?"
        ? [
            ["Sales → Success", "2.4 days median"],
            ["Review → Approved", "1.2 days median"],
          ]
        : [
            ["Completed", "18"],
            ["In progress", "7"],
          ];
  return (
    <>
      <label className="field">
        Report name
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setBuilt(false);
          }}
          placeholder="Weekly customer health"
        />
      </label>
      <Pick
        label="Business question"
        value={question}
        options={[
          "Which accounts need attention?",
          "Where are handoffs slowing down?",
          "How much work did we complete?",
        ]}
        onChange={(v) => {
          setQuestion(v);
          setBuilt(false);
        }}
      />
      <Pick
        label="Reporting period"
        value={range}
        options={["Last 7 days", "Last 30 days", "This quarter"]}
        onChange={(v) => {
          setRange(v);
          setBuilt(false);
        }}
      />
      <p className="fine-print">
        {r.context.records
          ? `${r.context.records} imported records are available. This preview adds illustrative aggregate data.`
          : "Using a sample dataset. Connect a real source in your implementation."}
      </p>
      <button
        className="primary full"
        onClick={() => {
          if (!name.trim()) {
            setError("Give this report a name.");
            return;
          }
          setError("");
          r.run("Build report", () => {
            setBuilt(true);
            r.complete();
          });
        }}
      >
        Build report
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {built && (
        <div className="report-result" role="status">
          <div className="review-row">
            <strong>{name}</strong>
            <span>{range}</span>
          </div>
          <p>{question}</p>
          {rows.map(([a, b]) => (
            <div className="review-row" key={a}>
              <span>{a}</span>
              <strong>{b}</strong>
            </div>
          ))}
          <small>Illustrative data · private workspace</small>
          <button
            className="secondary full"
            onClick={() =>
              download(
                "report.csv",
                "Label,Value\n" + rows.map((x) => x.join(",")).join("\n"),
                "text/csv",
              )
            }
          >
            Download sample report
          </button>
        </div>
      )}
    </>
  );
}
function Automation() {
  const r = useDemoRuntime();
  const [trigger, setTrigger] = useState(
      r.initial?.choice || "New qualified lead",
    ),
    [action, setAction] = useState(r.initial?.extra || "Assign an owner"),
    [owner, setOwner] = useState(r.initial?.name || ""),
    [tested, setTested] = useState(false),
    [enabled, setEnabled] = useState(r.initial?.done || false);
  useEffect(
    () =>
      r.report({ choice: trigger, name: owner, extra: action, done: enabled }),
    [trigger, owner, action, enabled],
  );
  return (
    <>
      <Pick
        label="When this happens"
        value={trigger}
        options={[
          "New qualified lead",
          "Task becomes overdue",
          "Handoff completed",
        ]}
        onChange={(v) => {
          setTrigger(v);
          setTested(false);
          setEnabled(false);
        }}
      />
      <Pick
        label="Do this"
        value={action}
        options={[
          "Assign an owner",
          "Create a follow-up task",
          "Post a workspace notification",
        ]}
        onChange={(v) => {
          setAction(v);
          setTested(false);
          setEnabled(false);
        }}
      />
      <label className="field">
        Responsible owner
        <input
          value={owner}
          onChange={(e) => {
            setOwner(e.target.value);
            setTested(false);
            setEnabled(false);
          }}
          placeholder="Alex Morgan"
        />
      </label>
      <div className="automation-chain">
        <span>{trigger}</span>
        <span>then</span>
        <span>{action}</span>
      </div>
      <button
        className="secondary full"
        disabled={!owner.trim()}
        onClick={() => r.run("Run sample event", () => setTested(true))}
      >
        Preview with a sample event
      </button>
      {tested && (
        <p className="inline-success" role="status">
          One matching sample event would run “{action}”, owned by {owner}. No
          external action was executed.
        </p>
      )}
      <button
        className="primary full"
        disabled={!tested && !enabled}
        onClick={() =>
          r.run(enabled ? "Disable automation" : "Enable automation", () => {
            setEnabled(!enabled);
            r.complete();
          })
        }
      >
        {enabled ? "Disable automation" : "Enable automation"}
      </button>
      <p className="fine-print">
        {enabled
          ? "Enabled locally. A live implementation needs an event queue, idempotency, and failure notifications."
          : "Preview before enabling. Existing records will not run automatically."}
      </p>
    </>
  );
}
function Billing() {
  const r = useDemoRuntime();
  const [email, setEmail] = useState(r.initial?.email || r.context.email),
    [accepted, setAccepted] = useState(false),
    [done, setDone] = useState(r.initial?.done || false);
  const price =
    r.context.plan === "Starter" ? 0 : r.context.plan === "Business" ? 49 : 19;
  const perSeat = r.context.annual ? price * 0.8 : price;
  const addons = r.context.addOns.reduce(
    (sum, x) =>
      sum + (x.includes("report") ? 15 : x.includes("support") ? 25 : 10),
    0,
  );
  const total =
    (perSeat * r.context.seats + addons) * (r.context.annual ? 12 : 1);
  useEffect(
    () =>
      r.report({
        email,
        done,
        choice: r.context.plan,
        amount: r.context.seats,
        annual: r.context.annual,
      }),
    [email, done],
  );
  return done ? (
    <Success title="Subscription review confirmed">
      <p>
        {r.context.plan} · {r.context.seats} seats · {money(total)}{" "}
        {r.context.annual ? "per year" : "per month"}, before tax.
      </p>
      <p>
        Invoice recipient: {email}. This is a local confirmation; no payment was
        processed.
      </p>
      <button
        className="secondary"
        onClick={() => {
          setDone(false);
          setAccepted(false);
        }}
      >
        Review again
      </button>
    </Success>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        r.run("Confirm subscription", () => {
          setDone(true);
          r.complete();
        });
      }}
    >
      <div className="invoice">
        <div className="review-row">
          <span>Plan</span>
          <strong>{r.context.plan}</strong>
        </div>
        <div className="review-row">
          <span>Paid seats</span>
          <strong>
            {r.context.seats} × {money(perSeat)}/month
          </strong>
        </div>
        <div className="review-row">
          <span>Add-ons</span>
          <strong>{addons ? money(addons) + "/month" : "None selected"}</strong>
        </div>
        <div className="review-row total">
          <span>Recurring subtotal</span>
          <strong>
            {money(total)} / {r.context.annual ? "year" : "month"}
          </strong>
        </div>
        <p className="fine-print">
          Tax would be calculated by the payment provider. Renews{" "}
          {r.context.annual ? "annually" : "monthly"} until canceled.
        </p>
      </div>
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
        label="I have reviewed the recurring charge and billing period"
        checked={accepted}
        onChange={setAccepted}
      />
      <button className="primary full" disabled={!accepted} type="submit">
        Confirm review · {money(total)}
      </button>
      <p className="fine-print">
        Explore “Fail next request” to see a retry without losing these
        selections.
      </p>
    </form>
  );
}
function ValueRecap() {
  const r = useDemoRuntime();
  const [period, setPeriod] = useState(r.initial?.choice || "Last 30 days"),
    [done, setDone] = useState(r.initial?.done || false);
  useEffect(() => r.report({ choice: period, done }), [period, done]);
  const n = period === "Last 30 days" ? 1 : period === "Last 90 days" ? 3 : 6;
  return (
    <>
      <Pick
        label="Reporting period"
        value={period}
        options={["Last 30 days", "Last 90 days", "Last 180 days"]}
        onChange={(v) => {
          setPeriod(v);
          setDone(false);
        }}
      />
      <div className="value-metrics">
        <div>
          <strong>{24 * n}</strong>
          <span>projects completed</span>
        </div>
        <div>
          <strong>{68 * n}</strong>
          <span>handoffs recorded</span>
        </div>
        <div>
          <strong>{12 * n}</strong>
          <span>reports shared</span>
        </div>
      </div>
      <div className="review-row">
        <span>Active paid seats</span>
        <strong>4 of {Math.max(r.context.seats, 5)}</strong>
      </div>
      <Meter
        value={(4 / Math.max(r.context.seats, 5)) * 100}
        label="Paid-seat utilization"
      />
      <p className="fine-print">
        Sample activity data, not measured savings. These counts indicate use
        and do not establish business impact.
      </p>
      <button
        className="secondary full"
        onClick={() => {
          download(
            "workspace-value-recap.txt",
            `${r.company} — ${period}\n${24 * n} projects, ${68 * n} handoffs, ${12 * n} reports.\nIllustrative sample data, not a claim of business impact.`,
          );
          setDone(true);
          r.complete();
        }}
      >
        <Download size={16} />
        Download recap
      </button>
      {done && (
        <p className="inline-success" role="status">
          Sample recap downloaded for your review.
        </p>
      )}
    </>
  );
}
function PaymentRecovery() {
  const r = useDemoRuntime();
  const [method, setMethod] = useState(r.initial?.choice || "Visa ···· 4242"),
    [done, setDone] = useState(r.initial?.done || false);
  useEffect(() => r.report({ choice: method, done }), [method, done]);
  return done ? (
    <Success title="Invoice recovered in preview">
      <p>
        Sample invoice INV-1042 is marked paid after a simulated provider
        confirmation.
      </p>
      <p>No card was charged. Your workspace remains accessible.</p>
    </Success>
  ) : (
    <>
      <div className="payment-warning">
        <strong>Invoice INV-1042 needs attention</strong>
        <p>
          $95.00 · Payment was declined. Your workspace remains available during
          a 7-day grace period.
        </p>
      </div>
      <Pick
        label="Payment method"
        value={method}
        options={[
          "Visa ···· 4242",
          "Mastercard ···· 5555 (sample replacement)",
        ]}
        onChange={setMethod}
      />
      <div className="review-row">
        <span>Amount due</span>
        <strong>$95.00</strong>
      </div>
      <button
        className="primary full"
        onClick={() =>
          r.run("Retry invoice payment", () => {
            setDone(true);
            r.complete();
          })
        }
      >
        Retry sample payment
      </button>
      <p className="fine-print">
        Use “Fail next request” to preview another decline. A live product must
        rely on the payment provider’s confirmed status.
      </p>
    </>
  );
}
function Story() {
  const r = useDemoRuntime();
  const [title, setTitle] = useState(r.initial?.name || ""),
    [story, setStory] = useState(r.initial?.extra || ""),
    [consent, setConsent] = useState(false),
    [step, setStep] = useState(r.initial?.step || 0);
  useEffect(
    () => r.report({ name: title, extra: story, step, done: step === 2 }),
    [title, story, step],
  );
  return step === 2 ? (
    <Success title="Story prepared for editorial review">
      <p>{title}</p>
      <p>
        You have authorized a review of this draft. It is not published; the
        final wording and attribution still need your approval.
      </p>
      <button
        className="secondary"
        onClick={() => {
          setStep(1);
          setConsent(false);
        }}
      >
        Withdraw draft approval
      </button>
    </Success>
  ) : step === 1 ? (
    <>
      <div className="review">
        <h3>{title}</h3>
        <p>{story}</p>
        <p>
          Attribution: {r.company} team. No performance figures will be added
          without evidence.
        </p>
      </div>
      <CheckRow
        label="I agree to share this draft for review; publication requires my final approval"
        checked={consent}
        onChange={setConsent}
      />
      <button
        className="primary full"
        disabled={!consent}
        onClick={() =>
          r.run("Submit story draft", () => {
            setStep(2);
            r.complete();
          })
        }
      >
        Prepare approved draft
      </button>
      <button className="text-button full" onClick={() => setStep(0)}>
        Back to editing
      </button>
    </>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep(1);
      }}
    >
      <label className="field">
        Story title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A clearer customer handoff"
        />
      </label>
      <label className="field">
        What changed for your team?
        <textarea
          required
          rows={4}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Describe the workflow, the result you observed, and the evidence you can share."
        />
      </label>
      <button className="primary full" type="submit">
        Review draft and consent
      </button>
    </form>
  );
}
function Reconnect() {
  const r = useDemoRuntime();
  const [source, setSource] = useState(r.initial?.choice || "HubSpot"),
    [done, setDone] = useState(r.initial?.done || false),
    [scope, setScope] = useState(r.initial?.checks?.length ? true : false);
  useEffect(
    () =>
      r.report({
        choice: source,
        checks: scope ? ["Read-only CRM access"] : [],
        done,
      }),
    [source, scope, done],
  );
  return (
    <>
      <Pick
        label="Expired connection"
        value={source}
        options={["HubSpot", "Slack", "Google Drive"]}
        onChange={(v) => {
          setSource(v);
          setDone(false);
          setScope(false);
        }}
      />
      {done ? (
        <Success title={`${source} is connected again`}>
          <p>
            The sample authorization was renewed. Existing records were
            preserved; new changes can resume syncing.
          </p>
          <button
            className="secondary"
            onClick={() => {
              setDone(false);
              setScope(false);
            }}
          >
            Revoke this connection
          </button>
        </Success>
      ) : (
        <>
          <div className="callout">
            <RefreshCw size={20} />
            <div>
              <strong>Authorization expired</strong>
              <p>
                Last successful sync: 3 days ago. Your existing{" "}
                {r.context.records || 24} records are still available.
              </p>
            </div>
          </div>
          <div className="review">
            <strong>Requested access</strong>
            <p>
              Read selected workspace records. No delete permission. The scope
              matches the original connection.
            </p>
          </div>
          <CheckRow
            label="I reviewed the read-only permission scope"
            checked={scope}
            onChange={setScope}
          />
          <button
            className="primary full"
            disabled={!scope}
            onClick={() =>
              r.run("Reconnect provider", () => {
                setDone(true);
                r.complete();
              })
            }
          >
            Reconnect {source}
          </button>
          <p className="fine-print">
            This is a local OAuth outcome preview. No external authorization is
            requested.
          </p>
        </>
      )}
    </>
  );
}
