"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "@/components/common/icon";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "react-interview-hub-theme";
const THEME_CHANGE_EVENT = "react-interview-hub-theme-change";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

function notifyThemeChange() {
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";

    applyTheme(initialTheme);
    notifyThemeChange();
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    notifyThemeChange();
  }

  return (
    <button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      className="icon-button"
      onClick={toggleTheme}
      type="button"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
