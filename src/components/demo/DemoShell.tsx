import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type DemoShellProps = ComponentPropsWithoutRef<"section">;

function DemoShell({ className, children, ...props }: DemoShellProps) {
  return (
    <TooltipProvider>
      <section className={cn("demo-shell", className)} {...props}>
        {children}
      </section>
    </TooltipProvider>
  );
}

type DemoStageProps = ComponentPropsWithoutRef<"div">;

const DemoStage = forwardRef<HTMLDivElement, DemoStageProps>(
  function DemoStage({ className, ...props }, ref) {
    return <div ref={ref} className={cn("demo-stage", className)} {...props} />;
  },
);

export {
  DemoShell,
  DemoStage,
};
