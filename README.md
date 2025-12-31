# Library UI - Frontend

A modern, responsive React web application for an online library management system. Built with React, TypeScript, Vite, and Material-UI. Students can browse and borrow books, while admins manage the entire system.

## Overview

A modern, responsive React web application for an online library management system. Built with React, TypeScript, Vite, and Material-UI. Students can browse and borrow books, while admins manage the entire system.

Key Features:

- User authentication & profiles
- Book browsing with search & filters
- Borrowing system with cart
- Admin dashboard
- Forum/discussion
- Favorites & activity tracking
- Dark/light theme

## Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API at `http://localhost:4000/api/v1`

### Installation

```bash
git clone <your-repo-url>
cd library-ui
npm install
cp .env.example .env.local
# Update .env.local: VITE_API_URL=http://localhost:4000/api/v1
npm run dev
```

Application URL: `http://localhost:5173`

### Build & Deploy

```bash
npm run build
npm run preview
```

## Tech Stack

| Component            | Technology           | Version  |
| -------------------- | -------------------- | -------- |
| **Framework**        | React                | 18.3+    |
| **Language**         | TypeScript           | Latest   |
| **Build Tool**       | Vite                 | 5.x      |
| **UI Library**       | Material-UI (MUI)    | 7.x      |
| **HTTP Client**      | Axios                | 1.x      |
| **Router**           | React Router         | 7.x      |
| **Data Fetching**    | TanStack React Query | 5.x      |
| **State Management** | Context API          | Built-in |
| **Forms**            | React Hook Form      | 7.x      |
| **Icons**            | MUI Icons            | 7.x      |
| **Charts**           | MUI X Charts         | 7.x      |
| **Tables**           | MUI X Data Grid      | 8.x      |
| **Rich Text**        | React Quill          | 2.x      |
| **Image Crop**       | React Cropper        | 2.x      |
| **Notifications**    | Notistack            | 3.x      |

## Project Structure

```
src/
├── app/
│   ├── config/              # Configuration
│   ├── routes/              # Route definitions
│   └── theme/               # MUI theme
├── components/              # Shared components
├── context/                 # Global state (Context API)
├── features/                # Feature modules
│   ├── admin/               # Admin panel
│   ├── auth/                # Authentication
│   ├── books/               # Book browsing
│   ├── borrow/              # Borrowing
│   ├── events/              # Events
│   ├── favourites/          # Favorites
│   ├── forum/               # Forum
│   └── users/               # User management
├── pages/                   # Page components
├── shared/                  # Shared utilities
│   ├── api/                 # API services
│   ├── components/          # UI components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   └── types/               # Types
├── styles/                  # Global styles
└── main.tsx                 # Entry point
```

## Features Completed

### User & Auth

- Registration & login
- Profile management
- Password change
- JWT with auto-refresh
- Session management

### Book Management

- Browse catalog
- Search & filters
- Detailed views
- Favorites
- Recommendations

### Borrowing

- Borrow requests
- Shopping cart
- History tracking
- Due dates
- Return books

### Admin Dashboard

- User management
- Book management
- Borrow approvals
- News management
- Events management
- Statistics & reports
- System settings

### Community

- Forum discussions
- Comments & posts
- News/announcements
- Event calendar

## Routes

```
GET    /                        - Home
GET    /auth/login              - Login
GET    /auth/register           - Register
GET    /books                   - Book listing
GET    /books/:id               - Book details
GET    /borrow                  - Borrowing history
GET    /borrow-cart             - Cart
GET    /forum                   - Forum
GET    /profile                 - User profile
GET    /admin/*                 - Admin pages
```

## Environment Variables

```env
VITE_API_URL=http://localhost:4000/api/v1
```

## Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # ESLint check
```

## Theme & Styling

- Material-UI theming system
- Light & dark mode support
- Responsive design
- Custom colors & typography
- Emotion CSS-in-JS

## Common Issues & Solutions

**CORS Error**

- Check backend URL in VITE_API_URL
- Verify backend CORS settings

**401 Unauthorized**

- Login again to refresh token
- Check localStorage

**Build Errors**

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Development Guidelines

### Architecture Principles

- Component-Driven: Reusable, focused components
- Context for State: Use Context API for global state (auth, theme, etc.)
- Axios Interceptors: Automatic token refresh and error handling
- Type Safety: Always use TypeScript interfaces
- Responsive Design: Mobile-first approach with MUI breakpoints
- Performance: Lazy loading, code splitting, and memoization

### Creating a New Feature

1. Create folder in `src/features/`
2. Add pages in `src/pages/`
3. Create API service in `src/shared/api/`
4. Add routes to `AppRoutes.tsx`
5. Use Context or Query for state management
6. Follow existing patterns

### Code Style

- Use functional components with hooks
- TypeScript strict mode enabled
- ESLint rules enforced
- Meaningful variable and component names
- JSDoc comments for complex logic
- Components under 300 lines ideally

## API Integration

### Axios Configuration

The frontend automatically:

- Attaches JWT tokens to requests
- Refreshes expired tokens
- Handles CORS
- Shows error notifications
- Caches responses with React Query

### Example API Call

```typescript
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBooks = async () => {
  const { data } = await axios.get("/books");
  return data.data;
};

function BookList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <div>
      {data.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

## Performance Optimization

- Code Splitting: Routes are lazy loaded
- Image Optimization: Images from Cloudinary (CDN)
- Caching: React Query caches API responses
- Bundle Size: Tree-shaking and minification
- SEO: React Helmet for meta tags
- Analytics: Vercel Analytics & Speed Insights

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

- PWA (Progressive Web App) support
- Offline functionality
- Real-time notifications (WebSocket)
- Advanced search with filters
- Book recommendations engine
- E-book reader
- Mobile app (React Native)
- Multi-language support (i18n)
- Advanced analytics
- Video tutorials for books

## Testing

Testing infrastructure is being set up. Planned testing stack:

- Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests
- Run tests with `npm test`

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Material-UI for beautiful components
- TanStack for data fetching
- Vercel for hosting and analytics
- Thanks to the open source community
