import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type DemoStep<Value extends string> = {
  value: Value;
  label: string;
};

type DemoStepListProps<Value extends string> = Omit<
  ComponentPropsWithoutRef<"ol">,
  "onChange"
> & {
  value: Value;
  items: readonly DemoStep<Value>[];
  onValueChange: (value: Value) => void;
  label: string;
  detailId?: string;
};

function DemoStepList<Value extends string>({
  className,
  value,
  items,
  onValueChange,
  label,
  detailId,
  ...props
}: DemoStepListProps<Value>) {
  return (
    <ol className={cn("demo-step-list", className)} aria-label={label} {...props}>
      {items.map((item, index) => {
        const current = item.value === value;

        return (
          <li key={item.value}>
            <button
              type="button"
              className="demo-step-list__button"
              aria-current={current ? "step" : undefined}
              aria-controls={detailId}
              onClick={() => onValueChange(item.value)}
            >
              <span className="demo-step-list__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export { DemoStepList };
export type { DemoStep, DemoStepListProps };
