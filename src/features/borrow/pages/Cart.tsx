import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function Cart(): React.ReactElement {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ mượn
      </Typography>
      <Typography color="text.secondary">
        Trang này đang được phát triển...
      </Typography>
    </Box>
  );
}
