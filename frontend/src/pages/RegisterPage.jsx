import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/common/UI";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    studentId: "", department: "",
  });
  const [localError, setLocalError] = useState("");
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError(); setLocalError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match."); return;
    }
    try {
      const { confirmPassword, ...payload } = form;
      const u = await register(payload);
      navigate(u.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch {}
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg mx-auto mb-4">
            L
          </div>
          <h1 className="font-display font-bold text-ink text-3xl">Create account</h1>
          <p className="text-gray-400 mt-1 text-sm">Join the college library system</p>
        </div>

        <div className="card">
          {displayError && (
            <div className="mb-5">
              <Alert type="error" message={displayError} onClose={() => { clearError(); setLocalError(""); }} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" name="name" required value={form.name}
                  onChange={handleChange} placeholder="Jane Smith" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" name="email" required value={form.email}
                  onChange={handleChange} placeholder="jane@college.edu" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student ID</label>
                <input type="text" name="studentId" required value={form.studentId}
                  onChange={handleChange} placeholder="STU-2024-001" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                <select name="department" required value={form.department}
                  onChange={handleChange} className="input-field">
                  <option value="">Select dept…</option>
                  {["Computer Science","Engineering","Business","Arts","Science","Law","Medicine"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input type="password" name="password" required value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input type="password" name="confirmPassword" required value={form.confirmPassword}
                  onChange={handleChange} placeholder="Re-enter password" className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <><Spinner size="sm" /> Creating account…</> : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
