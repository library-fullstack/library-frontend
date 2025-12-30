import React, { useEffect, useState, lazy } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Alert,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  BookOpen,
  Users,
  BookMarked,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { statisticsApi } from "../../features/admin/api/statistics.api";
import type { DashboardStatistics } from "../../features/admin/api/statistics.api";
import { parseApiError } from "../../shared/lib/errorHandler";

const RecentActivity = lazy(
  () => import("../../features/admin/components/RecentActivity")
);
const TrendChart = lazy(() => import("./components/TrendChart"));
const CategoryPieChart = lazy(() => import("./components/CategoryPieChart"));
const MonthlyBarChart = lazy(() => import("./components/MonthlyBarChart"));

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactElement;
  color: string;
  loading?: boolean;
}

const StatCard = React.memo(
  ({ title, value, change, icon, color, loading }: StatCardProps) => {
    if (loading) {
      return (
        <Card elevation={0} sx={{ height: "100%" }}>
          <CardContent>
            <Skeleton width="60%" height={24} />
            <Skeleton width="40%" height={48} sx={{ mt: 1 }} />
            <Skeleton width="50%" height={20} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid",
          borderColor: "divider",
          "&:hover": {
            boxShadow: 2,
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, mb: 1 }}
              >
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color }}>
                {typeof value === "number"
                  ? value.toLocaleString("vi-VN")
                  : value}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? `${color}20` : `${color}25`,
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? `${color}30` : `${color}40`,
              }}
            >
              {React.cloneElement(icon, {
                size: 28,
                color,
                strokeWidth: 2,
              } as React.SVGProps<SVGSVGElement>)}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TrendingUp
              size={16}
              color={change >= 0 ? "#10B981" : "#EF4444"}
              style={{ transform: change < 0 ? "rotate(180deg)" : "none" }}
            />
            <Typography
              variant="caption"
              sx={{
                color: change >= 0 ? "success.main" : "error.main",
                fontWeight: 600,
              }}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              so với tháng trước
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const statsResponse = await statisticsApi.getDashboardStats();
        setStats(statsResponse.data);
      } catch (err) {
        const errorMsg = parseApiError(err);
        setError(errorMsg);
        setStats(createMockStats());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    booksAddedLastMonth: 38,
    usersJoinedLastMonth: 52,
    borrowsLastMonth: 178,
    overdueLastMonth: 15,

    growthRates: {
      books: 3.6,
      users: 7.8,
      borrows: -2.4,
      overdue: -15.7,
    },

    popularCategories: [
      { category_id: 1, category_name: "Khoa học", book_count: 287 },
      { category_id: 2, category_name: "Văn học", book_count: 245 },
      { category_id: 3, category_name: "Công nghệ", book_count: 198 },
      { category_id: 4, category_name: "Kinh tế", book_count: 176 },
      { category_id: 5, category_name: "Nghệ thuật", book_count: 154 },
    ],

    recentBorrows: [
      {
        id: 1,
        book_title: "Clean Code",
        user_name: "Nguyễn Văn A",
        borrowed_at: new Date().toISOString(),
        due_date: new Date().toISOString(),
        status: "ACTIVE",
      },
    ],

    monthlyStats: [
      { month: "T7", books: 32, users: 45 },
      { month: "T8", books: 38, users: 52 },
      { month: "T9", books: 41, users: 61 },
      { month: "T10", books: 35, users: 58 },
      { month: "T11", books: 47, users: 69 },
      { month: "T12", books: 45, users: 67 },
    ],

    borrowTrends: [
      { month: "T7", borrows: 156, returns: 142 },
      { month: "T8", borrows: 178, returns: 165 },
      { month: "T9", borrows: 192, returns: 175 },
      { month: "T10", borrows: 215, returns: 198 },
      { month: "T11", borrows: 234, returns: 210 },
      { month: "T12", borrows: 189, returns: 176 },
    ],

    systemHealth: {
      databaseStatus: "healthy",
      storageUsage: 45,
      apiResponseTime: 150,
    },
  });

  const displayStats = stats || createMockStats();

  const categoryData = React.useMemo(
    () =>
      displayStats.popularCategories.slice(0, 5).map((cat) => ({
        name: cat.category_name,
        value: cat.book_count,
      })),
    [displayStats.popularCategories]
  );

  const monthlyData = React.useMemo(() => {
    return (
      displayStats?.monthlyStats || [
        { month: "T7", books: 32, users: 45 },
        { month: "T8", books: 38, users: 52 },
        { month: "T9", books: 41, users: 61 },
        { month: "T10", books: 35, users: 58 },
        { month: "T11", books: 47, users: 69 },
        { month: "T12", books: 45, users: 67 },
      ]
    );
  }, [displayStats?.monthlyStats]);

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 0, sm: 0 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
        >
          Tổng quan Dashboard
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Chào mừng quay trở lại! Đây là thống kê hoạt động hệ thống thư viện.
        </Typography>
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Đang sử dụng dữ liệu mẫu. {error}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Tổng số sách"
            value={displayStats.totalBooks}
            change={displayStats.growthRates?.books || 0}
            icon={<BookOpen />}
            color="#3B82F6"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Tổng người dùng"
            value={displayStats.totalUsers}
            change={displayStats.growthRates?.users || 0}
            icon={<Users />}
            color="#10B981"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Đang mượn"
            value={displayStats.activeBorrows}
            change={displayStats.growthRates?.borrows || 0}
            icon={<BookMarked />}
            color="#F59E0B"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Sách quá hạn"
            value={displayStats.overdueBorrows}
            change={displayStats.growthRates?.overdue || 0}
            icon={<AlertTriangle />}
            color="#EF4444"
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: "0.95rem", sm: "1.25rem" } }}
            >
              Xu hướng mượn trả sách
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Thống kê 6 tháng gần nhất
            </Typography>
            {loading ? (
              <Box sx={{ height: { xs: 280, sm: 320, md: 360 }, flex: 1 }}>
                <Skeleton variant="rectangular" height="100%" />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 320, md: 360 },
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <React.Suspense fallback={null}>
                  <TrendChart data={displayStats.borrowTrends} />
                </React.Suspense>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: "0.95rem", sm: "1.25rem" } }}
            >
              Phân bố danh mục
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Top 5 danh mục phổ biến
            </Typography>
            {loading ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 420, sm: 420, md: 420 },
                }}
              >
                <Skeleton variant="circular" width={100} height={100} />
              </Box>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  overflow: "visible",
                  minHeight: { xs: 420, sm: 420, md: 420 },
                }}
              >
                <React.Suspense fallback={null}>
                  <CategoryPieChart data={categoryData} />
                </React.Suspense>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: "0.95rem", sm: "1.25rem" } }}
            >
              Sách & Người dùng mới
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Thống kê hàng tháng
            </Typography>
            {loading ? (
              <Box sx={{ height: { xs: 280, sm: 320, md: 360 }, flex: 1 }}>
                <Skeleton variant="rectangular" height="100%" />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 320, md: 360 },
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <React.Suspense fallback={null}>
                  <MonthlyBarChart data={monthlyData} />
                </React.Suspense>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <React.Suspense fallback={null}>
            <RecentActivity
              activities={displayStats.recentBorrows}
              loading={loading}
            />
          </React.Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}
