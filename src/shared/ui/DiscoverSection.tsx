import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { booksApi } from "../../features/books/api";
import type { Book } from "../../features/books/types";
import { Link as RouterLink } from "react-router-dom";

const MotionBox = motion.create(Box);

export default function DiscoverSection(): React.ReactElement {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [displayBooks, setDisplayBooks] = React.useState<string[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const data = await booksApi.getAllBooks({
          limit: 40,
          sort_by: "popular",
        });
        if (!mounted) return;
        const list = (Array.isArray(data) ? data : []) as Book[];
        const thumbnails = list
          .map((b) => b.thumbnail_url)
          .filter(Boolean) as string[];
        const shuffled = thumbnails.sort(() => Math.random() - 0.5);
        const chosen =
          (shuffled.slice(0, 5).length
            ? shuffled.slice(0, 5)
            : thumbnails.slice(0, 5)) || [];
        setDisplayBooks(chosen);
      } catch {
        setDisplayBooks([]);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  const leftMotionProps = !downMd
    ? ({
        initial: { opacity: 0, x: -40 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      } as const)
    : {};

  const rightMotionProps = !downMd
    ? ({
        initial: { opacity: 0, x: 40 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      } as const)
    : {};

  return (
    <Box
      sx={{
        py: { xs: 4, md: 8 },
        bgcolor: "background.default",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0, sm: 3, md: 6 },
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* cột hình ảnh */}
          <MotionBox
            {...leftMotionProps}
            sx={{
              flex: "1 1 420px",
              minWidth: { xs: "100%", md: 260 },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 4, md: 5 },
                borderRadius: 2,
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(180deg, rgba(99,102,241,0.04), rgba(99,102,241,0.02))"
                    : "linear-gradient(180deg, rgba(129,140,248,0.08), rgba(129,140,248,0.04))",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                overflow: "visible",
                mx: { xs: "auto", md: 0 },
                maxWidth: { xs: "100%", sm: 500 },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: { xs: -12, sm: -16 },
                  bgcolor: "background.paper",
                  opacity: 0.6,
                  borderRadius: 2,
                  transform: "rotate(-1.5deg)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  zIndex: 1,
                }}
              />

              <Chip
                label="Bộ sưu tập"
                size="small"
                color="primary"
                sx={{
                  position: "absolute",
                  top: { xs: -14, sm: -18 },
                  left: { xs: 18, sm: 28 },
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                  zIndex: 3,
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                  minHeight: { xs: 280, sm: 340, md: 450 },
                  perspective: "1500px",
                }}
              >
                {displayBooks.map((src, idx) => {
                  const totalBooks = displayBooks.length;
                  const centerIndex = Math.floor(totalBooks / 2);
                  const offset = idx - centerIndex;
                  const rotateY = downSm ? offset * 8 : offset * 12;
                  const translateX = downSm
                    ? offset * 45
                    : downMd
                    ? offset * 60
                    : offset * 70;
                  const translateZ = downSm
                    ? -Math.abs(offset) * 16
                    : -Math.abs(offset) * 30;
                  const scale = 1 - Math.abs(offset) * (downSm ? 0.1 : 0.08);
                  const zIndex = totalBooks - Math.abs(offset);

                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "absolute",
                        width: { xs: 165, sm: 210, md: 240 },
                        height: { xs: 248, sm: 315, md: 360 },
                        transformStyle: "preserve-3d",
                        transform: `
                          translateX(${translateX}px)
                          translateZ(${translateZ}px)
                          rotateY(${rotateY}deg)
                          scale(${scale})
                        `,
                        transition: "all 0.3s ease",
                        zIndex,
                        "&:hover": {
                          transform: `
                            translateX(${translateX}px)
                            translateZ(${translateZ}px)
                            rotateY(${rotateY * 0.7}deg)
                            scale(${scale + 0.08})
                          `,
                          "& img": {
                            boxShadow: "0 12px 32px rgba(99,102,241,0.3)",
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          src
                            ? src.replace(
                                "/upload/",
                                "/upload/w_400,h_560,c_fill,q_auto,f_auto/"
                              )
                            : `https://via.placeholder.com/240x360/6366f1/ffffff?text=Book+${
                                idx + 1
                              }`
                        }
                        alt={`Bìa sách ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 1,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          transition: "all 0.3s ease",
                          border: 2,
                          borderColor: "background.paper",
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </MotionBox>

          {/* cột text */}
          <MotionBox
            {...rightMotionProps}
            sx={{
              flex: "1 1 440px",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: "center",
              gap: { xs: 1.5, md: 2 },
              textAlign: { xs: "center", md: "left" },
              mt: { xs: -10, sm: 0 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              Tìm kiếm cuốn sách bạn yêu thích
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                fontSize: { xs: "0.9rem", md: "1rem" },
                maxWidth: { xs: "100%", md: 540 },
              }}
            >
              Khám phá hàng nghìn cuốn sách được tuyển chọn theo thể loại, tác
              giả và xu hướng. Dù bạn đang tìm sách học tập, tiểu thuyết hay tài
              liệu chuyên ngành, chúng tôi luôn có gợi ý phù hợp cho bạn.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                mt: 1,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              {[
                { value: "800+", label: "Danh mục sách" },
                { value: "550+", label: "Sinh viên" },
                { value: "1,200+", label: "Sách đã được mượn" },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{ minWidth: 96, textAlign: { xs: "center", md: "left" } }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 12, md: 13 },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Button
                component={RouterLink}
                to="/catalog"
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                  px: 3,
                  py: 1.2,
                  fontSize: { xs: "0.875rem", md: "0.95rem" },
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(99,102,241,0.35)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Khám phá ngay
              </Button>
            </Box>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}
