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

function ExperimentalSlider({
  description,
  disabled = false,
  id,
  label,
  max = 125,
  min = 50,
  onValueChange,
  step = 5,
  value,
  variant,
}: ExperimentalSliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("slider-option", `slider-option--${variant}`)}
      data-disabled={disabled || undefined}
      disabled={disabled}
      format={{ maximumFractionDigits: 0 }}
      max={max}
      min={min}
      onValueChange={onValueChange}
      step={step}
      thumbAlignment="edge"
      value={value}
    >
      <div className="slider-option__header">
        <div className="slider-option__copy">
          <SliderPrimitive.Label className="slider-option__label">
            {label}
          </SliderPrimitive.Label>
          <p className="slider-option__description" id={`${id}-description`}>
            {description}
          </p>
        </div>

        <SliderPrimitive.Value className="slider-option__value">
          {(_, values) => `${values[0]}%`}
        </SliderPrimitive.Value>
      </div>

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
            aria-valuetext={`${value} percent`}
            className="slider-option__thumb"
            index={0}
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>

      <div className="slider-option__endpoints" aria-hidden="true">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </SliderPrimitive.Root>
  );
}

export { ExperimentalSlider };
export type { ExperimentalSliderProps, ExperimentalSliderVariant };
