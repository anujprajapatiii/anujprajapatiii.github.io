import { useState } from "react";

import {
  DemoPanel,
  DemoPanelFooter,
  DemoPanelHeader,
  DemoSetting,
  DemoStepDetail,
} from "@/components/demo/DemoPanel";
import { DemoShell, DemoStage } from "@/components/demo/DemoShell";
import { DemoStepList } from "@/components/demo/DemoStepList";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import "./demo-primitives-specimen.css";

const STEP_ORDER = ["canvas", "surface", "control"] as const;

type StepKey = (typeof STEP_ORDER)[number];

const STEPS: Record<StepKey, { label: string; title: string; text: string }> = {
  canvas: {
    label: "Demo area",
    title: "The demo area holds the example.",
    text: "It gives the object one stable place to respond.",
  },
  surface: {
    label: "Surface",
    title: "The surface carries the content.",
    text: "Its raised neutral separates it without adding decoration.",
  },
  control: {
    label: "Setting",
    title: "The setting changes one visible property.",
    text: "Its label stays close to the control and says what turning it on will do.",
  },
};

const STEP_ITEMS = STEP_ORDER.map((value) => ({
  value,
  label: STEPS[value].label,
}));

export default function DemoPrimitivesSpecimen() {
  const [activeStep, setActiveStep] = useState<StepKey>("canvas");
  const [highlightVisible, setHighlightVisible] = useState(true);
  const activeIndex = STEP_ORDER.indexOf(activeStep);
  const previousStep = activeIndex > 0 ? STEP_ORDER[activeIndex - 1] : null;
  const nextStep = STEP_ORDER[(activeIndex + 1) % STEP_ORDER.length];
  const step = STEPS[activeStep];

  return (
    <DemoShell
      className="demo-specimen"
      aria-label="Guided demo-panel specimen"
    >
      <DemoStage className="demo-specimen__stage">
        <div
          className="demo-specimen__visual"
          data-highlight={highlightVisible}
          data-step={activeStep}
        >
          <span className="demo-specimen__outline" aria-hidden="true" />
          <div className="demo-specimen__object">
            <span>Demo surface</span>
            <strong>{step.label}</strong>
          </div>
        </div>
      </DemoStage>

      <DemoPanel aria-label="Explore the specimen">
        <DemoPanelHeader
          title="Explore the specimen"
          description="Choose a part to see how the shared panel explains it."
          headingLevel="h4"
          current={activeIndex + 1}
          total={STEP_ORDER.length}
        />

        <DemoStepList
          label="Specimen parts"
          value={activeStep}
          items={STEP_ITEMS}
          detailId="demo-specimen-step-detail"
          onValueChange={setActiveStep}
        />

        <DemoStepDetail
          id="demo-specimen-step-detail"
          title={step.title}
          headingLevel="h5"
        >
          {step.text}
        </DemoStepDetail>

        <DemoSetting
          label="Show highlight"
          htmlFor="demo-specimen-highlight"
          control={
            <Switch
              id="demo-specimen-highlight"
              checked={highlightVisible}
              onCheckedChange={setHighlightVisible}
            />
          }
        />

        <DemoPanelFooter>
          <Button
            variant="quiet"
            disabled={!previousStep}
            onClick={() => previousStep && setActiveStep(previousStep)}
          >
            Previous
          </Button>
          <Button variant="primary" onClick={() => setActiveStep(nextStep)}>
            {activeIndex === STEP_ORDER.length - 1
              ? "Start again"
              : `Next: ${STEPS[nextStep].label}`}
          </Button>
        </DemoPanelFooter>
      </DemoPanel>
    </DemoShell>
  );
}
