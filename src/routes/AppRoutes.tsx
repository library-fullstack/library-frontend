import { Routes, Route, Navigate } from "react-router-dom";
import * as React from "react";

// Layouts & small components (keep static)
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../pages/auth/AuthLayout";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";

// Lazy-loaded pages to enable code-splitting
const HomePage = React.lazy(() => import("../pages/home/HomePage"));
const BookList = React.lazy(() => import("../pages/book/BookList"));
const BookDetail = React.lazy(() => import("../pages/book/BookDetail"));
const Cart = React.lazy(() => import("../pages/borrow/Cart"));
const Checkout = React.lazy(() => import("../pages/borrow/Checkout"));
const BorrowList = React.lazy(() => import("../pages/borrow/BorrowList"));
const OrderList = React.lazy(() => import("../pages/borrow/OrderList"));
const Profile = React.lazy(() => import("../pages/user/Profile"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const Services = React.lazy(() => import("../pages/common/Services"));
const News = React.lazy(() => import("../pages/common/News"));
const About = React.lazy(() => import("../pages/common/About"));
const Contact = React.lazy(() => import("../pages/common/Contact"));
const Forum = React.lazy(() => import("../pages/common/Forum"));
const Favorites = React.lazy(() => import("../pages/common/Favorites"));
const NotFound = React.lazy(() => import("../components/commons/NotFound"));

export default function AppRoutes() {
  return (
    // ???? ?????
    <React.Suspense
      fallback={
        <div style={{ padding: 24, textAlign: "center" }}>
          <span>Đang tải...</span>
        </div>
      }
    >
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
        <Route path="/forum" element={<Forum />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>

      {/* trang 404 */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}
