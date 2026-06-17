import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs text-[var(--color-text-secondary)] font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full resize-none rounded-input border border-[var(--color-border)]",
            "bg-[var(--color-surface)] px-4 py-3 text-sm",
            "text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
