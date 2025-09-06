import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bizbot",
  description: "AI-Powered Chatbot for Your Business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script src="https://bizbot-eight.vercel.app/api/embed/68bc1da4fa020c7b86d4bd28/script" async></script>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
