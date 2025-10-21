import * as React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useThemeMode } from "../../hooks/useThemeMode";
import { motion } from "framer-motion";

export default function HeroBanner(): React.ReactElement {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const { mode } = useThemeMode();

  // giả định sách
  const books = [
    { src: "/assets/book-2020-war.png", alt: "2020 World of War" },
    { src: "/assets/book-gothic.png", alt: "War in the Gothic Line" },
    { src: "/assets/book-time-traveler.png", alt: "Time Traveler" },
    { src: "/assets/book-doctor-who.png", alt: "Doctor Who" },
    { src: "/assets/book-siloed.png", alt: "Siloed" },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor: mode === "light" ? "#FAFAFA" : "background.default",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ flex: 1, maxWidth: 550 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.25rem", md: "3.5rem" },
                fontWeight: 800,
                color: mode === "light" ? "text.primary" : "text.primary",
                mb: 2,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Khám phá thế giới tri thức
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "text.secondary",
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              Hàng nghìn đầu sách chất lượng, cập nhật liên tục. Đọc online,
              mượn offline - trải nghiệm thư viện hiện đại ngay hôm nay.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 5 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  px: 3,
                  py: 1.25,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Khám phá ngay
              </Button>
              <Button
                variant="outlined"
                sx={{
                  px: 3,
                  py: 1.25,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderWidth: 1.5,
                  "&:hover": {
                    borderWidth: 1.5,
                    bgcolor:
                      mode === "light"
                        ? "rgba(99,102,241,0.04)"
                        : "rgba(129,140,248,0.08)",
                  },
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  sx={{
                    width: activeSlide === index ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor:
                      activeSlide === index
                        ? "primary.main"
                        : mode === "light"
                        ? "#E2E8F0"
                        : "#334155",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor:
                        activeSlide === index
                          ? "primary.main"
                          : mode === "light"
                          ? "#CBD5E1"
                          : "#475569",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 450,
            }}
          >
            {books.map((book, index) => (
              <Box
                key={index}
                component={motion.img}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                src={book.src}
                alt={book.alt}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = `https://via.placeholder.com/180x260/667eea/white?text=Book+${
                    index + 1
                  }`;
                }}
                sx={{
                  position: "absolute",
                  width: 180,
                  height: 260,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  transform: `translateX(${(index - 2) * 40}px) translateY(${
                    Math.abs(index - 2) * 10
                  }px) rotate(${(index - 2) * 3}deg)`,
                  zIndex: 5 - Math.abs(index - 2),
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: `translateX(${(index - 2) * 40}px) translateY(${
                      Math.abs(index - 2) * 10 - 12
                    }px) rotate(${(index - 2) * 3}deg) scale(1.06)`,
                    boxShadow: "0 20px 48px rgba(99,102,241,0.3)",
                    zIndex: 10,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
