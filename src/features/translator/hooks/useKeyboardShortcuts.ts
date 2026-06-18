import { useEffect } from "react";
import { useTranslatorStore } from "../store";
import { parseShortcutEvent } from "@/shared/utils/shortcuts";
import { useScreenshotStore } from "@/features/screenshot-translation/store";

function matchShortcut(stored: string, e: KeyboardEvent): boolean {
  const parsed = parseShortcutEvent(e);
  return parsed === stored.toLowerCase();
}

async function readClipboard(): Promise<string | null> {
  try {
    const { readText } = await import("@tauri-apps/plugin-clipboard-manager");
    return await readText();
  } catch {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }
}

export function useKeyboardShortcuts() {
  const shortcuts = useTranslatorStore((s) => s.shortcuts);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Translate shortcut — read clipboard + translate
      if (matchShortcut(shortcuts.translate, e)) {
        e.preventDefault();
        const store = useTranslatorStore.getState();
        readClipboard().then((text) => {
          if (text && text.trim()) {
            store.setInputText(text);
            setTimeout(() => store.translate(), 50);
          }
        });
        return;
      }

      // Swap languages
      if (matchShortcut(shortcuts.swap, e)) {
        e.preventDefault();
        useTranslatorStore.getState().swapAndTranslate();
        return;
      }

      // Clear input (only when not in a text field)
      if (matchShortcut(shortcuts.clear, e)) {
        const active = document.activeElement;
        const isInput = active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement;
        if (!isInput) {
          e.preventDefault();
          useTranslatorStore.getState().clearInput();
        }
        return;
      }

      // Focus input
      if (matchShortcut(shortcuts.focusInput, e)) {
        e.preventDefault();
        const input = document.getElementById("input-text") as HTMLTextAreaElement | null;
        input?.focus();
        return;
      }

      // OCR capture
      if (matchShortcut(shortcuts.ocr, e)) {
        e.preventDefault();
        console.log("[Transify] OCR shortcut triggered");
        useScreenshotStore.getState().startCapture();
        return;
      }

      // Enter → Translate (when input is focused)
      if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        const active = document.activeElement;
        if (active instanceof HTMLTextAreaElement && active.id === "input-text") {
          e.preventDefault();
          useTranslatorStore.getState().translate();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
