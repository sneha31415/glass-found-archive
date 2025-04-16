
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(252 87% 67%)", // Vibrant purple
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(217 33% 17%)", // Deep blue
          foreground: "hsl(0 0% 98%)",
        },
        accent: {
          DEFAULT: "hsl(194 85% 55%)", // Bright cyan
          foreground: "hsl(0 0% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 62.8% 30.6%)", // Red
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(240 3.7% 15.9%)", // Dark gray
          foreground: "hsl(240 5% 64.9%)", // Light gray
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsla(252, 87%, 67%, 1) 0%, hsla(252, 87%, 57%, 1) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsla(217, 33%, 17%, 1) 0%, hsla(217, 33%, 27%, 1) 100%)',
        'gradient-accent': 'linear-gradient(135deg, hsla(194, 85%, 55%, 1) 0%, hsla(194, 85%, 45%, 1) 100%)',
        'gradient-background': 'linear-gradient(135deg, hsla(240, 10%, 3.9%, 1) 0%, hsla(240, 10%, 13.9%, 1) 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
