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
import { getAllBooks } from "../api/books.api";
import type { Book } from "../api/books.api";
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
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={5}>
            Sách nổi bật
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rectangular" width="100%" height={320} />
                <CardContent>
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={18} width="60%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    );

  return (
    <Box sx={{ py: 8, bgcolor: "background.paper", position: "relative" }}>
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          "&:hover .nav-btn": { opacity: 1 },
          ".nav-btn": { opacity: 0, transition: "opacity 0.3s ease" },
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
          Sách nổi bật
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={5}
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
            left: { xs: 4, sm: -20 },
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
            right: { xs: 4, sm: -20 },
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
          slidesPerView={4}
          observer
          observeParents
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 12 },
            640: { slidesPerView: 2.2, spaceBetween: 16 },
            900: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 4.2, spaceBetween: 24 },
          }}
          style={{ paddingBottom: 50 }}
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <Card
                component={motion.div}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                sx={{
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.1)" },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "3/4",
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

                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      mb: 0.5,
                      lineHeight: 1.4,
                      minHeight: 48,
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
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {book.author || "Chưa rõ tác giả"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating value={4} readOnly size="small" precision={0.5} />
                    <Typography
                      variant="caption"
                      sx={{ ml: 0.5 }}
                      color="text.secondary"
                    >
                      (4.0)
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<InfoOutlined />}
                      onClick={() => navigate(`/books/${book.id}`)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
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
            width: { xs: 80, md: 160 },
            height: "100%",
            background: (theme) =>
              `linear-gradient(to right, transparent 0%, ${theme.palette.background.paper} 100%)`,
            pointerEvents: "none",
            zIndex: 10,
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
