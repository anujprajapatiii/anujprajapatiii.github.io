import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Check,
  Lock,
  RotateCcw,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { Pick } from "./ui";
import type { CuratedPattern } from "./curation";
export type DemoSnapshot = {
  invitations?: { email: string; role: string; status: string }[];
  name?: string;
  email?: string;
  extra?: string;
  choice?: string;
  amount?: number;
  annual?: boolean;
  checks?: string[];
  people?: string[];
  rows?: string[][];
  done?: boolean;
  count?: number;
  step?: number;
  message?: string;
  link?: boolean;
};
export type JourneyContext = {
  template: string;
  sources: string[];
  view: string;
  invitationRoles: Record<string, string>;
  workspace: string;
  email: string;
  project: string;
  plan: string;
  seats: number;
  annual: boolean;
  addOns: string[];
  invitees: string[];
  records: number;
  goal: string;
  report: string;
};
export const emptyContext: JourneyContext = {
  template: "",
  sources: [],
  view: "",
  invitationRoles: {},
  workspace: "Acme",
  email: "",
  project: "",
  plan: "Team",
  seats: 5,
  annual: false,
  addOns: [],
  invitees: [],
  records: 0,
  goal: "",
  report: "",
};
export type RuntimeValue = {
  company: string;
  context: JourneyContext;
  initial?: DemoSnapshot;
  run: (label: string, action: () => void) => void;
  report: (state: DemoSnapshot) => void;
  complete: () => void;
  busy: boolean;
};
const Runtime = createContext<RuntimeValue>({
  company: "Acme",
  context: emptyContext,
  run: (_, fn) => fn(),
  report: () => {},
  complete: () => {},
  busy: false,
});
export function useDemoRuntime() {
  return useContext(Runtime);
}
const gated = new Set([23, 24, 25, 51, 57, 58, 59, 68, 71, 72, 73, 77, 80, 97]);
export function DemoRuntime({
  pattern,
  children,
  context = emptyContext,
  initial,
  onChange,
  onComplete,
}: {
  pattern: CuratedPattern;
  children: ReactNode;
  context?: JourneyContext;
  initial?: DemoSnapshot;
  onChange?: (v: DemoSnapshot) => void;
  onComplete?: () => void;
}) {
  const [network, setNetwork] = useState("Normal"),
    [role, setRole] = useState(
      gated.has(pattern.id) ? "Workspace admin" : "Member",
    ),
    [status, setStatus] = useState<
      "idle" | "busy" | "error" | "denied" | "requested"
    >("idle"),
    [operation, setOperation] = useState(""),
    [company, setCompany] = useState(context.workspace || "Acme");
  const pending = useRef<(() => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  function run(label: string, action: () => void) {
    if (status === "busy") return;
    if (
      /^(Continue|Next|Finish tour|See my|Pick up|Review trial|Explore a higher)/i.test(
        label,
      )
    ) {
      action();
      return;
    }
    pending.current = action;
    setOperation(label);
    if (
      role === "Viewer" ||
      (gated.has(pattern.id) && role !== "Workspace admin")
    ) {
      setStatus("denied");
      return;
    }
    setStatus("busy");
    timer.current = setTimeout(
      () => {
        if (network === "Fail next request") {
          setNetwork("Normal");
          setStatus("error");
        } else {
          setStatus("idle");
          pending.current = null;
          action();
        }
      },
      network === "Slow connection" ? 3200 : 450,
    );
  }
  function retry() {
    const action = pending.current;
    if (!action) return;
    setNetwork("Normal");
    setStatus("busy");
    timer.current = setTimeout(() => {
      setStatus("idle");
      pending.current = null;
      action();
    }, 450);
  }
  const failure =
    pattern.kind === "billing"
      ? "The payment provider did not confirm the request. No charge is recorded."
      : pattern.kind === "import"
        ? "The import could not be committed. Your reviewed rows are still available."
        : pattern.kind === "invite"
          ? "The invitation request did not finish. Your recipients and roles have been preserved."
          : pattern.kind === "connect"
            ? "The provider could not complete authorization. Existing workspace data is unchanged."
            : "The request could not be completed. Your inputs are preserved so you can try again.";
  const state =
    status === "busy"
      ? "Request in progress"
      : status === "error"
        ? "Recoverable error"
        : status === "denied"
          ? "Permission required"
          : status === "requested"
            ? "Approval requested"
            : "Ready";
  return (
    <Runtime.Provider
      value={{
        company,
        context,
        initial,
        run,
        report: onChange || (() => {}),
        complete: onComplete || (() => {}),
        busy: status === "busy",
      }}
    >
      <div className="lab-config">
        <details>
          <summary>
            Explore conditions <span>{state}</span>
          </summary>
          <div className="lab-config-fields">
            <Pick
              label="Connection"
              value={network}
              options={["Normal", "Slow connection", "Fail next request"]}
              onChange={setNetwork}
            />
            <Pick
              label="Workspace role"
              value={role}
              options={["Viewer", "Member", "Workspace admin"]}
              onChange={(v) => {
                setRole(v);
                if (status === "denied" || status === "requested")
                  setStatus("idle");
              }}
            />
            <label className="field">
              Workspace name
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value.slice(0, 40))}
                placeholder="Acme"
              />
            </label>
          </div>
          <p>
            Choose a condition, then use the demo. Requests run locally;
            failures preserve your inputs.
          </p>
        </details>
      </div>
      <div className="runtime-surface" ref={container}>
        {status !== "idle" && (
          <div
            className={`runtime-notice runtime-${status}`}
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {status === "busy" ? (
              <LoaderCircle className="spin" size={19} />
            ) : status === "denied" ? (
              <Lock size={19} />
            ) : status === "requested" ? (
              <Check size={19} />
            ) : (
              <AlertCircle size={19} />
            )}
            <div>
              <strong>{state}</strong>
              <p>
                {status === "busy"
                  ? `${operation}… Your work stays here while the request finishes.`
                  : status === "error"
                    ? failure
                    : status === "denied"
                      ? `${role}s cannot complete “${operation}”. A workspace admin can approve this change.`
                      : "The approval request is recorded in this preview. Nothing was sent."}
              </p>
              <div className="notice-actions">
                {status === "busy" && (
                  <button
                    onClick={() => {
                      clearTimeout(timer.current);
                      pending.current = null;
                      setStatus("idle");
                    }}
                  >
                    Cancel request
                  </button>
                )}
                {status === "error" && (
                  <>
                    <button onClick={retry}>
                      <RotateCcw size={14} />
                      Retry request
                    </button>
                    <button
                      onClick={() => {
                        pending.current = null;
                        setStatus("idle");
                      }}
                    >
                      Keep editing
                    </button>
                  </>
                )}
                {status === "denied" && (
                  <>
                    <button onClick={() => setStatus("requested")}>
                      Request admin approval
                    </button>
                    <button onClick={() => setStatus("idle")}>
                      Keep current setup
                    </button>
                  </>
                )}
                {status === "requested" && (
                  <button
                    onClick={() => {
                      setRole("Workspace admin");
                      setStatus("idle");
                    }}
                  >
                    Preview as workspace admin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          aria-busy={status === "busy"}
          inert={status === "busy" ? true : undefined}
        >
          {children}
        </div>
      </div>
    </Runtime.Provider>
  );
}
