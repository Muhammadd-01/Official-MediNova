/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#7F2323", // Main background color
        foreground: "#FDFBFB", // Default text color

        primary: {
          DEFAULT: "#7F2323",
          foreground: "#FDFBFB",
        },
        secondary: {
          DEFAULT: "#7F2323",
          foreground: "#FDFBFB",
        },
        destructive: {
          DEFAULT: "#a91b1b",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#7F2323",
          foreground: "#FDFBFB",
        },
        accent: {
          DEFAULT: "#7F2323",
          foreground: "#FDFBFB",
        },
        popover: {
          DEFAULT: "#7F2323",
          foreground: "#FDFBFB",
        },
        card: {
          DEFAULT: "#7F2323",
          foreground: "#FDFBFB",
        },

        deepMeron: {
          DEFAULT: "#7F2323",
          light: "#9c2b2b",
          dark: "#5c1a1a",
        },
        meronText: {
          DEFAULT: "#FDFBFB",
        },

        meronishRed: {
          50: "#fff1f1",
          100: "#fcdede",
          200: "#f8bcbc",
          300: "#f28a8a",
          400: "#e94c4c",
          500: "#c23737",
          600: "#9e2b2b",
          700: "#741f1f",
          800: "#4a1414",
          900: "#1f0505",
        },

        // Dark mode overrides
        dark: {
          background: "#1a1a1a",
          foreground: "#ffffff",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      animation: {
        blob: "blob 7s infinite",
        fadeIn: "fadeIn 1s ease-in",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
