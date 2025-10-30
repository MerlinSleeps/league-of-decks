import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import Header from "@/components/site/Header";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "League of Decks",
  description: "Build your Riftbound decks with ease.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      {/* This applies a dark background and light text to the whole app */}
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
