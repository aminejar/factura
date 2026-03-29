/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B3FD9",
        secondary: "#3B82F6",
        pinkCTA: "#EC4899",
        pinkCTA2: "#F472B6",
        success: "#22C55E",
        warning: "#F97316",
        danger: "#EF4444",
        dark: "#111827",
        grayText: "#6B7280",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "hero-grad": "linear-gradient(135deg, #5B3FD9, #EC4899)",
        "cta-grad": "linear-gradient(135deg, #EC4899, #F472B6)",
      },
    },
  },
  plugins: [],
};
