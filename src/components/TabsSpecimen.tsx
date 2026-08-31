import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import "./tabs-specimen.css";

type SpecimenTab = {
  value: string;
  label: string;
  title: string;
  description: string;
  disabled?: boolean;
};

const INITIAL_LINE_TABS: SpecimenTab[] = [
  {
    value: "overview",
    label: "Overview",
    title: "Project overview",
    description: "A concise view of the project’s current direction and status.",
  },
  {
    value: "decisions",
    label: "Decision log",
    title: "Decision log",
    description: "The choices that shaped the work, with enough context to revisit them.",
  },
  {
    value: "archive",
    label: "Archive",
    title: "Project archive",
    description: "Older material retained for reference.",
    disabled: true,
  },
];

const ADDABLE_LINE_TABS: SpecimenTab[] = [
  {
    value: "findings",
    label: "Research findings",
    title: "Research findings",
    description: "Observed patterns, open questions, and evidence from the latest study.",
  },
  {
    value: "accessibility",
    label: "Accessibility findings",
    title: "Accessibility findings",
    description: "Keyboard, screen-reader, contrast, and zoom checks for this release.",
  },
  {
    value: "implementation",
    label: "Implementation notes",
    title: "Implementation notes",
    description: "Technical constraints and handoff details for the next build cycle.",
  },
];

const CONTAINED_TABS: SpecimenTab[] = [
  {
    value: "summary",
    label: "Summary",
    title: "Release summary",
    description: "The release is ready for its final design and engineering review.",
  },
  {
    value: "interaction-states",
    label: "Interaction states",
    title: "Interaction states",
    description: "Rest, hover, focus, active, selected, and disabled states are accounted for.",
  },
  {
    value: "accessibility-review",
    label: "Accessibility review",
    title: "Accessibility review",
    description: "The current pass covers keyboard order, names, roles, and state announcements.",
  },
  {
    value: "responsive-behaviour",
    label: "Responsive behaviour at narrow widths",
    title: "Responsive behaviour",
    description: "The tablist scrolls within its own boundary instead of wrapping or widening the page.",
  },
  {
    value: "localisation",
    label: "Localisation and longer translated labels",
    title: "Localisation",
    description: "Content-sized tabs preserve complete labels and expose the overflow boundary.",
  },
  {
    value: "performance",
    label: "Performance budget",
    title: "Performance budget",
    description: "The shared primitive adds behavior without duplicating another tab implementation.",
  },
  {
    value: "browser-support",
    label: "Browser support",
    title: "Browser support",
    description: "The supported interaction contract is tested through real browser input.",
  },
  {
    value: "motion",
    label: "Reduced motion",
    title: "Reduced motion",
    description: "Selection remains clear when indicator movement is removed.",
  },
  {
    value: "contrast",
    label: "Increased contrast",
    title: "Increased contrast",
    description: "Selection and focus remain distinguishable when stronger boundaries are requested.",
  },
  {
    value: "rtl",
    label: "Right-to-left direction",
    title: "Right-to-left direction",
    description: "Logical properties allow the same component to follow the document direction.",
  },
  {
    value: "release-notes",
    label: "Release notes",
    title: "Release notes",
    description: "A record of the supported interface and its deliberately excluded cases.",
  },
  {
    value: "archived-decisions",
    label: "Archived decisions",
    title: "Archived decisions",
    description: "This view is unavailable in the current release.",
    disabled: true,
  },
];

function TabPanel({ tab }: { tab: SpecimenTab }) {
  return (
    <TabsContent className="tabs-specimen__panel" value={tab.value}>
      <h5>{tab.title}</h5>
      <p>{tab.description}</p>
    </TabsContent>
  );
}

export default function TabsSpecimen() {
  const [lineTabs, setLineTabs] = useState(INITIAL_LINE_TABS);
  const [activeLineTab, setActiveLineTab] = useState("overview");
  const [containedTabs, setContainedTabs] = useState(CONTAINED_TABS);
  const [activeContainedTab, setActiveContainedTab] = useState("summary");
  const [tabsDirection, setTabsDirection] = useState<"ltr" | "rtl">("ltr");

  const nextTab = useMemo(
    () =>
      ADDABLE_LINE_TABS.find(
        (candidate) =>
          !lineTabs.some((tab) => tab.value === candidate.value),
      ),
    [lineTabs],
  );
  const enabledLineTabs = lineTabs.filter((tab) => !tab.disabled);
  const enabledContainedTabs = containedTabs.filter((tab) => !tab.disabled);
  const currentContainedTab = containedTabs.find(
    (tab) => tab.value === activeContainedTab && !tab.disabled,
  );

  const addTab = () => {
    if (!nextTab) return;

    setLineTabs((tabs) => [...tabs, nextTab]);
    setActiveLineTab(nextTab.value);
  };

  const removeSelectedTab = () => {
    if (enabledLineTabs.length <= 1) return;

    const selectedIndex = lineTabs.findIndex(
      (tab) => tab.value === activeLineTab,
    );
    const remainingTabs = lineTabs.filter(
      (tab) => tab.value !== activeLineTab,
    );
    const nextEnabledTab =
      remainingTabs.slice(selectedIndex).find((tab) => !tab.disabled) ??
      [...remainingTabs].reverse().find((tab) => !tab.disabled);

    setLineTabs(remainingTabs);
    if (nextEnabledTab) setActiveLineTab(nextEnabledTab.value);
  };

  const removeCurrentContainedTab = () => {
    if (!currentContainedTab || enabledContainedTabs.length <= 1) return;

    // Do not assign the next value here. This root is intentionally
    // uncontrolled so Base UI owns the missing-item fallback.
    setContainedTabs((tabs) =>
      tabs.filter((tab) => tab.value !== currentContainedTab.value),
    );
  };

  const toggleTabsDirection = () => {
    setTabsDirection((direction) =>
      direction === "ltr" ? "rtl" : "ltr",
    );
  };

  return (
    <section
      className="tabs-specimen"
      aria-label="Supported Tabs specimens"
      data-tabs-supported-specimen
    >
      <div
        className="tabs-specimen__controls"
        role="group"
        aria-label="Change Tabs direction"
        data-tabs-direction-controls
      >
        <Button
          type="button"
          variant="secondary"
          onClick={toggleTabsDirection}
        >
          {tabsDirection === "ltr"
            ? "Use right-to-left"
            : "Use left-to-right"}
        </Button>
        <p className="tabs-specimen__status" aria-live="polite">
          Current direction:{" "}
          {tabsDirection === "ltr" ? "left-to-right" : "right-to-left"}
        </p>
      </div>

      <article
        className="tabs-specimen__case"
        aria-labelledby="tabs-specimen-line-title"
        data-tabs-specimen="line"
      >
        <header className="tabs-specimen__header">
          <h4 id="tabs-specimen-line-title">Line tabs</h4>
          <p>
            Use for peer views that share an edge with the content below. This
            controlled set also proves that tabs can be added and removed
            without changing the interaction contract.
          </p>
        </header>

        <div
          className="tabs-specimen__controls"
          role="group"
          aria-label="Change line tabs"
        >
          <Button
            type="button"
            variant="secondary"
            onClick={addTab}
            disabled={!nextTab}
          >
            Add tab
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={removeSelectedTab}
            disabled={enabledLineTabs.length <= 1}
          >
            Remove selected
          </Button>
          <p className="tabs-specimen__count" aria-live="polite">
            {lineTabs.length} tabs in this set
          </p>
        </div>

        <div className="tabs-specimen__stage">
          <Tabs
            value={activeLineTab}
            onValueChange={setActiveLineTab}
            dir={tabsDirection}
            data-tabs-collection="dynamic"
            data-tabs-direction={tabsDirection}
          >
            <TabsList
              aria-label="Project views, line tabs"
              variant="line"
              layout="content"
              data-tabs-list="line-dynamic"
            >
              {lineTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  data-tab-value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="tabs-specimen__panel-frame">
              {lineTabs.map((tab) => (
                <TabPanel key={tab.value} tab={tab} />
              ))}
            </div>
          </Tabs>
        </div>
      </article>

      <article
        className="tabs-specimen__case"
        aria-labelledby="tabs-specimen-contained-title"
        data-tabs-specimen="contained"
      >
        <header className="tabs-specimen__header">
          <h4 id="tabs-specimen-contained-title">Contained tabs</h4>
          <p>
            Use for a compact group of peer views. This content-sized stress
            case also removes its current view without controlling the next
            selection, proving the primitive’s missing-item fallback.
          </p>
        </header>

        <div
          className="tabs-specimen__controls"
          role="group"
          aria-label="Change contained tabs"
        >
          <Button
            type="button"
            variant="secondary"
            onClick={removeCurrentContainedTab}
            disabled={!currentContainedTab || enabledContainedTabs.length <= 1}
          >
            Remove current view
          </Button>
          <p className="tabs-specimen__count" aria-live="polite">
            {containedTabs.length} views in this set · Current:{" "}
            {currentContainedTab?.label ?? "Updating"}
          </p>
        </div>

        <div className="tabs-specimen__stage" data-tabs-overflow-case>
          <p className="tabs-specimen__hint" id="contained-tabs-overflow-hint">
            Scroll sideways to reach later views. Arrow keys continue through
            the full set; the final view is unavailable.
          </p>
          <Tabs
            defaultValue="summary"
            onValueChange={(value) => {
              if (value !== null) setActiveContainedTab(value);
            }}
            dir={tabsDirection}
            data-tabs-collection="overflow"
            data-tabs-direction={tabsDirection}
            data-tabs-state="uncontrolled-dynamic"
          >
            <TabsList
              activateOnFocus
              aria-label="Release views, contained tabs"
              aria-describedby="contained-tabs-overflow-hint"
              variant="contained"
              layout="content"
              data-tabs-list="contained-overflow"
            >
              {containedTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  data-tab-value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="tabs-specimen__panel-frame">
              {containedTabs.map((tab) => (
                <TabPanel key={tab.value} tab={tab} />
              ))}
            </div>
          </Tabs>
        </div>
      </article>
    </section>
  );
}
