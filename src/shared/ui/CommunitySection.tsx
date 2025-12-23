import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  Button,
  Skeleton,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Link as RouterLink, useNavigationType } from "react-router-dom";
import { Pagination, Autoplay } from "swiper/modules";
import { useEventTheme } from "../hooks/useEventTheme";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import "../../styles/eventTheme.css";

interface ForumPost {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  category_name: string;
  content: string;
  created_at: string;
}

export default function CommunitySection(): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigationType = useNavigationType();
  const shouldAnimate = !isMobile && navigationType !== "POP";
  const eventClass = useEventTheme();

  const { data: postsData, isLoading } = useQuery<ForumPost[]>({
    queryKey: ["forum-posts-random"],
    queryFn: async () => {
      const response = await axiosClient.get("/forum/posts", {
        params: {
          limit: 3,
          sort: "random",
          status: "APPROVED",
        },
      });
      const data = response.data as { success?: boolean; data?: ForumPost[] };
      return data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const posts = postsData || [];

  const MobileContent = (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.2,
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: (t) => t.palette.text.primary }}
        >
          Góc cộng đồng sinh viên
        </Typography>
      </Box>

      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        mb={6}
      >
        Một vài chia sẻ nổi bật từ diễn đàn của Thư viện HBH.
      </Typography>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          600: { slidesPerView: 1.2 },
          900: { slidesPerView: 2 },
        }}
        autoplay={
          isMobile
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        touchStartPreventDefault={false}
        touchReleaseOnEdges
        resistanceRatio={0.5}
        observer
        observeParents
        speed={500}
      >
        {isLoading
          ? [1, 2, 3].map((i) => (
              <SwiperSlide key={i} style={{ display: "flex" }}>
                <Card
                  sx={{
                    height: "100%",
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 2,
                  }}
                >
                  <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton width="80%" height={20} sx={{ mb: 1 }} />
                  <Skeleton height={16} />
                  <Skeleton height={16} />
                  <Skeleton width="70%" height={16} />
                </Card>
              </SwiperSlide>
            ))
          : posts.map((post) => (
              <SwiperSlide key={post.id} style={{ display: "flex" }}>
                <Card
                  component={RouterLink}
                  to={`/forum/posts/${post.slug}`}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[1],
                    textDecoration: "none",
                    transition: isMobile ? "none" : "all 0.25s ease",
                    "&:hover": !isMobile
                      ? {
                          transform: "translateY(-4px)",
                          boxShadow: (t) => t.shadows[4],
                          transition: "0.3s ease",
                        }
                      : {},
                  }}
                >
                  <Box>
                    <Chip
                      label={post.category_name || "Thảo luận"}
                      size="small"
                      color="primary"
                      sx={{ mb: 1.2, fontWeight: 500, borderRadius: 2 }}
                    />
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        mb: 0.5,
                        color: theme.palette.text.primary,
                        lineHeight: 1.5,
                        minHeight: "3em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        pt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 56,
                      }}
                    >
                      {post.content
                        ? post.content.replace(/<[^>]*>/g, "").substring(0, 150)
                        : "Nhấn để xem chi tiết..."}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: (t) => t.palette.primary.main,
                        fontSize: 13,
                        color: (t) => t.palette.primary.contrastText,
                        flexShrink: 0,
                      }}
                    >
                      {post.author_name?.charAt(0) || "A"}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {post.author_name || "Ẩn danh"}
                    </Typography>
                  </Box>
                </Card>
              </SwiperSlide>
            ))}
      </Swiper>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          component={RouterLink}
          to="/forum"
          variant="contained"
          color="primary"
          sx={{
            mt: 0,
            mb: 0.5,
            display: "block",
            mx: "auto",
            px: 5,
            py: 1.3,
            minWidth: "100%",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
            textAlign: "center",
            "&:hover": { filter: "brightness(0.98)" },
          }}
        >
          Đến diễn đàn ngay
        </Button>
      </Box>

      <style>
        {`
          .swiper-pagination {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 25px;
            margin-bottom: 10px;
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
            width: 20px;
            border-radius: 8px;
            background: ${theme.palette.primary.main};
          }
        `}
      </style>
    </Container>
  );

  const DesktopContent = (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1.2}
        mb={1}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: (t) => t.palette.text.primary }}
        >
          Góc cộng đồng sinh viên
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        mb={6}
      >
        Một vài chia sẻ nổi bật từ diễn đàn của Thư viện HBH.
      </Typography>

      <Stack direction="row" spacing={4}>
        {isLoading
          ? [1, 2, 3].map((i) => (
              <Card key={i} sx={{ flex: 1, p: 3, borderRadius: 2 }}>
                <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="90%" height={20} sx={{ mb: 1 }} />
                <Skeleton height={16} />
                <Skeleton height={16} />
                <Skeleton width="60%" height={16} />
              </Card>
            ))
          : posts.map((post, index) => (
              <Card
                key={post.id}
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                onClick={() =>
                  (window.location.href = `/forum/posts/${post.slug}`)
                }
                sx={{
                  flex: 1,
                  p: 3,
                  height: 320,
                  borderRadius: 2,
                  bgcolor: (t) => t.palette.background.paper,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  boxShadow: (t) => t.shadows[1],
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": !isMobile
                    ? {
                        transform: "translateY(-4px)",
                        boxShadow: (t) => t.shadows[4],
                        transition: "0.3s ease",
                      }
                    : {},
                }}
              >
                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Chip
                    label={post.category_name || "Thảo luận"}
                    size="small"
                    color="primary"
                    sx={{
                      mb: 1.2,
                      fontWeight: 500,
                      borderRadius: 2,
                      alignSelf: "flex-start",
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: (t) => t.palette.text.primary,
                      lineHeight: 1.4,
                      height: "2.8em",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flexGrow: 1,
                    }}
                  >
                    {post.content
                      ? post.content.replace(/<[^>]*>/g, "").substring(0, 150)
                      : "Nhấn để xem chi tiết..."}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pt: 2,
                    mt: 2,
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: (t) => t.palette.primary.main,
                      fontSize: 13,
                      color: (t) => t.palette.primary.contrastText,
                    }}
                  >
                    {post.author_name?.charAt(0) || "A"}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {post.author_name || "Ẩn danh"}
                  </Typography>
                </Box>
              </Card>
            ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Box
          component={motion.div}
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            component={RouterLink}
            to="/forum"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              border: (t) => `1.5px solid ${t.palette.primary.main}`,
              color: (t) => t.palette.primary.main,
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: (t) => t.palette.action.hover,
                boxShadow: (t) => t.shadows[2],
              },
            }}
          >
            <span>Truy cập diễn đàn sinh viên</span>
          </Box>
        </Box>
      </Box>
    </Container>
  );

  if (isMobile) {
    return (
      <Box
        className={`event-banner ${eventClass}`}
        sx={{
          bgcolor: (t) => t.palette.background.default,
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 6 },
        }}
      >
        {MobileContent}
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      className={`event-banner ${eventClass}`}
      initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      sx={{
        bgcolor: (t) => t.palette.background.default,
        py: { xs: 6, md: 10 },
        mb: { xs: 4, md: 6 },
      }}
    >
      {DesktopContent}
    </Box>
  );
}
