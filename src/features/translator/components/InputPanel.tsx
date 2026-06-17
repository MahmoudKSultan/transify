import { useEffect, useRef } from "react";
import { Textarea } from "@/shared/ui/Textarea";
import { useTranslatorStore } from "../store";

export function InputPanel() {
  const inputText = useTranslatorStore((s) => s.inputText);
  const setInputText = useTranslatorStore((s) => s.setInputText);
  const isLoading = useTranslatorStore((s) => s.isLoading);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      useTranslatorStore.getState().clearInput();
      textareaRef.current?.focus();
    }
  };

  return (
    <div>
      <Textarea
        ref={textareaRef}
        id="input-text"
        label="Source Text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste text or start typing..."
        disabled={isLoading}
        rows={4}
        aria-label="Input text to translate"
        aria-describedby="input-hint"
      />
      <p id="input-hint" className="sr-only">
        Type or paste text. Press Enter to translate. Press Escape to clear.
      </p>
    </div>
  );
}
