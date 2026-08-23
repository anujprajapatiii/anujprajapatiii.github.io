import { useState, type ComponentType } from "react";
import {
  Accessibility,
  Blocks,
  Boxes,
  CalendarCheck,
  ChartNoAxesCombined,
  CircleCheckBig,
  Gauge,
  Keyboard,
  Lightbulb,
  MessageCircle,
  MousePointer2,
  MousePointerClick,
  PackageOpen,
  Route,
  Ruler,
  ScanSearch,
  Timer,
  TimerReset,
  Users,
  Wifi,
} from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import "./project-nutrition-labels.css";

type Icon = ComponentType<{
  "aria-hidden"?: boolean;
  size?: number | string;
  strokeWidth?: number | string;
}>;

type LabelItem = {
  icon: Icon;
  label: string;
  value?: string;
};

type LabelExample = {
  title: string;
  icon: Icon;
  items: LabelItem[];
};

const examples = {
  performance: {
    title: "File size & performance",
    icon: Gauge,
    items: [
      { icon: PackageOpen, label: "total transfer", value: "42 KB" },
      { icon: Timer, label: "interactive", value: "0.7 s" },
      { icon: Route, label: "main-thread work", value: "86 ms" },
      { icon: ChartNoAxesCombined, label: "performance score", value: "100" },
      { icon: Boxes, label: "runtime dependencies", value: "0" },
      { icon: Wifi, label: "test profile", value: "Fast 4G" },
    ],
  },
  impact: {
    title: "Business impact",
    icon: ChartNoAxesCombined,
    items: [
      { icon: MousePointerClick, label: "task completion", value: "+18%" },
      { icon: TimerReset, label: "median time on task", value: "−24 s" },
      { icon: Users, label: "people tested", value: "12" },
      { icon: CircleCheckBig, label: "successful sessions", value: "91%" },
      { icon: MessageCircle, label: "support questions", value: "−31%" },
      { icon: CalendarCheck, label: "measurement window", value: "30 days" },
    ],
  },
  learnings: {
    title: "Project learnings",
    icon: Lightbulb,
    items: [
      { icon: MousePointer2, label: "Keep proximity effects optional" },
      { icon: Accessibility, label: "Preserve feedback with reduced motion" },
      { icon: Ruler, label: "Small movement ranges feel more physical" },
      { icon: Keyboard, label: "Keep keyboard behavior conventional" },
      { icon: ScanSearch, label: "Test fast reversals, not only ideal paths" },
      { icon: Blocks, label: "Isolate behavior from the component" },
    ],
  },
} satisfies Record<string, LabelExample>;

type ExampleKey = keyof typeof examples;

interface ProjectNutritionLabelsProps {
  initialView?: ExampleKey;
  showSwitcher?: boolean;
}

const labels: Array<{ value: ExampleKey; label: string }> = [
  { value: "performance", label: "Performance" },
  { value: "impact", label: "Impact" },
  { value: "learnings", label: "Learnings" },
];

export default function ProjectNutritionLabels({
  initialView = "performance",
  showSwitcher = true,
}: ProjectNutritionLabelsProps) {
  const [activeKey, setActiveKey] = useState<ExampleKey>(initialView);
  const active = examples[activeKey];
  const CategoryIcon = active.icon;

  return (
    <div className="nutrition-label-demo">
      {showSwitcher && (
        <SegmentedControl
          className="nutrition-label-switcher"
          label="Choose a project label"
          value={activeKey}
          items={labels}
          onValueChange={setActiveKey}
        />
      )}

      <section
        className="nutrition-label"
        aria-label={active.title}
        aria-live="polite"
      >
        <header className="nutrition-label__header">
          <span className="nutrition-label__hero-icon" aria-hidden="true">
            <CategoryIcon />
          </span>
          <h2 className="nutrition-label__title">
            {active.title}
          </h2>
        </header>

        <dl className="nutrition-label__grid">
          {active.items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                className="nutrition-label__item"
                key={`${activeKey}-${item.label}`}
              >
                <ItemIcon aria-hidden={true} />
                <div className="nutrition-label__item-copy">
                  {item.value && (
                    <dd className="nutrition-label__value">{item.value}</dd>
                  )}
                  <dt className="nutrition-label__name">{item.label}</dt>
                </div>
              </div>
            );
          })}
        </dl>
      </section>
    </div>
  );
}
