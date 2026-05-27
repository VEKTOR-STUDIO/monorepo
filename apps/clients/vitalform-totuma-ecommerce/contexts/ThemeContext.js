"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "vitalform-profile-mode";

const ThemeContext = createContext({
  activeProfile: "vitalform",
  setActiveProfile: () => {},
});

export function ThemeProvider({ children, defaultProfile = "vitalform" }) {
  const [activeProfile, setActiveProfileState] = useState(defaultProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "vitalform" || stored === "totuma") {
      setActiveProfileState(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const theme = activeProfile === "vitalform" ? "vitalform-fit" : "totuma-mealpreps";
    document.documentElement.setAttribute("data-theme", theme);
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, activeProfile);
    }
  }, [activeProfile, mounted]);

  const setActiveProfile = (value) => {
    if (value === "vitalform" || value === "totuma") {
      setActiveProfileState(value);
    }
  };

  return (
    <ThemeContext.Provider value={{ activeProfile, setActiveProfile }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
