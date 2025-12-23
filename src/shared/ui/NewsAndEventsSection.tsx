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
import { useLatestNews } from "../../features/news/hooks/useNewsQuery";
import { useLatestEvents } from "../../features/events/hooks/useEventsQuery";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const MotionBox = motion.create(Box);

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

function NewsAndEventsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });
  const eventClass = useEventTheme();

  const { data: newsData } = useLatestNews(3);
  const { data: eventsData } = useLatestEvents(3);

  const news = newsData || [];
  const events = eventsData || [];

  React.useEffect(() => {
    if (!isMobile && inView) controls.start("visible");
  }, [inView, isMobile, controls]);

  const renderCard = (
    item: { title: string; date: string; desc: string; slug?: string },
    color: "primary" | "secondary",
    index?: number
  ) => {
    const CardContentBox = (
      <Card
        key={item.title}
        component={RouterLink}
        to={color === "primary" ? `/news/${item.slug}` : `/events/${item.slug}`}
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
          textDecoration: "none",
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
                {news.map((newsItem) => (
                  <SwiperSlide key={newsItem.id} style={{ display: "flex" }}>
                    {renderCard(
                      {
                        title: newsItem.title,
                        date: format(
                          new Date(newsItem.published_at),
                          "dd/MM/yyyy",
                          { locale: vi }
                        ),
                        desc: newsItem.content
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 150),
                        slug: newsItem.slug,
                      },
                      "primary"
                    )}
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
                {events.map((event) => (
                  <SwiperSlide key={event.id} style={{ display: "flex" }}>
                    {renderCard(
                      {
                        title: event.title,
                        date: format(new Date(event.start_time), "dd/MM/yyyy", {
                          locale: vi,
                        }),
                        desc: event.description || "",
                        slug: event.slug,
                      },
                      "secondary"
                    )}
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
                {news.map((newsItem, i) =>
                  renderCard(
                    {
                      title: newsItem.title,
                      date: format(
                        new Date(newsItem.published_at),
                        "dd/MM/yyyy",
                        { locale: vi }
                      ),
                      desc: newsItem.content
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 150),
                      slug: newsItem.slug,
                    },
                    "primary",
                    i
                  )
                )}
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
                {events.map((event, i) =>
                  renderCard(
                    {
                      title: event.title,
                      date: format(new Date(event.start_time), "dd/MM/yyyy", {
                        locale: vi,
                      }),
                      desc: event.description || "",
                      slug: event.slug,
                    },
                    "secondary",
                    i + news.length
                  )
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
