import * as React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

export default function HeroBanner(): React.ReactElement {
  const [activeSlide, setActiveSlide] = React.useState(0);

  const books = [
    { src: "/assets/book-2020-war.png", alt: "2020 World of War" },
    { src: "/assets/book-gothic.png", alt: "War in the Gothic Line" },
    { src: "/assets/book-time-traveler.png", alt: "Time Traveler" },
    { src: "/assets/book-doctor-who.png", alt: "Doctor Who" },
    { src: "/assets/book-siloed.png", alt: "Siloed" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#FFF5F7",
        py: 6,
        minHeight: 400,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* nội dung bên trái */}
          <Box sx={{ flex: 1, maxWidth: 500 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                color: "#393280",
                mb: 2,
              }}
            >
              Xin chào các bạn
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#666",
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Cùng chào mừng sự kiện khai trương thư viện trực tuyến HBH...
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                borderColor: "#393280",
                color: "#393280",
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "0.95rem",
                "&:hover": {
                  borderColor: "#2e276a",
                  backgroundColor: "rgba(57, 50, 128, 0.04)",
                },
              }}
            >
              Xem thêm
            </Button>

            {/* điều hướng bằng chấm tròn */}
            <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: activeSlide === index ? "#FF6B6B" : "#DDD",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#FF6B6B",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* sách */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 400,
            }}
          >
            {books.map((book, index) => (
              <Box
                key={index}
                component="img"
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
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transform: `translateX(${(index - 2) * 40}px) translateY(${
                    Math.abs(index - 2) * 10
                  }px) rotate(${(index - 2) * 3}deg)`,
                  zIndex: 5 - Math.abs(index - 2),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: `translateX(${(index - 2) * 40}px) translateY(${
                      Math.abs(index - 2) * 10 - 10
                    }px) rotate(${(index - 2) * 3}deg) scale(1.05)`,
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
