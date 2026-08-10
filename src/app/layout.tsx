import type { Metadata } from "next";
import { Geist, Geist_Mono, Skranji } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "./store/AuthStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const skranji = Skranji({
  weight: ["400", "700"],
  variable: "--font-skranji",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Habit Tracker for your life",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${skranji.variable} h-full antialiased`}>
      <body className="bg-dark text-cream">
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}