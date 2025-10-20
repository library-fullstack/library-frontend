import React from "react";
import { Box, Typography } from "@mui/material";

export default function BookList() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sách
      </Typography>
      <Typography color="text.secondary">
        Trang này đang được phát triển...
      </Typography>
    </Box>
  );
}
