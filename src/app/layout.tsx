import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import LetterGlitch from "@/components/LetterGlitch";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fōji — FORGE/SH",
  description: "Gestión de proyectos de ingeniería · FORGE/SH",
  icons: {
    icon: "/forge-sh-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <LetterGlitch
            glitchColors={[
              "#00D2FF",
              "#C81DF5",
              "#7B2CBF",
              "#14F1C9",
              "#FF7B1C",
              "#FFD13B",
            ]}
            baseColor="#7B2CBF"
            baseOpacity={0.2}
            glitchAmount={0.55}
            speed={1}
            flow={0.5}
            clickEffect="tear"
          />
        </div>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
