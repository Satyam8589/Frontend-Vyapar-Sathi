import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vyapar Sathi — Smart Business Management for Indian Retailers",
  description: "Vyapar Sathi helps Indian shop owners manage inventory, track sales, and grow their business — all in one place. Simple, fast, and built for Bharat.",
  keywords: ["vyapar sathi", "business management", "inventory", "Indian retail", "shop management", "GST billing"],
  authors: [{ name: "Vyapar Sathi Team" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Vyapar Sathi — Smart Business Management",
    description: "Manage your shop, inventory, and sales effortlessly with Vyapar Sathi.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
