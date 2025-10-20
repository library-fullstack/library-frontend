import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Rating,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/books.api";
import type { Book } from "../api/books.api";

const FeaturedBooks: React.FC = () => {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      try {
        const res = await getAllBooks({ limit: 10 });
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Không thể tải danh sách sách nổi bật.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải sách nổi bật...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ py: 8, textAlign: "center", color: "error.main" }}>
        <Typography>{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ py: 6, bgcolor: "white" }}>
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {/* làm mờ sách*/}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: { xs: 80, sm: 110, md: 140 },
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
            background:
              "linear-gradient(to right, rgba(255,255,255,0), #fff 85%)",
          }}
        />

        {/* title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 60, height: 2, bgcolor: "#FF6B6B" }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#333", letterSpacing: "1px" }}
            >
              SÁCH NỔI BẬT
            </Typography>
            <Box sx={{ width: 60, height: 2, bgcolor: "#FF6B6B" }} />
          </Box>
        </Box>

        {/* danh sách trượt */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={4.2}
          style={{
            paddingBottom: "40px",
            overflow: "hidden",
            paddingRight: 16,
          }}
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <Card
                onClick={() => navigate(`/books/${book.id}`)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* ảnh thumbnail của sách */}
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    bgcolor: "#f9f9f9",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
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
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/280x370/eeeeee/777777?text=No+Cover";
                    }}
                    sx={{
                      width: "90%",
                      height: "90%",
                      objectFit: "contain",
                      borderRadius: "4px",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  />
                </Box>

                {/* thông tin sách */}
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      mb: 0.5,
                      minHeight: 40,
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
                    sx={{
                      color: "#666",
                      fontSize: "0.85rem",
                      mb: 1,
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {book.author || "Chưa rõ tác giả"}
                  </Typography>
                  <Rating value={4} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#888",
                      fontSize: "0.8rem",
                      mb: 2,
                      minHeight: 40,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.description || "Không có mô tả."}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      backgroundColor: "#393280",
                      textTransform: "none",
                      fontSize: "0.85rem",
                      py: 1,
                      "&:hover": { backgroundColor: "#2e276a" },
                    }}
                  >
                    {/* tên này dài quá nhỉ ?, để đây để xem xét */}
                    THÊM VÀO GIỎ MƯỢN
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
};

export default FeaturedBooks;
