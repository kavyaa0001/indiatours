import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mist-black": "#0A0A0A",
        "mountain-cream": "#F5E8D3",
        "kimono-white": "#FAFAFA",
        "lime-accent": "#D4F87A",
        "sakura-pink": "#FFB7C5",
        "mouse-gray": "#888888",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        editorial: ["var(--font-editorial)"],
      },
    },
  },
  plugins: [],
};
export default config;
