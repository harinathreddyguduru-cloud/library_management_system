import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Seed data ─── */
const BOOKS = [
  { title: "The Great Gatsby",        author: "F. Scott Fitzgerald", genre: "Classic",    bg: "#3d1505", spine: "#7a3210", tag: "#e8956a", tagBg: "rgba(168,70,15,0.22)" },
  { title: "Sapiens",                  author: "Yuval Noah Harari",   genre: "History",    bg: "#071608", spine: "#165210", tag: "#6ac07a", tagBg: "rgba(15,110,25,0.20)" },
  { title: "Cosmos",                   author: "Carl Sagan",          genre: "Science",    bg: "#060d18", spine: "#0e2870", tag: "#6a9ee8", tagBg: "rgba(15,55,170,0.20)" },
  { title: "1984",                     author: "George Orwell",       genre: "Dystopian",  bg: "#100618", spine: "#420e72", tag: "#a86ae8", tagBg: "rgba(72,15,172,0.20)" },
  { title: "Ikigai",                   author: "Héctor García",       genre: "Self-help",  bg: "#180e08", spine: "#723a0c", tag: "#e8b86a", tagBg: "rgba(170,108,15,0.20)" },
  { title: "Dune",                     author: "Frank Herbert",       genre: "Sci-Fi",     bg: "#180606", spine: "#720808", tag: "#e86a6a", tagBg: "rgba(170,15,15,0.20)" },
  { title: "Thinking, Fast and Slow",  author: "Daniel Kahneman",    genre: "Psychology", bg: "#081616", spine: "#085868", tag: "#6ae8e0", tagBg: "rgba(8,130,150,0.20)" },
  { title: "The Alchemist",            author: "Paulo Coelho",        genre: "Fiction",    bg: "#160e08", spine: "#724818", tag: "#e8cc6a", tagBg: "rgba(170,130,15,0.20)" },
];

const LandingPage = () => {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const rootRef     = useRef(null);
  const motesRef    = useRef([]);

  /* ── Side-effects ── */
  useEffect(() => {
    buildBooks();
    spawnMotes();
    observeReveals();
    return cleanup;
  }, []); // eslint-disable-line

  function buildBooks() {
    const grid = document.getElementById("lp-books-grid");
    if (!grid) return;
    grid.innerHTML = "";
    BOOKS.forEach((b, i) => {
      const card = document.createElement("div");
      card.className = "lp-book-card animate-shelf-drop";
      card.style.animationDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="lp-book-cover" style="background:${b.bg}">
          <div class="lp-book-spine-bar" style="background:${b.spine}"></div>
          <span class="lp-genre-pill" style="background:${b.tagBg};color:${b.tag};border:1px solid ${b.tag}55">${b.genre}</span>
        </div>
        <div class="lp-book-meta">
          <p class="lp-book-title">${b.title}</p>
          <p class="lp-book-author">${b.author}</p>
        </div>`;
      card.addEventListener("click", () =>
        navigate(`/books?q=${encodeURIComponent(b.title)}`)
      );
      grid.appendChild(card);
    });
  }

  function spawnMotes() {
    const root = rootRef.current;
    if (!root) return;
    for (let i = 0; i < 12; i++) {
      const m = document.createElement("span");
      m.className = `dust-mote dust-mote-${(i % 6) + 1}`;
      const sz = 2 + Math.random() * 4;
      m.style.cssText = `
        width:${sz}px;height:${sz}px;
        left:${Math.random() * 100}%;
        bottom:${-10 + Math.random() * 20}%;
        animation-delay:${Math.random() * 10}s;
      `;
      root.appendChild(m);
      motesRef.current.push(m);
    }
  }

  function observeReveals() {
    const els = document.querySelectorAll(".lp-reveal");
    const io  = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lp-reveal--visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return io;
  }

  function cleanup() {
    motesRef.current.forEach((m) => m.remove());
    motesRef.current = [];
  }

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        /* === Landing page scoped styles === */
        .lp-root {
          background: var(--parchment-50);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Decorative shelf line at bottom ── */
        .lp-root::after {
          content: '';
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,
            var(--mahogany-700) 0%, var(--gold-400) 25%,
            var(--mahogany-600) 50%, var(--gold-300) 75%,
            var(--mahogany-700) 100%);
          z-index: 200;
        }

        /* ── Hero ── */
        .lp-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
          overflow: hidden;
        }

        /* Warm radial glow behind hero */
        .lp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 60%, rgba(139,94,60,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .lp-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mahogany-400);
          margin-bottom: 20px;
          opacity: 0;
          animation: lp-fade-up 0.7s ease 0.15s forwards;
        }

        .lp-hero-h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(38px, 6vw, 72px);
          line-height: 1.12;
          color: var(--mahogany-800);
          margin-bottom: 10px;
          opacity: 0;
          animation: lp-fade-up 0.8s ease 0.3s forwards;
        }
        .lp-hero-h1 em {
          font-style: italic;
          color: var(--mahogany-500);
        }

        .lp-hero-sub {
          font-family: 'Lora', serif;
          font-size: 17px;
          color: var(--ink-500);
          max-width: 500px;
          line-height: 1.75;
          margin-bottom: 40px;
          opacity: 0;
          animation: lp-fade-up 0.8s ease 0.45s forwards;
        }

        .lp-cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: lp-fade-up 0.8s ease 0.6s forwards;
        }

        /* ── 3D spinning book ── */
        .lp-book-3d-wrap {
          margin-top: 56px;
          perspective: 900px;
          opacity: 0;
          animation: lp-fade-up 1s ease 0.75s forwards;
        }
        .lp-book-3d {
          width: 90px;
          height: 124px;
          position: relative;
          transform-style: preserve-3d;
          animation: lp-book-spin 7s ease-in-out infinite;
          cursor: pointer;
          transition: filter 0.3s;
        }
        .lp-book-3d:hover { filter: brightness(1.1); }
        .lp-book-face {
          position: absolute;
          width: 90px; height: 124px;
          background: linear-gradient(155deg, var(--mahogany-400) 0%, var(--mahogany-600) 60%, var(--mahogany-800) 100%);
          transform: translateZ(14px);
          border-radius: 2px 8px 8px 2px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.25);
        }
        .lp-book-face-text {
          color: var(--gold-300);
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-style: italic;
          text-align: center;
          padding: 10px;
          line-height: 1.5;
          letter-spacing: 0.05em;
        }
        .lp-book-spine {
          position: absolute;
          width: 28px; height: 124px;
          background: linear-gradient(90deg, var(--mahogany-800), var(--mahogany-600));
          left: -14px;
          transform: rotateY(-90deg) translateZ(14px);
        }
        .lp-book-top {
          position: absolute;
          width: 90px; height: 28px;
          background: var(--parchment-200);
          top: -14px;
          transform: rotateX(90deg) translateZ(14px);
        }
        .lp-book-pages {
          position: absolute;
          width: 86px; height: 120px;
          background: repeating-linear-gradient(
            90deg,
            var(--parchment-50) 0px, var(--parchment-50) 2px,
            var(--parchment-200) 2px, var(--parchment-200) 3px
          );
          right: -2px; top: 2px;
          border-radius: 0 6px 6px 0;
          transform: translateZ(-2px);
        }

        @keyframes lp-book-spin {
          0%,100% { transform: rotateY(-18deg) rotateX(6deg); }
          50%      { transform: rotateY(18deg) rotateX(-4deg); }
        }

        /* ── Stats strip ── */
        .lp-stats {
          display: flex;
          justify-content: center;
          background: var(--parchment-100);
          border-top: 1px solid var(--parchment-200);
          border-bottom: 1px solid var(--parchment-200);
        }
        .lp-stat {
          flex: 1;
          max-width: 160px;
          padding: 24px 16px;
          text-align: center;
          border-right: 1px solid var(--parchment-200);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-num {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--mahogany-600);
        }
        .lp-stat-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: var(--ink-300);
          margin-top: 4px;
          letter-spacing: 0.04em;
        }

        /* ── Section layout ── */
        .lp-section {
          padding: 72px 32px;
        }
        .lp-section-inner { max-width: 920px; margin: 0 auto; }

        .lp-section-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mahogany-400);
          display: block;
          margin-bottom: 10px;
        }
        .lp-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 700;
          color: var(--mahogany-800);
          margin-bottom: 10px;
        }
        .lp-section-desc {
          font-family: 'Lora', serif;
          font-size: 15px;
          color: var(--ink-500);
          line-height: 1.75;
          max-width: 520px;
        }

        /* ── Book cards ── */
        .lp-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          gap: 18px;
          margin-top: 36px;
        }
        .lp-book-card {
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          border: 1px solid var(--parchment-200);
          cursor: pointer;
          transform-style: preserve-3d;
          transition:
            transform 0.35s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.35s ease,
            border-color 0.2s;
        }
        .lp-book-card:hover {
          transform: perspective(800px) translateY(-8px) rotateX(4deg) rotateY(-3deg) scale(1.03);
          box-shadow:
            0 18px 36px rgba(82,49,26,0.22),
            0 6px 12px rgba(139,94,60,0.14),
            inset 0 1px 0 rgba(255,255,255,0.15);
          border-color: var(--mahogany-400);
        }
        .lp-book-cover {
          height: 168px;
          display: flex;
          align-items: flex-end;
          padding: 12px;
          position: relative;
        }
        .lp-book-spine-bar {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 12px;
          border-radius: 2px 0 0 2px;
        }
        .lp-genre-pill {
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        .lp-book-meta { padding: 13px 14px 14px; }
        .lp-book-title {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: var(--mahogany-800);
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .lp-book-author {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          color: var(--ink-300);
        }

        /* ── How it works — numbered steps ── */
        .lp-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 0;
          margin-top: 36px;
        }
        .lp-step {
          background: #fff;
          border: 1px solid var(--parchment-200);
          padding: 28px 22px;
          position: relative;
          transition: border-color 0.2s, transform 0.25s;
        }
        .lp-step:first-child { border-radius: 14px 0 0 14px; }
        .lp-step:last-child  { border-radius: 0 14px 14px 0; }
        .lp-step + .lp-step  { border-left: none; }
        .lp-step:hover {
          border-color: var(--mahogany-300);
          transform: translateY(-3px);
          z-index: 1;
        }
        .lp-step-num {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 700;
          color: var(--parchment-200);
          position: absolute;
          top: 14px; right: 18px;
          line-height: 1;
          user-select: none;
        }
        .lp-step-icon { font-size: 24px; margin-bottom: 12px; }
        .lp-step-title {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--mahogany-700);
          margin-bottom: 6px;
        }
        .lp-step-text {
          font-family: 'Lora', serif;
          font-size: 13px;
          color: var(--ink-500);
          line-height: 1.65;
        }

        /* ── Feature cards ── */
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 36px;
        }
        .lp-feat-card {
          background: #fff;
          border: 1px solid var(--parchment-200);
          border-radius: 14px;
          padding: 24px 20px;
          transition: border-color 0.2s, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
        }
        .lp-feat-card:hover {
          border-color: var(--mahogany-300);
          transform: perspective(700px) translateY(-5px) rotateX(3deg);
          box-shadow: 0 12px 28px rgba(82,49,26,0.14);
        }
        .lp-feat-icon {
          width: 44px; height: 44px;
          background: var(--parchment-100);
          border: 1px solid var(--parchment-200);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          margin-bottom: 14px;
        }
        .lp-feat-name {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--mahogany-700);
          margin-bottom: 7px;
        }
        .lp-feat-desc {
          font-family: 'Lora', serif;
          font-size: 13px;
          color: var(--ink-500);
          line-height: 1.65;
        }

        /* ── CTA banner ── */
        .lp-cta-banner {
          margin: 0 32px 72px;
          background: var(--mahogany-700);
          border-radius: 18px;
          padding: 64px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .lp-cta-banner::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 20% 50%, rgba(212,168,67,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 50%, rgba(139,94,60,0.25) 0%, transparent 60%);
          pointer-events: none;
        }
        .lp-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3.5vw, 38px);
          font-weight: 700;
          color: var(--parchment-100);
          margin-bottom: 12px;
          position: relative;
        }
        .lp-cta-desc {
          font-family: 'Lora', serif;
          font-size: 16px;
          color: rgba(247,237,216,0.65);
          max-width: 440px;
          margin: 0 auto 36px;
          line-height: 1.75;
          position: relative;
        }
        .lp-cta-btns {
          display: flex; gap: 14px;
          justify-content: center; flex-wrap: wrap;
          position: relative;
        }
        .btn-cta-light {
          padding: 14px 30px;
          border: none;
          border-radius: 10px;
          background: var(--parchment-100);
          color: var(--mahogany-700);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          box-shadow: 0 3px 0 rgba(0,0,0,0.2), 0 6px 16px rgba(0,0,0,0.15);
        }
        .btn-cta-light:hover {
          background: #fff;
          transform: translateY(-2px);
        }
        .btn-cta-ghost {
          padding: 14px 30px;
          border: 1.5px solid rgba(247,237,216,0.3);
          border-radius: 10px;
          background: transparent;
          color: var(--parchment-100);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-cta-ghost:hover {
          background: rgba(247,237,216,0.08);
          transform: translateY(-2px);
        }

        /* ── Footer ── */
        .lp-footer {
          background: var(--mahogany-800);
          padding: 28px 32px;
          text-align: center;
        }
        .lp-footer p {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: rgba(247,237,216,0.35);
        }

        /* ── Scroll reveal ── */
        .lp-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .lp-reveal--visible {
          opacity: 1;
          transform: none;
        }

        /* ── Keyframes ── */
        @keyframes lp-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .lp-steps { grid-template-columns: 1fr; }
          .lp-step:first-child { border-radius: 14px 14px 0 0; }
          .lp-step:last-child  { border-radius: 0 0 14px 14px; }
          .lp-step + .lp-step  { border-left: 1px solid var(--parchment-200); border-top: none; }
          .lp-cta-banner { margin: 0 16px 56px; padding: 48px 24px; }
          .lp-section { padding: 56px 20px; }
          .lp-book-3d-wrap { display: none; }
        }
      `}</style>

      <div className="lp-root" ref={rootRef}>

        {/* ── Navbar ── */}
        <nav className="nav">
          <div className="nav-brand font-ui">
            <span className="nav-brand-icon">📚</span>
            LibraryHub
          </div>
          <div className="flex gap-2">
            {user ? (
              <button
                className="btn-primary font-ui"
                onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button className="btn-secondary font-ui" onClick={() => navigate("/login")}>
                  Log in
                </button>
                <button className="btn-primary font-ui" onClick={() => navigate("/register")}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="lp-hero">
          <p className="lp-eyebrow">Welcome to LibraryHub · Your College Library Portal</p>
          <h1 className="lp-hero-h1">
            Every great story<br />
            <em>begins here.</em>
          </h1>
          <p className="lp-hero-sub">
            Thousands of books, journals, and resources — curated for curious minds.
            Borrow, discover, and return from anywhere.
          </p>
          <div className="lp-cta-row">
            <button
              className="btn-primary"
              onClick={() => document.getElementById("lp-catalog")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore catalog →
            </button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById("lp-how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              How it works
            </button>
          </div>

          {/* 3D book */}
          <div className="lp-book-3d-wrap">
            <div
              className="lp-book-3d"
              title="LibraryHub — your college library"
              onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login")}
            >
              <div className="lp-book-pages" />
              <div className="lp-book-spine" />
              <div className="lp-book-top" />
              <div className="lp-book-face">
                <div className="lp-book-face-text">Library<br />Hub</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="lp-stats">
          {[
            { num: "12,400+", label: "Books available" },
            { num: "38",      label: "Genres" },
            { num: "3,200",   label: "Active readers" },
            { num: "24/7",    label: "Access" },
          ].map((s) => (
            <div key={s.label} className="lp-stat">
              <span className="lp-stat-num">{s.num}</span>
              <span className="lp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Featured books ── */}
        <section className="lp-section lp-reveal" id="lp-catalog">
          <div className="lp-section-inner">
            <span className="lp-section-eyebrow">✦ Featured books</span>
            <h2 className="lp-section-title">What's waiting for you</h2>
            <p className="lp-section-desc">
              Browse a curated selection from our catalog — timeless classics to cutting-edge research.
            </p>
            <div className="lp-books-grid" id="lp-books-grid" />
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          className="lp-section lp-reveal"
          id="lp-how-it-works"
          style={{ background: "var(--parchment-100)" }}
        >
          <div className="lp-section-inner">
            <span className="lp-section-eyebrow">✦ Simple steps</span>
            <h2 className="lp-section-title">Borrow a book in minutes</h2>
            <div className="lp-steps">
              {[
                { n: "01", icon: "🔎", title: "Search",  text: "Find any book by title, author, genre, or ISBN instantly." },
                { n: "02", icon: "📋", title: "Reserve", text: "Click Reserve — no paperwork, no queues required." },
                { n: "03", icon: "📦", title: "Collect", text: "Pick it up at the front desk with your student ID." },
                { n: "04", icon: "🔔", title: "Return",  text: "We'll remind you before the due date — no surprise fines." },
              ].map((s) => (
                <div key={s.n} className="lp-step">
                  <span className="lp-step-num">{s.n}</span>
                  <div className="lp-step-icon">{s.icon}</div>
                  <p className="lp-step-title">{s.title}</p>
                  <p className="lp-step-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="lp-section lp-reveal">
          <div className="lp-section-inner">
            <span className="lp-section-eyebrow">✦ Everything you need</span>
            <h2 className="lp-section-title">A library built for students</h2>
            <div className="lp-features-grid">
              {[
                { icon: "🔎", name: "Smart Search",    desc: "Find any book instantly by title, author, genre, or ISBN." },
                { icon: "📚", name: "Easy Borrowing",  desc: "Reserve and borrow in one click. No paperwork, no queues." },
                { icon: "⏰", name: "Due Reminders",   desc: "Never miss a return date — get notified before fines kick in." },
                { icon: "📖", name: "Reading History", desc: "Track every book you've read and rediscover favourites." },
              ].map((f) => (
                <div key={f.name} className="lp-feat-card">
                  <div className="lp-feat-icon">{f.icon}</div>
                  <p className="lp-feat-name">{f.name}</p>
                  <p className="lp-feat-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <div className="lp-cta-banner lp-reveal">
          <h2 className="lp-cta-title">Ready to start reading?</h2>
          <p className="lp-cta-desc">
            Join thousands of students who borrow, learn, and grow with LibraryHub every day.
            Your first book is one click away.
          </p>
          <div className="lp-cta-btns">
            {user ? (
              <button
                className="btn-cta-light"
                onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button className="btn-cta-light" onClick={() => navigate("/register")}>
                  Create free account →
                </button>
                <button className="btn-cta-ghost" onClick={() => navigate("/login")}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="lp-footer">
          <p>© {new Date().getFullYear()} LibraryHub · College Library Management System</p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
