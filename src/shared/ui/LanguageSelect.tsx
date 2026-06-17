import { cn } from "@/shared/utils/cn";
import { LANGUAGES, type Language } from "@/shared/constants/languages";

interface LanguageSelectProps {
  value: string;
  onChange: (code: string) => void;
  excludeAuto?: boolean;
  label: string;
}

export function LanguageSelect({ value, onChange, excludeAuto = false, label }: LanguageSelectProps) {
  const languages = excludeAuto
    ? LANGUAGES.filter((l) => l.code !== "auto")
    : LANGUAGES;

  const selected = LANGUAGES.find((l) => l.code === value) as Language | undefined;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[var(--color-text-secondary)] font-medium">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className={cn(
            "w-full rounded-lg border border-[var(--color-border)]",
            "bg-[var(--color-select-bg)] px-3 py-2 pr-8 text-sm",
            "text-[var(--color-text)]",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "cursor-pointer transition-colors duration-150",
            "min-w-[120px]"
          )}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
      {selected && (
        <span className="sr-only">
          {label}: {selected.name}
        </span>
      )}
    </div>
  );
}
