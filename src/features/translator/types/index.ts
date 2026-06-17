export interface TranslationItem {
  id: string;
  inputText: string;
  outputText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

export type TranslationError =
  | "NETWORK_ERROR"
  | "API_ERROR"
  | "RATE_LIMIT"
  | "EMPTY_INPUT"
  | "UNSUPPORTED_LANGUAGE";

export type Theme = "light" | "dark" | "system";
export type ContrastMode = "normal" | "high";

export interface ShortcutConfig {
  translate: string;
  swap: string;
  clear: string;
  focusInput: string;
}

export const DEFAULT_SHORTCUTS: ShortcutConfig = {
  translate: "ctrl+t",
  swap: "ctrl+s",
  clear: "ctrl+shift+c",
  focusInput: "ctrl+shift+f",
};

export interface TranslatorState {
  inputText: string;
  outputText: string;
  sourceLang: string;
  targetLang: string;
  isLoading: boolean;
  error: string | null;
  history: TranslationItem[];
  isAutoCopy: boolean;
  isHistoryEnabled: boolean;
  theme: Theme;
  contrastMode: ContrastMode;
  settingsOpen: boolean;
  shortcuts: ShortcutConfig;
}
