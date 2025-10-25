import * as React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import { bannerConfig } from "../../app/config/bannerConfig";

export default function HeroBanner(): React.ReactElement {
  const [activeSlide, setActiveSlide] = React.useState(0);

  // giảm số lượng sách xuống 3 để tối ưu hiệu suất
  const books = [
    { src: "/assets/img/book-2020-war.png", alt: "2020 World of War" },
    { src: "/assets/img/book-gothic.png", alt: "War in the Gothic Line" },
    { src: "/assets/img/book-time-traveler.png", alt: "Time Traveler" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `url(${bannerConfig.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: { xs: 8, md: 10 },
        minHeight: { xs: "auto", md: "calc(100vh - 125px)" },
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        backgroundAttachment: { xs: "scroll", md: "scroll" },
        willChange: "auto",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            bannerConfig.overlay === "dark"
              ? "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))"
              : "linear-gradient(to right, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
          backdropFilter: "blur(2px)",
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 6, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 4, md: 6 },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* nội dung bên trái */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: 520 },
              mb: { xs: 6, md: 0 },
              width: "100%",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem", md: "3rem" },
                fontWeight: 700,
                color: bannerConfig.titleColor,
                mb: 2,
                lineHeight: 1.25,
                textShadow:
                  bannerConfig.overlay === "dark"
                    ? "0 3px 6px rgba(0,0,0,0.4)"
                    : "0 3px 6px rgba(255,255,255,0.3)",
              }}
            >
              {bannerConfig.title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                color: bannerConfig.subtitleColor,
                mb: 3,
                lineHeight: 1.6,
                textShadow:
                  bannerConfig.overlay === "dark"
                    ? "0 2px 4px rgba(0,0,0,0.3)"
                    : "0 2px 4px rgba(255,255,255,0.4)",
              }}
            >
              {bannerConfig.subtitle}
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: bannerConfig.buttonColor,
                color: "#fff",
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: { xs: "0.875rem", md: "0.95rem" },
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: `${bannerConfig.buttonColor}cc`,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                },
              }}
            >
              {bannerConfig.buttonText}
            </Button>

            {/* điều hướng bằng chấm tròn */}
            <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
              {[0, 1, 2].map((index) => (
                <Box
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      activeSlide === index
                        ? bannerConfig.buttonColor
                        : bannerConfig.overlay === "dark"
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: bannerConfig.buttonColor,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* sách minh họa */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 400,
              contain: "layout style paint",
            }}
          >
            {books.map((book, index) => (
              <Box
                key={index}
                component="img"
                src={book.src}
                alt={book.alt}
                loading="lazy"
                width="180"
                height="260"
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
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transform: `translateX(${(index - 1) * 60}px) translateY(${
                    Math.abs(index - 1) * 15
                  }px) rotate(${(index - 1) * 5}deg)`,
                  zIndex: 3 - Math.abs(index - 1),
                  transition: "transform 0.3s ease",
                  willChange: "transform",
                  "&:hover": {
                    transform: `translateX(${(index - 1) * 60}px) translateY(${
                      Math.abs(index - 1) * 15 - 10
                    }px) rotate(${(index - 1) * 5}deg) scale(1.05)`,
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
