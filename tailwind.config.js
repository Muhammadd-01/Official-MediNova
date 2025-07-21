/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",                  // Brown from scarf
          foreground: "hsl(var(--primary-foreground))",    // White text
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",                // Light beige/gray
          foreground: "hsl(var(--secondary-foreground))",  // Dark text
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Custom brown color palette
        professionalBrown: {
          50: "#f9f0ef",
          100: "#f0dbd9",
          200: "#e0b7b3",
          300: "#d0948d",
          400: "#c07067",
          500: "#b04c41",
          600: "#8b3a3a", // Main primary color from scarf
          700: "#672c2c",
          800: "#431d1d",
          900: "#1e0f0f",
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
}
