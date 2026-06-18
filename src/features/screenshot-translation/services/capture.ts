import { invoke } from "@tauri-apps/api/core";

export interface CaptureProvider {
  captureRegion(): Promise<string>;
}

export class RustCaptureProvider implements CaptureProvider {
  async captureRegion(): Promise<string> {
    const base64 = await invoke<string>("capture_screen_region");
    return `data:image/png;base64,${base64}`;
  }
}
