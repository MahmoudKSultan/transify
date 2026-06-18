import { useEffect } from "react";
import { useScreenshotStore } from "../store";

export function useScreenshotTranslation() {
  const store = useScreenshotStore();

  useEffect(() => {
    return () => {
      useScreenshotStore.getState().clear();
    };
  }, []);

  return store;
}
