import { useTranslatorStore } from "@/features/translator/store";
import { Button } from "@/shared/ui/Button";
import { Trash2, Clock, X } from "lucide-react";

export function HistoryPanel() {
  const history = useTranslatorStore((s) => s.history);
  const clearHistory = useTranslatorStore((s) => s.clearHistory);
  const removeFromHistory = useTranslatorStore((s) => s.removeFromHistory);
  const isHistoryEnabled = useTranslatorStore((s) => s.isHistoryEnabled);

  if (!isHistoryEnabled) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">History is disabled</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Enable in Settings</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-center" aria-label="No translation history">
        <Clock className="mx-auto h-8 w-8 text-[var(--color-text-secondary)] opacity-40" />
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">No translations yet</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Translations will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)]">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
          History · {history.length}
        </h2>
        <Button variant="ghost" size="sm" onClick={clearHistory} aria-label="Clear all history">
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto" role="list">
        {history.map((item) => (
          <li
            key={item.id}
            className="group relative px-4 py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
          >
            <button
              onClick={() => removeFromHistory(item.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-text-secondary)] hover:text-red-500"
              aria-label={`Remove: ${item.inputText}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)] mb-1">
              <span className="font-medium">{item.sourceLang.toUpperCase()}</span>
              <span>→</span>
              <span className="font-medium">{item.targetLang.toUpperCase()}</span>
              <span className="ml-auto">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-[var(--color-text)] line-clamp-1 pr-5">{item.inputText}</p>
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 pr-5 mt-0.5">{item.outputText}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
