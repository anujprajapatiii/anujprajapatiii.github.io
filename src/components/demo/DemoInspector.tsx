import { useId, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type DemoHeadingLevel = "h2" | "h3" | "h4";

type DemoInspectorProps = ComponentPropsWithoutRef<"aside">;

function DemoInspector({ className, ...props }: DemoInspectorProps) {
  return <aside className={cn("demo-inspector", className)} {...props} />;
}

type DemoInspectorHeaderProps = ComponentPropsWithoutRef<"header"> & {
  title: string;
  description?: string;
  headingLevel?: Extract<DemoHeadingLevel, "h2" | "h3">;
};

function DemoInspectorHeader({
  className,
  title,
  description,
  headingLevel = "h2",
  ...props
}: DemoInspectorHeaderProps) {
  const Heading = headingLevel;

  return (
    <header className={cn("demo-inspector__header", className)} {...props}>
      <Heading>{title}</Heading>
      {description && <p>{description}</p>}
    </header>
  );
}

type DemoInspectorSectionProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> & {
  title: string;
  description?: string;
  headingLevel?: Extract<DemoHeadingLevel, "h3" | "h4">;
};

function DemoInspectorSection({
  className,
  title,
  description,
  headingLevel = "h3",
  children,
  ...props
}: DemoInspectorSectionProps) {
  const generatedId = useId();
  const Heading = headingLevel;
  const headingId = `${generatedId}-heading`;

  return (
    <section
      className={cn("demo-inspector__section", className)}
      aria-labelledby={headingId}
      {...props}
    >
      <div className="demo-inspector__section-heading">
        <Heading id={headingId}>{title}</Heading>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

type DemoInspectorFooterProps = ComponentPropsWithoutRef<"footer">;

function DemoInspectorFooter({
  className,
  ...props
}: DemoInspectorFooterProps) {
  return (
    <footer
      className={cn("demo-inspector__footer", className)}
      {...props}
    />
  );
}

export {
  DemoInspector,
  DemoInspectorFooter,
  DemoInspectorHeader,
  DemoInspectorSection,
};
export type {
  DemoInspectorFooterProps,
  DemoInspectorHeaderProps,
  DemoInspectorProps,
  DemoInspectorSectionProps,
};
