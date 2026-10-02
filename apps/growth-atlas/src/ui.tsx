import { Checkbox } from "@base-ui/react/checkbox";
import { Switch } from "@base-ui/react/switch";
import { Slider } from "@base-ui/react/slider";
import { Progress } from "@base-ui/react/progress";
import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
export function CheckRow({
  label,
  checked,
  onChange,
  detail,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  detail?: string;
}) {
  return (
    <label className="check-row">
      <Checkbox.Root
        className="check"
        checked={checked}
        onCheckedChange={onChange}
      >
        <Checkbox.Indicator>
          <Check size={13} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span>
        {label}
        {detail && <small>{detail}</small>}
      </span>
    </label>
  );
}
export function Toggle({
  label,
  checked,
  onChange,
  detail,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  detail?: string;
}) {
  return (
    <label className="toggle-row">
      <span>
        {label}
        {detail && <small>{detail}</small>}
      </span>
      <Switch.Root
        className="switch"
        checked={checked}
        onCheckedChange={onChange}
      >
        <Switch.Thumb className="switch-thumb" />
      </Switch.Root>
    </label>
  );
}
export function Range({
  label,
  value,
  onChange,
  min = 1,
  max = 100,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div className="range">
      <div className="range-label">
        <span>{label}</span>
        <strong>
          {unit}
          {value}
        </strong>
      </div>
      <Slider.Root
        value={value}
        onValueChange={(v) => onChange(Number(v))}
        min={min}
        max={max}
      >
        <Slider.Control className="slider-control">
          <Slider.Track className="slider-track">
            <Slider.Indicator className="slider-indicator" />
            <Slider.Thumb className="slider-thumb" aria-label={label} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  );
}
export function Meter({ value, label }: { value: number; label: string }) {
  return (
    <Progress.Root value={value} className="meter">
      <Progress.Label className="meter-label">{label}</Progress.Label>
      <Progress.Track className="meter-track">
        <Progress.Indicator
          className="meter-indicator"
          style={{ width: `${value}%` }}
        />
      </Progress.Track>
    </Progress.Root>
  );
}
export function Pick({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <Select.Root value={value} onValueChange={(v) => v && onChange(v)}>
        <Select.Trigger className="select-trigger" aria-label={label}>
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={15} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="select-positioner" sideOffset={5}>
            <Select.Popup className="select-popup">
              {options.map((o) => (
                <Select.Item className="select-item" key={o} value={o}>
                  <Select.ItemText>{o}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </label>
  );
}
export function download(name: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
