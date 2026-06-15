import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/common/UI";

const LoginPage = () => {
  const [form, setForm]   = useState({ email: "", password: "" });
  const { login, loading, error, clearError, user, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || (isAdmin ? "/admin" : "/dashboard");

  // Already logged in
  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    clearError();
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(form);
      navigate(u.role === "admin" ? "/admin" : from, { replace: true });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg mx-auto mb-4">
            L
          </div>
          <h1 className="font-display font-bold text-ink text-3xl">Welcome back</h1>
          <p className="text-gray-400 mt-1 text-sm">Sign in to your library account</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} onClose={clearError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@college.edu"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password" name="password" required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Spinner size="sm" /> Signing in…</> : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Demo — Student: <code className="bg-gray-100 px-1 rounded">student@demo.com / demo123</code>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Admin: <code className="bg-gray-100 px-1 rounded">admin@demo.com / admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
