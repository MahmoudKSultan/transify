import { create } from "zustand";
import type { ScreenshotTranslationStore } from "../types";
import { TesseractOcrProvider } from "../services/ocr";
import { RustCaptureProvider } from "../services/capture";

const ocr = new TesseractOcrProvider();
const capture = new RustCaptureProvider();

export const useScreenshotStore = create<ScreenshotTranslationStore>((set) => ({
  capturedImage: null,
  extractedText: "",
  translatedText: "",
  isCapturing: false,
  isOcrRunning: false,
  isTranslating: false,
  error: null,

  startCapture: async () => {
    set({ isCapturing: true, error: null });

    try {
      const dataUrl = await capture.captureRegion();
      set({ capturedImage: dataUrl, isCapturing: false, isOcrRunning: true });

      const result = await ocr.extractText(dataUrl);
      if (!result.text) {
        set({ error: "No readable text detected.", isOcrRunning: false });
        return;
      }

      set({ extractedText: result.text, isOcrRunning: false });

      const { useTranslatorStore } = await import("../../translator/store");
      const translator = useTranslatorStore.getState();
      translator.setInputText(result.text);
      setTimeout(() => translator.translate(), 50);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Capture failed.";
      set({ isCapturing: false, isOcrRunning: false, error: message });
    }
  },

  cancelCapture: () => {
    set({ isCapturing: false, error: null });
  },

  clear: () => {
    set({
      capturedImage: null,
      extractedText: "",
      translatedText: "",
      error: null,
    });
  },
}));
