import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

type SliderProps = SliderPrimitive.Root.Props & {
  thumbLabels?: readonly string[];
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : Array.isArray(defaultValue)
        ? defaultValue
        : typeof defaultValue === "number"
          ? [defaultValue]
          : [min];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("ui-slider", className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      aria-label={ariaLabel}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="ui-slider__control">
        <SliderPrimitive.Track className="ui-slider__track">
          <SliderPrimitive.Indicator className="ui-slider__indicator" />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            aria-label={thumbLabels?.[index] ?? (values.length === 1 ? ariaLabel : undefined)}
            className="ui-slider__thumb"
            key={index}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
export type { SliderProps };
