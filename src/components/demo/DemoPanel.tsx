import type { ComponentPropsWithoutRef, ReactNode } from "react";

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
};

function DemoPanelHeader({
  title,
  description,
  current,
  total,
}: DemoPanelHeaderProps) {
  const hasProgress = current !== undefined && total !== undefined;

  return (
    <header className="demo-panel__header">
      <div className="demo-panel__heading">
        <h2>{title}</h2>
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
};

function DemoStepDetail({
  className,
  title,
  children,
  ...props
}: DemoStepDetailProps) {
  return (
    <section
      className={cn("demo-step-detail", className)}
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      <h3>{title}</h3>
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
    <div className={cn("demo-setting", className)} {...props}>
      <label htmlFor={htmlFor}>{label}</label>
      {control}
    </div>
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
