/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C61821",
          50: "#FFF1F2",
          100: "#FFE0E2",
          200: "#FFC2C5",
          300: "#FF969B",
          400: "#F85D64",
          500: "#E52A32",
          600: "#C61821",
          700: "#A81119",
          800: "#8B0E14",
          900: "#700B10",
          dark: "#991016",
        },
        ink: {
          DEFAULT: "#111827",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Montserrat", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "var(--font-devanagari)", "Noto Sans Devanagari", "serif"],
        heading: ["var(--font-serif)", "Playfair Display", "var(--font-devanagari)", "Noto Sans Devanagari", "serif"],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
        devanagariDisplay: ["var(--font-devanagari-display)", "Rozha One", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(198, 24, 33, 0.08)",
        card: "0 8px 30px rgba(0, 0, 0, 0.06)",
        cardHover: "0 18px 45px rgba(0, 0, 0, 0.10)",
        button: "0 8px 24px rgba(198, 24, 33, 0.22)",
        buttonHover: "0 12px 30px rgba(198, 24, 33, 0.32)",
        floating: "0 20px 60px rgba(0, 0, 0, 0.08)",
        book: "0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.15)",
        bookHover: "0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 15px 25px -5px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(ellipse at 50% 30%, rgba(255, 235, 236, 0.8) 0%, rgba(255, 255, 255, 0) 70%)",
        "red-gradient": "linear-gradient(135deg, #D71920 0%, #A61016 100%)",
        "badge-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FDF4F4 100%)",
      },
    },
  },
  plugins: [],
};
