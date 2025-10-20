import React from "react";
import { Box, Typography } from "@mui/material";

export default function Forum() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Diễn đàn
      </Typography>
      <Typography color="text.secondary">
        Trang này đang được phát triển...
      </Typography>
    </Box>
  );
}
