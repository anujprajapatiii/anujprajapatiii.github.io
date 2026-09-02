import { useState } from "react";

import { Field, FieldGroup } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import "./slider-specimen.css";

export default function SliderSpecimen() {
  const [previewScale, setPreviewScale] = useState(80);

  return (
    <section
      className="slider-specimen"
      aria-labelledby="slider-specimen-title"
      data-slider-supported-specimen
    >
      <header className="slider-specimen__header">
        <h4 id="slider-specimen-title">Continuous settings</h4>
        <p>
          Use the full field for quick pointer movement, or focus the handle and
          use the arrow keys for fine adjustments.
        </p>
      </header>

      <FieldGroup>
        <Field>
          <Slider
            id="slider-specimen-preview-scale"
            label="Preview scale"
            description="Adjust the working preview without changing the published page."
            value={previewScale}
            onValueChange={setPreviewScale}
          />
        </Field>

        <Field>
          <Slider
            id="slider-specimen-motion-strength"
            label="Motion strength"
            description="Choose how strongly the preview responds to pointer movement."
            defaultValue={32.5}
          />
        </Field>

        <Field data-disabled>
          <Slider
            id="slider-specimen-published-preview"
            label="Published preview"
            description="Locked while the live preview is open."
            defaultValue={100}
            disabled
          />
        </Field>
      </FieldGroup>
    </section>
  );
}
