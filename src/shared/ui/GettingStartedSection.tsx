import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const MotionBox = motion.create(Box);

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.94 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

// cái này thì không cần gọi API. cố định luôn
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

export default function GettingStartedSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

  React.useEffect(() => {
    if (!isMobile && inView) controls.start("visible");
  }, [inView, isMobile, controls]);

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={isMobile ? false : "hidden"}
      animate={isMobile ? undefined : controls}
      sx={{
        bgcolor:
          theme.palette.mode === "light"
            ? "#f9fafb"
            : theme.palette.background.default,
        py: { xs: 6, md: 10 },
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

        {isMobile ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={
              isMobile
                ? {
                    delay: 4000,
                    disableOnInteraction: false,
                  }
                : false
            }
          >
            {steps.map((step, idx) => (
              <SwiperSlide key={idx}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 2,
                    p: { xs: 2, sm: 2.5 },
                    bgcolor: (t) => t.palette.background.paper,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    boxShadow: (t) => t.shadows[1],
                    minHeight: 250,
                    "&:hover": !isMobile
                      ? {
                          transform: "translateY(-4px)",
                          boxShadow: (t) => t.shadows[4],
                          transition: "0.3s ease",
                        }
                      : {},
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexGrow: 1,
                      gap: 1.5,
                      py: { xs: 2.5, sm: 3 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        bgcolor:
                          theme.palette.mode === "light"
                            ? "rgba(79,70,229,0.08)"
                            : "rgba(129,140,248,0.15)",
                        color: theme.palette.primary.main,
                        mb: 0.8,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                        maxWidth: 220,
                      }}
                    >
                      {step.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ width: "100%" }}>
            {steps.map((step, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <MotionBox
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate={controls}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      borderRadius: 2,
                      p: { xs: 2.5, sm: 3 },
                      bgcolor: (t) => t.palette.background.paper,
                      border: (t) => `1px solid ${t.palette.divider}`,
                      boxShadow: (t) => t.shadows[1],
                      transition: "all 0.25s ease",
                      "&:hover": !isMobile
                        ? {
                            transform: "translateY(-4px)",
                            boxShadow: (t) => t.shadows[4],
                            transition: "0.3s ease",
                          }
                        : {},
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
                              ? "rgba(79,70,229,0.08)"
                              : "rgba(129,140,248,0.15)",
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
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
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
