/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#359EFF",
        "primary-dark": "#2a8ee6",
        "brand-teal": "#1492A8",
        "dark-teal": "#003B46",
        "background-light": "#f6f8f8",
        "background-dark": "#111f21",
        "neutral-light": "#e0e7e7",
        "neutral-dark": "#1f2f2f",
        "text-main-light": "#0d1b1b",
        "text-main-dark": "#ffffff",
        "text-sub-light": "#4c9a9a",
        "text-sub-dark": "#a0cfcf",
        "gray-custom": "#4F4F4F",
        "tagline-prominent": "#0F172A",
      },
      fontFamily: {
        regular: ["PlusJakartaSans_400Regular"],
        medium: ["PlusJakartaSans_500Medium"],
        semibold: ["PlusJakartaSans_600SemiBold"],
        bold: ["PlusJakartaSans_700Bold"],
      },
      
    },
  },
  plugins: [],
};
