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

// giả định banner
const bookImages = [
  "/assets/book-2020-war.png",
  "/assets/book-gothic.png",
  "/assets/book-time-traveler.png",
  "/assets/book-doctor-who.png",
  "/assets/book-siloed.png",
  "/assets/book-2020-war.png",
  "/assets/book-gothic.png",
  "/assets/book-time-traveler.png",
  "/assets/book-doctor-who.png",
];

export default function DiscoverSection(): React.ReactElement {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));

  const displayBooks = bookImages.slice(0, 5);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            gap: { xs: 4, md: 6 },
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: "1 1 420px", minWidth: 260 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                position: "relative",
                px: { xs: 2.5, sm: 3 },
                py: { xs: 3, sm: 3.5 },
                borderRadius: 2,
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(180deg, rgba(99,102,241,0.04), rgba(99,102,241,0.02))"
                    : "linear-gradient(180deg, rgba(129,140,248,0.08), rgba(129,140,248,0.04))",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                overflow: "visible",
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
                  minHeight: { xs: 280, sm: 400, md: 480 },
                  perspective: "1500px",
                }}
              >
                {displayBooks.map((src, idx) => {
                  const totalBooks = displayBooks.length;
                  const centerIndex = Math.floor(totalBooks / 2);
                  const offset = idx - centerIndex;

                  const rotateY = downSm ? offset * 8 : offset * 12;
                  const translateX = downSm
                    ? offset * 55
                    : downMd
                    ? offset * 70
                    : offset * 85;
                  const translateZ = downSm
                    ? -Math.abs(offset) * 20
                    : -Math.abs(offset) * 35;
                  const scale = 1 - Math.abs(offset) * 0.08;
                  const zIndex = totalBooks - Math.abs(offset);

                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "absolute",
                        width: { xs: 180, sm: 220, md: 260 },
                        height: { xs: 270, sm: 330, md: 390 },
                        transformStyle: "preserve-3d",
                        transform: `
                          translateX(${translateX}px)
                          translateZ(${translateZ}px)
                          rotateY(${rotateY}deg)
                          scale(${scale})
                        `,
                        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
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
                        src={src}
                        alt={`Bìa sách ${idx + 1}`}
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.src = `https://via.placeholder.com/180x270/6366f1/ffffff?text=Book+${
                            idx + 1
                          }`;
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 1.5,
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
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{
              flex: "1 1 440px",
              minWidth: 260,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Tìm kiếm cuốn sách bạn yêu thích
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
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
              }}
            >
              {[
                { value: "800+", label: "Danh mục sách" },
                { value: "550+", label: "Sinh viên" },
                { value: "1,200+", label: "Sách đã được mượn" },
              ].map((stat) => (
                <Box key={stat.label} sx={{ minWidth: 96 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1.1rem",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                href="/book"
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(99,102,241,0.35)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Khám phá ngay
              </Button>
              <Button
                href="/about"
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
