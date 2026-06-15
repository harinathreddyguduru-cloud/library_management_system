import React from "react";

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = "md", className = "" }) => {
  const s = { sm: "h-4 w-4", md: "h-7 w-7", lg: "h-12 w-12" }[size];
  return (
    <div className={`${s} animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 ${className}`} />
  );
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

// ─── Alert ───────────────────────────────────────────────────────────────────
const alertStyles = {
  error:   "bg-red-50   border-red-200   text-red-700",
  success: "bg-green-50 border-green-200 text-green-700",
  info:    "bg-blue-50  border-blue-200  text-blue-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
};
const alertIcons = {
  error:   "✕",
  success: "✓",
  info:    "ℹ",
  warning: "⚠",
};

export const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${alertStyles[type]}`}>
      <span className="font-bold mt-0.5">{alertIcons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 font-bold">✕</button>
      )}
    </div>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────
const badgeVariants = {
  available:  "bg-green-100  text-green-700",
  borrowed:   "bg-amber-100  text-amber-700",
  overdue:    "bg-red-100    text-red-700",
  returned:   "bg-blue-100   text-blue-700",
  admin:      "bg-primary-100 text-primary-700",
  student:    "bg-gray-100   text-gray-600",
  default:    "bg-gray-100   text-gray-600",
};

export const Badge = ({ label, variant = "default" }) => (
  <span className={`badge ${badgeVariants[variant] || badgeVariants.default}`}>
    {label}
  </span>
);

// ─── EmptyState ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = "📚", title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-5xl mb-4 opacity-60">{icon}</div>
    <h3 className="font-display font-semibold text-gray-700 text-lg mb-1">{title}</h3>
    {subtitle && <p className="text-gray-400 text-sm mb-6 max-w-xs">{subtitle}</p>}
    {action}
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-semibold text-ink text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, color = "primary" }) => {
  const colors = {
    primary: "bg-primary-50 text-primary-600",
    green:   "bg-green-50  text-green-600",
    amber:   "bg-amber-50  text-amber-600",
    red:     "bg-red-50    text-red-600",
  };
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl text-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-display font-bold text-ink mt-0.5">{value ?? "—"}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
};
