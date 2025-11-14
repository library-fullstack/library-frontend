import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Skeleton,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, useNavigationType } from "react-router-dom";
import type { Book } from "../../features/books/types";
import { motion } from "framer-motion";
import { useEventTheme } from "../../shared/hooks/useEventTheme";
import EventFallingElements from "../../shared/components/EventFallingElements";
import "../../styles/eventTheme.css";
import { useBooks } from "@/features/books/hooks/useBooks";

const MotionCard = motion.create(Card);

const FeaturedBooks: React.FC = () => {
  const {
    data: booksData,
    isLoading: loading,
    error: queryError,
  } = useBooks({
    limit: 10,
    sort_by: "popular",
  });

  const books = booksData || [];
  const error = queryError ? "Không thể tải danh sách sách nổi bật." : null;

  const theme = useTheme();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isMobile = useMediaQuery("(max-width:900px)");
  const eventClass = useEventTheme();

  const isBackNavigation = navigationType === "POP";

  const prevRef = React.useRef<HTMLButtonElement | null>(null);
  const nextRef = React.useRef<HTMLButtonElement | null>(null);

  const handleSwiperInit = React.useCallback((swiper: SwiperType) => {
    if (typeof swiper.params.navigation !== "boolean") {
      const nav = swiper.params.navigation;
      if (nav && prevRef.current && nextRef.current) {
        nav.prevEl = prevRef.current;
        nav.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, []);
  const SkeletonCard = () => (
    <Card
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={320}
        sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      />
      <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, flex: 1 }}>
        <Skeleton height={24} width="80%" sx={{ mb: 0.5 }} />
        <Skeleton height={16} width="60%" sx={{ mb: 1 }} />
        <Skeleton height={32} width="100%" sx={{ mb: 0.75 }} />
        <Skeleton height={36} width="100%" sx={{ mb: 0.5 }} />
        <Skeleton height={36} width="100%" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: "background.default", position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
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

          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflow: "hidden",
              pb: 2,
            }}
          >
            {[...Array(isMobile ? 1 : 8)].map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: isMobile ? "0 0 100%" : "0 0 calc(25% - 18px)",
                  minWidth: 0,
                }}
              >
                <SkeletonCard />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8, bgcolor: "background.default", position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
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

          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflow: "hidden",
              pb: 2,
            }}
          >
            {[...Array(4)].map((_, idx) => (
              <Box key={idx} sx={{ flex: "0 0 calc(25% - 18px)", minWidth: 0 }}>
                <SkeletonCard />
              </Box>
            ))}
          </Box>

          <Typography
            variant="body2"
            color="error"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            {error}
          </Typography>
        </Container>
      </Box>
    );
  }

  // swiper
  const CardItem = (book: Book) => {
    const handleCardClick = () => {
      navigate(`/books/${book.id}`);
    };

    const cardBase = (
      <Card
        onClick={handleCardClick}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "none",
          cursor: "pointer",
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

          <Box sx={{ pt: { xs: 0.5, sm: 0.75 }, mt: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                py: { xs: 0.5, sm: 0.75 },
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor:
                    !book.available_count || book.available_count === 0
                      ? "#EF4444"
                      : book.available_count <= 3
                      ? "#F59E0B"
                      : "#10B981",
                  flexShrink: 0,
                  transform: "translateY(0.5px)",
                  mb: 0.3,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    !book.available_count || book.available_count === 0
                      ? "#EF4444"
                      : book.available_count <= 3
                      ? "#F59E0B"
                      : "#10B981",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  lineHeight: 1,
                }}
              >
                {!book.available_count || book.available_count === 0
                  ? "Hết sách"
                  : book.available_count <= 3
                  ? `Sắp hết - Còn ${book.available_count} cuốn`
                  : `Còn ${book.available_count} cuốn`}
              </Typography>
            </Box>
          </Box>
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
        onClick={handleCardClick}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          pointerEvents: "auto",
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

          {/* nút điều hướng */}
          <IconButton
            ref={prevRef}
            className="nav-btn"
            aria-label="Sách trước"
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
            aria-label="Sách tiếp theo"
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

          {/* swiper */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={handleSwiperInit}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                const nav = swiper.params.navigation;
                if (nav) {
                  nav.prevEl = prevRef.current;
                  nav.nextEl = nextRef.current;
                }
              }
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
              640: { slidesPerView: 2, spaceBetween: 16 },
              900: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 20 },
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
