import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",

        secondary: "bg-secondary text-secondary-foreground border-transparent",

        destructive:
          "bg-destructive/15 text-destructive border border-destructive/20",

        outline: "text-foreground",

        success:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",

        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",

        info: "bg-sky-500/15 text-sky-400 border border-sky-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
