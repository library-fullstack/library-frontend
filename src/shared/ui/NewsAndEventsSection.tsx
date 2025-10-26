import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

// cái này thì cần phải gọi api vì sự kiện không thể tĩnh
// tuy nhiên chưa có table news trong cơ sở dữ liệu nên sẽ tạm thời bỏ qua
// TO-DO
// TO-DO
// TO-DO
const mockNews = [
  {
    title: "Thư viện HBH mở rộng khu đọc mới",
    date: "20/10/2025",
    desc: "Khu đọc mới tại tầng 2 nhà B chính thức hoạt động, mang đến không gian học tập yên tĩnh và tiện nghi hơn cho sinh viên.",
  },
  {
    title: "Cập nhật quy định mượn sách học kỳ I năm 2025-2026",
    date: "10/10/2025",
    desc: "Thư viện điều chỉnh thời gian mượn và trả sách nhằm tối ưu luân chuyển tài liệu phục vụ sinh viên toàn trường.",
  },
  {
    title: "Cập nhật tính năng tra cứu nhanh trên hệ thống thư viện",
    date: "01/10/2025",
    desc: "Từ nay sinh viên có thể tìm kiếm tài liệu nhanh hơn 50% nhờ công cụ tra cứu mới được tích hợp trên website.",
  },
];

// cái này thì cần phải gọi api vì sự kiện không thể tĩnh
// tuy nhiên chưa có table events trong cơ sở dữ liệu nên sẽ tạm thời bỏ qua
// TO-DO
// TO-DO
// TO-DO
const mockEvents = [
  {
    title: "Ngày hội đọc sách HBH 2025",
    date: "15/11/2025",
    desc: "Sự kiện thường niên lan tỏa tinh thần đọc sách trong cộng đồng sinh viên HBH.",
  },
  {
    title: "Talkshow: Văn hóa đọc thời công nghệ số",
    date: "02/12/2025",
    desc: "Buổi trò chuyện cùng các diễn giả về việc giữ gìn và phát triển văn hóa đọc trong kỷ nguyên số.",
  },
  {
    title: "Workshop: Viết review sách cùng AI",
    date: "20/12/2025",
    desc: "Hướng dẫn sinh viên viết nhận xét, cảm nhận sách hiệu quả với sự hỗ trợ của công nghệ AI.",
  },
];

export default function NewsAndEventsSection(): React.ReactElement {
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
        {/* Tiêu đề */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={1}
          sx={{ color: theme.palette.text.primary }}
        >
          Tin tức & Sự kiện
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={6}
        >
          Cập nhật những hoạt động và thông báo mới nhất từ Thư viện HBH.
        </Typography>

        {/* Hai cột: News & Events */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
          }}
        >
          {/* Cột Tin tức */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <ArticleOutlinedIcon color="primary" />
              <Typography fontWeight={600}>Tin tức mới</Typography>
            </Stack>

            <Stack spacing={3}>
              {mockNews.map((news, idx) => (
                <Card
                  key={idx}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 6px 16px rgba(99,102,241,0.06)"
                        : "0 6px 16px rgba(129,140,248,0.1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "0.3s ease",
                      boxShadow:
                        theme.palette.mode === "light"
                          ? "0 8px 20px rgba(99,102,241,0.15)"
                          : "0 8px 20px rgba(129,140,248,0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary.main"
                    fontWeight={600}
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    {news.date}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      mb: 0.5,
                      color: theme.palette.text.primary,
                      lineHeight: 1.5,
                    }}
                  >
                    {news.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {news.desc}
                  </Typography>
                </Card>
              ))}
            </Stack>

            <Button
              href="/news"
              variant="outlined"
              color="primary"
              sx={{
                mt: 4,
                display: "block",
                mx: "auto",
                px: 4,
                py: 1.2,
                fontWeight: 600,
              }}
            >
              Xem tất cả tin tức
            </Button>
          </Box>

          {/* Cột Sự kiện */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <EventOutlinedIcon color="secondary" />
              <Typography fontWeight={600}>Sự kiện sắp tới</Typography>
            </Stack>

            <Stack spacing={3}>
              {mockEvents.map((event, idx) => (
                <Card
                  key={idx}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === "light"
                        ? "rgba(99,102,241,0.04)"
                        : "rgba(129,140,248,0.08)",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary.main"
                    fontWeight={600}
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    {event.date}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 0.5, color: theme.palette.text.primary }}
                  >
                    {event.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {event.desc}
                  </Typography>
                  <Button
                    size="small"
                    href="/events"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    Xem chi tiết
                  </Button>
                </Card>
              ))}
            </Stack>

            <Button
              href="/events"
              variant="outlined"
              color="primary"
              sx={{
                mt: 4,
                display: "block",
                mx: "auto",
                px: 4,
                py: 1.2,
                fontWeight: 600,
              }}
            >
              Xem tất cả sự kiện
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
