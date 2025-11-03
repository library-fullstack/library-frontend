import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Alert,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
} from "lucide-react";
import { statisticsApi } from "../../features/admin/api/statistics.api";
import type { DashboardStatistics } from "../../features/admin/api/statistics.api";
import { parseApiError } from "../../shared/lib/errorHandler";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await statisticsApi.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError(parseApiError(err));
      setStats(createMockStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const createMockStats = (): DashboardStatistics => ({
    totalBooks: 1234,
    activeBooks: 1180,
    totalUsers: 856,
    totalBorrows: 3421,
    activeBorrows: 234,
    overdueBorrows: 12,
    totalCategories: 24,
    totalPublishers: 89,
    booksAddedThisMonth: 45,
    usersJoinedThisMonth: 67,
    borrowsThisMonth: 189,
    popularCategories: [
      {
        category_id: 1,
        category_name: "Khoa học & Công nghệ",
        book_count: 287,
      },
      { category_id: 2, category_name: "Văn học Việt Nam", book_count: 36 },
      { category_id: 3, category_name: "Lịch sử & Địa lý", book_count: 36 },
      { category_id: 4, category_name: "Kinh tế & Quản lý", book_count: 36 },
      { category_id: 5, category_name: "Triết học & Tâm lý", book_count: 36 },
      { category_id: 6, category_name: "Văn học nước ngoài", book_count: 36 },
      { category_id: 7, category_name: "Nghệ thuật", book_count: 36 },
      { category_id: 8, category_name: "Y học & Sức khỏe", book_count: 36 },
    ],
    recentBorrows: [],
    monthlyStats: [
      { month: "T7", books: 36, users: 36 },
      { month: "T8", books: 36, users: 36 },
      { month: "T9", books: 36, users: 36 },
      { month: "T10", books: 36, users: 36 },
      { month: "T11", books: 36, users: 36 },
      { month: "T12", books: 36, users: 36 },
    ],
    systemHealth: {
      databaseStatus: "healthy",
      storageUsage: 45,
      apiResponseTime: 150,
    },
  });

  const displayStats = stats || createMockStats();

  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  const getTrendData = () => [
    {
      label: "Sách mới tháng này",
      value: displayStats.booksAddedThisMonth,
      total: displayStats.totalBooks,
      color: "#4F46E5",
      trend: 12.5,
      isPositive: true,
    },
    {
      label: "Người dùng mới",
      value: displayStats.usersJoinedThisMonth,
      total: displayStats.totalUsers,
      color: "#10B981",
      trend: 8.3,
      isPositive: true,
    },
    {
      label: "Lượt mượn tháng này",
      value: displayStats.borrowsThisMonth,
      total: displayStats.totalBorrows,
      color: "#F59E0B",
      trend: -3.2,
      isPositive: false,
    },
    {
      label: "Sách quá hạn",
      value: displayStats.overdueBorrows,
      total: displayStats.activeBorrows,
      color: "#EF4444",
      trend: -15.7,
      isPositive: true,
    },
  ];

  const getMaxBookCount = () => {
    return Math.max(...displayStats.popularCategories.map((c) => c.book_count));
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Thống kê & Phân tích
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Báo cáo chi tiết về hoạt động thư viện
          </Typography>
        </Box>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Đang sử dụng dữ liệu mẫu. {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <Activity size={24} color="#4F46E5" />
                <Typography variant="h6" fontWeight={700}>
                  Xu hướng hoạt động
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {getTrendData().map((item, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3,
                    }}
                  >
                    {loading ? (
                      <Skeleton height={120} />
                    ) : (
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          height: "100%",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {item.label}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              sx={{ color: item.color }}
                            >
                              {item.value.toLocaleString("vi-VN")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              / {item.total.toLocaleString("vi-VN")}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {item.isPositive ? (
                              <TrendingUp
                                size={16}
                                color={item.trend > 0 ? "#10B981" : "#EF4444"}
                              />
                            ) : (
                              <TrendingDown size={16} color="#EF4444" />
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  item.isPositive && item.trend > 0
                                    ? "success.main"
                                    : "error.main",
                                fontWeight: 600,
                              }}
                            >
                              {item.trend > 0 ? "+" : ""}
                              {item.trend}%
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              so với tháng trước
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <BarChart3 size={24} color="#4F46E5" />
                <Typography variant="h6" fontWeight={700}>
                  Phân bố sách theo danh mục
                </Typography>
              </Box>
              {loading ? (
                <Box>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} height={50} sx={{ mb: 2 }} />
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  {displayStats.popularCategories.map((category, index) => {
                    const percentage = calculatePercentage(
                      category.book_count,
                      displayStats.totalBooks
                    );
                    const barWidth =
                      (category.book_count / getMaxBookCount()) * 100;

                    return (
                      <Box key={category.category_id}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Chip
                              label={`#${index + 1}`}
                              size="small"
                              sx={{
                                minWidth: 36,
                                height: 24,
                                fontWeight: 700,
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "rgba(79, 70, 229, 0.2)"
                                    : "rgba(79, 70, 229, 0.1)",
                                color: "primary.main",
                              }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {category.category_name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="primary.main"
                            >
                              {category.book_count.toLocaleString("vi-VN")}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ({percentage}%)
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            style={{
                              height: "100%",
                              background: `linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)`,
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <PieChart size={24} color="#10B981" />
                <Typography variant="h6" fontWeight={700}>
                  Tổng quan
                </Typography>
              </Box>
              {loading ? (
                <Box>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={60} sx={{ mb: 2 }} />
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Sách đang hoạt động
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {displayStats.activeBooks.toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (displayStats.activeBooks / displayStats.totalBooks) *
                        100
                      }
                      color="success"
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {calculatePercentage(
                        displayStats.activeBooks,
                        displayStats.totalBooks
                      )}
                      % từ tổng số sách
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Đang được mượn
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {displayStats.activeBorrows.toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (displayStats.activeBorrows /
                          displayStats.totalBorrows) *
                        100
                      }
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {calculatePercentage(
                        displayStats.activeBorrows,
                        displayStats.totalBorrows
                      )}
                      % từ tổng lượt mượn
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Sách quá hạn
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="error.main"
                      >
                        {displayStats.overdueBorrows.toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (displayStats.overdueBorrows /
                          displayStats.activeBorrows) *
                        100
                      }
                      color="error"
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {calculatePercentage(
                        displayStats.overdueBorrows,
                        displayStats.activeBorrows
                      )}
                      % sách đang mượn
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(79, 70, 229, 0.05)"
                          : "rgba(79, 70, 229, 0.03)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Calendar size={18} color="#4F46E5" />
                      <Typography variant="body2" fontWeight={600}>
                        Tháng này
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Sách mới
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {displayStats.booksAddedThisMonth}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          User mới
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="success.main"
                        >
                          {displayStats.usersJoinedThisMonth}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
