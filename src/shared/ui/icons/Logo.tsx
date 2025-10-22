import * as React from "react";
import { Box, useTheme } from "@mui/material";
import logo from "../../../assets/img/logo.png";

// logo HBH
export default function Logo({
  sx,
  width,
}: {
  sx?: object;
  width?: number | string;
}): React.ReactElement {
  const theme = useTheme();

  return (
    <Box
      component="img"
      src={logo}
      alt="Logo thư viện trực tuyến HBH"
      sx={{
        width: width || { xs: 80, sm: 90, md: 100 },
        height: "auto",
        filter: theme.palette.mode === "light" ? "invert(1)" : "invert(0)",
        transition: "filter 0.3s ease",
        ...sx,
      }}
    />
  );
}
