/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      /* ── Color palette ── */
      colors: {
        /* Warm parchment / aged paper */
        parchment: {
          50:  "#fdf8f0",
          100: "#f7edd8",
          200: "#eed8b0",
          300: "#debb80",
        },
        /* Rich mahogany wood / leather */
        mahogany: {
          400: "#8b5e3c",
          500: "#6b4226",
          600: "#52311a",
          700: "#3c2210",
          800: "#271508",
          900: "#150a02",
        },
        /* Aged gold lettering */
        gold: {
          300: "#d4a843",
          400: "#b8862a",
          500: "#96661a",
        },
        /* Forest green (available / success) */
        forest: {
          400: "#4a7c59",
          500: "#355e41",
          600: "#234231",
        },
        /* Ink tones */
        ink: {
          300: "#c4956a",
          500: "#6b4426",
          700: "#3d2510",
          900: "#1c1008",
        },
        /* Aliases for backward compat with old utility classes */
        primary: {
          400: "#8b5e3c",
          500: "#6b4226",
          600: "#52311a",
          700: "#3c2210",
          800: "#271508",
        },
        mist: "#fdf8f0",
        ink: "#1c1008",
      },

      /* ── Typography ── */
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        serif:   ["Lora", "Georgia", "serif"],
        body:    ["Lora", "Georgia", "serif"],
        ui:      ["Inter", "system-ui", "sans-serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
      },

      /* ── Border radius ── */
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      /* ── Box shadows ── */
      boxShadow: {
        parchment: "0 1px 3px rgba(139,94,60,0.08), 0 4px 16px rgba(139,94,60,0.06)",
        "parchment-md": "0 2px 8px rgba(139,94,60,0.10), 0 8px 24px rgba(139,94,60,0.08)",
        "parchment-lg": "0 4px 16px rgba(139,94,60,0.14), 0 16px 48px rgba(139,94,60,0.12)",
        "mahogany-sm": "0 1px 3px rgba(60,34,16,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
        "inner-warm": "inset 0 1px 3px rgba(139,94,60,0.08)",
      },

      /* ── Keyframe animations ── */
      keyframes: {
        "page-enter": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "ink-drop": {
          "0%":   { transform: "scale(0.95)", opacity: "0.6" },
          "50%":  { transform: "scale(1.02)", opacity: "1" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition:  "400px 0" },
        },
        "dust-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)", opacity: "0.3" },
          "50%":      { transform: "translateY(-8px) rotate(3deg)", opacity: "0.6" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "bookmark-unfurl": {
          from: { transform: "scaleY(0)", transformOrigin: "top" },
          to:   { transform: "scaleY(1)", transformOrigin: "top" },
        },
      },

      /* ── Animation utilities ── */
      animation: {
        "page-enter":    "page-enter 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "slide-up":      "slide-up 0.40s cubic-bezier(0.22,1,0.36,1) both",
        "slide-left":    "slide-left 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":       "fade-in 0.50s ease both",
        "ink-drop":      "ink-drop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        shimmer:         "shimmer 1.4s ease infinite",
        "dust-float":    "dust-float 4s ease-in-out infinite",
        "spin-slow":     "spin-slow 0.7s linear infinite",
        "bookmark":      "bookmark-unfurl 0.3s ease both",
      },

      /* ── Transition timing ── */
      transitionTimingFunction: {
        spring:    "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },

      /* ── Background images ── */
      backgroundImage: {
        "parchment-gradient":
          "linear-gradient(135deg, #fdf8f0 0%, #f7edd8 50%, #fdf8f0 100%)",
        "mahogany-gradient":
          "linear-gradient(180deg, #3c2210 0%, #271508 40%, #150a02 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, #d4a843, #96661a, #d4a843)",
        "sidebar-gradient":
          "linear-gradient(180deg, #3c2210 0%, #271508 40%, #150a02 100%)",
        "book-cover":
          "linear-gradient(135deg, #3c2210 0%, #6b4226 50%, #b8862a 100%)",
      },

      /* ── Backdrop blur ── */
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};