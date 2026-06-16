import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/common/UI";

const DEPARTMENTS = [
  "Computer Science", "Engineering", "Business",
  "Arts", "Science", "Law", "Medicine",
];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    studentId: "", department: "", semester: "", phone: "",
  });
  const [localError, setLocalError] = useState("");
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    try {
      const { confirmPassword, ...payload } = form;
      const user = await register(payload);
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch { /* error shown via AuthContext */ }
  };

  const displayError = localError || error;

  return (
    <>
      <style>{`
        /* === Register page scoped styles === */
        .rp-root {
          min-height: 100vh;
          background: var(--parchment-50);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background-image:
            radial-gradient(ellipse 50% 60% at 10% 20%, rgba(139,94,60,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 90% 85%, rgba(212,168,67,0.06) 0%, transparent 55%);
        }

        /* ── Logo area ── */
        .rp-logo {
          text-align: center;
          margin-bottom: 28px;
          animation: rp-fade-up 0.6s ease 0.05s both;
        }
        .rp-logo-icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--mahogany-500), var(--mahogany-700));
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin: 0 auto 14px;
          box-shadow: 0 4px 0 var(--mahogany-800), 0 8px 20px rgba(60,34,16,0.28);
          transform-style: preserve-3d;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rp-logo-icon:hover {
          transform: perspective(400px) translateY(-2px) translateZ(4px);
          box-shadow: 0 6px 0 var(--mahogany-800), 0 12px 28px rgba(60,34,16,0.32);
        }
        .rp-logo-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--mahogany-800);
          margin-bottom: 4px;
        }
        .rp-logo-sub {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--ink-300);
        }

        /* ── Form card ── */
        .rp-card {
          width: 100%;
          max-width: 500px;
          background: #fff;
          border: 1px solid var(--parchment-200);
          border-radius: 20px;
          padding: 36px;
          box-shadow:
            0 1px 3px rgba(139,94,60,0.08),
            0 8px 28px rgba(139,94,60,0.07);
          animation: rp-fade-up 0.7s ease 0.15s both;
        }

        /* ── Section label (inside form) ── */
        .rp-section-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--mahogany-400);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rp-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--parchment-200);
        }

        /* ── Grid rows ── */
        .rp-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .rp-row-1 {
          margin-bottom: 14px;
        }

        /* ── Field ── */
        .rp-field label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: var(--mahogany-500);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .rp-field input,
        .rp-field select {
          width: 100%;
          padding: 10px 13px;
          border: 1.5px solid var(--parchment-300);
          border-radius: 9px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--ink-900);
          background: var(--parchment-50);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .rp-field input::placeholder { color: var(--ink-300); }
        .rp-field input:focus,
        .rp-field select:focus {
          border-color: var(--mahogany-400);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(139,94,60,0.12);
          transform: perspective(400px) translateZ(3px);
        }
        .rp-field select { cursor: pointer; }

        /* ── Divider ── */
        .rp-divider {
          height: 1px;
          background: var(--parchment-200);
          margin: 22px 0 20px;
        }

        /* ── Submit button ── */
        .rp-submit {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: var(--mahogany-600);
          color: var(--parchment-100);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transform-style: preserve-3d;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 0 var(--mahogany-800), 0 6px 16px rgba(60,34,16,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .rp-submit:hover:not(:disabled) {
          background: var(--mahogany-500);
          transform: perspective(400px) translateY(-2px) translateZ(2px);
          box-shadow: 0 6px 0 var(--mahogany-800), 0 10px 24px rgba(60,34,16,0.32);
        }
        .rp-submit:active:not(:disabled) {
          transform: perspective(400px) translateY(3px) translateZ(-2px);
          box-shadow: 0 1px 0 var(--mahogany-800), 0 2px 6px rgba(60,34,16,0.20);
        }
        .rp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Footer link ── */
        .rp-footer {
          text-align: center;
          margin-top: 22px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--ink-300);
        }
        .rp-footer a {
          color: var(--mahogany-500);
          font-weight: 500;
          text-decoration: none;
        }
        .rp-footer a:hover { color: var(--mahogany-700); text-decoration: underline; }

        .rp-back-link {
          display: block;
          text-align: center;
          margin-top: 16px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: var(--ink-300);
          text-decoration: none;
          transition: color 0.15s;
        }
        .rp-back-link:hover { color: var(--mahogany-500); }

        @keyframes rp-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }

        @media (max-width: 520px) {
          .rp-row-2 { grid-template-columns: 1fr; }
          .rp-card { padding: 28px 20px; }
        }
      `}</style>

      <div className="rp-root">

        {/* ── Logo ── */}
        <div className="rp-logo">
          <div className="rp-logo-icon">📚</div>
          <h1 className="rp-logo-title">Create your account</h1>
          <p className="rp-logo-sub">Join the college library system</p>
        </div>

        {/* ── Card ── */}
        <div className="rp-card">

          {/* Error alert */}
          {displayError && (
            <div style={{ marginBottom: 20 }}>
              <Alert
                type="error"
                message={displayError}
                onClose={() => { clearError(); setLocalError(""); }}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Section 1: Personal details ── */}
            <p className="rp-section-label">Personal details</p>

            <div className="rp-row-1 rp-field">
              <label htmlFor="rp-name">Full name</label>
              <input
                id="rp-name"
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </div>

            <div className="rp-row-1 rp-field">
              <label htmlFor="rp-email">Email address</label>
              <input
                id="rp-email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@college.edu"
                autoComplete="email"
              />
            </div>

            <div className="rp-divider" />

            {/* ── Section 2: Student info ── */}
            <p className="rp-section-label">Student information</p>

            <div className="rp-row-2">
              <div className="rp-field">
                <label htmlFor="rp-studentId">Student ID</label>
                <input
                  id="rp-studentId"
                  type="text"
                  name="studentId"
                  required
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="STU-2024-001"
                />
              </div>
              <div className="rp-field">
                <label htmlFor="rp-phone">Phone number</label>
                <input
                  id="rp-phone"
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="rp-row-2">
              <div className="rp-field">
                <label htmlFor="rp-department">Department</label>
                <select
                  id="rp-department"
                  name="department"
                  required
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select dept…</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="rp-field">
                <label htmlFor="rp-semester">Semester</label>
                <select
                  id="rp-semester"
                  name="semester"
                  required
                  value={form.semester}
                  onChange={handleChange}
                >
                  <option value="">Select…</option>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rp-divider" />

            {/* ── Section 3: Password ── */}
            <p className="rp-section-label">Set your password</p>

            <div className="rp-row-2">
              <div className="rp-field">
                <label htmlFor="rp-password">Password</label>
                <input
                  id="rp-password"
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div className="rp-field">
                <label htmlFor="rp-confirmPassword">Confirm password</label>
                <input
                  id="rp-confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? (
                <><Spinner size="sm" /> Creating account…</>
              ) : (
                "Create account →"
              )}
            </button>
          </form>

          <p className="rp-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <Link to="/login" className="rp-back-link">← Back to sign in</Link>
      </div>
    </>
  );
};

export default RegisterPage;