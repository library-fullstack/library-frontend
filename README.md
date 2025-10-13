# Frontend Todo List – Library UI (React + TypeScript + MUI)

> **Mục tiêu:** Xây dựng giao diện web thư viện trực tuyến (mượn + mua + thanh toán) kết nối backend `library-backend` qua API.  
> **Công nghệ:** React 19 + TypeScript + Material UI + Axios + React Router + Context API  
> **Cổng mặc định ( dev ):** Frontend http://localhost:5173 – Backend http://localhost:4000/api/v1

---

## GIAI ĐOẠN 1 – CẤU HÌNH CƠ BẢN & KHỞI TẠO DỰ ÁN - ĐÃ HOÀN THÀNH

**Mục tiêu:** đầu tiên thì làm project chạy được đã, cấu trúc dự án thì đã theo template rồi.

- [x] Kiểm tra file `.env`
  ```env
  VITE_API_URL=http://localhost:4000/api/v1
  ```
- [x] Dọn dẹp file mặc định (App.tsx, main.tsx, assets, v.v.)
- [x] Chạy thử `npm run dev` đảm bảo mở được trang `http://localhost:5173`
- [x] Cài thêm thư viện cần thiết:
  ```bash
  npm i axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
  npm i -D @types/react-router-dom
  ```
- [x] Kiểm tra cấu trúc thư mục `src/`:
  ```
  src/
   ├─ api/
   ├─ components/
   ├─ context/
   ├─ hooks/
   ├─ pages/
   ├─ styles/
   ├─ theme/
   ├─ utils/
   └─ main.tsx / App.tsx
  ```

---

## GIAI ĐOẠN 2 – AUTH (ĐĂNG NHẬP / ĐĂNG KÝ / TOKEN / PROFILE)

**Mục tiêu:** Người dùng có thể đăng nhập, lưu JWT token, xem profile, đăng xuất.

### Thư mục liên quan

```
src/
 ├─ api/axiosClient.ts
 ├─ context/AuthContext.tsx
 ├─ components/ProtectedRoute.tsx
 └─ pages/auth/Login.tsx / Register.tsx
```

### Tasks

- [ ] `api/axiosClient.ts`
  - [ ] Tạo `axiosClient` với `baseURL` = `VITE_API_URL`
  - [ ] Thêm interceptor gắn `Authorization` nếu có token
- [ ] `context/AuthContext.tsx`
  - [ ] Tạo `AuthContext` lưu `user`, `token`, `login()`, `logout()`, `register()`
  - [ ] Khi có token -> tự gọi `/auth/profile` để lấy user
  - [ ] Lưu token vào `localStorage`
- [ ] `components/ProtectedRoute.tsx`
  - [ ] Nếu chưa có token -> redirect sang `/login`
- [ ] `pages/auth/Login.tsx`
  - [ ] Form MUI: `TextField`, `Button`, `Paper`
  - [ ] Gọi API `POST /auth/login`
  - [ ] Nếu thành công -> lưu token -> redirect `/`
  - [ ] Hiển thị thông báo lỗi (Typography màu đỏ hoặc Snackbar)
- [ ] `pages/auth/Register.tsx`
  - [ ] Form nhập thông tin user
  - [ ] Gọi `POST /auth/register`
  - [ ] Nếu thành công -> chuyển sang `/login`
- [ ] `App.tsx`
  - [ ] Bọc `<AuthProvider>` quanh `<Routes>`
  - [ ] Thêm routes: `/login`, `/register`, `/` (ProtectedRoute)
- [ ] Kiểm tra luồng hoàn chỉnh:
  - [ ] Login -> lưu token -> fetch `/auth/profile`
  - [ ] Logout -> xóa token -> redirect `/login`

---

## GIAI ĐOẠN 3 – LAYOUT CHUNG & ĐIỀU HƯỚNG

**Mục tiêu:** Có Navbar, Footer, Banner và khung layout chung cho toàn app.

Không nghĩ ra cái gì để mà viết tiếp
