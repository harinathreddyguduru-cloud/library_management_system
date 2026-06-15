import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("library_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("library_token");
      localStorage.removeItem("library_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const mapBook = (book) => ({
  ...book,
  _id: book.id,
  title: book.title,
  author: book.author,
  availableCopies: book.available_count ?? book.availableCopies ?? 0,
  totalCopies: book.total_count ?? book.totalCopies ?? 0,
  genre: book.genre ?? book.category_name ?? "",
  year: book.year ?? book.published_year ?? "",
  description: book.description ?? "",
  publisher: book.publisher ?? "",
});

const mapBorrowRecord = (record) => ({
  ...record,
  _id: record.id,
  borrowedAt: record.issue_date,
  dueDate: record.due_date,
  returnedAt: record.return_date,
  book: {
    title: record.book_title || record.title,
    author: record.book_author || record.author,
  },
  student: {
    name: record.student_name || record.name,
    studentId: record.roll_number || record.student_id,
  },
});

export const authAPI = {
  login: (data) => api.post("/api/auth/login", data),
  register: (data) => api.post("/api/auth/register", data),
  logout: () => Promise.resolve(),
};

export const booksAPI = {
  getAll: (params) => api.get("/api/books", { params }).then((res) => ({
    data: {
      books: res.data.map(mapBook),
      totalPages: 1,
      total: res.data.length,
    },
  })),
  create: (data) => api.post("/api/books", data),
  update: (id, data) => api.put(`/api/books/${id}`, data),
  delete: (id) => api.delete(`/api/books/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get("/api/categories"),
};

export const borrowAPI = {
  borrow: (bookId, studentId) => api.post("/api/issues/issue", { book_id: bookId, student_id: studentId }),
  return: (issueId) => api.post("/api/issues/return", { issue_id: issueId }),
  myBorrows: (studentId) => api.get(`/api/student/${studentId}/history`).then((res) => ({ data: res.data.map(mapBorrowRecord) })),
  allBorrows: (params) => api.get("/api/issues", { params }).then((res) => ({ data: { borrows: res.data.map(mapBorrowRecord) } })),
};

export const studentAPI = {
  history: (studentId) => api.get(`/api/student/${studentId}/history`),
  getAll: (params) => api.get("/api/student", { params }),
};

export const studentsAPI = studentAPI;

export const statsAPI = {
  dashboard: () => api.get("/api/admin/dashboard"),
  overdueBooks: () => api.get("/api/admin/overdue-books"),
};

export const adminAPI = statsAPI;

export default api;
