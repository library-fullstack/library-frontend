import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

// phần này cần xem xét việc xử lí gọi api và lấy ra bài viết trending thay vì static dữ liệu như này
// tuy nhiên vấn đề lấy bài viết trending sẽ có vấn đề về sự nghiêm túc và lệch chuẩn do đôi khi bài
// viết có thể sẽ không phù hợp. và vì thế nó không phù hợp nằm ở webpage.
// có lẽ vẫn nên để static để thể hiện ví dụ về cộng đồng...
const mockPosts = [
  {
    id: 1,
    title: "Chia sẻ cảm nhận sau khi đọc 'Tôi thấy hoa vàng trên cỏ xanh'",
    author: "Tạ Hữu Anh Bình",
    tag: "Cảm nhận sách",
    excerpt:
      "Một cuốn sách nhẹ nhàng nhưng đầy cảm xúc. Mình nghĩ ai từng trải qua tuổi thơ giản dị đều sẽ tìm thấy bản thân trong đó...",
  },
  {
    id: 2,
    title: "Thảo luận: Nên đọc ebook hay sách giấy?",
    author: "Lê Văn Huy",
    tag: "Thảo luận học tập",
    excerpt:
      "Mỗi hình thức đều có ưu và nhược điểm riêng. Theo bạn, giữa sự tiện lợi và trải nghiệm thật, nên chọn bên nào?",
  },
  {
    id: 3,
    title: "Góc học tập: Cách ghi chú hiệu quả khi đọc sách chuyên ngành",
    author: "Trần Kính Hoàng",
    tag: "Kinh nghiệm học tập",
    excerpt:
      "Thay vì highlight tràn lan, mình chuyển sang hệ thống hoá bằng sơ đồ tư duy. Kết quả ghi nhớ tăng rõ rệt!",
  },
];

export default function CommunitySection(): React.ReactElement {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor:
          theme.palette.mode === "light"
            ? "rgba(99,102,241,0.02)"
            : "rgba(129,140,248,0.05)",
        py: { xs: 6, md: 10 },
        width: "100%",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Tiêu đề */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.2}
          mb={1}
        >
          <ForumOutlinedIcon color="primary" />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: theme.palette.text.primary }}
          >
            Góc cộng đồng sinh viên
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={6}
        >
          Một vài chia sẻ nổi bật từ diễn đàn của Thư viện HBH.
        </Typography>

        {/* danh sách bài viết */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
        >
          {mockPosts.map((post, index) => (
            <Card
              key={post.id}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              sx={{
                flex: 1,
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
                      : "0 8px 20px rgba(129,140,248,0.25)",
                },
              }}
            >
              <Chip
                label={post.tag}
                size="small"
                color="primary"
                sx={{
                  mb: 1.2,
                  fontWeight: 500,
                  letterSpacing: 0.1,
                  borderRadius: 2,
                }}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  mb: 1,
                  color: theme.palette.text.primary,
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: "auto",
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "primary.main",
                    fontSize: 13,
                    color: "#fff",
                  }}
                >
                  {post.author.charAt(0)}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {post.author}
                </Typography>
              </Box>
            </Card>
          ))}
        </Stack>

        {/* button đi đến forum */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Box
            component={motion.div}
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              component="a"
              href="/forum"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                px: 3.5,
                py: 1.2,
                borderRadius: 2,
                border: `1.5px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "rgba(99,102,241,0.08)"
                      : "rgba(129,140,248,0.15)",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 4px 12px rgba(99,102,241,0.2)"
                      : "0 4px 12px rgba(129,140,248,0.25)",
                },
              }}
            >
              <ForumOutlinedIcon
                sx={{ fontSize: 20, color: theme.palette.primary.main }}
              />
              <span>Truy cập diễn đàn sinh viên</span>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
