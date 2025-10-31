import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Link as RouterLink, useNavigationType } from "react-router-dom";
import { Pagination, Autoplay } from "swiper/modules";

// cần gọi api lấy post ra
// TODO
// TODO
// TODO
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigationType = useNavigationType();
  const shouldAnimate = !isMobile && navigationType !== "POP";

  const MobileContent = (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.2,
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: (t) => t.palette.text.primary }}
        >
          Góc cộng đồng sinh viên
        </Typography>
      </Box>

      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        mb={6}
      >
        Một vài chia sẻ nổi bật từ diễn đàn của Thư viện HBH.
      </Typography>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          600: { slidesPerView: 1.2 },
          900: { slidesPerView: 2 },
        }}
        autoplay={
          isMobile
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        touchStartPreventDefault={false}
        touchReleaseOnEdges
        resistanceRatio={0.5}
        observer
        observeParents
        speed={500}
      >
        {mockPosts.map((post) => (
          <SwiperSlide key={post.id} style={{ display: "flex" }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: { xs: 2.5, sm: 3 },
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                transition: isMobile ? "none" : "all 0.25s ease",
                "&:hover": !isMobile
                  ? {
                      transform: "translateY(-4px)",
                      boxShadow: (t) => t.shadows[4],
                      transition: "0.3s ease",
                    }
                  : {},
              }}
            >
              <Box>
                <Chip
                  label={post.tag}
                  size="small"
                  color="primary"
                  sx={{ mb: 1.2, fontWeight: 500, borderRadius: 2 }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    mb: 0.5,
                    color: theme.palette.text.primary,
                    lineHeight: 1.5,
                    minHeight: "3em", // giữ chỗ đủ cho 2 dòng
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    pt: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 56, // luôn chiếm đủ chỗ để các card đều
                  }}
                >
                  {post.excerpt}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: (t) => t.palette.primary.main,
                    fontSize: 13,
                    color: (t) => t.palette.primary.contrastText,
                    flexShrink: 0,
                  }}
                >
                  {post.author.charAt(0)}
                </Avatar>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {post.author}
                </Typography>
              </Box>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          component={RouterLink}
          to="/forum"
          variant="contained"
          color="primary"
          sx={{
            mt: 0,
            mb: 0.5,
            display: "block",
            mx: "auto",
            px: 5,
            py: 1.3,
            minWidth: "100%",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
            textAlign: "center",
            "&:hover": { filter: "brightness(0.98)" },
          }}
        >
          Đến diễn đàn ngay
        </Button>
      </Box>

      <style>
        {`
          .swiper-pagination {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 25px;
            margin-bottom: 10px;
          }
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px !important;
            background: ${theme.palette.action.disabled};
            opacity: 1;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            width: 20px;
            border-radius: 8px;
            background: ${theme.palette.primary.main};
          }
        `}
      </style>
    </Container>
  );

  const DesktopContent = (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1.2}
        mb={1}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: (t) => t.palette.text.primary }}
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

      <Stack direction="row" spacing={4}>
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
              p: 3,
              borderRadius: 2,
              bgcolor: (t) => t.palette.background.paper,
              border: (t) => `1px solid ${t.palette.divider}`,
              boxShadow: (t) => t.shadows[1],
              overflow: "hidden",
              "&:hover": !isMobile
                ? {
                    transform: "translateY(-4px)",
                    boxShadow: (t) => t.shadows[4],
                    transition: "0.3s ease",
                  }
                : {},
            }}
          >
            <Chip
              label={post.tag}
              size="small"
              color="primary"
              sx={{ mb: 1.2, fontWeight: 500, borderRadius: 2 }}
            />
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mb: 1,
                color: (t) => t.palette.text.primary,
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
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: (t) => t.palette.primary.main,
                  fontSize: 13,
                  color: (t) => t.palette.primary.contrastText,
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Box
          component={motion.div}
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            component={RouterLink}
            to="/forum"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              border: (t) => `1.5px solid ${t.palette.primary.main}`,
              color: (t) => t.palette.primary.main,
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: (t) => t.palette.action.hover,
                boxShadow: (t) => t.shadows[2],
              },
            }}
          >
            <span>Truy cập diễn đàn sinh viên</span>
          </Box>
        </Box>
      </Box>
    </Container>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          bgcolor: (t) => t.palette.background.default,
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 6 },
        }}
      >
        {MobileContent}
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor: (t) => t.palette.background.default,
        py: { xs: 6, md: 10 },
        mb: { xs: 4, md: 6 },
      }}
    >
      {DesktopContent}
    </Box>
  );
}
