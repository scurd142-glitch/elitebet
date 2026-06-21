export const COLORS = {
  pageBg: "#0a0e1a",
  cardBg: "#1e2530",
  surfaceSecondary: "#2d3448",
  primary: "#00C853",
  gold: "#f5a623",
  textPrimary: "#ffffff",
  textMuted: "#6b7280",
  border: "#1e2530",
  error: "#ef4444",
  inputBg: "#2d3448",
  inputBorder: "#2d3448",
  flightLine: "#ff2d55",
} as const;

export const SITE = {
  name: "NiteBet",
  tagline: "Kenya's premier betting platform",
  company: "NiteBet",
  description:
    "NiteBet is Kenya's premier betting platform. Play crash games, bet on sports, and enjoy casino entertainment.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://nitebet-frontend.vercel.app",
  email: "hello@nitebet.co.ke",
  supportEmail: "support@nitebet.co.ke",
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
