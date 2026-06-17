import { create } from "zustand";
import type { TranslatorState, TranslationItem, TranslationError, Theme, ContrastMode, ShortcutConfig } from "../types";
import { DEFAULT_SHORTCUTS } from "../types";
import { translateText, getTranslationErrorLabel } from "../services/translation";

const SHORTCUT_VERSION = 2;

function loadShortcuts(): ShortcutConfig {
  try {
    const version = parseInt(localStorage.getItem("transify-shortcut-version") || "0", 10);
    if (version < SHORTCUT_VERSION) {
      localStorage.removeItem("transify-shortcuts");
      localStorage.setItem("transify-shortcut-version", String(SHORTCUT_VERSION));
      return { ...DEFAULT_SHORTCUTS };
    }
    const stored = localStorage.getItem("transify-shortcuts");
    if (stored) return { ...DEFAULT_SHORTCUTS, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULT_SHORTCUTS };
}

function saveShortcuts(shortcuts: ShortcutConfig) {
  try {
    localStorage.setItem("transify-shortcuts", JSON.stringify(shortcuts));
  } catch {}
}

interface TranslatorActions {
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  swapLanguages: () => void;
  swapAndTranslate: () => Promise<void>;
  translate: () => Promise<void>;
  clearInput: () => void;
  clearError: () => void;
  toggleAutoCopy: () => void;
  toggleHistory: () => void;
  setTheme: (theme: Theme) => void;
  setContrastMode: (mode: ContrastMode) => void;
  toggleSettings: () => void;
  setShortcut: (action: keyof ShortcutConfig, keys: string) => void;
  resetShortcuts: () => void;
  addToHistory: (item: TranslationItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  pasteFromClipboard: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
}

export const useTranslatorStore = create<TranslatorState & TranslatorActions>((set, get) => ({
  inputText: "",
  outputText: "",
  sourceLang: "auto",
  targetLang: "en",
  isLoading: false,
  error: null,
  history: [],
  isAutoCopy: false,
  isHistoryEnabled: true,
  theme: "system",
  contrastMode: "normal",
  settingsOpen: false,
  shortcuts: loadShortcuts(),

  setInputText: (text) => set({ inputText: text, error: null }),

  setOutputText: (text) => set({ outputText: text }),

  setSourceLang: (lang) => set({ sourceLang: lang }),

  setTargetLang: (lang) => set({ targetLang: lang }),

  swapLanguages: () => {
    const { sourceLang, targetLang } = get();
    if (sourceLang === "auto") return;
    set({ sourceLang: targetLang, targetLang: sourceLang });
  },

  swapAndTranslate: async () => {
    const { sourceLang, targetLang, inputText } = get();
    if (sourceLang === "auto" || !inputText.trim()) return;
    set({ sourceLang: targetLang, targetLang: sourceLang });
    await get().translate();
  },

  translate: async () => {
    const { inputText, sourceLang, targetLang, isHistoryEnabled, isAutoCopy } = get();

    if (!inputText.trim()) {
      set({ outputText: "", error: null, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      set({ outputText: result.translatedText, isLoading: false });

      if (result.detectedLanguage && sourceLang === "auto") {
        set({ sourceLang: result.detectedLanguage });
      }

      if (isAutoCopy && result.translatedText) {
        try {
          await navigator.clipboard.writeText(result.translatedText);
        } catch {
          // silent fail for auto-copy
        }
      }

      if (isHistoryEnabled && result.translatedText) {
        const item: TranslationItem = {
          id: crypto.randomUUID(),
          inputText,
          outputText: result.translatedText,
          sourceLang: sourceLang === "auto" ? result.detectedLanguage || "auto" : sourceLang,
          targetLang,
          timestamp: Date.now(),
        };
        get().addToHistory(item);
      }
    } catch {
      const errorLabel = getTranslationErrorLabel("API_ERROR" as TranslationError);
      set({ error: errorLabel, isLoading: false, outputText: "" });
    }
  },

  clearInput: () => set({ inputText: "", outputText: "", error: null }),

  clearError: () => set({ error: null }),

  toggleAutoCopy: () => set((s) => ({ isAutoCopy: !s.isAutoCopy })),

  toggleHistory: () => set((s) => ({ isHistoryEnabled: !s.isHistoryEnabled })),

  setTheme: (theme) => set({ theme }),

  setContrastMode: (contrastMode) => set({ contrastMode }),

  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),

  setShortcut: (action, keys) => {
    const shortcuts = { ...get().shortcuts, [action]: keys };
    saveShortcuts(shortcuts);
    set({ shortcuts });
  },

  resetShortcuts: () => {
    const shortcuts = { ...DEFAULT_SHORTCUTS };
    saveShortcuts(shortcuts);
    set({ shortcuts });
  },

  addToHistory: (item) =>
    set((s) => ({
      history: [item, ...s.history].slice(0, 100),
    })),

  removeFromHistory: (id) =>
    set((s) => ({
      history: s.history.filter((item) => item.id !== id),
    })),

  clearHistory: () => set({ history: [] }),

  pasteFromClipboard: async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        set({ inputText: text, error: null });
      }
    } catch {
      set({ error: "Unable to access clipboard." });
    }
  },

  copyToClipboard: async () => {
    const { outputText } = get();
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
    } catch {
      set({ error: "Unable to copy to clipboard." });
    }
  },
}));
