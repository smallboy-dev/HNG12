/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roadrage: ['Road Rage', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#05252C",
        greenone: "#24A0B5",
        greentwo: "#041E23",
        greenthree: "#0E464F",
        greenfour: "#08252B",
        greenfive: "#052228",
        greensix: "#12464E",
        borderone: "#197686",
        bordertwo: "#0E464F",
        borderthree: "#07373F",
        borderfour: "#2BA4B9",
        borderfive: "#2C545B",
        subdued: "#B3B3B3",
        lightgrey: "#FAFAFA"
      },
    },
  },
  plugins: [],
};

export default config;
