export function parseShortcutEvent(e: KeyboardEvent): string | null {
  const parts: string[] = [];

  if (e.ctrlKey || e.metaKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  if (e.metaKey) parts.push("meta");

  const key = e.key.toLowerCase();
  const skipKeys = ["control", "alt", "shift", "meta"];
  if (skipKeys.includes(key)) return null;

  parts.push(key);
  return parts.join("+");
}

export function formatShortcut(shortcut: string): string {
  return shortcut
    .split("+")
    .map((part) => {
      const p = part.toLowerCase();
      if (p === "ctrl" || p === "meta") return "Ctrl";
      if (p === "alt") return "Alt";
      if (p === "shift") return "Shift";
      if (p.length === 1) return p.toUpperCase();
      if (p === "arrowup") return "↑";
      if (p === "arrowdown") return "↓";
      if (p === "arrowleft") return "←";
      if (p === "arrowright") return "→";
      if (p === "enter") return "Enter";
      if (p === "escape") return "Esc";
      if (p === "backspace") return "Bksp";
      if (p === "delete") return "Del";
      if (p === " ") return "Space";
      if (p.startsWith("f") && p.length <= 3) return p.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" + ");
}

export function shortcutsEqual(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export const SHORTCUT_ACTIONS = [
  { key: "translate" as const, label: "Translate", description: "Paste clipboard & translate" },
  { key: "swap" as const, label: "Swap Languages", description: "Swap source & target" },
  { key: "clear" as const, label: "Clear Input", description: "Clear all text" },
  { key: "focusInput" as const, label: "Focus Input", description: "Jump to input field" },
  { key: "ocr" as const, label: "Capture & Translate", description: "Screenshot OCR translation" },
] as const;
