import * as React from "react";
import { Box, useTheme } from "@mui/material";
import logo from "../../../assets/img/logo.png";

// logo HBH
export default function Logo(): React.ReactElement {
  const theme = useTheme();

  return (
    <Box>
      <img
        width="30"
        height="32"
        src={logo}
        alt="Logo thư viện trực tuyến HBH"
        style={{
          filter: theme.palette.mode === "light" ? "invert(1)" : "invert(0)",
          transition: "filter 0.3s ease",
        }}
      />
    </Box>
  );
}
