/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary:  { DEFAULT: "#667eea", dark: "#5a6fd8" },
        secondary:"#764ba2",
        accent:   "#4facfe",
        success:  "#43e97b",
        warning:  "#fa709a",
        danger:   "#ff9a9e",
        // Neutrals
        gray: {
          50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",
          400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",
          800:"#424242",900:"#212121"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "Inter", "ui-sans-serif"],
        mono: ["JetBrains Mono","ui-monospace","SFMono-Regular"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "inner-soft":"inset 0 2px 4px 0 rgba(0,0,0,.06)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
