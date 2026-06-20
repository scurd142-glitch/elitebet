import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[999px] text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#FF8C00] to-[#FFD700] text-[#000000] shadow-[0_18px_38px_rgba(255,215,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,215,0,0.3)] active:translate-y-0 active:scale-[0.98]",
        secondary:
          "border border-[rgba(255,215,0,0.35)] bg-transparent text-[var(--gold)] hover:bg-[rgba(255,215,0,0.14)] hover:border-[rgba(255,215,0,0.6)]",
        outline:
          "border border-[rgba(255,215,0,0.35)] bg-transparent text-[var(--text)] hover:bg-[rgba(255,255,255,0.08)]",
        ghost: "text-[var(--text)] hover:bg-[rgba(255,255,255,0.08)]",
        link: "text-[var(--gold)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 rounded-[999px] px-4 text-xs",
        lg: "h-14 rounded-[999px] px-8 text-base",
        icon: "h-10 w-10 rounded-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
