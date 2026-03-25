import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const uiFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600"],
});
const displayFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CertiSafe | Secure Digital Certification Management",
  description: "Issue, manage, and verify professional certificates with ease. Institutional-grade integrity protocol for the digital age.",
  metadataBase: new URL("https://certificationmanagementsystem-nine.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${uiFont.variable} ${displayFont.variable} ${monoFont.variable} antialiased font-sans`}>
        <ToastProvider>
           {children}
        </ToastProvider>
      </body>
    </html>
  );
}

