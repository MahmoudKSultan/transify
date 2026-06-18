import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/Button";
import { useTranslatorStore } from "../store";
import { CaptureButton } from "@/features/screenshot-translation/components/CaptureButton";
import { Copy, ClipboardPaste, Eraser, Volume2, Check } from "lucide-react";

export function ActionBar() {
  const [copied, setCopied] = useState(false);
  const clearInput = useTranslatorStore((s) => s.clearInput);
  const pasteFromClipboard = useTranslatorStore((s) => s.pasteFromClipboard);
  const outputText = useTranslatorStore((s) => s.outputText);
  const inputText = useTranslatorStore((s) => s.inputText);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    await useTranslatorStore.getState().copyToClipboard();
    setCopied(true);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window && outputText) {
      const utterance = new SpeechSynthesisUtterance(outputText);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center gap-1.5" role="toolbar" aria-label="Translation actions">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        disabled={!outputText}
        aria-label="Copy translated text"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={pasteFromClipboard}
        aria-label="Paste text from clipboard"
      >
        <ClipboardPaste className="h-3.5 w-3.5" />
        <span className="ml-1">Paste</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={clearInput}
        disabled={!inputText}
        aria-label="Clear input text"
      >
        <Eraser className="h-3.5 w-3.5" />
        <span className="ml-1">Clear</span>
      </Button>

      <CaptureButton />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSpeak}
        disabled={!outputText}
        aria-label="Speak translated text"
      >
        <Volume2 className="h-3.5 w-3.5" />
        <span className="ml-1">Speak</span>
      </Button>
    </div>
  );
}
