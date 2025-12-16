import { useState, useEffect, useMemo, startTransition } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Typography,
  Button,
  Stack,
  Chip,
  Pagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search as SearchIcon,
  Plus as PlusIcon,
  Filter as FilterIcon,
} from "lucide-react";
import {
  useForumCategories,
  useForumPosts,
} from "../../features/forum/hooks/useForum";
import ForumPostCard from "../../features/forum/components/ForumPostCard";
import {
  ForumPostCategory,
  ForumPostDetail,
} from "../../features/forum/types/forum.types";

const ForumPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useForumCategories();
  const categories = useMemo(
    () => (categoriesData as ForumPostCategory[]) || [],
    [categoriesData]
  );

  const initialCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.id || null
    : null;

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "trending" | "most-comments">(
    "newest"
  );
  const limit = 12;

  // Derive selected category from URL slug
  useEffect(() => {
    if (categorySlug) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        startTransition(() => {
          setSelectedCategory(category.id);
        });
      } else {
        startTransition(() => {
          setSelectedCategory(null);
        });
      }
    } else {
      startTransition(() => {
        setSelectedCategory(null);
      });
    }
  }, [categorySlug, categories]);

  // Reset to page 1 when category changes
  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
  }, [selectedCategory]);

  const { data: postsData, isLoading: postsLoading } = useForumPosts(
    selectedCategory || undefined,
    page,
    limit,
    sortBy,
    searchQuery
  );

  // Refetch posts when page becomes visible or on interval
  useEffect(() => {
    // Invalidate + refetch immediately on mount/when dependencies change
    queryClient.invalidateQueries({
      queryKey: ["forum"],
    });
    queryClient.refetchQueries({
      queryKey: ["forum"],
    });

    // Also refetch every 3 seconds
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["forum"],
      });
      queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    }, 3000);

    // Refetch when window regains focus
    const handleFocus = () => {
      queryClient.invalidateQueries({
        queryKey: ["forum"],
      });
      queryClient.refetchQueries({
        queryKey: ["forum"],
      });
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [queryClient]);

  const posts = (postsData?.data as ForumPostDetail[]) || [];
  const pagination = postsData?.pagination || {
    total: 0,
    page: 1,
    limit,
    pages: 1,
  };

  const handleCategoryChange = (categoryId: number | null) => {
    if (categoryId === null) {
      navigate("/forum");
    } else {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        navigate(`/forum/${category.slug}`);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (
    e: SelectChangeEvent<"newest" | "trending" | "most-comments">
  ): void => {
    setSortBy(e.target.value as "newest" | "trending" | "most-comments");
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              position: "sticky",
              top: 100,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              <FilterIcon
                size={18}
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              Bộ lọc
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Chủ đề
            </Typography>

            <Stack spacing={1} sx={{ mb: 3 }}>
              <Chip
                label="Tất cả"
                onClick={() => handleCategoryChange(null)}
                variant={selectedCategory === null ? "filled" : "outlined"}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedCategory === null
                      ? theme.palette.primary.main
                      : "transparent",
                  color: selectedCategory === null ? "#fff" : "inherit",
                  justifyContent: "flex-start",
                }}
              />
            </Stack>

            {categoriesLoading ? (
              <Stack spacing={1}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height={40} variant="rectangular" />
                ))}
              </Stack>
            ) : (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {categories.map((category: ForumPostCategory) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => handleCategoryChange(category.id)}
                    variant={
                      selectedCategory === category.id ? "filled" : "outlined"
                    }
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedCategory === category.id
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        selectedCategory === category.id ? "#fff" : "inherit",
                      justifyContent: "flex-start",
                    }}
                  />
                ))}
              </Stack>
            )}

            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp"
                onChange={handleSortChange}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="trending">Xu hướng</MenuItem>
                <MenuItem value="most-comments">Bình luận nhiều</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <TextField
                placeholder="Tìm kiếm bài viết..."
                size="small"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, minWidth: "200px" }}
              />
              <Button
                variant="contained"
                startIcon={<PlusIcon size={20} />}
                onClick={() => navigate("/forum/create")}
              >
                Tạo bài viết
              </Button>
            </Box>

            {postsLoading ? (
              <Stack spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} height={200} variant="rectangular" />
                ))}
              </Stack>
            ) : posts.length > 0 ? (
              <>
                <Typography variant="body2" color="textSecondary">
                  Hiển thị {posts.length} / {pagination.total} bài viết
                </Typography>

                <Grid container spacing={2}>
                  {posts.map((post) => (
                    <Grid size={12} key={post.id}>
                      <ForumPostCard post={post} />
                    </Grid>
                  ))}
                </Grid>

                {pagination.pages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={pagination.pages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {searchQuery
                    ? "Không tìm thấy bài viết nào"
                    : "Không có bài viết nào"}
                </Typography>
                {!searchQuery && (
                  <Button
                    variant="contained"
                    onClick={() => navigate("/forum/create")}
                    startIcon={<PlusIcon size={20} />}
                  >
                    Hãy viết bài đầu tiên
                  </Button>
                )}
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForumPage;
