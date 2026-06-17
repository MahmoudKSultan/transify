import { useEffect } from "react";
import { useTranslatorStore } from "../store";

async function readClipboard(): Promise<string | null> {
  try {
    const { readText } = await import("@tauri-apps/plugin-clipboard-manager");
    const text = await readText();
    console.log("[Transify] Clipboard (Tauri plugin):", text?.substring(0, 50));
    return text;
  } catch (e) {
    console.warn("[Transify] Tauri clipboard failed:", e);
  }

  try {
    const text = await navigator.clipboard.readText();
    console.log("[Transify] Clipboard (browser):", text?.substring(0, 50));
    return text;
  } catch (e) {
    console.warn("[Transify] Browser clipboard failed:", e);
    return null;
  }
}

async function confirmEventReceived() {
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("event_received", { eventName: "global-shortcut-translate" });
  } catch {}
}

export function useGlobalShortcut() {
  useEffect(() => {
    let unlistenFn: (() => void) | undefined;

    const setup = async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event");
        console.log("[Transify] Listening for global-shortcut-translate event...");

        unlistenFn = await listen("global-shortcut-translate", async () => {
          console.log("[Transify] Global shortcut event received!");
          // Confirm back to Rust
          confirmEventReceived();

          const store = useTranslatorStore.getState();
          const text = await readClipboard();
          if (text && text.trim()) {
            console.log("[Transify] Setting input text and translating...");
            store.setInputText(text);
            setTimeout(() => {
              useTranslatorStore.getState().translate();
            }, 150);
          } else {
            console.warn("[Transify] Clipboard is empty or whitespace");
          }
        });

        console.log("[Transify] Event listener registered successfully");
      } catch (e) {
        console.error("[Transify] Failed to set up global shortcut listener:", e);
      }
    };

    setup();

    return () => {
      unlistenFn?.();
    };
  }, []);
}
