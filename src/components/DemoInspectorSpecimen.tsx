import { useState, type CSSProperties } from "react";

import {
  DemoInspector,
  DemoInspectorFooter,
  DemoInspectorHeader,
  DemoInspectorSection,
} from "@/components/demo/DemoInspector";
import { DemoShell, DemoStage } from "@/components/demo/DemoShell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import "./demo-inspector-specimen.css";

const MODES = ["preview", "structure", "states"] as const;

type Mode = (typeof MODES)[number];

const MODE_ITEMS: Array<{ value: Mode; label: string }> = [
  { value: "preview", label: "Preview" },
  { value: "structure", label: "Structure" },
  { value: "states", label: "States" },
];

const MODE_LABELS: Record<Mode, string> = {
  preview: "Preview",
  structure: "Structure",
  states: "States",
};

type SpecimenStyle = CSSProperties & {
  "--specimen-intensity": number;
};

export default function DemoInspectorSpecimen() {
  const [mode, setMode] = useState<Mode>("preview");
  const [intensity, setIntensity] = useState(64);
  const [guidesVisible, setGuidesVisible] = useState(true);

  const reset = () => {
    setMode("preview");
    setIntensity(64);
    setGuidesVisible(true);
  };

  const specimenStyle: SpecimenStyle = {
    "--specimen-intensity": intensity / 100,
  };

  return (
    <DemoShell
      className="demo-inspector-specimen"
      aria-label="Control-panel specimen"
    >
      <DemoStage className="demo-inspector-specimen__stage">
        <div
          className="demo-inspector-specimen__canvas"
          data-guides={guidesVisible}
          data-mode={mode}
          style={specimenStyle}
          aria-label={`${MODE_LABELS[mode]} view at ${intensity} percent intensity${guidesVisible ? " with guides" : ""}`}
        >
          <span className="demo-inspector-specimen__guide" aria-hidden="true" />
          <div className="demo-inspector-specimen__object">
            <span>Live result</span>
            <strong>{MODE_LABELS[mode]}</strong>
          </div>
        </div>
      </DemoStage>

      <DemoInspector aria-label="Adjust the specimen">
        <DemoInspectorHeader
          title="Adjust the specimen"
          description="Change a few persistent settings and watch the result."
          headingLevel="h3"
        />

        <DemoInspectorSection
          title="Appearance"
          description="Controls stay grouped by what they change."
          headingLevel="h4"
        >
          <FieldGroup>
            <Field>
              <FieldTitle id="demo-inspector-view-label">View</FieldTitle>
              <SegmentedControl
                aria-labelledby="demo-inspector-view-label"
                value={mode}
                items={MODE_ITEMS}
                onValueChange={setMode}
              />
            </Field>

            <Field>
              <div className="demo-inspector-specimen__value-row">
                <FieldLabel id="demo-inspector-intensity-label">
                  Intensity
                </FieldLabel>
                <output>{intensity}%</output>
              </div>
              <Slider
                aria-labelledby="demo-inspector-intensity-label"
                thumbLabels={["Intensity"]}
                min={0}
                max={100}
                step={1}
                value={intensity}
                onValueChange={(value) => setIntensity(value as number)}
              />
              <FieldDescription>
                Use an approximate value here; exact entry is unnecessary.
              </FieldDescription>
            </Field>

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="demo-inspector-guides">
                  Show guides
                </FieldLabel>
                <FieldDescription>
                  Reveals the alignment boundary on the stage.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="demo-inspector-guides"
                checked={guidesVisible}
                onCheckedChange={setGuidesVisible}
              />
            </Field>
          </FieldGroup>
        </DemoInspectorSection>

        <DemoInspectorFooter>
          <Button variant="quiet" onClick={reset}>
            Reset settings
          </Button>
        </DemoInspectorFooter>
      </DemoInspector>
    </DemoShell>
  );
}
