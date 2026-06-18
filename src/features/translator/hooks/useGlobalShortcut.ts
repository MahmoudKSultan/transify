import { useEffect } from "react";
import { useTranslatorStore } from "../store";
import { useScreenshotStore } from "@/features/screenshot-translation/store";

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

type EventHandler = () => void;

export function useGlobalShortcut() {
  useEffect(() => {
    const unlisteners: (() => void)[] = [];

    const setup = async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event");

        const handlers: Record<string, EventHandler> = {
          "global-shortcut-translate": async () => {
            const store = useTranslatorStore.getState();
            const text = await readClipboard();
            if (text && text.trim()) {
              store.setInputText(text);
              setTimeout(() => useTranslatorStore.getState().translate(), 150);
            }
          },
          "global-shortcut-swap": () => {
            useTranslatorStore.getState().swapAndTranslate();
          },
          "global-shortcut-clear": () => {
            useTranslatorStore.getState().clearInput();
          },
          "global-shortcut-focus": () => {
            const input = document.getElementById("input-text") as HTMLTextAreaElement | null;
            input?.focus();
          },
          "global-shortcut-ocr": () => {
            useScreenshotStore.getState().startCapture();
          },
        };

        for (const [event, handler] of Object.entries(handlers)) {
          const unlisten = await listen(event, () => {
            console.log(`[Transify] Global event: ${event}`);
            handler();
          });
          unlisteners.push(unlisten);
        }

        console.log(`[Transify] Listening for ${Object.keys(handlers).length} global shortcut events`);
      } catch (e) {
        console.error("[Transify] Failed to set up global shortcut listeners:", e);
      }
    };

    setup();

    return () => {
      unlisteners.forEach((fn) => fn());
    };
  }, []);
}
