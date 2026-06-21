import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { DepositProvider } from "@/components/providers/deposit-provider";
import { DepositModal } from "@/components/payments/deposit-modal";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "react-hot-toast";
import { SITE } from "@/lib/constants";
import { OnboardingWrapper } from "@/components/providers/onboarding-provider";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — Kenya's premier betting platform`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "betting",
    "sports betting",
    "aviator",
    "crash games",
    "casino",
    "Kenya",
    "NiteBet",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NiteBet",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} — Premier Betting Platform`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Premier Betting Platform`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#00C853",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: siteUrl,
  description: SITE.description,
  areaServed: "Kenya",
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
      className={`${bodyFont.variable} h-full dark`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-[#ffffff]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <DepositProvider>
              <OnboardingWrapper>
                <AppShell>{children}</AppShell>
                <PWAInstallPrompt />
                <DepositModal />
              </OnboardingWrapper>
            </DepositProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#ffffff",
              border: "1px solid #333333",
            },
          }}
        />
      </body>
    </html>
  );
}
