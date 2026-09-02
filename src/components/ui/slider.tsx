import { useId, useState } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

type SliderChangeDetails = SliderPrimitive.Root.ChangeEventDetails;

type SliderProps = Omit<
  SliderPrimitive.Root.Props,
  | "children"
  | "className"
  | "defaultValue"
  | "format"
  | "largeStep"
  | "max"
  | "min"
  | "onValueChange"
  | "orientation"
  | "step"
  | "thumbAlignment"
  | "value"
> & {
  className?: string;
  defaultValue?: number;
  description?: string;
  formatValue?: (value: number) => string;
  label: string;
  largeStep?: number;
  max?: number;
  min?: number;
  onValueChange?: (value: number, eventDetails: SliderChangeDetails) => void;
  step?: number;
  value?: number;
};

function defaultFormatValue(value: number) {
  return `${Math.round(value)}%`;
}

function Slider({
  className,
  defaultValue,
  description,
  formatValue = defaultFormatValue,
  id,
  label,
  largeStep = 1,
  max = 100,
  min = 0,
  onValueChange,
  step = 0.1,
  value,
  ...props
}: SliderProps) {
  const generatedId = useId();
  const [animatePosition, setAnimatePosition] = useState(false);
  const descriptionId = `${id ?? `slider-${generatedId}`}-description`;
  const initialValue = value === undefined ? (defaultValue ?? min) : undefined;

  return (
    <SliderPrimitive.Root
      {...props}
      data-slot="slider"
      data-position-animation={animatePosition ? "settle" : undefined}
      className={cn("ui-slider", className)}
      id={id}
      defaultValue={initialValue}
      value={value}
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      format={{ maximumFractionDigits: 3 }}
      thumbAlignment="center"
      onValueChange={(nextValue, eventDetails) => {
        setAnimatePosition(eventDetails.reason === "track-press");
        const scalarValue = Array.isArray(nextValue)
          ? (nextValue[0] ?? min)
          : nextValue;
        onValueChange?.(scalarValue, eventDetails);
      }}
    >
      <div className="ui-slider__surface" data-slot="slider-surface">
        <SliderPrimitive.Control className="ui-slider__control">
          <SliderPrimitive.Track className="ui-slider__track">
            <SliderPrimitive.Indicator className="ui-slider__indicator" />
            <SliderPrimitive.Thumb
              aria-describedby={description ? descriptionId : undefined}
              className="ui-slider__thumb"
              getAriaValueText={(_, currentValue) => formatValue(currentValue)}
              index={0}
            />
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>

        <div className="ui-slider__readout">
          <SliderPrimitive.Label className="ui-slider__label">
            {label}
          </SliderPrimitive.Label>

          <SliderPrimitive.Value className="ui-slider__value">
            {(_, values) => formatValue(values[0] ?? initialValue ?? min)}
          </SliderPrimitive.Value>
        </div>
      </div>

      {description && (
        <p className="ui-slider__description" id={descriptionId}>
          {description}
        </p>
      )}

      <div className="ui-slider__endpoints" aria-hidden="true">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </SliderPrimitive.Root>
  );
}

export { Slider };
export type { SliderProps };
