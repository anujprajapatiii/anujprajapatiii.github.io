import { useState } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import "./switch-specimen.css";

type Setting = {
  key: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
};

const SETTINGS: Setting[] = [
  {
    key: "shared-focus",
    label: "Share focus across devices",
    description:
      "Keep the current focus mode synchronized when you move between devices.",
    defaultChecked: true,
  },
  {
    key: "preview-motion",
    label: "Reduce preview motion",
    description:
      "Use quieter transitions while reviewing long project pages and experiment states.",
  },
  {
    key: "archive-sync",
    label: "Sync archived decisions",
    description: "Unavailable until the archive migration is complete.",
    disabled: true,
  },
];

function SwitchSetting({ setting }: { setting: Setting }) {
  const [checked, setChecked] = useState(setting.defaultChecked ?? false);
  const id = `switch-specimen-${setting.key}`;
  const descriptionId = `${id}-description`;

  return (
    <div className="switch-specimen__row">
      <Field
        orientation="horizontal"
        data-disabled={setting.disabled || undefined}
      >
        <FieldContent>
          <FieldLabel htmlFor={id}>{setting.label}</FieldLabel>
          <FieldDescription id={descriptionId}>
            {setting.description}
          </FieldDescription>
        </FieldContent>

        <div className="switch-specimen__action">
          <span className="switch-specimen__state" aria-hidden="true">
            {setting.disabled ? "Unavailable" : checked ? "On" : "Off"}
          </span>
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={setChecked}
            disabled={setting.disabled}
            aria-describedby={descriptionId}
          />
        </div>
      </Field>
    </div>
  );
}

export default function SwitchSpecimen() {
  return (
    <section
      className="switch-specimen"
      aria-labelledby="switch-specimen-title"
      data-switch-supported-specimen
    >
      <header className="switch-specimen__header">
        <h4 id="switch-specimen-title">Immediate settings</h4>
        <p>
          The track remains visible in either state. Thumb position and nearby
          text communicate the current value without relying on colour alone.
        </p>
      </header>

      <FieldGroup>
        {SETTINGS.map((setting) => (
          <SwitchSetting key={setting.key} setting={setting} />
        ))}
      </FieldGroup>
    </section>
  );
}
