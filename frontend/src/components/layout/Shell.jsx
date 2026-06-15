import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const studentLinks = [
  { to: "/dashboard",        icon: "⊞",  label: "Dashboard"       },
  { to: "/books",            icon: "📚", label: "Book Catalog"    },
  { to: "/my-books",         icon: "📖", label: "My Borrowed"     },
];

const adminLinks = [
  { to: "/admin",            icon: "⊞",  label: "Dashboard"       },
  { to: "/admin/books",      icon: "📚", label: "Manage Books"    },
  { to: "/admin/borrows",    icon: "📋", label: "Borrow Records"  },
  { to: "/admin/students",   icon: "👥", label: "Students"        },
];

const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-primary-600 text-white shadow-sm shadow-primary-200"
          : "text-gray-500 hover:bg-primary-50 hover:text-primary-700"
      }`
    }
  >
    <span className="text-base leading-none">{icon}</span>
    {label}
  </NavLink>
);

const Sidebar = ({ mobile = false, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className={`flex flex-col h-full bg-white border-r border-gray-100 ${mobile ? "w-72" : "w-64"}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-display font-bold text-lg shadow-sm">
            L
          </div>
          <div>
            <p className="font-display font-bold text-ink text-sm leading-tight">College Library</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest px-4 mb-2">
          {isAdmin ? "Administration" : "Navigation"}
        </p>
        {links.map((l) => (
          <NavItem key={l.to} {...l} onClick={mobile ? onClose : undefined} />
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-gray-400 truncate capitalize">{user?.role || "student"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition font-medium"
        >
          <span>↩</span> Sign out
        </button>
      </div>
    </aside>
  );
};

// ─── Shell ────────────────────────────────────────────────────────────────────
const Shell = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-mist">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex-shrink-0">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-display font-bold text-ink text-sm">Library MS</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
            ☰
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
