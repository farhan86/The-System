import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The System",
  description: "Collaborative AI Knowledge & Chat Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[--color-background] text-[--color-foreground] antialiased selection:bg-[--color-primary]/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
