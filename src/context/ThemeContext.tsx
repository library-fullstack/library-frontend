import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeContext } from "./ThemeContext.context";
import type { ThemeMode } from "./ThemeContext.types";
import { lightTheme, darkTheme } from "../app/theme/palette";

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved) {
      return saved as ThemeMode;
    }
    return "light";
  });

  useEffect(() => {
    const bgColor = mode === "dark" ? "#1b1c22" : "#f8fafc";

    // Update html background
    document.documentElement.style.backgroundColor = bgColor;

    // Update body background and class
    document.body.style.backgroundColor = bgColor;

    if (mode === "dark") {
      document.body.classList.add("dark-mode");
      document.documentElement.dataset.theme = "dark";
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.dataset.theme = "light";
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // memoize theme để tránh re-create
  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  // memoize context value
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
