import type { TranslationResult, TranslationError } from "../types";

const API_BASE = "https://translate.googleapis.com/translate_a/single";

export function getTranslationErrorLabel(error: TranslationError): string {
  const labels: Record<TranslationError, string> = {
    NETWORK_ERROR: "Network error. Check your connection.",
    API_ERROR: "Translation failed. Try again.",
    RATE_LIMIT: "Too many requests. Please wait.",
    EMPTY_INPUT: "",
    UNSUPPORTED_LANGUAGE: "Language not supported.",
  };
  return labels[error];
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  if (!text.trim()) {
    return { translatedText: "" };
  }

  const source = sourceLang === "auto" ? "auto" : sourceLang;
  const url = `${API_BASE}?client=gtx&sl=${source}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API_ERROR`);
  }

  const data = await response.json();
  const translatedText = data[0]
    .map((segment: unknown[]) => segment[0])
    .filter(Boolean)
    .join("");

  const detectedLanguage = sourceLang === "auto" ? data[2] : undefined;

  return { translatedText, detectedLanguage };
}
