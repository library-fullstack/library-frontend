import React from "react";
import { Box, Typography, Button } from "@mui/material";

// phần thông tin của banner
const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(90deg, #ffffff 0%, #fafafa 100%)",
        boxSizing: "border-box",
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 0 },
        overflow: "hidden",
      }}
    >
      {/* nội dung bên trái banner */}
      <Box
        sx={{
          maxWidth: { xs: "100%", md: 600 },
          textAlign: { xs: "center", md: "left" },
          zIndex: 1,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#393280",
            mb: 3,
            lineHeight: 1.2,
            fontSize: { xs: "2rem", md: "3.5rem" },
          }}
        >
          Xin chào các bạn
        </Typography>

        <Typography
          sx={{
            mb: 4,
            color: "#333",
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          Cùng chào mừng sự kiện khai trương thư viện trực tuyến HBH...
        </Typography>

        <Button
          variant="outlined"
          sx={{
            borderColor: "#ED553B",
            color: "#ED553B",
            borderRadius: "25px",
            textTransform: "none",
            px: 4,
            py: 1.2,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "rgba(237,85,59,0.1)",
              borderColor: "#ED553B",
            },
          }}
        >
          Xem thêm
        </Button>
      </Box>

      {/* nội dung bên phải ( hình ) banner */}
      <Box
        component="img"
        src="/assets/hero-books.png"
        alt="Books"
        sx={{
          width: { xs: "80%", md: "45vw" },
          height: { xs: "auto", md: "100%" },
          objectFit: "cover",
          borderRadius: 0,
          position: { xs: "static", md: "absolute" },
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
    </Box>
  );
};

export default HeroSection;
