import { useState } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

type ExperimentalSliderVariant = "block" | "rule" | "channel";

type ExperimentalSliderProps = {
  description: string;
  disabled?: boolean;
  id: string;
  label: string;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  value: number;
  variant: ExperimentalSliderVariant;
};

const TICKS = Array.from({ length: 9 }, (_, index) => index);
const GRIP_DOTS = Array.from({ length: 6 }, (_, index) => index);

function ExperimentalSlider({
  description,
  disabled = false,
  id,
  label,
  max = 100,
  min = 0,
  onValueChange,
  step = 0.1,
  value,
  variant,
}: ExperimentalSliderProps) {
  const [animatePosition, setAnimatePosition] = useState(false);

  return (
    <SliderPrimitive.Root
      className={cn("slider-option", `slider-option--${variant}`)}
      data-disabled={disabled || undefined}
      data-position-animation={animatePosition ? "settle" : undefined}
      disabled={disabled}
      format={{ maximumFractionDigits: 0 }}
      largeStep={1}
      max={max}
      min={min}
      onValueChange={(nextValue, eventDetails) => {
        setAnimatePosition(eventDetails.reason === "track-press");
        onValueChange?.(nextValue);
      }}
      step={step}
      thumbAlignment={variant === "block" ? "center" : "edge"}
      value={value}
    >
      <div className="slider-option__surface">
        <SliderPrimitive.Control className="slider-option__control">
          {variant === "rule" && (
            <span className="slider-option__ticks" aria-hidden="true">
              {TICKS.map((tick) => (
                <span key={tick} />
              ))}
            </span>
          )}

          <SliderPrimitive.Track className="slider-option__track">
            <SliderPrimitive.Indicator className="slider-option__indicator" />
            <SliderPrimitive.Thumb
              aria-describedby={`${id}-description`}
              aria-valuetext={`${Math.round(value)} percent`}
              className="slider-option__thumb"
              index={0}
            >
              {variant === "block" && (
                <span className="slider-option__grip" aria-hidden="true">
                  {GRIP_DOTS.map((dot) => (
                    <span className="slider-option__grip-dot" key={dot} />
                  ))}
                </span>
              )}
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>

        <div className="slider-option__readout">
          <SliderPrimitive.Label className="slider-option__label">
            {label}
          </SliderPrimitive.Label>

          <SliderPrimitive.Value className="slider-option__value">
            {(_, values) => `${Math.round(values[0])}%`}
          </SliderPrimitive.Value>
        </div>
      </div>

      <p className="slider-option__description" id={`${id}-description`}>
        {description}
      </p>

      <div className="slider-option__endpoints" aria-hidden="true">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </SliderPrimitive.Root>
  );
}

export { ExperimentalSlider };
export type { ExperimentalSliderProps, ExperimentalSliderVariant };
