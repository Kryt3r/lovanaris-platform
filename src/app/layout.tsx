import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./lovanaris.css";
import { LovanarisNavbar } from "@/components/lovanaris/Navbar";
import { LovanarisBackground } from "@/components/lovanaris/Background";
import { LovanarisFooter } from "@/components/lovanaris/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lovanaris | Dein Raum. Deine Geschichte. Deine Stimme.",
  description: "Ein sicherer Raum für Betroffene von Gewalt und Missbrauch. Anonym Geschichten teilen und Unterstützung finden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-white selection:bg-white/20`}>
        <div className="lovanaris-wrapper">
          <LovanarisBackground />
          <LovanarisNavbar />
          <main className="center-wrapper" style={{ position: "relative", zIndex: 20, paddingTop: "48px" }}>
            {children}
          </main>
          <LovanarisFooter />
        </div>
      </body>
    </html>
  );
}
