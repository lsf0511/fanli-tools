/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0e1a",
          elevated: "#12172a",
        },
        brand: {
          DEFAULT: "#FF6B1A",
          hover: "#FF7F3C",
          muted: "#CC5414",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hover: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.10)",
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      backdropBlur: {
        glass: "16px",
      },
      boxShadow: {
        "brand-glow": "0 0 0 1px #FF6B1A, 0 10px 40px -10px rgba(255,107,26,0.3)",
      },
    },
  },
  plugins: [],
};
