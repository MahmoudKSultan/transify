import { LanguageSelect } from "@/shared/ui/LanguageSelect";
import { Button } from "@/shared/ui/Button";
import { useTranslatorStore } from "../store";
import { ArrowLeftRight } from "lucide-react";

export function LanguageSelector() {
  const sourceLang = useTranslatorStore((s) => s.sourceLang);
  const targetLang = useTranslatorStore((s) => s.targetLang);
  const setSourceLang = useTranslatorStore((s) => s.setSourceLang);
  const setTargetLang = useTranslatorStore((s) => s.setTargetLang);
  const swapAndTranslate = useTranslatorStore((s) => s.swapAndTranslate);

  return (
    <div className="flex items-end gap-2" role="group" aria-label="Language selection">
      <LanguageSelect
        value={sourceLang}
        onChange={setSourceLang}
        label="From"
      />
      <Button
        variant="icon"
        onClick={swapAndTranslate}
        aria-label="Swap languages and translate"
        title="Swap languages (Ctrl+Shift+S)"
        disabled={sourceLang === "auto"}
        className="mb-0.5 transition-transform duration-200 hover:rotate-180"
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>
      <LanguageSelect
        value={targetLang}
        onChange={setTargetLang}
        excludeAuto
        label="To"
      />
    </div>
  );
}
