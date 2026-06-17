import { useEffect } from "react";
import { useTranslatorStore } from "../store";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function useTranslation() {
  const inputText = useTranslatorStore((s) => s.inputText);
  const debouncedInput = useDebounce(inputText, 300);
  const translate = useTranslatorStore((s) => s.translate);

  useEffect(() => {
    if (debouncedInput.trim()) {
      translate();
    } else {
      useTranslatorStore.getState().setOutputText("");
    }
  }, [debouncedInput, translate]);

  return {
    debouncedInput,
  };
}
