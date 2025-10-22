import React from "react";
import { Box, Typography, Button } from "@mui/material";

// phần banner đầu trang
const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/assets/banner.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: 0,
        p: 8,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 500 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, color: "#393280", mb: 2 }}
        >
          Xin chào cộng đồng sinh viên HBH
        </Typography>
        <Typography sx={{ mb: 3, color: "#333" }}>
          Cùng chào mừng sự kiện khai trương thư viện trực tuyến HBH...
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#ED553B",
            color: "#ED553B",
            borderRadius: "25px",
            textTransform: "none",
            px: 3,
            "&:hover": { backgroundColor: "rgba(237,85,59,0.1)" },
          }}
        >
          Xem thêm
        </Button>
      </Box>

      <Box
        component="img"
        src="/assets/hero-books.png"
        alt="Books"
        sx={{ width: 400, height: "auto", borderRadius: "12px" }}
      />
    </Box>
  );
};

export default HeroSection;
