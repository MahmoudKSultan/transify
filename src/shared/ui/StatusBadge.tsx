import { cn } from "@/shared/utils/cn";

interface StatusBadgeProps {
  status: "ready" | "loading" | "error";
  message?: string;
}

export function StatusBadge({ status, message }: StatusBadgeProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message || status}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all",
        {
          "bg-green-50 text-green-700": status === "ready",
          "bg-blue-50 text-blue-700": status === "loading",
          "bg-red-50 text-red-700": status === "error",
        }
      )}
    >
      {status === "loading" && (
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      <span>{message || { ready: "Ready", loading: "Translating...", error: "Error" }[status]}</span>
    </div>
  );
}
