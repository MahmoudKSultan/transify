import Tesseract from "tesseract.js";
import type { OcrResult } from "../types";

export interface OcrProvider {
  extractText(imageBase64: string): Promise<OcrResult>;
}

export class TesseractOcrProvider implements OcrProvider {
  async extractText(imageBase64: string): Promise<OcrResult> {
    const { data } = await Tesseract.recognize(imageBase64, "eng+ara", {
      logger: () => {},
    });

    return {
      text: data.text.replace(/\r/g, "").trim(),
      confidence: data.confidence,
    };
  }
}
