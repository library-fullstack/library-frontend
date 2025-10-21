import React, { useState } from "react";
import { ThemeProvider, CssBaseline, GlobalStyles, Box } from "@mui/material";
import { ThemeContext } from "./ThemeContext.context";
import type { ThemeMode } from "./ThemeContext.types";
import { lightTheme, darkTheme } from "../theme/palette";

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("themeMode");
    return (saved as ThemeMode) || "light";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleTheme = () => {
    // cho tí hiệu ứng
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 400);

    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            "html, body, #root": {
              transition:
                "background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease",
            },
            "*": {
              transition:
                "background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease",
            },
          }}
        />

        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: theme.palette.background.default,
            opacity: isTransitioning ? 1 : 0,
            pointerEvents: "none",
            transition: "opacity 0.4s ease",
            zIndex: 1300,
          }}
        />

        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
