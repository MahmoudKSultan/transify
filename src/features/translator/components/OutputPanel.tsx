import { useTranslatorStore } from "../store";

export function OutputPanel() {
  const outputText = useTranslatorStore((s) => s.outputText);
  const isLoading = useTranslatorStore((s) => s.isLoading);
  const error = useTranslatorStore((s) => s.error);

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="rounded-input border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
        role="status"
        aria-live="polite"
        aria-label="Translating"
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-[var(--color-text-secondary)]">Translating...</span>
        </div>
      </div>
    );
  }

  if (!outputText) {
    return (
      <div
        className="rounded-input border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
        aria-label="Translated text result — empty"
      >
        <span className="text-sm text-[var(--color-text-secondary)]">Translation will appear here</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-input border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 animate-fade-in"
      aria-label="Translated text result"
      aria-live="polite"
      role="region"
    >
      <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap break-words">
        {outputText}
      </p>
    </div>
  );
}
