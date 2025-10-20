import React from "react";
import { Box, Typography } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trang quản trị
      </Typography>
      <Typography color="text.secondary">
        Trang này đang được phát triển...
      </Typography>
    </Box>
  );
}
