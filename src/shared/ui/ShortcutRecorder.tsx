import { useState, useRef, useCallback } from "react";
import { formatShortcut, parseShortcutEvent } from "@/shared/utils/shortcuts";
import { cn } from "@/shared/utils/cn";
import { Pencil, X } from "lucide-react";

interface ShortcutRecorderProps {
  value: string;
  onChange: (shortcut: string) => void;
  disabled?: boolean;
  label: string;
  id: string;
}

export function ShortcutRecorder({ value, onChange, disabled, label, id }: ShortcutRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleRecord = useCallback(() => {
    if (disabled) return;
    setIsRecording(true);
    setError(null);
    buttonRef.current?.focus();
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isRecording) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.key === "Escape") {
        setIsRecording(false);
        return;
      }

      const shortcut = parseShortcutEvent(e as unknown as KeyboardEvent);
      if (shortcut) {
        onChange(shortcut);
        setIsRecording(false);
      }
    },
    [isRecording, onChange]
  );

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="flex items-center justify-between py-2.5">
      <label htmlFor={id} className="text-sm text-[var(--color-text)]">{label}</label>
      <div className="flex items-center gap-1.5">
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={handleRecord}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-mono transition-all",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            isRecording
              ? "border-primary bg-primary/10 text-primary animate-pulse"
              : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-text-secondary)]",
            disabled && "opacity-50 cursor-not-allowed",
            !value && !isRecording && "text-[var(--color-text-secondary)] italic"
          )}
          aria-label={`${label}: ${value ? formatShortcut(value) : "not set"}. Click to record.`}
        >
          {isRecording ? (
            <span>Press keys...</span>
          ) : value ? (
            <span>{formatShortcut(value)}</span>
          ) : (
            <span>Not set</span>
          )}
          <Pencil className="h-3 w-3 opacity-50" />
        </button>
        {value && !isRecording && !disabled && (
          <button
            onClick={handleClear}
            className="rounded p-1 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label={`Clear ${label} shortcut`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
