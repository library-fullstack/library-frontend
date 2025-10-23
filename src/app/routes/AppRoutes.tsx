import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

// để load ngay
import MainLayout from "../../widgets/layout/MainLayout";

// để load ngay
import ProtectedRoute from "../../widgets/routing/ProtectedRoute";
import PublicRoute from "../../widgets/routing/PublicRoute";

// lazy load pages
const HomePage = lazy(() => import("../../pages/home/HomePage"));
const AuthLayout = lazy(() => import("../../pages/auth/AuthLayout"));
const BookList = lazy(() => import("../../pages/book/BookList"));
const BookDetail = lazy(() => import("../../pages/book/BookDetail"));
const Cart = lazy(() => import("../../pages/borrow/Cart"));
const Checkout = lazy(() => import("../../pages/borrow/Checkout"));
const BorrowList = lazy(() => import("../../pages/borrow/BorrowList"));
const OrderList = lazy(() => import("../../pages/borrow/OrderList"));
const Profile = lazy(() => import("../../pages/user/Profile"));
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));

// auth components
const LoginForm = lazy(
  () => import("../../features/auth/components/LoginForm")
);
const RegisterForm = lazy(
  () => import("../../features/auth/components/RegisterForm")
);
const ForgotPasswordForm = lazy(
  () => import("../../features/auth/components/ForgotPasswordForm")
);
const ResetPasswordForm = lazy(
  () => import("../../features/auth/components/ResetPasswordForm")
);

// common pages
const Services = lazy(() => import("../../pages/common/Services"));
const News = lazy(() => import("../../pages/common/News"));
const About = lazy(() => import("../../pages/common/About"));
const Contact = lazy(() => import("../../pages/common/Contact"));
const Forum = lazy(() => import("../../pages/common/Forum"));
const Favorites = lazy(() => import("../../pages/common/Favorites"));

// UI
const NotFound = lazy(() => import("../../shared/ui/NotFound"));

// fallback
const PageLoader = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "background.default",
      zIndex: 9999,
    }}
  >
    <CircularProgress
      size={50}
      thickness={3.5}
      sx={{
        color: "primary.main",
        mb: 2,
      }}
    />
    <Box
      sx={{
        fontSize: "1rem",
        color: "text.secondary",
        fontWeight: 500,
        letterSpacing: "0.5px",
        animation: "pulse 1.5s ease-in-out infinite",
        "@keyframes pulse": {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      }}
    >
      Đang tải...
    </Box>
  </Box>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* auth - redirect /auth to /auth/login */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

        {/* auth routes - chỉ cho phép truy cập khi chưa đăng nhập */}
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
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrow"
            element={
              <ProtectedRoute>
                <BorrowList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN", "LIBRARIAN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* các page khác */}
          <Route path="/services" element={<Services />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
          />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        {/* trang 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
