import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const steps = [
  {
    icon: <LoginOutlinedIcon fontSize="large" />,
    title: "Đăng nhập hệ thống",
    desc: "Sử dụng tài khoản sinh viên để truy cập vào cổng thư viện trực tuyến.",
  },
  {
    icon: <SearchOutlinedIcon fontSize="large" />,
    title: "Tìm kiếm & xem sách",
    desc: "Tìm kiếm sách theo tên, thể loại, tác giả hoặc mã ISBN chỉ trong vài giây.",
  },
  {
    icon: <LibraryBooksOutlinedIcon fontSize="large" />,
    title: "Mượn & quản lý sách",
    desc: "Đặt mượn trực tuyến, gia hạn thời gian, hoặc xem chi tiết lịch sử mượn.",
  },
  {
    icon: <HistoryOutlinedIcon fontSize="large" />,
    title: "Theo dõi & phản hồi",
    desc: "Xem tiến trình mượn sách, nhận thông báo hạn trả và gửi đánh giá phản hồi.",
  },
];

export default function GettingStartedSection(): React.ReactElement {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 6, md: 10 },
        width: "100%",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={1}
          sx={{ color: theme.palette.text.primary }}
        >
          Bắt đầu với Thư viện HBH
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={6}
        >
          Bạn là sinh viên mới? Hãy làm quen với hệ thống chỉ qua vài bước đơn
          giản.
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {steps.map((step, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  p: 1,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 6px 16px rgba(99,102,241,0.08)"
                      : "0 6px 16px rgba(129,140,248,0.15)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 8px 24px rgba(99,102,241,0.18)"
                        : "0 8px 24px rgba(129,140,248,0.25)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    py: { xs: 3, sm: 4 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor:
                        theme.palette.mode === "light"
                          ? "rgba(99,102,241,0.08)"
                          : "rgba(129,140,248,0.15)",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      maxWidth: 240,
                    }}
                  >
                    {step.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
