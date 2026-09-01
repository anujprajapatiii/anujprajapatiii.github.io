import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<
  SwitchPrimitive.Root.Props,
  "children" | "className" | "nativeButton" | "render"
> & {
  className?: string;
};

function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      {...props}
      data-slot="switch"
      className={cn("ui-switch", className)}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ui-switch__thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
export type { SwitchProps };
