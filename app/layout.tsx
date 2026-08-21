import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soft-space-pink-sensory.ritika-rk200.chatgpt.site"),
  title: "Soft Space, a sensory place to soften",
  description: "Touch shape-shifting pink forms, choose a calming noise, and take one gentle breath.",
  openGraph: {
    title: "Soft Space, a sensory place to soften",
    description: "Touch, listen, breathe. A little corner of the internet made for your senses.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soft Space, a sensory place to soften",
    description: "Touch, listen, breathe. A little corner of the internet made for your senses.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
