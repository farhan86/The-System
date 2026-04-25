import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KaloHub",
  description: "Collaborative knowledge sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen relative selection:bg-white/20 selection:text-white`}>
        {/* Navigation Sidebar/Top bar structure can stay in the layout component */}
        <div className="flex h-screen overflow-hidden">
          {/* Main content wrapper */}
          <main className="flex-1 overflow-y-auto relative z-10 p-6 md:p-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
