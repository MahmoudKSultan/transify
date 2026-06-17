import { InputPanel } from "./InputPanel";
import { OutputPanel } from "./OutputPanel";
import { LanguageSelector } from "./LanguageSelector";
import { ActionBar } from "./ActionBar";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useTranslatorStore } from "../store";
import { useTranslation } from "../hooks/useTranslation";
import { formatShortcut } from "@/shared/utils/shortcuts";
import { Keyboard } from "lucide-react";

export function Translator() {
  const isLoading = useTranslatorStore((s) => s.isLoading);
  const error = useTranslatorStore((s) => s.error);
  const outputText = useTranslatorStore((s) => s.outputText);
  const shortcuts = useTranslatorStore((s) => s.shortcuts);

  useTranslation();

  const status = error ? "error" : isLoading ? "loading" : "ready";

  return (
    <div className="flex flex-col gap-4 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-[var(--color-text)]">Instant Translate</h1>
        <StatusBadge status={status} />
      </div>

      <InputPanel />

      <LanguageSelector />

      <OutputPanel />

      {outputText && <ActionBar />}

      <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)] mt-1">
        <Keyboard className="h-3 w-3" />
        <span>
          {formatShortcut(shortcuts.focusInput)} focus · {formatShortcut(shortcuts.swap)} swap · {formatShortcut(shortcuts.clear)} clear · Enter translate · Esc clear
        </span>
      </div>
    </div>
  );
}
