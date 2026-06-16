import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Shell from "./components/layout/Shell";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import BooksCatalog from "./pages/student/BooksCatalog";
import MyBorrows from "./pages/student/MyBorrows";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import BorrowRecords from "./pages/admin/BorrowRecords";
import Students from "./pages/admin/Students";

/**
 * Floating 3D dust motes — golden particles that drift upward
 * with depth, evoking old library light shafts through mahogany shelves.
 */
const DustMotes = () => (
  <div
    aria-hidden="true"
    style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}
  >
    {/* Left shaft */}
    <span className="dust-mote dust-mote-1" style={{ left: "12%",  bottom: "15%" }} />
    <span className="dust-mote dust-mote-2" style={{ left: "18%",  bottom: "30%" }} />
    <span className="dust-mote dust-mote-3" style={{ left: "8%",   bottom: "45%" }} />
    {/* Centre shaft */}
    <span className="dust-mote dust-mote-4" style={{ left: "48%",  bottom: "10%" }} />
    <span className="dust-mote dust-mote-5" style={{ left: "52%",  bottom: "25%" }} />
    <span className="dust-mote dust-mote-6" style={{ left: "45%",  bottom: "55%" }} />
    {/* Right shaft */}
    <span className="dust-mote dust-mote-1" style={{ left: "80%",  bottom: "20%", animationDelay: "2.5s" }} />
    <span className="dust-mote dust-mote-3" style={{ left: "88%",  bottom: "38%", animationDelay: "0.9s" }} />
    <span className="dust-mote dust-mote-2" style={{ left: "75%",  bottom: "60%", animationDelay: "4.1s" }} />
  </div>
);

/**
 * Wraps each page in a keyed div so the 3D `page-enter` animation
 * re-triggers on every route change — giving a satisfying book-turn feel.
 */
const AnimatedPage = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter scene-3d" style={{ position: "relative", zIndex: 1 }}>
      {children}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <DustMotes />
      <Routes>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <LandingPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <LoginPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/register"
          element={
            <AnimatedPage>
              <RegisterPage />
            </AnimatedPage>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Shell>
                <AnimatedPage>
                  <StudentDashboard />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Shell>
                <AnimatedPage>
                  <BooksCatalog />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-books"
          element={
            <ProtectedRoute>
              <Shell>
                <AnimatedPage>
                  <MyBorrows />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Shell>
                <AnimatedPage>
                  <AdminDashboard />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute adminOnly>
              <Shell>
                <AnimatedPage>
                  <ManageBooks />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/borrows"
          element={
            <ProtectedRoute adminOnly>
              <Shell>
                <AnimatedPage>
                  <BorrowRecords />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute adminOnly>
              <Shell>
                <AnimatedPage>
                  <Students />
                </AnimatedPage>
              </Shell>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;