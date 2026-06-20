export const SITE = {
  name: "WritersNite",
  tagline: "Write. Earn. Grow",
  company: "WRITERSNITE PRODUCTION LIMITED",
  description:
    "WritersNite is a premium writing platform where skilled writers connect with opportunities, grow their careers, and earn from quality work.",
  url: "https://writersnite.com",
  email: "hello@writersnite.com",
  supportEmail: "support@writersnite.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { href: "/about", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ],
  account: [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ],
} as const;
