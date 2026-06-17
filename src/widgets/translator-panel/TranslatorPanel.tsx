import { Translator } from "@/features/translator/components/Translator";

export function TranslatorPanel() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]" role="main">
      <Translator />
    </main>
  );
}
