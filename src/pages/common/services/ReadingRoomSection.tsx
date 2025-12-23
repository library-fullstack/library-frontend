import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { MenuBook, Wifi, Computer, Chair } from "@mui/icons-material";
import Grid from "@mui/material/Grid";

export default function ReadingRoomSection() {
  const facilities = [
    {
      icon: <MenuBook sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Tài liệu đa dạng",
      description: "Sách in, tạp chí, báo thuộc nhiều lĩnh vực",
    },
    {
      icon: <Wifi sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Wifi miễn phí",
      description: "Kết nối internet tốc độ cao",
    },
    {
      icon: <Computer sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Máy tra cứu",
      description: "Máy tra cứu tài liệu tại các phòng đọc",
    },
    {
      icon: <Chair sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Không gian yên tĩnh",
      description: "Bàn ghế hiện đại, không gian lý tưởng",
    },
  ];

  return (
    <Box id="reading-room">
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 3,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          color: "text.primary",
        }}
      >
        Mượn đọc tài liệu tại chỗ
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}
      >
        Đọc tài liệu tại chỗ là một trong số các dịch vụ của Trung tâm Thư viện
        Trường Đại học Kinh tế - Kỹ thuật Công nghiệp. Bạn đọc có thể tìm kiếm
        và nghiên cứu, đọc tài liệu tại chỗ trong không gian yên tĩnh và được hỗ
        trợ các trang thiết bị hiện đại, cần thiết như máy mượn – trả tự động
        (máy Self Check), wifi, bàn ghế,... và nhiều tiện ích khác.
      </Typography>

      <Grid container spacing={3}>
        {facilities.map((facility, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                textAlign: "center",
                border: 1,
                borderColor: "divider",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 3,
                  borderColor: "primary.main",
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{facility.icon}</Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, fontSize: "1rem" }}
              >
                {facility.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                {facility.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          mt: 4,
          p: 3,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, textAlign: "center" }}
        >
          Dịch vụ này mang lại cho Bạn đọc cơ hội tiếp cận ngay tới những tài
          liệu có sẵn trong Thư viện mà không cần mượn về nhà, giúp nâng cao
          hiệu quả học tập và nghiên cứu.
        </Typography>
      </Paper>
    </Box>
  );
}
