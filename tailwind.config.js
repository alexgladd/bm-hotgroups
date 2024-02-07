/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Noto Sans"', "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        light: "#f6f1f2",
        dark: "#382d39",
        accent: "#898695",
        primary: {
          DEFAULT: "#dd4b39",
          50: "#fef3f2",
          100: "#fee5e2",
          200: "#fdd0cb",
          300: "#fbafa6",
          400: "#f78172",
          500: "#ed5846",
          600: "#dd4b39",
          700: "#b72f1e",
          800: "#982a1c",
          900: "#7e291e",
          950: "#44110b",
        },
      },
    },
  },
  plugins: [],
};
