import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Rating,
  Skeleton,
  Stack,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  InfoOutlined,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../features/books/api/books.api";
import type { Book } from "../../features/books/api/books.api";
import { motion } from "framer-motion";

const FeaturedBooks: React.FC = () => {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      try {
        const res = await getAllBooks({ limit: 10 });
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Không thể tải danh sách sách nổi bật.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || error)
    return (
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={5}
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "#000000 !important"
                  : "#FFFFFF !important",
              opacity: "1 !important",
              animation: "none !important",
              WebkitAnimation: "none !important",
              transition: "none !important",
              WebkitTransition: "none !important",
              willChange: "auto !important",
            }}
            style={{
              color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
              transition: "none",
              animation: "none",
            }}
          >
            Sách nổi bật
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Card sx={{ display: { xs: "block", sm: "block" } }}>
              <Skeleton variant="rectangular" width="100%" height={320} />
              <CardContent>
                <Skeleton height={24} width="80%" />
                <Skeleton height={18} width="60%" />
              </CardContent>
            </Card>
            <Card sx={{ display: { xs: "none", sm: "block" } }}>
              <Skeleton variant="rectangular" width="100%" height={320} />
              <CardContent>
                <Skeleton height={24} width="80%" />
                <Skeleton height={18} width="60%" />
              </CardContent>
            </Card>
            <Card sx={{ display: { xs: "none", md: "block" } }}>
              <Skeleton variant="rectangular" width="100%" height={320} />
              <CardContent>
                <Skeleton height={24} width="80%" />
                <Skeleton height={18} width="60%" />
              </CardContent>
            </Card>
            <Card sx={{ display: { xs: "none", md: "block" } }}>
              <Skeleton variant="rectangular" width="100%" height={320} />
              <CardContent>
                <Skeleton height={24} width="80%" />
                <Skeleton height={18} width="60%" />
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    );

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: "background.paper",
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          px: { xs: 2, sm: 3 },
          "&:hover .nav-btn": { opacity: 1 },
          ".nav-btn": { opacity: 0, transition: "opacity 0.3s ease" },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={1}
          sx={{
            color: (theme) =>
              theme.palette.mode === "light"
                ? "#000000 !important"
                : "#FFFFFF !important",
            opacity: "1 !important",
            animation: "none !important",
            WebkitAnimation: "none !important",
            transition: "none !important",
            WebkitTransition: "none !important",
            willChange: "auto !important",
          }}
          style={{
            color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
            transition: "none",
            animation: "none",
          }}
        >
          Sách nổi bật
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={5}
          sx={{
            opacity: "1 !important",
            animation: "none !important",
            WebkitAnimation: "none !important",
            transition: "none !important",
          }}
        >
          Khám phá những đầu sách được yêu thích nhất
        </Typography>

        {/* nút sang trái */}
        <IconButton
          className="prev-btn nav-btn"
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: { xs: 4, sm: -40 },
            zIndex: 15,
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(255, 255, 255, 0.1)",
            color:
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 0 20px rgba(99,102,241,0.2)"
                : "0 0 20px rgba(255,255,255,0.15)",
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(99,102,241,0.15)"
                  : "rgba(255,255,255,0.15)",
              color: theme.palette.primary.main,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 0 25px rgba(99,102,241,0.35)"
                  : "0 0 25px rgba(255,255,255,0.3)",
              transform: "translateY(-50%) scale(1.08)",
              opacity: 1,
            },
          }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>

        {/* nút sang phải */}
        <IconButton
          className="next-btn nav-btn"
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: { xs: 4, sm: -40 },
            zIndex: 15,
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(255, 255, 255, 0.1)",
            color:
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 0 20px rgba(99,102,241,0.2)"
                : "0 0 20px rgba(255,255,255,0.15)",
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(99,102,241,0.15)"
                  : "rgba(255,255,255,0.15)",
              color: theme.palette.primary.main,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 0 25px rgba(99,102,241,0.35)"
                  : "0 0 25px rgba(255,255,255,0.3)",
              transform: "translateY(-50%) scale(1.08)",
              opacity: 1,
            },
          }}
        >
          <ArrowForward fontSize="small" />
        </IconButton>

        {/* danh sách trượt */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={4.5}
          observer
          observeParents
          centeredSlides={false}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 16,
              centeredSlides: false,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
              centeredSlides: false,
            },
            900: {
              slidesPerView: 3.3,
              spaceBetween: 20,
              centeredSlides: false,
            },
            1280: {
              slidesPerView: 4.5,
              spaceBetween: 24,
              centeredSlides: false,
            },
          }}
          style={{ paddingBottom: 50, paddingLeft: 0, paddingRight: 0 }}
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <Card
                component={motion.div}
                layout={false}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                sx={{
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  boxShadow: "none",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.1)" },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: { xs: "2.5/3.8", sm: "3/4" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor:
                      theme.palette.mode === "light" ? "#F1F5F9" : "#2A2B33",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      book.thumbnail_url
                        ? book.thumbnail_url.replace(
                            "/upload/",
                            "/upload/w_400,h_520,c_fill,q_auto,f_auto/"
                          )
                        : "https://via.placeholder.com/280x370/eeeeee/777777?text=No+Cover"
                    }
                    alt={book.title}
                    sx={{
                      width: "88%",
                      height: "88%",
                      objectFit: "contain",
                      borderRadius: 1,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      mb: 0.5,
                      lineHeight: 1.4,
                      minHeight: { xs: 40, sm: 48 },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {book.author || "Chưa rõ tác giả"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 1, sm: 2 },
                    }}
                  >
                    <Rating value={4} readOnly size="small" precision={0.5} />
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 0.5,
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                      color="text.secondary"
                    >
                      (4.0)
                    </Typography>
                  </Box>
                  <Stack spacing={{ xs: 0.75, sm: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<InfoOutlined />}
                      onClick={() => navigate(`/books/${book.id}`)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        py: { xs: 0.5, sm: 0.75 },
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        py: { xs: 0.5, sm: 0.75 },
                        boxShadow: "0 2px 6px rgba(99,102,241,0.25)",
                        "&:hover": { transform: "translateY(-1px)" },
                      }}
                    >
                      Thêm vào giỏ
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* làm mờ ở cuối  */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: { xs: 0, sm: 80, md: 160 },
            height: "100%",
            background: (theme) =>
              `linear-gradient(to right, transparent 0%, ${theme.palette.background.paper} 100%)`,
            pointerEvents: "none",
            zIndex: 10,
            display: { xs: "none", sm: "block" },
          }}
        />

        {/* nút chấm trang của book cart*/}
        <style>{`
          .swiper-pagination {
            position: relative;
            margin-top: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px !important;
            background: ${
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.25)"
                : "rgba(255,255,255,0.25)"
            };
            opacity: 1;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            width: 22px;
            border-radius: 8px;
            background: ${theme.palette.primary.main};
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default FeaturedBooks;
