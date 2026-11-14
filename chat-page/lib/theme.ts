"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

export type ThemePreference = "light" | "dark" | "system";

const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  const v = localStorage.getItem(THEME_STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
}

function applyTheme(pref: ThemePreference) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Other tabs changing the theme.
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyTheme(readPreference());
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved theme preference, and a setter that applies and stores it. */
export function useTheme() {
  const preference = useSyncExternalStore<ThemePreference>(subscribe, readPreference, () => "system");

  // While on "system", follow the OS setting as it changes.
  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
    applyTheme(pref);
    listeners.forEach((l) => l());
  }, []);

  return { preference, setPreference };
}
