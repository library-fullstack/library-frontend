import { Routes, Route, Navigate } from "react-router-dom";

// Layout components
import MainLayout from "../../widgets/layout/MainLayout";

// Feature pages - from src/pages/
import HomePage from "../../pages/home/HomePage";
import AuthLayout from "../../pages/auth/AuthLayout";
import BookList from "../../pages/book/BookList";
import BookDetail from "../../pages/book/BookDetail";
import Cart from "../../pages/borrow/Cart";
import Checkout from "../../pages/borrow/Checkout";
import BorrowList from "../../pages/borrow/BorrowList";
import OrderList from "../../pages/borrow/OrderList";
import Profile from "../../pages/user/Profile";
import AdminDashboard from "../../pages/admin/AdminDashboard";

// Auth components - moved to features/auth/components/
import LoginForm from "../../features/auth/components/LoginForm";
import RegisterForm from "../../features/auth/components/RegisterForm";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";

// Common pages - from src/pages/common/
import Services from "../../pages/common/Services";
import News from "../../pages/common/News";
import About from "../../pages/common/About";
import Contact from "../../pages/common/Contact";
import Forum from "../../pages/common/Forum";
import Favorites from "../../pages/common/Favorites";

// Guards and UI
import NotFound from "../../shared/ui/NotFound";
import ProtectedRoute from "../../widgets/routing/ProtectedRoute";
import PublicRoute from "../../widgets/routing/PublicRoute";

export default function AppRoutes() {
  return (
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
  );
}
