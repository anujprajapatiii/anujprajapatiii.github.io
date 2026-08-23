import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      primary: "ui-button--primary",
      secondary: "ui-button--secondary",
      quiet: "ui-button--quiet",
    },
    size: {
      compact: "ui-button--compact",
      icon: "ui-button--icon",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "compact",
  },
});

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = "secondary",
  size = "compact",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type IconButtonProps = Omit<ButtonProps, "aria-label" | "children" | "size"> & {
  label: string;
  children: ReactNode;
};

function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <Button aria-label={label} size="icon" {...props}>
      {children}
    </Button>
  );
}

export { Button, IconButton, buttonVariants };
export type { ButtonProps, IconButtonProps };
