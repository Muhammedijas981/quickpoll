import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { WebSocketProvider } from "@/lib/WebSocketProvider"; // Normal import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickPoll - Real-Time Polling Platform",
  description: "Create and participate in real-time polls with live updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
          <Toaster />
        </WebSocketProvider>
      </body>
    </html>
  );
}
