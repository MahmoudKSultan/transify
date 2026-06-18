export interface OcrResult {
  text: string;
  confidence: number;
}

export interface ScreenshotTranslationState {
  capturedImage: string | null;
  extractedText: string;
  translatedText: string;
  isCapturing: boolean;
  isOcrRunning: boolean;
  isTranslating: boolean;
  error: string | null;
}

export interface ScreenshotTranslationActions {
  startCapture: () => Promise<void>;
  cancelCapture: () => void;
  clear: () => void;
}

export type ScreenshotTranslationStore = ScreenshotTranslationState & ScreenshotTranslationActions;
