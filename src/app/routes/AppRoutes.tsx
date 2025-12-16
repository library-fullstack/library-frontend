import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, ComponentType } from "react";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import { KeepAlive } from "react-activation";
import MainLayout from "../../widgets/layout/MainLayout";
import AdminLayout from "../../widgets/layout/AdminLayout";

// quan trọng
import HomePage from "../../pages/home/HomePage";
import AuthLayout from "../../pages/auth/AuthLayout";
import LoginForm from "../../features/auth/components/LoginForm";
import RegisterForm from "../../features/auth/components/RegisterForm";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";
import Profile from "../../pages/user/Profile";
import ProtectedRoute from "../../widgets/routing/ProtectedRoute";
import PublicRoute from "../../widgets/routing/PublicRoute";
import NotFound from "../../shared/ui/NotFound";
import ConfirmStudentInfo from "../../features/auth/components/ConfirmStudentInfo";
import logger from "../../shared/lib/logger";

const lazyWithErrorBoundary = (
  importFunc: () => Promise<{
    default: ComponentType<Record<string, unknown>>;
  }>,
  componentName: string
) => {
  const LazyComponent = lazy(() =>
    importFunc().catch(async (error) => {
      logger.error(`Failed to load ${componentName} (attempt 1):`, error);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        logger.info(`Retrying to load ${componentName}...`);
        return await importFunc();
      } catch (retryError) {
        logger.error(
          `Failed to load ${componentName} (attempt 2):`,
          retryError
        );

        return {
          default: () => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                gap: 2,
                p: 2,
              }}
            >
              <Alert severity="error" sx={{ maxWidth: 500 }}>
                <strong>Lỗi tải {componentName}</strong>
                <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Không thể tải trang. Vui lòng kiểm tra kết nối mạng hoặc thử
                  lại.
                </div>
              </Alert>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                >
                  Tải lại toàn trang
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                >
                  Quay lại
                </Button>
              </Box>
            </Box>
          ),
        };
      }
    })
  );
  return LazyComponent;
};

// lazy
const BookList = lazyWithErrorBoundary(
  () => import("../../pages/book/BookList"),
  "Danh sách sách"
);
const BookDetail = lazyWithErrorBoundary(
  () => import("../../pages/book/BookDetail"),
  "Chi tiết sách"
);
const Cart = lazyWithErrorBoundary(
  () => import("../../pages/borrow/Cart"),
  "Giỏ sách"
);
const Checkout = lazyWithErrorBoundary(
  () => import("../../pages/borrow/Checkout"),
  "Thanh toán"
);
const BorrowList = lazyWithErrorBoundary(
  () => import("../../pages/borrow/BorrowList"),
  "Danh sách mượn"
);
const OrderList = lazyWithErrorBoundary(
  () => import("../../pages/borrow/OrderList"),
  "Danh sách đơn hàng"
);
const AdminDashboard = lazyWithErrorBoundary(
  () => import("../../pages/admin/AdminDashboard"),
  "Dashboard Admin"
);
const BooksManagement = lazyWithErrorBoundary(
  () => import("../../pages/admin/BooksManagement"),
  "Quản lý sách"
);
const UsersManagement = lazyWithErrorBoundary(
  () => import("../../pages/admin/UsersManagement"),
  "Quản lý người dùng"
);
const BorrowManagement = lazyWithErrorBoundary(
  () => import("../../pages/admin/BorrowManagement"),
  "Quản lý mượn"
);
const AnalyticsPage = lazyWithErrorBoundary(
  () => import("../../pages/admin/AnalyticsPage"),
  "Phân tích"
);
const BannerManagement = lazyWithErrorBoundary(
  () => import("../../pages/admin/BannerManagement"),
  "Quản lý banner"
);
const PerformanceMonitoring = lazyWithErrorBoundary(
  () => import("../../pages/admin/PerformanceMonitoring"),
  "Giám sát hiệu suất"
);
const ForumPendingPostsPage = lazyWithErrorBoundary(
  () => import("../../pages/admin/ForumPendingPostsPage"),
  "Bài viết chờ duyệt"
);
const ForumReportsPage = lazyWithErrorBoundary(
  () => import("../../pages/admin/ForumReportsPage"),
  "Báo cáo vi phạm"
);
const ForumActivityLogsPage = lazyWithErrorBoundary(
  () => import("../../pages/admin/ForumActivityLogsPage"),
  "Nhật ký hoạt động"
);
const ForumCategoriesPage = lazyWithErrorBoundary(
  () => import("../../pages/admin/ForumCategoriesPage"),
  "Quản lý chủ đề"
);
const ForumSettingsPage = lazyWithErrorBoundary(
  () => import("../../pages/admin/ForumSettingsPage"),
  "Cài đặt diễn đàn"
);
const Services = lazyWithErrorBoundary(
  () => import("../../pages/common/Services"),
  "Dịch vụ"
);
const News = lazyWithErrorBoundary(
  () => import("../../pages/common/News"),
  "Tin tức"
);
const About = lazyWithErrorBoundary(
  () => import("../../pages/common/About"),
  "Về chúng tôi"
);
const Contact = lazyWithErrorBoundary(
  () => import("../../pages/common/Contact"),
  "Liên hệ"
);
import ForumPageDirect from "../../pages/forum/ForumPage";
const Forum = ForumPageDirect;
const ForumPostDetail = lazyWithErrorBoundary(
  () => import("../../pages/forum/PostDetailPage"),
  "Chi tiết bài viết"
);
const ForumCreatePost = lazyWithErrorBoundary(
  () => import("../../pages/forum/CreatePostPage"),
  "Tạo bài viết"
);
const ModerationDashboard = lazyWithErrorBoundary(
  () => import("../../pages/forum/ModerationDashboard"),
  "Bảng điều khiển kiểm duyệt"
);
const UserProfile = lazyWithErrorBoundary(
  () => import("../../pages/forum/UserProfile"),
  "Hồ sơ người dùng"
);
const Favorites = lazyWithErrorBoundary(
  () => import("../../pages/common/Favorites"),
  "Yêu thích"
);

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress size={56} thickness={3.5} />
  </Box>
);

export default function AppRoutes(): JSX.Element {
  return (
    <Routes>
      {/* chuyển hướng auth */}
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="reset-password" element={<ResetPasswordForm />} />
      </Route>

      {/* layout chính */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/catalog"
          element={
            <Suspense fallback={<PageLoader />}>
              <BookList />
            </Suspense>
          }
        />
        <Route
          path="/news"
          element={
            <KeepAlive id="news" name="news">
              <Suspense fallback={<PageLoader />}>
                <News />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <KeepAlive id="forum" name="forum">
                <Suspense fallback={<PageLoader />}>
                  <Forum />
                </Suspense>
              </KeepAlive>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/:categorySlug"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Forum />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/create"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <ForumCreatePost />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/edit/:postId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <ForumCreatePost />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/:categorySlug/:postId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <ForumPostDetail />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/moderation"
          element={
            <ProtectedRoute roles={["MODERATOR", "ADMIN"]}>
              <Suspense fallback={<PageLoader />}>
                <ModerationDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/users/:userId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <UserProfile />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <KeepAlive id="services" name="services">
              <Suspense fallback={<PageLoader />}>
                <Services />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="/about"
          element={
            <KeepAlive id="about" name="about">
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="/contact"
          element={
            <KeepAlive id="contact" name="contact">
              <Suspense fallback={<PageLoader />}>
                <Contact />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="/favorites"
          element={
            <KeepAlive id="favorites" name="favorites">
              <Suspense fallback={<PageLoader />}>
                <Favorites />
              </Suspense>
            </KeepAlive>
          }
        />

        {/* không keep alive */}
        <Route
          path="/books/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <BookDetail />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/borrow/cart"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/borrow"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <BorrowList />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN", "LIBRARIAN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="books"
          element={
            <Suspense fallback={<PageLoader />}>
              <BooksManagement />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Suspense fallback={<PageLoader />}>
                <UsersManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="borrows"
          element={
            <Suspense fallback={<PageLoader />}>
              <BorrowManagement />
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <AnalyticsPage />
            </Suspense>
          }
        />
        <Route
          path="banners"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Suspense fallback={<PageLoader />}>
                <BannerManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="performance"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Suspense fallback={<PageLoader />}>
                <PerformanceMonitoring />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="forum/pending-posts"
          element={
            <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
              <Suspense fallback={<PageLoader />}>
                <ForumPendingPostsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="forum/reports"
          element={
            <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
              <Suspense fallback={<PageLoader />}>
                <ForumReportsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="forum/activity-logs"
          element={
            <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
              <Suspense fallback={<PageLoader />}>
                <ForumActivityLogsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="forum/categories"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Suspense fallback={<PageLoader />}>
                <ForumCategoriesPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="forum/settings"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Suspense fallback={<PageLoader />}>
                <ForumSettingsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/auth/confirm-info" element={<ConfirmStudentInfo />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
