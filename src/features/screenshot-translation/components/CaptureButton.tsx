import { useScreenshotStore } from "../store";

export function CaptureButton() {
  const { startCapture, isCapturing } = useScreenshotStore();

  return (
    <button
      onClick={startCapture}
      disabled={isCapturing}
      aria-label="Capture screen and translate text"
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
        bg-indigo-50 text-indigo-700 hover:bg-indigo-100
        dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
      {isCapturing ? "Capturing..." : "Capture & Translate"}
    </button>
  );
}
