import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type FieldOrientation = "vertical" | "horizontal";

type FieldProps = ComponentPropsWithoutRef<"div"> & {
  orientation?: FieldOrientation;
};

function Field({
  className,
  orientation = "vertical",
  ...props
}: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn("ui-field", className)}
      {...props}
    />
  );
}

type FieldGroupProps = ComponentPropsWithoutRef<"div">;

function FieldGroup({ className, ...props }: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      className={cn("ui-field-group", className)}
      {...props}
    />
  );
}

type FieldContentProps = ComponentPropsWithoutRef<"div">;

function FieldContent({ className, ...props }: FieldContentProps) {
  return (
    <div
      data-slot="field-content"
      className={cn("ui-field__content", className)}
      {...props}
    />
  );
}

type FieldLabelProps = ComponentPropsWithoutRef<"label">;

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      className={cn("ui-field__label", className)}
      {...props}
    />
  );
}

type FieldTitleProps = ComponentPropsWithoutRef<"div">;

function FieldTitle({ className, ...props }: FieldTitleProps) {
  return (
    <div
      data-slot="field-title"
      className={cn("ui-field__label", className)}
      {...props}
    />
  );
}

type FieldDescriptionProps = ComponentPropsWithoutRef<"p">;

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <p
      data-slot="field-description"
      className={cn("ui-field__description", className)}
      {...props}
    />
  );
}

type FieldErrorProps = ComponentPropsWithoutRef<"p">;

function FieldError({ className, children, ...props }: FieldErrorProps) {
  if (!children) return null;

  return (
    <p
      role="alert"
      data-slot="field-error"
      className={cn("ui-field__error", className)}
      {...props}
    >
      {children}
    </p>
  );
}

type FieldSetProps = ComponentPropsWithoutRef<"fieldset">;

function FieldSet({ className, ...props }: FieldSetProps) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("ui-field-set", className)}
      {...props}
    />
  );
}

type FieldLegendProps = ComponentPropsWithoutRef<"legend">;

function FieldLegend({ className, ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("ui-field-legend", className)}
      {...props}
    />
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
};
export type {
  FieldContentProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldLegendProps,
  FieldOrientation,
  FieldProps,
  FieldSetProps,
  FieldTitleProps,
};
