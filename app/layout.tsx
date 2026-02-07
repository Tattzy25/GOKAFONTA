import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://fonts.tattty.com"),
  title: "TaTTTy Fonts - AI Tattoo Font Generator",
  description: "Generate amazing tattoo designs with TaTTTy Fonts. A powerful AI tool for tattoo artists.",
  keywords: ["AI", "Tattoo", "Fonts", "Generator", "TaTTTy"],
  authors: [{ name: "TaTTTy Team" }],
  openGraph: {
    title: "TaTTTy Fonts - AI Tattoo Font Generator",
    description: "Generate amazing tattoo designs with TaTTTy Fonts",
    siteName: "TaTTTy Fonts",
    images: [
      {
        url: "/gokanix1200x630.png",
        width: 1200,
        height: 630,
        alt: "GoKAnI AI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaTTTy Fonts - AI Tattoo Font Generator",
    description: "Generate amazing tattoo designs with TaTTTy Fonts",
    images: ["/gokanix1200x630.png"],
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
        className={`${openSans.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
