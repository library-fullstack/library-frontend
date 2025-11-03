import * as React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import {
  getActiveBannerConfig,
  defaultBannerConfig,
  BannerConfig,
} from "../../app/config/bannerConfig";
import EventFallingElements from "../../shared/components/EventFallingElements";
import "../../styles/eventTheme.css";

export default function HeroBanner(): React.ReactElement {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [bannerConfig, setBannerConfig] =
    React.useState<BannerConfig>(defaultBannerConfig);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadBanner = async () => {
      try {
        const config = await getActiveBannerConfig();
        setBannerConfig(config);
      } catch (error) {
        console.error("Failed to load banner config:", error);
        setBannerConfig(defaultBannerConfig);
      } finally {
        setIsLoading(false);
      }
    };

    // Load banner immediately
    loadBanner();

    // Listen for banner updates via BroadcastChannel
    const bc = new BroadcastChannel("banner-sync");
    bc.onmessage = (event) => {
      if (event.data === "REFRESH_BANNER") {
        console.log("[HeroBanner] Received REFRESH_BANNER broadcast");
        loadBanner();
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  const books = [
    { src: "/assets/img/book-2020-war.webp", alt: "2020 World of War" },
    { src: "/assets/img/book-gothic.webp", alt: "War in the Gothic Line" },
    { src: "/assets/img/book-time-traveler.webp", alt: "Time Traveler" },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          minHeight: { xs: "auto", md: "100vh" },
        }}
      />
    );
  }

  const eventClass = bannerConfig.eventType
    ? `event-${bannerConfig.eventType.toLowerCase()}`
    : "";

  return (
    <>
      <EventFallingElements eventType={bannerConfig.eventType} />
      <Box
        className={`event-banner ${eventClass}`}
        sx={{
          position: "relative",
          backgroundImage: `url(${bannerConfig.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          py: { xs: 8, md: 10 },
          minHeight: { xs: "auto", md: "100vh" },
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
          backgroundAttachment: { xs: "scroll", md: "scroll" },
          willChange: "auto",
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
                className="banner-title"
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

            {/* sách minh họa - ẩn */}
            <Box
              sx={{
                flex: 1,
                display: "none",
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
                      transform: `translateX(${
                        (index - 1) * 60
                      }px) translateY(${
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
    </>
  );
}
