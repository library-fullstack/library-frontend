import * as React from "react";
import { Box, useTheme } from "@mui/material";

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
      src="/assets/img/logo.webp"
      alt="Logo"
      width="180"
      height="60"
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
