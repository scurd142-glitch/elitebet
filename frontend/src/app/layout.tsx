import "./globals.css";
import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";
import { COMPANY } from "@/components/landing/constants";

const headingFont = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${COMPANY.brand} — Global writing marketplace`,
    template: `%s · ${COMPANY.brand}`,
  },
  description: `${COMPANY.brand} is a professional online writing jobs platform and remote work ecosystem by ${COMPANY.legalName}. Activate, earn, withdraw, and grow with ranks & referrals.`,
  keywords: [
    "writing jobs",
    "remote writing",
    "freelance writers",
    "copywriting jobs",
    "academic writing",
    "transcription",
    "translation",
    "WritersNite",
  ],
  manifest: "/manifest.json",
  themeColor: "#1B3A2B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WritersNite",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: COMPANY.brand,
    title: `${COMPANY.brand} — Global writing marketplace`,
    description: `Professional writing marketplace by ${COMPANY.legalName}.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.brand} — Global writing marketplace`,
    description: `Professional writing marketplace by ${COMPANY.legalName}.`,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.brand,
  legalName: COMPANY.legalName,
  url: siteUrl,
  description: "Online writing marketplace and remote work ecosystem.",
  areaServed: "Worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
