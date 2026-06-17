import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "icon";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "ghost", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary text-white hover:bg-primary-600 active:bg-primary-700": variant === "primary",
            "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]": variant === "ghost",
            "h-8 w-8 p-0": variant === "icon",
            "h-9 px-3 text-sm": size === "md" && variant !== "icon",
            "h-7 px-2 text-xs": size === "sm",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
