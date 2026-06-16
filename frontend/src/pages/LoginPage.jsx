import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/common/UI";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setLocalError("Please enter both email and password.");
      return;
    }
    try {
      const user = await login({ email: form.email, password: form.password });
      // Redirect to the correct page
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch {
      // Error handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <>
      <style>{`
        /* === Login page scoped styles === */
        .logp-root {
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
        .logp-logo {
          text-align: center;
          margin-bottom: 28px;
          animation: logp-fade-up 0.6s ease 0.05s both;
        }
        .logp-logo-icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--mahogany-500), var(--mahogany-700));
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin: 0 auto 14px;
          box-shadow: 0 4px 0 var(--mahogany-800), 0 8px 20px rgba(60,34,16,0.28);
          transform-style: preserve-3d;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .logp-logo-icon:hover {
          transform: perspective(400px) translateY(-2px) translateZ(4px);
          box-shadow: 0 6px 0 var(--mahogany-800), 0 12px 28px rgba(60,34,16,0.32);
        }
        .logp-logo-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--mahogany-800);
          margin-bottom: 4px;
        }
        .logp-logo-sub {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--ink-300);
        }

        /* ── Form card ── */
        .logp-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border: 1px solid var(--parchment-200);
          border-radius: 20px;
          padding: 36px;
          box-shadow:
            0 1px 3px rgba(139,94,60,0.08),
            0 8px 28px rgba(139,94,60,0.07);
          animation: logp-fade-up 0.7s ease 0.15s both;
        }

        /* ── Field ── */
        .logp-field {
          margin-bottom: 20px;
        }
        .logp-field label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: var(--mahogany-500);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .logp-field input {
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
        .logp-field input::placeholder { color: var(--ink-300); }
        .logp-field input:focus {
          border-color: var(--mahogany-400);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(139,94,60,0.12);
          transform: perspective(400px) translateZ(3px);
        }

        /* ── Submit button ── */
        .logp-submit {
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
        .logp-submit:hover:not(:disabled) {
          background: var(--mahogany-500);
          transform: perspective(400px) translateY(-2px) translateZ(2px);
          box-shadow: 0 6px 0 var(--mahogany-800), 0 10px 24px rgba(60,34,16,0.32);
        }
        .logp-submit:active:not(:disabled) {
          transform: perspective(400px) translateY(3px) translateZ(-2px);
          box-shadow: 0 1px 0 var(--mahogany-800), 0 2px 6px rgba(60,34,16,0.20);
        }
        .logp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Footer link ── */
        .logp-footer {
          text-align: center;
          margin-top: 22px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--ink-300);
        }
        .logp-footer a {
          color: var(--mahogany-500);
          font-weight: 500;
          text-decoration: none;
        }
        .logp-footer a:hover { color: var(--mahogany-700); text-decoration: underline; }

        .logp-back-link {
          display: block;
          text-align: center;
          margin-top: 16px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: var(--ink-300);
          text-decoration: none;
          transition: color 0.15s;
        }
        .logp-back-link:hover { color: var(--mahogany-500); }

        @keyframes logp-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="logp-root">
        {/* ── Logo ── */}
        <div className="logp-logo">
          <div className="logp-logo-icon" onClick={() => navigate("/")}>📚</div>
          <h1 className="logp-logo-title">Sign in to LibraryHub</h1>
          <p className="logp-logo-sub">Access your college library account</p>
        </div>

        {/* ── Card ── */}
        <div className="logp-card">
          {/* Error alert */}
          {displayError && (
            <div style={{ marginBottom: 20 }}>
              <Alert
                type="error"
                message={displayError}
                onClose={() => {
                  clearError();
                  setLocalError("");
                }}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="logp-field">
              <label htmlFor="logp-email">Email Address</label>
              <input
                id="logp-email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@college.edu"
                autoComplete="email"
              />
            </div>

            <div className="logp-field">
              <label htmlFor="logp-password">Password</label>
              <input
                id="logp-password"
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* ── Submit ── */}
            <button type="submit" className="logp-submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" /> Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          <p className="logp-footer">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </div>

        <Link to="/" className="logp-back-link">
          ← Back to home
        </Link>
      </div>
    </>
  );
};

export default LoginPage;