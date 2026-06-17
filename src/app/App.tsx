import { TranslatorPanel } from "@/widgets/translator-panel/TranslatorPanel";
import { HistoryPanel } from "@/widgets/history-panel/HistoryPanel";
import { SettingsPanel } from "@/widgets/settings-panel/SettingsPanel";
import { useKeyboardShortcuts } from "@/features/translator/hooks/useKeyboardShortcuts";
import { useGlobalShortcut } from "@/features/translator/hooks/useGlobalShortcut";
import { useSyncShortcuts } from "@/features/translator/hooks/useSyncShortcuts";
import { useTheme } from "@/features/translator/hooks/useTheme";
import { Button } from "@/shared/ui/Button";
import { Settings, History, Bug } from "lucide-react";
import { useTranslatorStore } from "@/features/translator/store";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";

async function triggerTestShortcut() {
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    console.log("[Transify] Calling test_shortcut_flow...");
    await invoke("test_shortcut_flow");
    console.log("[Transify] test_shortcut_flow completed");
  } catch (e) {
    console.error("[Transify] test_shortcut_flow failed:", e);
  }
}

export function App() {
  useKeyboardShortcuts();
  useGlobalShortcut();
  useSyncShortcuts();
  useTheme();

  const toggleSettings = useTranslatorStore((s) => s.toggleSettings);
  const [historyOpen, setHistoryOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-[var(--color-text)]">Transify</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="icon"
            onClick={() => setHistoryOpen(!historyOpen)}
            aria-label={historyOpen ? "Hide history" : "Show history"}
            title="Toggle history"
            className={cn("h-7 w-7", historyOpen && "text-primary")}
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="icon"
            onClick={toggleSettings}
            aria-label="Open settings"
            title="Settings"
            className="h-7 w-7"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="icon"
            onClick={triggerTestShortcut}
            aria-label="Test shortcut"
            title="Test shortcut (emit event)"
            className="h-7 w-7 text-yellow-500 hover:text-yellow-400"
          >
            <Bug className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Translator */}
        <main className="flex-1 overflow-y-auto" role="main">
          <TranslatorPanel />
        </main>

        {/* History sidebar */}
        {historyOpen && (
          <aside className="w-72 border-l border-[var(--color-border)] overflow-y-auto shrink-0 bg-[var(--color-surface)]">
            <HistoryPanel />
          </aside>
        )}
      </div>

      <SettingsPanel />
    </div>
  );
}
