# Library UI – Frontend

Hệ thống Quản Lý Thư Viện Trực Tuyến  
Frontend xây dựng bằng **React + TypeScript + Vite + Material UI**  
Kết nối trực tiếp backend `library-api` qua REST API.

## Công Nghệ Sử Dụng

| Thành phần       | Công nghệ           | Phiên bản |
| ---------------- | ------------------- | --------- |
| Framework        | React + TypeScript  | 19.x      |
| Bundler          | Vite                | 5.x       |
| UI Library       | Material UI (MUI)   | 7.x       |
| HTTP Client      | Axios               | 1.x       |
| Router           | React Router        | 7.x       |
| State Management | Context API + Hooks | -         |
| Icons            | MUI Icons           | 7.x       |

## Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Kiến Trúc & Cấu Trúc Thư Mục](#kiến-trúc--cấu-trúc-thư-mục)
- [Cài Đặt & Chạy Dự Án](#cài-đặt--chạy-dự-án)
- [Biến Môi Trường](#biến-môi-trường)
- [Chức Năng Đã Hoàn Thành](#chức-năng-đã-hoàn-thành)
- [Chức Năng Sắp Phát Triển](#chức-năng-sắp-phát-triển)
- [Scripts Hữu Ích](#scripts-hữu-ích)
- [Hướng Dẫn Phát Triển](#hướng-dẫn-phát-triển)
- [Troubleshooting](#troubleshooting)
- [Liên Hệ & Giấy Phép](#liên-hệ--giấy-phép)

## Giới Thiệu

Library UI là giao diện web hiện đại phục vụ:

- Sinh viên mượn sách, xem chi tiết
- Quản trị viên quản lý người dùng, sách, mượn trả
- Việc tương tác cộng đồng thông qua diễn đàn

**Cổng mặc định (dev):**  
Frontend: http://localhost:5173  
Backend: http://localhost:4000/api/v1

## Kiến Trúc & Cấu Trúc Thư Mục

```
src/
├── api/
├── app/
├── components/
├── context/
├── features/
│   ├── books/
│   ├── borrow/
│   ├── favourites/
│   ├── forum/
│   └── users/
├── hooks/
├── lib/
├── pages/
├── styles/
└── main.tsx / App.tsx
```

## Cài Đặt & Chạy Dự Án

### Cài đặt

```
npm install
```

### Chạy development

```
npm run dev
```

Truy cập: http://localhost:5173

## Biến Môi Trường

Tạo file `.env.local`:

```
VITE_API_URL=http://localhost:4000/api/v1
```

## Chức Năng Đã Hoàn Thành

### 1. Xác thực & người dùng

- Đăng ký / đăng nhập
- Lưu token JWT
- Xem & cập nhật profile
- Đổi mật khẩu
- Danh sách yêu thích
- Lịch sử hoạt động

### 2. Quản lý sách

- Danh sách + phân trang
- Chi tiết sách
- Lọc, tìm kiếm, sắp xếp

### 3. Dashboard quản trị

- CRUD người dùng
- CRUD sách
- Quản lý mượn trả
- Banner & thống kê

## Chức Năng Sắp Phát Triển

- Giỏ mượn
- Đặt yêu cầu mượn
- Lịch sử mượn trả
- Diễn đàn đầy đủ
- Recommendation engine
- E-book viewer
- Reading statistics
- Đa ngôn ngữ
- AI hỗ trợ

## Scripts Hữu Ích

```
npm run dev
npm run build
npm run preview
npm run lint
```

## Hướng Dẫn Phát Triển

- Tạo API service trong shared/api
- Tạo hook nếu cần
- Tạo UI component
- Thêm route mới vào AppRoutes.tsx
- TypeScript strict mode
- Clean code + hooks

## Troubleshooting

### Lỗi CORS:

- Kiểm tra corsOptions backend

### Lỗi token:

- Kiểm tra axios interceptor

### Lỗi API:

- Kiểm tra VITE_API_URL

## Giấy Phép

MIT License
