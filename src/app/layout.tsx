import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./lovanaris.css";
import { LovanarisNavbar } from "@/components/lovanaris/Navbar";
import { LovanarisBackground } from "@/components/lovanaris/Background";
import { LovanarisFooter } from "@/components/lovanaris/Footer";
import { BackgroundMesh } from "@/components/BackgroundMesh";
import { Meteors } from "@/components/Meteors";
import SmoothScroll from "@/components/SmoothScroll";

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
        <SmoothScroll>
          <div className="lovanaris-wrapper flex flex-col min-h-screen">
            <div 
              className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
              style={{ transform: 'translateZ(0)' }}
            >
              <Meteors number={25} />
            </div>
            <div style={{ transform: 'translateZ(0)' }}>
              <BackgroundMesh />
              <LovanarisBackground />
            </div>
            
            <LovanarisNavbar />
            
            <main className="relative flex-grow pb-20" style={{ paddingTop: "48px", zIndex: 20 }}>
              <div className="center-wrapper">
                {children}
              </div>
            </main>
            
            <LovanarisFooter />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
