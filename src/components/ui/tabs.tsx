import {
  DirectionProvider,
  type TextDirection,
  useDirection,
} from "@base-ui/react/direction-provider";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva } from "class-variance-authority";
import { useLayoutEffect, useState } from "react";

import { cn } from "@/lib/utils";

type StringClassName<T> = Omit<T, "className"> & { className?: string };

type TabsValue = string;

type TabsRootBaseProps = Omit<
  StringClassName<TabsPrimitive.Root.Props>,
  "defaultValue" | "onValueChange" | "value"
> & {
  dir?: TextDirection;
};

type TabsValueChangeHandler<Value extends TabsValue | null> = (
  value: Value,
  eventDetails: TabsPrimitive.Root.ChangeEventDetails,
) => void;

type TabsSelectionProps =
  | {
      defaultValue: TabsValue;
      onValueChange?: TabsValueChangeHandler<TabsValue | null>;
      value?: never;
    }
  | {
      defaultValue?: never;
      onValueChange?: TabsValueChangeHandler<TabsValue>;
      value: TabsValue;
    };

type TabsProps = TabsRootBaseProps & TabsSelectionProps;

function Tabs({
  className,
  dir = "ltr",
  orientation = "horizontal",
  ...props
}: TabsProps) {
  return (
    <DirectionProvider direction={dir}>
      <TabsPrimitive.Root
        {...props}
        data-slot="tabs"
        className={cn("ui-tabs", className)}
        dir={dir}
        orientation={orientation}
      />
    </DirectionProvider>
  );
}

type TabsVariant = "contained" | "line";
type TabsLayout = "equal" | "content";

const tabsListVariants = cva("ui-tabs__list", {
  variants: {
    variant: {
      contained: "ui-tabs__list--contained",
      line: "ui-tabs__list--line",
    },
    layout: {
      equal: "ui-tabs__list--equal",
      content: "ui-tabs__list--content",
    },
  },
  defaultVariants: {
    variant: "contained",
    layout: "equal",
  },
});

type TabsListAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

type TabsListProps = Omit<
  StringClassName<TabsPrimitive.List.Props>,
  "aria-label" | "aria-labelledby"
> &
  TabsListAccessibleName & {
    variant?: TabsVariant;
    layout?: TabsLayout;
  };

function TabsList({
  className,
  children,
  variant = "contained",
  layout,
  ...props
}: TabsListProps) {
  const resolvedLayout =
    layout ?? (variant === "line" ? "content" : "equal");
  const direction = useDirection();
  const [indicatorDirection, setIndicatorDirection] = useState(direction);

  useLayoutEffect(() => {
    if (indicatorDirection !== direction) setIndicatorDirection(direction);
  }, [direction, indicatorDirection]);

  return (
    <TabsPrimitive.List
      {...props}
      data-slot="tabs-list"
      data-layout={resolvedLayout}
      data-variant={variant}
      className={cn(
        tabsListVariants({ variant, layout: resolvedLayout }),
        className,
      )}
    >
      {children}
      {variant === "line" && (
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          data-indicator-direction={indicatorDirection}
          className="ui-tabs__indicator"
          renderBeforeHydration
        />
      )}
    </TabsPrimitive.List>
  );
}

type TabsTriggerProps = Omit<
  StringClassName<TabsPrimitive.Tab.Props>,
  "value"
> & { value: TabsValue };

function TabsTrigger({
  className,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      {...props}
      data-slot="tabs-trigger"
      className={cn("ui-tabs__trigger", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        // Base UI delegates Enter activation to the browser for native
        // buttons. Dispatch it explicitly so the tab contract stays reliable
        // in every browser stack while Space keeps Base UI's own handling.
        if (
          !event.defaultPrevented &&
          event.key === "Enter" &&
          event.currentTarget.getAttribute("aria-disabled") !== "true"
        ) {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    />
  );
}

type TabsContentProps = Omit<
  StringClassName<TabsPrimitive.Panel.Props>,
  "value"
> & { value: TabsValue };

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      {...props}
      data-slot="tabs-content"
      className={cn("ui-tabs__content", className)}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
export type {
  TabsContentProps,
  TabsLayout,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
  TabsValue,
  TabsVariant,
};
