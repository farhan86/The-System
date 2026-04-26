import Providers from "@/components/Providers";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="dark" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
