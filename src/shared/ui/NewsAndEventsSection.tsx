import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link as RouterLink } from "react-router-dom";
import { useEventTheme } from "../hooks/useEventTheme";
import "../../styles/eventTheme.css";

const MotionBox = motion.create(Box);

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

// cần gọi api lấy tin tức
// TODO
// TODO
// TODO
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

// cần gọi api lấy sự kiện
// TODO
// TODO
// TODO
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

function NewsAndEventsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });
  const eventClass = useEventTheme();

  React.useEffect(() => {
    if (!isMobile && inView) controls.start("visible");
  }, [inView, isMobile, controls]);

  const renderCard = (
    item: { title: string; date: string; desc: string },
    color: "primary" | "secondary",
    index?: number
  ) => {
    const CardContentBox = (
      <Card
        key={item.title}
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
          <Typography
            variant="caption"
            color={`${color}.main`}
            fontWeight={600}
            sx={{ mb: 0.5, display: "block" }}
          >
            {item.date}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              mb: 0.5,
              color: theme.palette.text.primary,
              lineHeight: 1.5,
              minHeight: "3em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.title}
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
              minHeight: 56,
            }}
          >
            {item.desc}
          </Typography>
        </Box>
      </Card>
    );

    if (isMobile) return CardContentBox;

    return (
      <MotionBox
        key={item.title}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={controls}
      >
        {CardContentBox}
      </MotionBox>
    );
  };

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={isMobile ? false : "hidden"}
      className={`event-banner ${eventClass}`}
      animate={isMobile ? undefined : controls}
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={1}
          color="text.primary"
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

        {isMobile ? (
          <Stack spacing={6}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <ArticleOutlinedIcon color="primary" />
                <Typography fontWeight={600}>Tin tức mới</Typography>
              </Stack>

              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={
                  isMobile
                    ? {
                        delay: 4000,
                        disableOnInteraction: false,
                      }
                    : false
                }
              >
                {mockNews.map((news) => (
                  <SwiperSlide key={news.title} style={{ display: "flex" }}>
                    {renderCard(news, "primary")}
                  </SwiperSlide>
                ))}
              </Swiper>

              <Button
                component={RouterLink}
                to="/news"
                variant="contained"
                color="primary"
                sx={{
                  mt: 0,
                  mb: 0.5,
                  display: "block",
                  mx: "auto",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  textAlign: "center",
                }}
              >
                Xem tất cả tin tức
              </Button>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <EventOutlinedIcon color="secondary" />
                <Typography fontWeight={600}>Sự kiện sắp tới</Typography>
              </Stack>

              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={
                  isMobile
                    ? {
                        delay: 4000,
                        disableOnInteraction: false,
                      }
                    : false
                }
              >
                {mockEvents.map((event) => (
                  <SwiperSlide key={event.title} style={{ display: "flex" }}>
                    {renderCard(event, "secondary")}
                  </SwiperSlide>
                ))}
              </Swiper>

              <Button
                component={RouterLink}
                to="/events"
                variant="contained"
                color="primary"
                sx={{
                  mt: 0,
                  mb: 0.5,
                  display: "block",
                  mx: "auto",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  textAlign: "center",
                }}
              >
                Xem tất cả sự kiện
              </Button>
            </Box>
          </Stack>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <ArticleOutlinedIcon color="primary" />
                <Typography fontWeight={600}>Tin tức mới</Typography>
              </Stack>
              <Stack spacing={3}>
                {mockNews.map((news, i) => renderCard(news, "primary", i))}
              </Stack>
              <Button
                component={RouterLink}
                to="/news"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  display: "block",
                  mx: "auto",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Xem tất cả tin tức
              </Button>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <EventOutlinedIcon color="secondary" />
                <Typography fontWeight={600}>Sự kiện sắp tới</Typography>
              </Stack>
              <Stack spacing={3}>
                {mockEvents.map((event, i) =>
                  renderCard(event, "secondary", i + mockNews.length)
                )}
              </Stack>
              <Button
                component={RouterLink}
                to="/events"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  display: "block",
                  mx: "auto",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Xem tất cả sự kiện
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default NewsAndEventsSection;
