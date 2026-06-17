import { useEffect } from "react";
import { useTranslatorStore } from "../store";

export function useTheme() {
  const theme = useTranslatorStore((s) => s.theme);
  const contrastMode = useTranslatorStore((s) => s.contrastMode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "high-contrast");

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }

    if (contrastMode === "high") {
      root.classList.add("high-contrast");
    }
  }, [theme, contrastMode]);

  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const root = document.documentElement;
      root.classList.toggle("dark", mq.matches);
      root.classList.toggle("light", !mq.matches);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);
}
