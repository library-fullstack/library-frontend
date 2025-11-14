import * as React from "react";
import { Box, Container, Typography, Button, Skeleton } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import { useBanner } from "../../context/useBannerContext";
import EventFallingElements from "../../shared/components/EventFallingElements";
import "../../styles/eventTheme.css";

export default function HeroBanner(): React.ReactElement | null {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const { bannerConfig, eventClass, isLoading } = useBanner();
  const [canRender, setCanRender] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCanRender(true);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading && !canRender) {
    return null;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 10 },
          minHeight: { xs: "auto", md: "100vh" },
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
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
            <Box
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", md: 520 },
                mb: { xs: 6, md: 0 },
                width: "100%",
              }}
            >
              <Skeleton width="100%" height={60} sx={{ mb: 2 }} />
              <Skeleton width="100%" height={100} sx={{ mb: 3 }} />
              <Skeleton width={150} height={44} sx={{ mb: 4 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} width={10} height={10} variant="circular" />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

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
                  color: `${bannerConfig.titleColor} !important`,
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
                  color: `${bannerConfig.subtitleColor} !important`,
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
          </Box>
        </Container>
      </Box>
    </>
  );
}
