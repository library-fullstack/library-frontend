import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import MainLayout from "../../widgets/layout/MainLayout";

// các component chức năng CRITICAL - load ngay
import HomePage from "../../pages/home/HomePage";
import AuthLayout from "../../pages/auth/AuthLayout";

// các component auth CRITICAL
import LoginForm from "../../features/auth/components/LoginForm";
import RegisterForm from "../../features/auth/components/RegisterForm";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";

// lớp bảo vệ CRITICAL
import ProtectedRoute from "../../widgets/routing/ProtectedRoute";
import PublicRoute from "../../widgets/routing/PublicRoute";
import NotFound from "../../shared/ui/NotFound";

// LAZY LOAD - các component không critical
const BookList = lazy(() => import("../../pages/book/BookList"));
const BookDetail = lazy(() => import("../../pages/book/BookDetail"));
const Cart = lazy(() => import("../../pages/borrow/Cart"));
const Checkout = lazy(() => import("../../pages/borrow/Checkout"));
const BorrowList = lazy(() => import("../../pages/borrow/BorrowList"));
const OrderList = lazy(() => import("../../pages/borrow/OrderList"));
const Profile = lazy(() => import("../../pages/user/Profile"));
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const Services = lazy(() => import("../../pages/common/Services"));
const News = lazy(() => import("../../pages/common/News"));
const About = lazy(() => import("../../pages/common/About"));
const Contact = lazy(() => import("../../pages/common/Contact"));
const Forum = lazy(() => import("../../pages/common/Forum"));
const Favorites = lazy(() => import("../../pages/common/Favorites"));

// loading fallback
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
      {/* redirect /auth đến /auth/login nếu người dùng bằng cách nào đấy lại gõ mỗi /auth thay vì /auth/login */}
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      {/* auth routes - chỉ cho phép truy cập khi chưa đăng nhập */}
      {/* nếu chưa đăng nhập thì cho truy cập đến auth */}
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

      {/* reset-password - cho phép truy cập dù đã đăng nhập hay chưa */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="reset-password" element={<ResetPasswordForm />} />
      </Route>

      {/* layout chính cho các route  */}
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
        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/user/profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute roles={["ADMIN", "LIBRARIAN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          }
        />
        {/* các page khác */}
        <Route
          path="/services"
          element={
            <Suspense fallback={<PageLoader />}>
              <Services />
            </Suspense>
          }
        />
        <Route
          path="/news"
          element={
            <Suspense fallback={<PageLoader />}>
              <News />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/forum"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/favorites"
          element={
            <Suspense fallback={<PageLoader />}>
              <Favorites />
            </Suspense>
          }
        />
      </Route>

      {/* trang 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
