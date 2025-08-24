// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { SocketProvider } from "@/context/SocketContext";
import "./globals.css";

// Load custom fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the application
export const metadata = {
  title: "Insyd",
  description: "The next-gen social web for the Architecture Industry.",
};

// Root Layout: Wraps every page of the app
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Provide a single, persistent WebSocket connection */}
        <SocketProvider>
          {/* Navbar appears on every page */}
          <Navbar />

          {/* Main content of each page */}
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </SocketProvider>
      </body>
    </html>
  );
}
