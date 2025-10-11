/** @type {import('tailwindcss').Config} */
exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // adjust if you have different paths
    ],
    theme: {
      extend: {
        colors: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          ink: "var(--color-ink)",
          card: "var(--color-surface-card)",
          neutral: {
            bg: "var(--neutral-bg)",      // white background
            surface: "var(--neutral-surface)", // cards/panels
            border: "var(--neutral-border)",
            text: "var(--neutral-text)",
            textSecondary: "var(--neutral-text-secondary)",
            accent: "var(--neutral-accent)", // blue highlight
          },
        },
        fontFamily: {
          manrope: ["Manrope", "sans-serif"],
          poppins: ["Poppins", "sans-serif"],
          grotesk: ["Space Grotesk", "sans-serif"],
        },
      },
    },
    plugins: [],
  };