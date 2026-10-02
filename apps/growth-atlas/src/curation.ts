import {
  patterns as originalPatterns,
  categories,
  type Pattern as BasePattern,
} from "./catalog";
import evidenceData from "./evidence.json";
export { categories };
export type Evidence = {
  id: string;
  product: string;
  title: string;
  url: string;
  checkedAt: string;
  evidenceType: string;
  observed: string;
  appliesTo: number[];
  limits: string;
};
export const evidence = evidenceData as Evidence[];
export type CuratedPattern = BasePattern & {
  job: string;
  trigger: string;
  persona: string;
  models: string[];
  avoid: string;
  alternatives: number[];
  variants: string[];
  variantIds: number[];
  sources: Evidence[];
  states: string[];
};
type Curation = [
  number,
  string,
  string,
  string,
  string,
  string,
  number[],
  number[],
];
const curation: Curation[] = [
  [
    1,
    "Build a business case",
    "A buyer is estimating operational value",
    "Buyer",
    "Sales-assisted|Seat-based",
    "Avoid when you cannot make the workload assumptions transparent. Do not equate time saved with realized cash savings.",
    [2, 4],
    [7],
  ],
  [
    2,
    "Evaluate with an expert",
    "A prospective team has a specific workflow question",
    "Buyer",
    "Sales-assisted",
    "Avoid a mandatory meeting when a self-service evaluation can answer the question.",
    [8, 5],
    [9, 60, 79, 87],
  ],
  [
    3,
    "Choose an appropriate plan",
    "A buyer understands the product but not the right tier",
    "Buyer",
    "Freemium|Seat-based",
    "Avoid a recommendation quiz when the comparison is already straightforward. Never hide cheaper eligible plans.",
    [4, 54],
    [6, 15],
  ],
  [
    4,
    "Compare commercial options",
    "A team is evaluating capabilities, limits, and total cost",
    "Buyer",
    "Seat-based|Freemium",
    "Avoid incomparable feature lists or an annual price displayed without its billing commitment.",
    [3, 59],
    [56, 67],
  ],
  [
    5,
    "Start from a proven structure",
    "A visitor wants to inspect a workflow before committing",
    "Builder",
    "Freemium|Seat-based",
    "Avoid forcing a template when users already have a workflow or data they need to preserve.",
    [23, 31],
    [18, 26, 32, 66, 83, 94],
  ],
  [
    8,
    "Understand the first useful outcome",
    "A visitor or returning user needs an orientation",
    "Builder",
    "Freemium|Sales-assisted",
    "Avoid blocking experienced users with a mandatory tour or explaining controls outside their context.",
    [5, 21],
    [27, 45, 93],
  ],
  [
    10,
    "Unblock a security evaluation",
    "An evaluator needs evidence for internal procurement",
    "Buyer",
    "Sales-assisted",
    "Avoid implying that a marketing checklist certifies compliance. Link authoritative evidence and access requirements.",
    [2, 68],
    [],
  ],
  [
    11,
    "Create an account",
    "An interested user is ready to establish an identity",
    "Builder",
    "Freemium|Seat-based",
    "Avoid collecting workspace and profile details before they are needed. A client-side success is not a verified identity.",
    [16, 20],
    [],
  ],
  [
    12,
    "Adapt the first workspace",
    "A new user has different setup needs based on their role",
    "Builder",
    "Freemium|Seat-based",
    "Avoid personalization questions that do not change the experience. Keep role choices editable.",
    [5, 13],
    [14],
  ],
  [
    13,
    "Create a workspace",
    "A user needs a private place to organize shared work",
    "Workspace admin",
    "Seat-based|Freemium",
    "Avoid copying organization permissions automatically into a new workspace.",
    [16, 5],
    [22, 62, 99],
  ],
  [
    16,
    "Join the right existing team",
    "A verified user may already belong to an organization",
    "Collaborator",
    "Seat-based",
    "Avoid revealing private workspace names to unverified domains. Discovery is not permission to join.",
    [13, 20],
    [],
  ],
  [
    20,
    "Accept a team invitation",
    "A recipient opens a scoped workspace invitation",
    "Collaborator",
    "Seat-based",
    "Avoid accepting expired or revoked tokens. Show the invited address and role before membership is granted.",
    [16, 24],
    [],
  ],
  [
    21,
    "Reach the first value milestone",
    "A new or returning team has a few meaningful setup tasks",
    "Builder",
    "Freemium|Seat-based",
    "Avoid marking optional profile work as a required activation step or counting clicks as delivered value.",
    [31, 23],
    [17, 30, 34, 47, 75, 92],
  ],
  [
    23,
    "Bring existing data into the product",
    "A team has records it already trusts",
    "Workspace admin",
    "Seat-based|Usage-based",
    "Avoid committing partial imports without a review of invalid rows, mappings, and duplicate handling.",
    [5, 31],
    [],
  ],
  [
    24,
    "Bring collaborators into a workflow",
    "A workspace needs a teammate with a defined role",
    "Workspace admin",
    "Seat-based",
    "Avoid sending invitations without explicit consent or hiding paid seat implications.",
    [20, 59],
    [38, 86, 98],
  ],
  [
    25,
    "Connect a trusted data source",
    "A new workspace depends on an external service",
    "Workspace admin",
    "Seat-based|Usage-based",
    "Avoid broad permissions or implying OAuth succeeded before a provider callback is verified.",
    [23, 97],
    [29, 63],
  ],
  [
    31,
    "Create the first real project",
    "A user encounters a new, empty workspace",
    "Builder",
    "Freemium|Seat-based",
    "Avoid multiple competing calls to action or populating a new project with unexplained fake work.",
    [5, 21],
    [33, 49, 90],
  ],
  [
    35,
    "Build a useful first report",
    "A user has data and a business question",
    "Builder",
    "Seat-based|Usage-based",
    "Avoid starting with an empty chart editor. Preserve query and range selections when validation fails.",
    [43, 41],
    [],
  ],
  [
    36,
    "Automate a recurring handoff",
    "A repeatable event should trigger an understandable action",
    "Builder",
    "Usage-based|Seat-based",
    "Avoid enabling an automation before previewing its scope, owner, and failure behavior.",
    [25, 21],
    [],
  ],
  [
    41,
    "Receive a useful recurring summary",
    "A user needs updates without repeatedly checking a dashboard",
    "Collaborator",
    "Seat-based",
    "Avoid enabling outreach by default or hiding the time zone. Delivery preferences must be easy to stop.",
    [42, 35],
    [50, 100],
  ],
  [
    42,
    "Control interruptions",
    "The product generates different kinds of notifications",
    "Collaborator",
    "Freemium|Seat-based",
    "Avoid treating optional marketing consent as mandatory service communication.",
    [41],
    [19, 78],
  ],
  [
    43,
    "Return to a useful filtered view",
    "A user repeats the same information-finding task",
    "Builder",
    "Seat-based",
    "Avoid a saved view whose filters or visibility are hidden from its owner.",
    [48, 35],
    [39],
  ],
  [
    44,
    "Track progress toward a useful goal",
    "A team agrees on a measurable short-term outcome",
    "Workspace admin",
    "Seat-based",
    "Avoid arbitrary streak pressure or targets users cannot influence. An activity target is not proof of value.",
    [31, 74],
    [28, 37, 65, 96],
  ],
  [
    46,
    "Give focused product feedback",
    "A user has just finished a meaningful task",
    "Collaborator",
    "Freemium|Seat-based",
    "Avoid interrupting unfinished work or soliciting only positive public reviews.",
    [76],
    [84],
  ],
  [
    48,
    "Reach a frequent action quickly",
    "An experienced user wants to bypass navigation",
    "Builder",
    "Freemium|Seat-based",
    "Avoid making keyboard shortcuts the only way to use an action. Search must respect authorization.",
    [43],
    [],
  ],
  [
    51,
    "Unlock a capability at the moment of need",
    "A user encounters a capability outside their plan",
    "Buyer",
    "Freemium|Seat-based",
    "Avoid surprising the user after substantial unpaid configuration. Show the current alternative and who can authorize a purchase.",
    [53, 4],
    [],
  ],
  [
    52,
    "Understand and manage a usage limit",
    "Consumption is approaching a plan boundary",
    "Workspace admin",
    "Usage-based|Freemium",
    "Avoid surprise blocks and ambiguous overage costs. Existing data must remain accessible according to published terms.",
    [59, 4],
    [],
  ],
  [
    53,
    "Evaluate the shape of paid value",
    "A user wants to inspect a paid report or capability",
    "Builder",
    "Freemium|Seat-based",
    "Avoid dressing sample data as the user’s actual results or claiming that preview access changes billing.",
    [51, 35],
    [],
  ],
  [
    54,
    "Choose a billing commitment",
    "A buyer compares monthly flexibility with an annual commitment",
    "Buyer",
    "Seat-based",
    "Avoid showing only the equivalent monthly price. State the actual amount collected and renewal period.",
    [4, 57],
    [],
  ],
  [
    55,
    "Complete a time-bounded evaluation",
    "A team is midway through a trial with remaining evaluation tasks",
    "Workspace admin",
    "Freemium|Sales-assisted",
    "Avoid fabricated countdowns. Clarify whether access stops, downgrades, or auto-renews at the trial end.",
    [21, 51],
    [],
  ],
  [
    57,
    "Review a subscription purchase",
    "An authorized buyer is ready to confirm price and terms",
    "Buyer",
    "Seat-based",
    "Avoid charging on a plan-selection click. Use provider-confirmed success, a recurring total, and an explicit authorization.",
    [54, 59],
    [],
  ],
  [
    58,
    "Add a focused capability",
    "A customer needs an adjacent feature with a separate price",
    "Buyer",
    "Seat-based|Usage-based",
    "Avoid preselected add-ons or bundling unrelated capability into a forced upgrade.",
    [51, 4],
    [64],
  ],
  [
    59,
    "Allocate paid team capacity",
    "An admin plans the number of paid collaborators",
    "Workspace admin",
    "Seat-based",
    "Avoid billing all workspace roles equally without explaining which ones consume a paid seat.",
    [24, 52],
    [61, 69],
  ],
  [
    68,
    "Roll out to another team",
    "An internal champion wants to extend a proven workflow",
    "Workspace admin",
    "Sales-assisted|Seat-based",
    "Avoid organization-wide rollout before checking permissions, ownership, training, and pilot feedback.",
    [13, 24],
    [],
  ],
  [
    71,
    "Cancel a subscription clearly",
    "An authorized customer has chosen to end a paid plan",
    "Buyer",
    "Seat-based|Usage-based",
    "Avoid requiring a reason, a call, or a retention offer before cancellation. Explain the effective date and data access.",
    [72, 73],
    [],
  ],
  [
    72,
    "Pause for a bounded period",
    "A customer has a temporary interruption in need",
    "Buyer",
    "Seat-based",
    "Avoid suggesting pause when the user has asked for cancellation. Show the exact resumption date and charge.",
    [71, 73],
    [],
  ],
  [
    73,
    "Right-size an existing plan",
    "A customer still needs the product but fewer capabilities",
    "Buyer",
    "Freemium|Seat-based",
    "Avoid silently deleting data that exceeds the smaller plan. Explain limits and effective date before confirming.",
    [71, 52],
    [],
  ],
  [
    74,
    "Review value before renewal",
    "An admin needs a factual account of adoption and outcomes",
    "Buyer",
    "Sales-assisted|Seat-based",
    "Avoid inventing savings or attributing all business gains to product activity. Clearly label source and reporting period.",
    [44, 57],
    [],
  ],
  [
    76,
    "Diagnose a reason for friction",
    "A customer is blocked or losing momentum",
    "Collaborator",
    "Freemium|Seat-based",
    "Avoid collecting feedback with no follow-through or using the survey to obstruct a decision.",
    [46, 71],
    [],
  ],
  [
    77,
    "Recover a failed payment",
    "A real provider event says the invoice was not paid",
    "Buyer",
    "Seat-based|Usage-based",
    "Avoid falsely claiming a charge succeeded or ending access without explaining the grace period.",
    [57, 73],
    [],
  ],
  [
    80,
    "Take workspace data elsewhere",
    "An authorized user needs an export for portability",
    "Workspace admin",
    "Freemium|Seat-based",
    "Avoid holding exports hostage to renewal or omitting known limits of the export format.",
    [23, 71],
    [],
  ],
  [
    81,
    "Recommend the product to another team",
    "A satisfied user chooses to share a referral link",
    "Collaborator",
    "Freemium|Seat-based",
    "Avoid undisclosed incentives and automatic contact messages. Explain attribution and reward eligibility.",
    [82, 85],
    [89],
  ],
  [
    82,
    "Share a useful work product",
    "A user wants a report or template to reach another audience",
    "Collaborator",
    "Freemium|Seat-based",
    "Avoid public-by-default links, invisible access changes, or irreversible permission decisions.",
    [24, 81],
    [40, 70],
  ],
  [
    85,
    "Understand a referral reward",
    "An advocate wants to know whether a referral qualified",
    "Collaborator",
    "Freemium",
    "Avoid implying an invitation earns credit before eligibility is met. Include pending, ineligible, and claimed states.",
    [81],
    [],
  ],
  [
    97,
    "Restore an expired integration",
    "A connected provider no longer grants access",
    "Workspace admin",
    "Seat-based|Usage-based",
    "Avoid wiping imported records or silently broadening permissions during reconnection.",
    [25, 23],
    [],
  ],
];
const stateKinds: Record<string, string[]> = {
  calculator: ["Editable assumptions", "Updated estimate", "Download"],
  lead: ["Empty form", "Validation", "Submitting", "Request prepared", "Retry"],
  quiz: ["Choice", "Recommendation", "Change choice"],
  checklist: ["Incomplete", "Partial progress", "Complete", "Undo"],
  wizard: [
    "Details",
    "Configuration",
    "Review",
    "Validation",
    "Back",
    "Confirm",
  ],
  import: ["Empty", "File validation", "Review", "Commit", "Download"],
  invite: ["Empty", "Validation", "Role review", "Pending", "Revoke"],
  connect: [
    "Disconnected",
    "Connecting",
    "Connected",
    "Permission denied",
    "Revoke",
  ],
  template: ["Browse", "Preview", "Use template", "Edit"],
  tour: ["Start", "Progress", "Skip", "Finish"],
  create: ["Empty", "Validation", "Creating", "Created"],
  search: ["Query", "Results", "No matches", "Selected action"],
  segment: ["Default filter", "Filtered results", "Save", "Edit"],
  notification: ["Disabled", "Enabled", "Saving", "Saved"],
  digest: ["Schedule", "Validation", "Save", "Disabled"],
  goal: ["Target", "Progress", "Complete", "Adjust"],
  milestone: ["In progress", "Complete", "Continue"],
  feedback: ["Rating", "Comment", "Submitting", "Received"],
  pricing: ["Compare", "Choose", "Review"],
  upgrade: [
    "Available alternative",
    "Blocked action",
    "Permission request",
    "Upgrade preview",
  ],
  limit: ["Below limit", "Near limit", "At limit", "Review capacity"],
  paywall: ["Sample preview", "Locked", "Unlocked preview"],
  addon: ["Unselected", "Selected", "Combined total", "Review"],
  seat: ["Seat allocation", "Cost preview", "Approval"],
  billing: [
    "Review",
    "Consent",
    "Processing",
    "Declined",
    "Retry",
    "Confirmed",
  ],
  annual: ["Monthly", "Annual", "Total cost", "Review"],
  trial: ["Active trial", "Evaluation progress", "Next step"],
  cancel: [
    "Optional reason",
    "Consequences",
    "Confirm",
    "Canceled",
    "Keep plan",
  ],
  pause: ["Duration", "Resumption date", "Confirm", "Cancel instead"],
  downgrade: ["Current plan", "Smaller plan", "Lost capability", "Confirm"],
  survey: ["Choice", "Comment", "Submit", "Next step"],
  referral: ["Active link", "Copied", "Revoked", "New link"],
  share: ["Restricted", "Permission scope", "Link enabled", "Revoked"],
  reward: ["Invited", "Qualified", "Eligible", "Claimed"],
  winback: ["Recap", "Select next action", "Resumed"],
};
const stateOverrides: Record<number, string[]> = {
  11: ["Account details", "Verification", "Invalid code", "Resend", "Verified"],
  12: ["Choose a role", "Adapted workflow", "Save", "Change choice"],
  20: ["Valid invitation", "Identity mismatch", "Expired", "Revoked", "Accepted", "Declined"],
  24: ["Empty", "Draft recipients", "Role review", "Seat limit", "Pending", "Revoke"],
  35: ["Business question", "Report details", "Validation", "Generated report", "Edit", "Download"],
  36: ["Trigger and action", "Owner", "Sample event", "Enable", "Disable"],
  74: ["Reporting period", "Activity recap", "Download"],
  77: ["Declined invoice", "Replacement method", "Retry", "Provider confirmation"],
  97: ["Expired authorization", "Permission review", "Reconnect", "Restored", "Revoke"],
};
export const patterns: CuratedPattern[] = curation.map(
  ([id, job, trigger, persona, model, avoid, alternatives, variantIds]) => {
    const p = originalPatterns.find((x) => x.id === id)!;
    return {
      ...p,
      job,
      trigger,
      persona,
      models: model.split("|"),
      avoid,
      alternatives,
      variantIds,
      variants: variantIds.map(
        (v) => originalPatterns.find((x) => x.id === v)!.title,
      ),
      sources: evidence.filter(
        (s) =>
          s.appliesTo.includes(id) ||
          variantIds.some((v) => s.appliesTo.includes(v)),
      ),
      states: stateOverrides[id] || stateKinds[p.kind] || ["Default", "Working", "Complete"],
    };
  },
);
const map = new Map<number, number>();
for (const p of patterns) {
  map.set(p.id, p.id);
  p.variantIds.forEach((id) => {
    if (!map.has(id)) map.set(id, p.id);
  });
}
export function resolvePattern(value: string | number) {
  const original =
    typeof value === "number"
      ? originalPatterns.find((p) => p.id === value)
      : originalPatterns.find((p) => p.slug === value);
  if (!original) return null;
  return (
    patterns.find((p) => p.id === (map.get(original.id) || original.id)) || null
  );
}
export function brief(p: CuratedPattern) {
  return `# ${p.title}\n\n${p.category} · ${p.format}\n\n## Job\n${p.job}\n\n## Trigger\n${p.trigger}\n\n## Design rationale (editorial)\n${p.insight}\n\n## When to avoid\n${p.avoid}\n\n## Measure\n${p.metric}\nNo uplift is claimed. Establish a baseline for your own context.\n\n## Guardrail\n${p.guardrail}\n\n## States\n${p.states.join(", ")}\n\n## Documented references\n${p.sources.map((s) => `- ${s.product}: [${s.title}](${s.url}) — reviewed ${s.checkedAt}\n  ${s.observed}\n  Evidence limit: ${s.limits}`).join("\n")}\n\nThe grayscale demo is an original interpretation, not a reproduction or endorsement by the referenced products.`;
}
export type Journey = {
  id: string;
  title: string;
  description: string;
  persona: string;
  ids: number[];
  entry: string;
  exit: string;
  steps: { why: string; handoff: string }[];
};
export const journeys: Journey[] = [
  {
    id: "first-use",
    title: "From interest to first value",
    description:
      "Let a new team explore, establish a workspace, and create its first useful project.",
    persona: "Builder",
    ids: [5, 11, 13, 21, 31],
    entry: "A new user has a real project to organize.",
    exit: "A named project exists and the first useful action is acknowledged.",
    steps: [
      {
        why: "Offer a useful starting structure before asking for commitment.",
        handoff:
          "Selected template carries forward as a starting point for the first project.",
      },
      {
        why: "Establish identity with minimal required information.",
        handoff: "Name and email carry forward into workspace setup.",
      },
      {
        why: "Create a private workspace around the user’s actual job.",
        handoff: "Workspace name becomes the context for later steps.",
      },
      {
        why: "Explain the few actions that lead to value.",
        handoff: "Completed setup actions remain visible in the journey.",
      },
      {
        why: "Turn evaluation into a real piece of work.",
        handoff: "The project name is saved in the shared journey context.",
      },
    ],
  },
  {
    id: "data-to-report",
    title: "From existing data to a useful report",
    description:
      "Connect a trusted source, validate its data, and create a report worth revisiting.",
    persona: "Builder",
    ids: [25, 23, 35, 43, 41],
    entry: "A workspace has existing customer or project records.",
    exit: "A reviewed report and recurring delivery preference are configured.",
    steps: [
      {
        why: "Make provider permissions and scope explicit.",
        handoff: "Connected sources stay in the context panel.",
      },
      {
        why: "Validate and review records before committing an import.",
        handoff: "Imported row count carries into the report brief.",
      },
      {
        why: "Ask a business question before choosing report details.",
        handoff: "Report title and scope are preserved.",
      },
      {
        why: "Make the useful result easy to find again.",
        handoff: "Saved view name remains available.",
      },
      {
        why: "Let the recipient choose a schedule rather than adding noise.",
        handoff: "Delivery preference completes the reporting loop.",
      },
    ],
  },
  {
    id: "team-rollout",
    title: "From one champion to a working team",
    description:
      "Prepare a pilot, allocate seats, invite collaborators, and review membership.",
    persona: "Workspace admin",
    ids: [68, 59, 24, 20, 42],
    entry: "A champion has evidence that the workflow helps their team.",
    exit: "A collaborator accepts a scoped invitation and controls notifications.",
    steps: [
      {
        why: "Check ownership, permissions, and pilot feedback first.",
        handoff: "Pilot readiness remains visible.",
      },
      {
        why: "Show the commercial implication of adding teammates.",
        handoff: "Chosen capacity carries into invitation review.",
      },
      {
        why: "Collect explicit invitees and a role.",
        handoff: "The invitee list is used by the acceptance step.",
      },
      {
        why: "Let the recipient verify identity, workspace, and role.",
        handoff: "Accepted membership is recorded locally.",
      },
      {
        why: "Give the new collaborator control over interruptions.",
        handoff: "Preference choices close the loop.",
      },
    ],
  },
  {
    id: "trial-to-paid",
    title: "From evaluation to paid commitment",
    description:
      "Help an active trial team assess fit and make a deliberate purchase decision.",
    persona: "Buyer",
    ids: [55, 3, 4, 54, 57],
    entry: "A team has tested the product against a defined use case.",
    exit: "The buyer has reviewed the selected plan, seats, and renewal terms.",
    steps: [
      {
        why: "Connect time remaining with unfinished evaluation work.",
        handoff: "Evaluation progress is preserved.",
      },
      {
        why: "Offer a recommendation based on a stated need.",
        handoff: "The recommended plan stays editable.",
      },
      {
        why: "Compare limits and capabilities on equal dimensions.",
        handoff: "Selected plan carries to billing.",
      },
      {
        why: "Show the real annual charge alongside flexibility.",
        handoff: "Billing cadence and seat count carry to review.",
      },
      {
        why: "Require clear consent and handle a declined request.",
        handoff: "Confirmation uses the price and cadence already selected.",
      },
    ],
  },
  {
    id: "capacity-expansion",
    title: "From a usage limit to informed expansion",
    description:
      "Make a capacity decision clear before a growing team commits to more spend.",
    persona: "Workspace admin",
    ids: [52, 59, 58, 57],
    entry: "A workspace is approaching a published limit.",
    exit: "An authorized buyer has reviewed the expanded recurring total.",
    steps: [
      {
        why: "Warn before a hard block and keep existing work accessible.",
        handoff: "Current capacity frames the decision.",
      },
      {
        why: "Distinguish paid collaborators from free viewers.",
        handoff: "Seat count carries into the commercial review.",
      },
      {
        why: "Add optional capabilities only when they match a need.",
        handoff: "Selected add-ons update the final total.",
      },
      {
        why: "Review recurring price and handle failures before confirming.",
        handoff: "A local confirmation completes the expansion preview.",
      },
    ],
  },
  {
    id: "feature-adoption",
    title: "From a blocked feature to a useful workflow",
    description:
      "Preview the benefit, respect purchase authority, and configure a meaningful use.",
    persona: "Builder",
    ids: [53, 51, 35, 41],
    entry: "A user finds a valuable capability outside their current plan.",
    exit: "An unlocked preview leads to a named report and delivery choice.",
    steps: [
      {
        why: "Show the shape of paid value using clearly labeled sample data.",
        handoff: "Preview selections are saved with this step for review.",
      },
      {
        why: "Separate wanting a feature from having billing authority.",
        handoff:
          "A viewer can request approval; an admin can inspect the upgraded state.",
      },
      {
        why: "Use the capability to answer a real question.",
        handoff: "The named report is carried forward.",
      },
      {
        why: "Make continued use relevant and controllable.",
        handoff: "A recipient and cadence complete the workflow.",
      },
    ],
  },
  {
    id: "right-size",
    title: "From friction to a sustainable plan",
    description:
      "Find out what changed, offer a smaller commitment, and review the consequences.",
    persona: "Buyer",
    ids: [76, 73, 54, 57],
    entry:
      "A customer still needs the product but the present plan no longer fits.",
    exit: "A smaller or differently billed plan has been explicitly reviewed.",
    steps: [
      {
        why: "Understand the friction without making the answer mandatory.",
        handoff: "The stated reason is saved as context.",
      },
      {
        why: "Explain lost capability before a smaller plan is selected.",
        handoff: "The chosen tier carries into billing.",
      },
      {
        why: "Offer flexibility with clear total cost.",
        handoff: "Cadence remains a deliberate choice.",
      },
      {
        why: "Confirm the actual selected plan and recurring terms.",
        handoff: "The preview records the user’s choice without charging.",
      },
    ],
  },
  {
    id: "responsible-exit",
    title: "From cancellation intent to a clear exit",
    description:
      "Respect the customer’s decision while supporting portability and a transparent end date.",
    persona: "Buyer",
    ids: [80, 72, 71],
    entry: "An authorized customer wants to stop paying.",
    exit: "Their export is available and cancellation terms are understood.",
    steps: [
      {
        why: "Support data portability before the subscription ends.",
        handoff: "Export status remains visible.",
      },
      {
        why: "Present a pause only as an optional alternative.",
        handoff: "A direct cancellation path remains available.",
      },
      {
        why: "Make the effective date and remaining access explicit.",
        handoff:
          "Confirmation closes the journey without a retention obstacle.",
      },
    ],
  },
  {
    id: "value-to-advocacy",
    title: "From a useful result to voluntary advocacy",
    description:
      "Let a customer share work, refer a peer, and understand the reward’s conditions.",
    persona: "Collaborator",
    ids: [74, 82, 81, 85],
    entry: "A customer has a result they find worth sharing.",
    exit: "A controlled share and a transparent referral status are available.",
    steps: [
      {
        why: "Begin with a factual recap rather than an invented benefit.",
        handoff: "The selected reporting period anchors the share.",
      },
      {
        why: "Let the owner choose audience and link permissions.",
        handoff: "Link status and scope remain visible.",
      },
      {
        why: "Make referral incentives and eligibility explicit.",
        handoff: "No contacts are messaged automatically.",
      },
      {
        why: "Separate invited, qualified, and rewarded states.",
        handoff: "Reward progression completes the advocacy loop.",
      },
    ],
  },
  {
    id: "return-to-value",
    title: "From a stalled workspace to renewed momentum",
    description:
      "Restore context and broken connections, then resume a modest, useful task.",
    persona: "Builder",
    ids: [97, 21, 43, 44],
    entry: "A returning user has existing work and an interrupted connection.",
    exit: "The connection is restored and a realistic new goal is recorded.",
    steps: [
      {
        why: "Explain why authorization expired and preserve existing records.",
        handoff: "Recovery status is saved with this step for review.",
      },
      {
        why: "Resume setup from a useful point instead of restarting.",
        handoff: "Readiness carries into goal setting.",
      },
      {
        why: "Recover the useful view of work before adding a new goal.",
        handoff:
          "Selected filters and the saved view remain in this walkthrough.",
      },
      {
        why: "Let the team select a small, achievable outcome.",
        handoff: "A saved goal ends the journey with a concrete next step.",
      },
    ],
  },
];
