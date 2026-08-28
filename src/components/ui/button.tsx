import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
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

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    loadingLabel?: string;
  };

function Button({
  "aria-label": ariaLabel,
  children,
  className,
  disabled = false,
  focusableWhenDisabled,
  loading = false,
  loadingLabel,
  variant = "secondary",
  size = "compact",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      {...props}
      aria-busy={loading || undefined}
      aria-label={loading ? loadingLabel ?? ariaLabel : ariaLabel}
      className={cn(buttonVariants({ variant, size }), className)}
      data-loading={loading ? "" : undefined}
      data-slot="button"
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
    >
      <span className="ui-button__content">{children}</span>
      {loading && (
        <LoaderCircle
          className="ui-button__spinner"
          data-icon="loading"
          aria-hidden="true"
        />
      )}
    </ButtonPrimitive>
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
