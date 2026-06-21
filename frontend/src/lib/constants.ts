export const COLORS = {
  pageBg: "#111111",
  cardBg: "#1a1a1a",
  surfaceSecondary: "#222222",
  primary: "#00a651",
  gold: "#f5c518",
  textPrimary: "#ffffff",
  textMuted: "#888888",
  border: "#333333",
  error: "#e63946",
  inputBg: "#222222",
  inputBorder: "#333333",
} as const;

export const SITE = {
  name: "EliteBet",
  tagline: "Kenya's premier betting platform",
  company: "EliteBet",
  description:
    "EliteBet is Kenya's premier betting platform. Deposit via M-Pesa, play crash games, bet on sports, and enjoy casino entertainment.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://elitebet-frontend.vercel.app",
  email: "hello@elitebet.co.ke",
  supportEmail: "support@elitebet.co.ke",
  version: "v1.0.0",
  paybill: process.env.NEXT_PUBLIC_PAYSTACK_PAYBILL ?? "4090000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "+254700000000",
} as const;

export const FOOTER_LINKS = {
  info: [
    { href: "/how-to-play", label: "How to Play" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/responsible-gambling", label: "Responsible Gambling" },
  ],
  account: [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/sports", label: "Sports" },
  { href: "/inplay", label: "Live" },
  { href: "/casino", label: "Casino" },
  { href: "/promotions", label: "Promotions" },
] as const;
