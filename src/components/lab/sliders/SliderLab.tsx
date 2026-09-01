import { useState } from "react";

import { Field, FieldGroup } from "@/components/ui/field";
import {
  ExperimentalSlider,
  type ExperimentalSliderVariant,
} from "@/components/ui/experimental-slider";
import "./slider-lab.css";

type SliderDirection = {
  key: "A" | "B" | "C";
  name: string;
  premise: string;
  useCase: string;
  variant: ExperimentalSliderVariant;
};

const DIRECTIONS: SliderDirection[] = [
  {
    key: "A",
    name: "Block rail",
    premise:
      "A familiar low rail with a compact square thumb and a decisive filled range.",
    useCase: "General settings",
    variant: "block",
  },
  {
    key: "B",
    name: "Calibrated rule",
    premise:
      "A narrow index moves across fine ticks, making position feel measured.",
    useCase: "Measured adjustments",
    variant: "rule",
  },
  {
    key: "C",
    name: "Inset channel",
    premise:
      "A raised square thumb travels inside a recessed channel for the strongest physical cue.",
    useCase: "Prominent canvas controls",
    variant: "channel",
  },
];

function SliderDirection({ direction }: { direction: SliderDirection }) {
  const [value, setValue] = useState(80);

  return (
    <article
      className="slider-lab__direction"
      aria-labelledby={`slider-direction-${direction.key}`}
      data-slider-direction={direction.key}
    >
      <header className="slider-lab__direction-header">
        <p className="label">Option {direction.key}</p>
        <h2 id={`slider-direction-${direction.key}`} className="text-heading">
          {direction.name}
        </h2>
        <p className="slider-lab__premise">{direction.premise}</p>
        <p className="slider-lab__use-case">
          <span>Best fit</span>
          <span>{direction.useCase}</span>
        </p>
      </header>

      <div className="slider-lab__specimen">
        <FieldGroup>
          <Field>
            <ExperimentalSlider
              description="Adjust the working preview without changing the published page."
              id={`slider-${direction.variant}-active`}
              label="Preview scale"
              onValueChange={setValue}
              value={value}
              variant={direction.variant}
            />
          </Field>

          <Field data-disabled>
            <ExperimentalSlider
              description="Locked while the live preview is open."
              disabled
              id={`slider-${direction.variant}-disabled`}
              label="Published preview"
              value={100}
              variant={direction.variant}
            />
          </Field>
        </FieldGroup>
      </div>
    </article>
  );
}

export default function SliderLab() {
  return (
    <section className="slider-lab" aria-label="Slider directions">
      {DIRECTIONS.map((direction) => (
        <SliderDirection direction={direction} key={direction.key} />
      ))}
    </section>
  );
}
