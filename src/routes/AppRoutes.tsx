import { Routes, Route, Navigate } from "react-router-dom";

// Features
import HomePage from "../features/home/HomePage";
import MainLayout from "../components/Layout/MainLayout";
import AuthLayout from "../features/auth/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";
import RegisterForm from "../features/auth/components/RegisterForm";
import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";
import BookList from "../features/books/pages/BookList";
import BookDetail from "../features/books/pages/BookDetail";
import Cart from "../features/borrow/pages/Cart";
import Checkout from "../features/borrow/pages/Checkout";
import BorrowList from "../features/borrow/pages/BorrowList";
import OrderList from "../features/borrow/pages/OrderList";
import Profile from "../features/user/pages/Profile";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import Services from "../features/common/pages/Services";
import News from "../features/common/pages/News";
import About from "../features/common/pages/About";
import Contact from "../features/common/pages/Contact";
import Forum from "../features/common/pages/Forum";
import Favorites from "../features/common/pages/Favorites";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

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
    </Routes>
  );
}
