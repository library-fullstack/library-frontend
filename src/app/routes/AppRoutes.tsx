import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
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

// lazy
const BookList = lazy(() => import("../../pages/book/BookList"));
const BookDetail = lazy(() => import("../../pages/book/BookDetail"));
const Cart = lazy(() => import("../../pages/borrow/Cart"));
const Checkout = lazy(() => import("../../pages/borrow/Checkout"));
const BorrowList = lazy(() => import("../../pages/borrow/BorrowList"));
const OrderList = lazy(() => import("../../pages/borrow/OrderList"));
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const BooksManagement = lazy(() => import("../../pages/admin/BooksManagement"));
const UsersManagement = lazy(() => import("../../pages/admin/UsersManagement"));
const BorrowManagement = lazy(
  () => import("../../pages/admin/BorrowManagement")
);
const AnalyticsPage = lazy(() => import("../../pages/admin/AnalyticsPage"));
const BannerManagement = lazy(
  () => import("../../pages/admin/BannerManagement")
);
const Services = lazy(() => import("../../pages/common/Services"));
const News = lazy(() => import("../../pages/common/News"));
const About = lazy(() => import("../../pages/common/About"));
const Contact = lazy(() => import("../../pages/common/Contact"));
const Forum = lazy(() => import("../../pages/common/Forum"));
const Favorites = lazy(() => import("../../pages/common/Favorites"));

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
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
        {/* keep alive */}
        <Route
          path="/"
          element={
            <KeepAlive id="home" name="home">
              <HomePage />
            </KeepAlive>
          }
        />
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
            <KeepAlive id="forum" name="forum">
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              </Suspense>
            </KeepAlive>
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
      </Route>

      <Route path="/auth/confirm-info" element={<ConfirmStudentInfo />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
