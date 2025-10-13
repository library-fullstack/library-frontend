import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0057b7" },
    secondary: { main: "#ffcc00" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

export default theme;
