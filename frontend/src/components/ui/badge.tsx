import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary)]/15 text-[var(--primary)]",
        outline: "border-[var(--border)] text-[var(--foreground)]",
        glow: "border-violet-500/30 bg-violet-500/10 text-violet-300",
        premium: "border-transparent bg-[#FFD700] text-[#000000]",
        active: "border-transparent bg-[#00C896] text-[#000000]",
        banned: "border-transparent bg-[#FF4444] text-[#FFFFFF]",
        pending: "border-transparent bg-[#7B68EE] text-[#FFFFFF]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
