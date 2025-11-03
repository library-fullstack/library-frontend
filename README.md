# Hệ Thống Quản Lý Thư Viện Trực Tuyến# Frontend Todo List – Library UI (React + TypeScript + MUI)

Dự án toàn diện xây dựng nền tảng quản lý thư viện kỹ thuật số với khả năng mượn sách và khu diễn đàn tương tác cộng đồng.> **Mục tiêu:** Xây dựng giao diện web thư viện trực tuyến kết nối backend `library-backend` qua API.

> **Công nghệ:** React 19 + TypeScript + Material UI + Axios + React Router + Context API

## Tổng Quan> **Cổng mặc định ( dev ):** Frontend http://localhost:5173 – Backend http://localhost:4000/api/v1

**Library Management System** là một ứng dụng web hiện đại cung cấp giao diện thân thiện cho sinh viên và độc giả quản lý việc mượn sách, và bảng điều khiển quản trị toàn diện cho nhân viên thư viện.---

| Thành Phần | Công Nghệ | Phiên Bản |## GIAI ĐOẠN 1 – CẤU HÌNH CƠ BẢN & KHỞI TẠO DỰ ÁN - ĐÃ HOÀN THÀNH

|-----------|-----------|----------|

| **Frontend** | React + TypeScript | 19.2.0 |**Mục tiêu:** đầu tiên thì làm project chạy được đã, cấu trúc dự án thì đã theo template rồi.

| **UI Framework** | Material UI | 7.3.4 |

| **Backend** | Express + TypeScript | 4.19.2 |- [x] Kiểm tra file `.env`

| **Database** | MySQL | 3.15.1 | ```env

| **State Management** | Context API + React Hooks | - | VITE_API_URL=http://localhost:4000/api/v1

| **HTTP Client** | Axios | 1.13.1 | ```

| **Routing** | React Router | 7.9.4 |- [x] Dọn dẹp file mặc định (App.tsx, main.tsx, assets, v.v.)

| **Authentication** | JWT + bcrypt | - |- [x] Chạy thử `npm run dev` đảm bảo mở được trang `http://localhost:5173`

- [x] Cài thêm thư viện cần thiết:

## Cấu Trúc Dự Án ```bash

npm i axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material

### Frontend (library-ui) npm i -D @types/react-router-dom

````

```- [x] Kiểm tra cấu trúc thư mục `src/`:

src/  ```

├── app/  src/

│   ├── config/              # Cấu hình ứng dụng   ├─ api/

│   ├── routes/              # Định tuyến các route   ├─ components/

│   └── theme/               # Cấu hình theme Material UI   ├─ context/

├── features/                # Feature modules   ├─ hooks/

│   ├── admin/               # Quản trị hệ thống   ├─ pages/

│   ├── auth/                # Xác thực & phân quyền   ├─ styles/

│   ├── books/               # Quản lý sách   ├─ theme/

│   ├── borrow/              # Quản lý mượn trả   ├─ utils/

│   ├── favourites/          # Danh sách yêu thích   └─ main.tsx / App.tsx

│   ├── forum/               # Khu diễn đàn  ```

│   └── users/               # Quản lý người dùng

├── pages/                   # Trang công cộng---

│   ├── admin/               # Trang quản trị

│   ├── auth/                # Trang đăng nhập/đăng ký## GIAI ĐOẠN 2 – AUTH (ĐĂNG NHẬP / ĐĂNG KÝ / TOKEN / PROFILE)

│   ├── book/                # Chi tiết sách

│   ├── borrow/              # Mượn sách, thanh toán**Mục tiêu:** Người dùng có thể đăng nhập, lưu JWT token, xem profile, đăng xuất.

│   ├── common/              # Tin tức, liên hệ, về chúng tôi

│   ├── home/                # Trang chủ### Thư mục liên quan

│   └── user/                # Hồ sơ người dùng

├── shared/                  # Thành phần dùng chung```

│   ├── api/                 # Cấu hình HTTP clientsrc/

│   ├── components/          # Component tái sử dụng ├─ api/axiosClient.ts

│   ├── hooks/               # Custom hooks ├─ context/AuthContext.tsx

│   ├── lib/                 # Utility functions ├─ components/ProtectedRoute.tsx

│   ├── types/               # Type definitions └─ pages/auth/Login.tsx / Register.tsx

│   └── ui/                  # UI components```

├── context/                 # Context API

│   ├── AuthContext.tsx      # Quản lý xác thực### Tasks

│   ├── CartContext.tsx      # Giỏ mượn sách

│   └── ThemeContext.tsx     # Cấu hình giao diện- [x] `api/axiosClient.ts`

├── widgets/                 # Widget & layout  - [x] Tạo `axiosClient` với `baseURL` = `VITE_API_URL`

│   ├── book-card/           # Card sách  - [x] Thêm interceptor gắn `Authorization` nếu có token

│   ├── book-catalog-filters/# Bộ lọc sách- [x] `context/AuthContext.tsx`

│   ├── layout/              # Layout chính  - [x] Tạo `AuthContext` lưu `user`, `token`, `login()`, `logout()`, `register()`

│   └── routing/             # Protected routes  - [x] Khi có token -> tự gọi `/auth/profile` để lấy user

└── styles/                  # CSS/SCSS toàn cục  - [x] Lưu token vào `localStorage`

```- [ ] `components/ProtectedRoute.tsx`

- [ ] Nếu chưa có token -> redirect sang `/login`

### Backend (library-api)- [x] `pages/auth/Login.tsx`

- [x] Form MUI: `TextField`, `Button`, `Paper`

```  - [x] Gọi API `POST /auth/login`

src/  - [x] Nếu thành công -> lưu token -> redirect `/`

├── config/                  # Cấu hình  - [x] Hiển thị thông báo lỗi (Typography màu đỏ hoặc Snackbar)

│   ├── db.ts                # Kết nối database- [x] `pages/auth/Register.tsx`

│   ├── env.ts               # Biến môi trường  - [x] Form nhập thông tin user

│   └── cloudinary.ts        # CDN hình ảnh  - [x] Gọi `POST /auth/register`

├── controllers/             # Xử lý request  - [x] Nếu thành công -> chuyển sang `/login`

│   ├── admin.controller.ts- [x] `App.tsx`

│   ├── auth.controller.ts  - [x] Bọc `<AuthProvider>` quanh `<Routes>`

│   ├── book/  - [x] Thêm routes: `/login`, `/register`, `/` (ProtectedRoute)

│   ├── borrow.controller.ts- [x] Kiểm tra luồng hoàn chỉnh:

│   ├── forum/  - [x] Login -> lưu token -> fetch `/auth/profile`

│   └── user.controller.ts  - [x] Logout -> xóa token -> redirect `/login`

├── models/                  # Schema database

│   ├── user.model.ts---

│   ├── book.model.ts

│   ├── borrow.model.ts## GIAI ĐOẠN 3 – LAYOUT CHUNG & ĐIỀU HƯỚNG

│   └── forum/

├── routes/                  # API endpoints**Mục tiêu:** Có Navbar, Footer, Banner và khung layout chung cho toàn app.

│   ├── auth.routes.ts

│   ├── book/Không nghĩ ra cái gì để mà viết tiếp

│   ├── borrow.routes.ts
│   ├── forum/
│   └── user.routes.ts
├── services/                # Business logic
│   ├── auth.service.ts
│   ├── book.service.ts
│   ├── borrow.service.ts
│   └── user.service.ts
├── middlewares/             # Middleware
│   ├── auth.middleware.ts
│   ├── authorize.middleware.ts
│   ├── validate.middleware.ts
│   └── error.middleware.ts
└── utils/                   # Utility functions
````

## Tính Năng Hoàn Thành

### 1. Xác Thực & Phân Quyền

- [x] Đăng ký tài khoản (mã sinh viên, thông tin cá nhân)
- [x] Đăng nhập bằng email hoặc mã sinh viên ( eg. do có liên kết với database của trường)
- [x] Xác thực token JWT
- [x] Mã hóa mật khẩu bcrypt + pepper
- [x] Quên mật khẩu & đặt lại qua email
- [x] Hai vai trò: ADMIN/LIBRARIAN và STUDENT
- [x] Middleware kiểm tra quyền truy cập

### 2. Quản Lý Sách

- [] Thêm/cập nhật/xóa sách (chỉ ADMIN/LIBRARIAN)
- [x] Danh sách sách với phân trang
- [x] Chi tiết sách đầy đủ
- [x] Tìm kiếm theo tiêu đề, tác giả
- [x] Lọc theo danh mục, định dạng, ngôn ngữ
- [x] Sắp xếp (ngày thêm, lượt mượn, xếp hạng)
- [] Tải lên hình ảnh bìa sách (Cloudinary)
- [] Quản lý danh mục sách

### 3. Mượn & Trả Sách

- [] Thêm sách vào giỏ mượn
- [] Đặt yêu cầu mượn sách
- [] Lịch sử mượn trả
- [] Theo dõi hạn trả
- [] Thông báo nhắc hạn trả
- [] Quản lý trạng thái mượn (chờ, đã mượn, đã trả)

### 4. Khu Diễn Đàn

- [] Danh mục thảo luận
- [] Bài viết cộng đồng
- [] Bình luận trên bài viết
- [] Hệ thống điểm/badge cho người dùng
- [] Tìm kiếm bài viết

### 5. Người Dùng

- [x] Xem hồ sơ cá nhân
- [x] Cập nhật thông tin
- [x] Thay đổi mật khẩu
- [x] Đánh dấu sách yêu thích
- [x] Lịch sử hoạt động

### 6. Bảng Điều Khiển Quản Trị

- [x] Dashboard với thống kê (sách, người dùng, mượn trả)
- [x] Quản lý người dùng (CRUD)
- [x] Quản lý sách (CRUD)
- [x] Quản lý mượn trả
- [x] Báo cáo & phân tích
- [x] Quản lý banner quảng cáo

## Tính Năng Sắp Tới

### Sắp Phát Triển

- [ ] Hệ thống đề xuất sách (recommendation engine)
- [ ] Mượn sách tại nhà (home delivery)
- [ ] Đọc online (e-book viewer)
- [ ] Phân tích độc lập (reading statistics)
- [ ] Chia sẻ xã hội (social sharing)
- [ ] Tích hợp Slack/Discord notifications
- [ ] Video hướng dẫn
- [ ] Hệ thống rating & review

### Có Thể Sẽ Phát Triển

- [ ] Tích hợp thư viện thực tế (RFID tracking)
- [ ] Augmented Reality (xem sách 3D)
- [ ] AI chatbot hỗ trợ
- [ ] Quản lý kho hàng nâng cao
- [ ] API công khai cho đối tác
- [ ] Đa ngôn ngữ toàn cầu

## Cài Đặt & Chạy

### Yêu Cầu

- Node.js 18.x hoặc cao hơn
- MySQL 8.0+
- npm/yarn

### Frontend

```bash
cd library-ui
npm install
npm run dev
```

Truy cập: http://localhost:5173

### Backend

```bash
cd library-api
npm install
npm run dev
```

API chạy: http://localhost:4000/api/v1

### Biến Môi Trường

**Frontend** (.env.local)

```env
VITE_API_URL=http://localhost:4000/api/v1
```

**Backend** (.env)

```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Script Hay Dùng

### Frontend

```bash
npm run dev       # Chạy dev server
npm run build     # Build sản xuất
npm run preview   # Xem preview build
npm run lint      # Kiểm tra lỗi code
```

### Backend

```bash
npm run dev       # Chạy với tsx watch
npm run build     # Build sang JavaScript
npm start         # Chạy build production
npm run lint      # Kiểm tra code
npm run format    # Format code với Prettier
```

## API Endpoints

### Authentication

```
POST   /api/v1/auth/register              # Đăng ký
POST   /api/v1/auth/login                 # Đăng nhập
POST   /api/v1/auth/forgot-password       # Quên mật khẩu
POST   /api/v1/auth/reset-password        # Đặt lại mật khẩu
GET    /api/v1/auth/profile               # Lấy hồ sơ
```

### Books

```
GET    /api/v1/books                      # Danh sách sách
GET    /api/v1/books/:id                  # Chi tiết sách
POST   /api/v1/books                      # Thêm sách (ADMIN)
PUT    /api/v1/books/:id                  # Cập nhật sách (ADMIN)
DELETE /api/v1/books/:id                  # Xóa sách (ADMIN)
GET    /api/v1/books/:id/borrowers        # Lịch sử mượn
```

### Borrow (Mượn Sách)

```
POST   /api/v1/borrows                    # Tạo yêu cầu mượn
GET    /api/v1/borrows                    # Danh sách mượn của user
GET    /api/v1/borrows/:id                # Chi tiết mượn
PUT    /api/v1/borrows/:id                # Cập nhật trạng thái
DELETE /api/v1/borrows/:id                # Hủy mượn
```

### Users

```
GET    /api/v1/users                      # Danh sách user (ADMIN)
GET    /api/v1/users/:id                  # Chi tiết user
PUT    /api/v1/users/:id                  # Cập nhật user
DELETE /api/v1/users/:id                  # Xóa user (ADMIN)
```

### Forum

```
GET    /api/v1/forum/categories           # Danh mục diễn đàn
GET    /api/v1/forum/posts                # Danh sách bài viết
POST   /api/v1/forum/posts                # Tạo bài viết
POST   /api/v1/forum/posts/:id/comments   # Bình luận
```

## Database Schema

### Bảng Chính

- `users` - Thông tin người dùng
- `books` - Danh mục sách
- `borrows` - Lịch sử mượn trả
- `borrow_details` - Chi tiết từng sách mượn
- `categories` - Danh mục sách
- `forum_categories` - Danh mục diễn đàn
- `forum_posts` - Bài viết diễn đàn
- `forum_comments` - Bình luận
- `banners` - Quảng cáo banner
- `settings` - Cài đặt hệ thống

## Hướng Dẫn Phát Triển

### Thêm Tính Năng Mới

1. **Backend**

   - Thêm route mới trong routes/
   - Tạo controller trong controllers/
   - Thêm business logic trong services/
   - Cập nhật database schema nếu cần

2. **Frontend**
   - Tạo API service trong shared/api/
   - Thêm component trong features/ hoặc shared/components/
   - Tạo page trong pages/ nếu cần route mới
   - Cập nhật AppRoutes.tsx nếu cần

### Code Style

- TypeScript strict mode
- Functional components với hooks
- Props type checking
- Error handling toàn bộ
- Loading states rõ ràng
- Responsive design (mobile-first)

## Troubleshooting

### Lỗi Kết Nối Database

```bash
# Kiểm tra MySQL chạy
mysql -u root -p

# Tạo database
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Lỗi CORS

Kiểm tra corsOptions trong backend/src/app.ts

### Token Hết Hạn

Frontend tự động refresh token qua interceptor

### Lỗi Upload Hình Ảnh

Kiểm tra Cloudinary credentials trong .env

## Đóng Góp

Mọi đóng góp đều được chào đón. Vui lòng:

1. Fork repository
2. Tạo feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open Pull Request

## Giấy Phép

MIT License - xem file LICENSE để chi tiết

## Liên Hệ & Hỗ Trợ

- Issues: Báo cáo lỗi qua GitHub Issues
- Email: support@library.local
- Documentation: Wiki

---

Cập nhật lần cuối: 2025-11-03
