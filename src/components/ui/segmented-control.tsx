import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";

import { cn } from "@/lib/utils";

type SegmentedItem<Value extends string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

type SegmentedControlLabel =
  | { label: string; "aria-labelledby"?: never }
  | { label?: never; "aria-labelledby": string };

type SegmentedControlProps<Value extends string> = {
  value: Value;
  items: readonly SegmentedItem<Value>[];
  onValueChange: (value: Value) => void;
  className?: string;
  disabled?: boolean;
} & SegmentedControlLabel;

function SegmentedControl<Value extends string>({
  value,
  items,
  onValueChange,
  label,
  "aria-labelledby": ariaLabelledBy,
  className,
  disabled,
}: SegmentedControlProps<Value>) {
  return (
    <ToggleGroupPrimitive
      aria-label={label}
      aria-labelledby={ariaLabelledBy}
      data-slot="segmented-control"
      className={cn("ui-segmented", className)}
      disabled={disabled}
      value={[value]}
      onValueChange={(next) => {
        const selected = next[0];
        if (selected) onValueChange(selected);
      }}
    >
      {items.map((item) => (
        <TogglePrimitive
          data-slot="segmented-control-item"
          className="ui-segmented__item"
          disabled={item.disabled}
          key={item.value}
          value={item.value}
        >
          {item.label}
        </TogglePrimitive>
      ))}
    </ToggleGroupPrimitive>
  );
}

export { SegmentedControl };
export type { SegmentedControlProps, SegmentedItem };
