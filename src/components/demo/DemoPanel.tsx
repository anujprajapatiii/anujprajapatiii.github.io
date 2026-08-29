import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type DemoPanelProps = ComponentPropsWithoutRef<"aside">;

function DemoPanel({ className, ...props }: DemoPanelProps) {
  return <aside className={cn("demo-panel", className)} {...props} />;
}

type DemoPanelHeaderProps = {
  title: string;
  description: string;
  current?: number;
  total?: number;
  headingLevel?: "h2" | "h3" | "h4";
};

function DemoPanelHeader({
  title,
  description,
  current,
  total,
  headingLevel = "h2",
}: DemoPanelHeaderProps) {
  const hasProgress = current !== undefined && total !== undefined;
  const Heading = headingLevel;

  return (
    <header className="demo-panel__header">
      <div className="demo-panel__heading">
        <Heading>{title}</Heading>
        <p>{description}</p>
      </div>
      {hasProgress && (
        <span
          className="demo-panel__progress"
          aria-label={`Step ${current} of ${total}`}
        >
          {current} of {total}
        </span>
      )}
    </header>
  );
}

type DemoStepDetailProps = ComponentPropsWithoutRef<"section"> & {
  title: string;
  children: ReactNode;
  headingLevel?: "h3" | "h4" | "h5";
};

function DemoStepDetail({
  className,
  title,
  children,
  headingLevel = "h3",
  ...props
}: DemoStepDetailProps) {
  const Heading = headingLevel;

  return (
    <section
      className={cn("demo-step-detail", className)}
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      <Heading>{title}</Heading>
      <p>{children}</p>
    </section>
  );
}

type DemoSettingProps = ComponentPropsWithoutRef<"div"> & {
  label: string;
  htmlFor: string;
  control: ReactNode;
};

function DemoSetting({
  className,
  label,
  htmlFor,
  control,
  ...props
}: DemoSettingProps) {
  return (
    <Field
      className={cn("demo-setting", className)}
      orientation="horizontal"
      {...props}
    >
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {control}
    </Field>
  );
}

type DemoPanelFooterProps = ComponentPropsWithoutRef<"footer">;

function DemoPanelFooter({ className, ...props }: DemoPanelFooterProps) {
  return <footer className={cn("demo-panel__footer", className)} {...props} />;
}

export {
  DemoPanel,
  DemoPanelFooter,
  DemoPanelHeader,
  DemoSetting,
  DemoStepDetail,
};
export type {
  DemoPanelFooterProps,
  DemoPanelHeaderProps,
  DemoPanelProps,
  DemoSettingProps,
  DemoStepDetailProps,
};
