import { useEffect, useRef } from "react";
import { useTranslatorStore } from "../store";

export function useSyncShortcuts() {
  const shortcuts = useTranslatorStore((s) => s.shortcuts);
  const prevShortcuts = useRef<string | null>(null);

  useEffect(() => {
    const shortcutStr = shortcuts.translate;

    // Always register on first run (prevShortcuts starts null)
    if (prevShortcuts.current !== null && shortcutStr === prevShortcuts.current) return;
    prevShortcuts.current = shortcutStr;

    const sync = async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke("register_shortcut", { shortcutStr });
        console.log("[Transify] Shortcut registered:", shortcutStr, result);
      } catch (e) {
        console.error("[Transify] Failed to register shortcut:", e);
      }
    };

    sync();
  }, [shortcuts.translate]);
}
