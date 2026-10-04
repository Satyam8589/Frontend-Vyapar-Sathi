import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ServiceWorkerRegistrar from "./ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vyapar Sakha — Smart Business Management for Indian Retailers",
  description:
    "Vyapar Sakha helps Indian shop owners manage inventory, track sales, and grow their business — all in one place. Simple, fast, and built for Bharat.",
  keywords: [
    "vyapar sakha",
    "business management",
    "inventory",
    "Indian retail",
    "shop management",
    "GST billing",
  ],
  authors: [{ name: "Vyapar Sakha Team" }],
  icons: {
    icon: "/vs_logo.ico",
    shortcut: "/vs_logo.ico",
    apple: "/images/logo/vs_logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Vyapar Sakha — Smart Business Management",
    description:
      "Manage your shop, inventory, and sales effortlessly with Vyapar Sakha.",
    type: "website",
    image: "/images/logo/vs_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <link
          rel="icon"
          href="/images/logo/vs_logo.png"
          type="image/png"
          sizes="32x32 64x64"
        />
        <link
          rel="icon"
          href="/images/logo/vs_logo.png"
          type="image/png"
          sizes="192x192 256x256"
        />
        <link rel="apple-touch-icon" href="/images/logo/vs_logo.png" />
        <meta name="theme-color" content="#1e40af" />
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
