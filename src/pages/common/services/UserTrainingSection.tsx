import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { School, Schedule, PersonAdd, Phone } from "@mui/icons-material";
import Grid from "@mui/material/Grid";

export default function UserTrainingSection() {
  const features = [
    {
      icon: <Schedule sx={{ fontSize: 35 }} />,
      title: "90 phút/buổi",
      description: "Thời lượng phù hợp",
    },
    {
      icon: <School sx={{ fontSize: 35 }} />,
      title: "Lý thuyết + Thực hành",
      description: "Kết hợp hiệu quả",
    },
    {
      icon: <PersonAdd sx={{ fontSize: 35 }} />,
      title: "Miễn phí 100%",
      description: "Không mất chi phí",
    },
  ];

  return (
    <Box id="user-training">
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
        Hướng dẫn người dùng tin
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}
      >
        Đồng hành vì một tương lai phát triển của HBH – Bạn đọc chính là nhân tố
        quan trọng mà Trung tâm Thư viện HBH muốn tập trung và hướng đến. Nhằm
        nâng cao chất lượng trải nghiệm trong học tập, nghiên cứu và sử dụng các
        dịch vụ Thư viện, chúng tôi tổ chức các lớp "Hướng dẫn người dùng tin -
        Miễn phí" với mục tiêu Bạn đọc toàn trường sẽ nắm rõ quy định, quy trình
        sử dụng Thư viện, nâng cao trải nghiệm cũng như đáp ứng nhu cầu tin một
        cách kịp thời nhất.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                border: 1,
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Box sx={{ color: "primary.main", mb: 1.5 }}>{feature.icon}</Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 0.5, fontSize: "1.1rem" }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Đăng ký tham gia
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 3, maxWidth: 600, mx: "auto" }}
        >
          Để đăng ký tham gia các lớp "Hướng dẫn người dùng tin miễn phí", vui
          lòng điền thông tin đăng ký theo mẫu
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Hỗ trợ capitale Mr Trần Kính Hoàng: <strong>0869.995.472</strong>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
