import { useState } from "react";
import { useTranslatorStore } from "@/features/translator/store";
import { Button } from "@/shared/ui/Button";
import { X, Keyboard, Palette, Sliders, RotateCcw } from "lucide-react";
import { ShortcutRecorder } from "@/shared/ui/ShortcutRecorder";
import { SHORTCUT_ACTIONS } from "@/shared/utils/shortcuts";
import type { Theme, ContrastMode } from "@/features/translator/types";
import { cn } from "@/shared/utils/cn";

function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-2.5">
      <span className="text-sm text-[var(--color-text)]">{label}</span>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          checked ? "bg-primary" : "bg-[var(--color-border)]"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <label htmlFor={id} className="text-sm text-[var(--color-text)]">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-select-bg)] px-3 py-1.5 pr-8 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

type Tab = "general" | "appearance" | "shortcuts";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <Sliders className="h-4 w-4" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
  { id: "shortcuts", label: "Shortcuts", icon: <Keyboard className="h-4 w-4" /> },
];

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const settingsOpen = useTranslatorStore((s) => s.settingsOpen);
  const toggleSettings = useTranslatorStore((s) => s.toggleSettings);
  const isAutoCopy = useTranslatorStore((s) => s.isAutoCopy);
  const toggleAutoCopy = useTranslatorStore((s) => s.toggleAutoCopy);
  const isHistoryEnabled = useTranslatorStore((s) => s.isHistoryEnabled);
  const toggleHistory = useTranslatorStore((s) => s.toggleHistory);
  const theme = useTranslatorStore((s) => s.theme);
  const setTheme = useTranslatorStore((s) => s.setTheme);
  const contrastMode = useTranslatorStore((s) => s.contrastMode);
  const setContrastMode = useTranslatorStore((s) => s.setContrastMode);
  const shortcuts = useTranslatorStore((s) => s.shortcuts);
  const setShortcut = useTranslatorStore((s) => s.setShortcut);
  const resetShortcuts = useTranslatorStore((s) => s.resetShortcuts);

  if (!settingsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={toggleSettings}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div
        className="w-full max-w-lg rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Settings</h2>
          <Button variant="icon" onClick={toggleSettings} aria-label="Close settings" className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-5 py-4 min-h-[200px] max-h-[400px] overflow-y-auto" role="tabpanel">
          {activeTab === "general" && (
            <div>
              <Toggle
                id="auto-copy"
                checked={isAutoCopy}
                onChange={toggleAutoCopy}
                label="Auto-copy translation"
              />
              <Toggle
                id="history"
                checked={isHistoryEnabled}
                onChange={toggleHistory}
                label="Save history"
              />
            </div>
          )}

          {activeTab === "appearance" && (
            <div>
              <Select
                id="theme"
                value={theme}
                onChange={(v) => setTheme(v as Theme)}
                label="Theme"
                options={[
                  { value: "system", label: "System" },
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
              <Select
                id="contrast"
                value={contrastMode}
                onChange={(v) => setContrastMode(v as ContrastMode)}
                label="Contrast"
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "high", label: "High Contrast" },
                ]}
              />
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Click a shortcut, then press your desired key combination
                </p>
                <Button variant="ghost" size="sm" onClick={resetShortcuts} aria-label="Reset shortcuts to defaults">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
              <div className="space-y-1">
                {SHORTCUT_ACTIONS.map((action) => (
                  <ShortcutRecorder
                    key={action.key}
                    id={`shortcut-${action.key}`}
                    label={action.label}
                    value={shortcuts[action.key]}
                    onChange={(keys) => setShortcut(action.key, keys)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
