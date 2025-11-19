# Library UI - Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)]()
[![Vite](https://img.shields.io/badge/Vite-5-purple)]()
[![MUI](https://img.shields.io/badge/MUI-7-blue)]()
[![Issues](https://img.shields.io/github/issues/library-fullstack/library-frontend)]()
[![Stars](https://img.shields.io/github/stars/library-fullstack/library-frontend)]()

---

# Library UI – Frontend  
**Online Library Management System UI**  
Built with **React - TypeScript - Vite - Material UI**  
Connects to backend `library-api` via REST API.

# English Version

## Overview

Library UI is the frontend of the **Online Library Management System**, providing:  
- Book browsing, searching, filtering  
- User account management  
- Borrow/return workflows  
- Admin dashboard (users, books, borrow records)  
- Community interaction via forum (expanding soon)

**Dev URLs**:  
- Frontend: `http://localhost:5173`  
- Backend: `http://localhost:4000/api/v1`

---

## Tech Stack

| Component        | Technology           | Version |
|-----------------|-----------------------|---------|
| Framework        | React + TypeScript    | 19.x    |
| Bundler          | Vite                  | 5.x     |
| UI Library       | Material UI (MUI)     | 7.x     |
| HTTP Client      | Axios                 | 1.x     |
| Router           | React Router          | 7.x     |
| State Mgmt       | Context API + Hooks   | -       |
| Icons            | MUI Icons             | 7.x     |

---

## Project Structure

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

---

## Installation

Install:
```
npm install
```

Run development:
```
npm run dev
```

Open: http://localhost:5173

---

## Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:4000/api/v1
```

---

## Completed Features

### 1. Authentication & Users  
- Register / Login  
- JWT token handling  
- Profile view/update  
- Change password  
- Favourites  
- Activity history  

### 2. Books  
- List + pagination  
- Book details  
- Search, sort, filter  

### 3. Admin Dashboard  
- CRUD users  
- CRUD books  
- Borrow/return management  
- Banner + stats  

---

## Upcoming Features   
- Borrow request  
- Rich forum  
- E-book reader  
- Recommendation engine  
- Reading statistics  
- Multilanguage UI  
- AI assistant  

---

## Useful Scripts
```
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Troubleshooting

### CORS error  
Check backend `corsOptions`.

### Token error  
Check Axios interceptor.

### API error  
Validate `VITE_API_URL`.

---

## License  
MIT License

---

# Phiên Bản Tiếng Việt

## Giới Thiệu

Library UI là giao diện web của **Hệ thống Quản Lý Thư Viện Trực Tuyến**, hỗ trợ:  
- Xem, tìm kiếm, lọc sách  
- Quản lý tài khoản người dùng  
- Quy trình mượn trả sách  
- Dashboard quản trị (user, sách, mượn trả)  
- Tương tác cộng đồng thông qua diễn đàn

Cổng phát triển:  
Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000/api/v1`

---

## Công Nghệ

(Bảng công nghệ giống bản tiếng Anh)

---

## Cấu Trúc Thư Mục

(Giống phần tiếng Anh)

---

## Cài Đặt

Cài:
```
npm install
```

Chạy:
```
npm run dev
```

---

## Biến Môi Trường  
Tạo file `.env.local`:
```
VITE_API_URL=http://localhost:4000/api/v1
```

---

## Chức Năng Đã Hoàn Thành

- Đăng ký / đăng nhập  
- Quản lý token  
- Hồ sơ cá nhân  
- Danh sách yêu thích  
- Tìm kiếm và xem chi tiết sách  
- Dashboard quản trị  

---

## Chức Năng Sắp Phát Triển  
(giống bản tiếng Anh)

---

## Giấy Phép  
MIT License
