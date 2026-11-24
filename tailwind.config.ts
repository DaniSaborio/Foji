import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fondo oficial FORGE/SH (forge-sh.dev): Obsidian Void (#010005) & Deep Forge Surface (#09080E)
        ink: {
          950: "#010005",
          900: "#09080E",
          850: "#0E0C16",
          800: "#141122",
          700: "#1D1930",
          600: "#282242",
          500: "#352D56",
        },
        // Accent primario FORGE/SH: Electric Cyan (#00D2FF)
        brand: {
          50: "#e6fbff",
          100: "#b3f3ff",
          200: "#80ebff",
          300: "#4de3ff",
          400: "#1adaff",
          500: "#00D2FF",
          600: "#00a8cc",
          700: "#007e99",
          800: "#005466",
          900: "#002a33",
        },
        // Forge Violet (#7B2CBF) & Neon Magenta (#C81DF5)
        violet: {
          400: "#C81DF5",
          500: "#9E30ED",
          600: "#7B2CBF",
          700: "#5A1E8F",
        },
        pink: {
          400: "#E066FF",
          500: "#C81DF5",
          600: "#9E14C2",
        },
        forge: {
          void: "#010005",
          surface: "#09080E",
          violet: "#7B2CBF",
          magenta: "#C81DF5",
          cyan: "#00D2FF",
          mint: "#14F1C9",
          orange: "#FF7B1C",
          gold: "#FFD13B",
          silver: "#9EA4B0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(0,210,255,0.22), 0 8px 30px -10px rgba(0,210,255,0.35)",
        "neon-violet":
          "0 0 0 1px rgba(123,44,191,0.32), 0 8px 30px -10px rgba(200,29,245,0.4)",
        "neon-crucible":
          "0 0 0 1px rgba(255,123,28,0.28), 0 8px 30px -10px rgba(255,209,59,0.32)",
        "neon-mint":
          "0 0 0 1px rgba(20,241,201,0.25), 0 8px 30px -10px rgba(20,241,201,0.3)",
      },
      backgroundImage: {
        // Gradiente Fragua Oficial (FORGE/SH)
        "brand-gradient":
          "linear-gradient(135deg, #C81DF5 0%, #7B2CBF 50%, #00D2FF 100%)",
        "brand-gradient-2": "linear-gradient(135deg, #00D2FF 0%, #7B2CBF 100%)",
        "crucible-gradient": "linear-gradient(180deg, #FFD13B 0%, #FF7B1C 100%)",
        "crucible-horiz":
          "linear-gradient(90deg, #FFD13B 0%, #FF7B1C 55%, #C81DF5 100%)",
        "forge-spectrum":
          "linear-gradient(90deg, #C81DF5 0%, #7B2CBF 24%, #00D2FF 52%, #14F1C9 74%, #FFD13B 88%, #FF7B1C 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
