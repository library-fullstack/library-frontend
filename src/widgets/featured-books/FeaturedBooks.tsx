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
  useMediaQuery,
} from "@mui/material";
import { InfoOutlined, ArrowBack, ArrowForward } from "@mui/icons-material";
import { ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, useNavigationType } from "react-router-dom";
import { booksApi } from "../../features/books/api";
import type { Book } from "../../features/books/types";
import { motion } from "framer-motion";
import { useEventTheme } from "../../shared/hooks/useEventTheme";
import EventFallingElements from "../../shared/components/EventFallingElements";
import "../../styles/eventTheme.css";

const MotionCard = motion.create(Card);

const FeaturedBooks: React.FC = () => {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isMobile = useMediaQuery("(max-width:900px)");
  const eventClass = useEventTheme();

  const isBackNavigation = navigationType === "POP";

  const prevRef = React.useRef<HTMLButtonElement | null>(null);
  const nextRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const fetchBooks = async () => {
      try {
        const list = await booksApi.getAllBooks({
          limit: 10,
          sort_by: "popular",
        });
        if (isMounted) setBooks(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Lỗi tải sách:", err);
        if (isMounted) setError("Không thể tải danh sách sách nổi bật.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || error)
    return (
      <Box sx={{ py: 8, bgcolor: "background.default" }}>
        <Container
          maxWidth="lg"
          sx={{
            transform: { xs: "scale(0.9)", md: "scale(1)" },
            transformOrigin: "top center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={5}
            color="text.primary"
          >
            Sách nổi bật
          </Typography>

          {isMobile ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 2,
              }}
            >
              <Card>
                <Skeleton variant="rectangular" width="100%" height={320} />
                <CardContent>
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={18} width="60%" />
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Đang tải dữ liệu...
            </Typography>
          )}
        </Container>
      </Box>
    );

  // swiper
  const CardItem = (book: Book) => {
    const cardBase = (
      <Card
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "none",
          "&:hover": isMobile
            ? {}
            : { boxShadow: "0 8px 20px rgba(0,0,0,0.1)" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "3/4.5", sm: "3/4" },
            overflow: "hidden",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box
            component="img"
            src={
              book.thumbnail_url
                ? book.thumbnail_url
                : "https://via.placeholder.com/240x330"
            }
            alt={book.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "scale(0.92)",
              borderRadius: 1.5,
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
            {book.author_names || "Chưa rõ tác giả"}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, sm: 2 } }}
          >
            <Rating value={4} readOnly size="small" precision={0.5} />
            <Typography
              variant="caption"
              sx={{ ml: 0.5, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
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
              startIcon={<ShoppingBag />}
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
    );

    return isMobile || isBackNavigation ? (
      cardBase
    ) : (
      <MotionCard
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
        {cardBase.props.children}
      </MotionCard>
    );
  };

  return (
    <>
      <EventFallingElements eventType={eventClass.replace("event-", "")} />
      <Box
        className={`event-banner ${eventClass}`}
        sx={{
          py: 8,
          bgcolor: "background.default",
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
            color="text.primary"
          >
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

          {/* Nút điều hướng */}
          <IconButton
            ref={prevRef}
            className="nav-btn"
            sx={{
              position: "absolute",
              top: "50%",
              display: { xs: "none", sm: "flex" },
              transform: "translateY(-50%)",
              left: { xs: 4, sm: -40 },
              zIndex: 15,
              width: 46,
              height: 46,
              borderRadius: "50%",
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.text.primary,
              backdropFilter: "blur(8px)",
              boxShadow: theme.shadows[2],
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>

          <IconButton
            ref={nextRef}
            className="nav-btn"
            sx={{
              position: "absolute",
              top: "50%",
              display: { xs: "none", sm: "flex" },
              transform: "translateY(-50%)",
              right: { xs: 4, sm: -40 },
              zIndex: 15,
              width: 46,
              height: 46,
              borderRadius: "50%",
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.text.primary,
              backdropFilter: "blur(8px)",
              boxShadow: theme.shadows[2],
            }}
          >
            <ArrowForward fontSize="small" />
          </IconButton>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                const nav = swiper.params.navigation;
                if (nav) {
                  nav.prevEl = prevRef.current;
                  nav.nextEl = nextRef.current;
                }
              }
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: isMobile ? 6000 : 4000,
              disableOnInteraction: false,
            }}
            spaceBetween={24}
            slidesPerView={4.5}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 12 },
              640: { slidesPerView: 2.2, spaceBetween: 16 },
              900: { slidesPerView: 3.3, spaceBetween: 20 },
              1280: { slidesPerView: 4.5, spaceBetween: 24 },
            }}
            style={{ paddingBottom: 50 }}
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>{CardItem(book)}</SwiperSlide>
            ))}
          </Swiper>

          {/* làm mờ card cuối */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: { xs: 0, sm: 80, md: 160 },
              height: "100%",
              background: (theme) =>
                `linear-gradient(to right, transparent 0%, ${theme.palette.background.default} 100%)`,
              pointerEvents: "none",
              zIndex: 10,
              display: { xs: "none", sm: "block" },
            }}
          />

          {/* Pagination custom */}
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
            background: ${theme.palette.action.disabled};
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
    </>
  );
};

export default FeaturedBooks;
