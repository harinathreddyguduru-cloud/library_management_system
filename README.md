# 📚 College Library Management System — Frontend

A modern React + Tailwind CSS frontend for a College Library Management System.

---

## Project Structure

```
library-ms/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── index.js              # Axios instance + all API functions
│   ├── components/
│   │   ├── common/
│   │   │   ├── ProtectedRoute.jsx  # Auth guard + admin guard
│   │   │   └── UI.jsx              # Spinner, Alert, Badge, Modal, StatCard, EmptyState
│   │   └── layout/
│   │       └── Shell.jsx           # Sidebar + responsive layout shell
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state (login/register/logout)
│   ├── hooks/
│   │   └── useApi.js               # Generic data-fetching hook
│   ├── pages/
│   │   ├── LoginPage.jsx           # /login
│   │   ├── RegisterPage.jsx        # /register
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx  # /dashboard
│   │   │   ├── BooksCatalog.jsx      # /books
│   │   │   └── MyBorrows.jsx         # /my-books
│   │   └── admin/
│   │       ├── AdminDashboard.jsx    # /admin
│   │       ├── ManageBooks.jsx       # /admin/books  (full CRUD)
│   │       ├── BorrowRecords.jsx     # /admin/borrows
│   │       └── Students.jsx          # /admin/students
│   ├── App.jsx                     # Router + route definitions
│   ├── index.js                    # Entry point
│   └── index.css                   # Tailwind directives + custom utilities
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI library |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Tailwind CSS | Utility-first styling |
| React Hooks | State & side-effects |

---

## Setup & Run

```bash
cd library-ms

# Install dependencies
npm install

# Start development server (backend must be running on :5000)
npm start
```

Ensure your backend is running at `http://localhost:5000`.

---

## API Endpoints Expected

### Auth
| Method | Path | Body |
|--------|------|------|
| POST | /api/auth/login | `{ email, password }` |
| POST | /api/auth/register | `{ name, email, password, studentId, department }` |
| POST | /api/auth/logout | — |
| GET  | /api/auth/me | — |

### Books
| Method | Path | Notes |
|--------|------|-------|
| GET  | /api/books | `?search=&genre=&page=&limit=` |
| POST | /api/books | Admin only |
| PUT  | /api/books/:id | Admin only |
| DELETE | /api/books/:id | Admin only |

### Borrowing
| Method | Path | Notes |
|--------|------|-------|
| POST | /api/borrow | `{ bookId }` |
| PUT  | /api/borrow/:id/return | — |
| GET  | /api/borrow/my | Current user's borrows |
| GET  | /api/borrow/all | Admin: all borrows `?status=&search=&page=` |

### Admin
| Method | Path |
|--------|------|
| GET | /api/students |
| DELETE | /api/students/:id |
| GET | /api/stats/dashboard |

---

## Features

### Student
- Login / Register with department selection
- Dashboard with active borrows, overdue alerts, due-soon warnings
- Paginated book catalog with genre filter + search
- Borrow books with confirmation modal
- Return borrowed books
- Borrowing history tab

### Admin
- Dashboard with system-wide stats
- Full book CRUD (add, edit, delete) with modal form
- All borrow records with status filter + search
- Mark borrows as returned
- Student list with detail view and removal

### Shared
- Responsive sidebar layout (collapses to hamburger on mobile)
- JWT stored in localStorage, auto-attached via Axios interceptor
- 401 auto-redirects to login
- Role-based routing (ProtectedRoute)
- Reusable component library (Alert, Badge, Modal, StatCard, EmptyState)

---

## Auth Flow

1. User logs in → JWT + user object stored in `localStorage`
2. `AuthContext` exposes `user`, `login`, `logout`, `isAdmin`
3. All Axios requests auto-attach `Authorization: Bearer <token>`
4. `ProtectedRoute` checks `user` (and `adminOnly` flag) before rendering
5. 401 response → auto logout + redirect to `/login`
