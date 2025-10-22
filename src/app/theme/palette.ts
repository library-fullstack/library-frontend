import { createTheme, Theme } from "@mui/material/styles";

// light theme nhé
export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4F46E5", contrastText: "#FFFFFF" },
    secondary: { main: "#F59E0B" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    divider: "#E2E8F0",
    action: {
      active: "#4F46E5",
      hover: "rgba(99,102,241,0.08)",
    },
  },

  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: "2rem", lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    body1: {
      color: "#0F172A",
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
  },

  shape: { borderRadius: 6 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
          transition: "0.3s ease",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 6,
        },
        contained: {
          backgroundColor: "#4F46E5",
          "&:hover": { backgroundColor: "#4338CA" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          borderRadius: 8,
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(99,102,241,0.12)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: 6,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D1D5DB",
            borderWidth: "1.5px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9CA3AF",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4F46E5",
            borderWidth: "2px",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#EF4444 !important",
            borderWidth: "2px !important",
          },
          input: {
            color: "#0F172A",
            fontWeight: 400,
          },
        },
      },
    },
  },
});

// dark theme đây
export const darkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#818CF8", contrastText: "#FFFFFF" },
    secondary: { main: "#FBBF24" },
    background: {
      default: "#1B1C22",
      paper: "#23242B",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#A1A1AA",
    },
    divider: "#30323B",
    action: {
      active: "#A78BFA",
      hover: "rgba(129,140,248,0.12)",
    },
  },

  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: "2rem", lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    body1: {
      color: "#F1F5F9",
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
  },

  shape: { borderRadius: 6 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#1B1C22",
          transition: "0.4s ease",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 6,
        },
        contained: {
          backgroundColor: "#4F46E5",
          "&:hover": { backgroundColor: "#6366F1" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(28,29,36,0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 1px 10px rgba(0,0,0,0.25)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#23242B",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          borderRadius: 8,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(129,140,248,0.2)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#2A2B33",
          borderRadius: 6,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3F4147",
            borderWidth: "1.5px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#52525B",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#818CF8",
            borderWidth: "2px",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F87171 !important",
            borderWidth: "2px !important",
          },
          input: {
            color: "#F9FAFB",
            fontWeight: 400,
          },
        },
      },
    },
  },
});
