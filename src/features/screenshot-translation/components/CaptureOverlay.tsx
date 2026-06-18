import { useEffect } from "react";
import { useScreenshotStore } from "../store";

export function CaptureOverlay() {
  const { isCapturing, cancelCapture, error } = useScreenshotStore();

  useEffect(() => {
    if (!isCapturing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelCapture();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCapturing, cancelCapture]);

  if (!isCapturing && !error) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-label="Screen capture"
    >
      <div className="rounded-xl bg-white dark:bg-gray-900 shadow-2xl p-8 max-w-sm w-full mx-4 text-center border border-gray-200 dark:border-gray-700">
        {isCapturing ? (
          <>
            <div className="text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-indigo-500" aria-hidden="true">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Capture Mode
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Click and drag to select a region, or press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">Esc</kbd> to cancel.
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-4xl mb-4 text-red-500">!</div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Capture Failed
            </h2>
            <p className="text-sm text-red-500 dark:text-red-400 mb-4 whitespace-pre-line">
              {error}
            </p>
          </>
        ) : null}

        <button
          onClick={cancelCapture}
          className="mt-2 rounded-lg px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          {isCapturing ? "Cancel" : "Dismiss"}
        </button>
      </div>
    </div>
  );
}
