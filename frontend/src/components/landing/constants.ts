export const COMPANY = {
  brand: "WritersNite",
  legalName: "WRITERSNITE PRODUCTION LIMITED",
  country: "United States of America",
} as const;

export const FEATURES = [
  {
    title: "Curated writing jobs",
    description: "Article, academic, copy, transcription, translation, and more — filtered for quality and fair pay.",
    icon: "pen",
  },
  {
    title: "Secure payouts",
    description: "Wallet, earnings history, and withdrawals with fraud-aware review and multi-rail payouts.",
    icon: "wallet",
  },
  {
    title: "Rankings & achievements",
    description: "XP, badges, and writer ranks from Beginner to Elite — designed for long-term growth.",
    icon: "trophy",
  },
  {
    title: "Referral engine",
    description: "Share your link, grow the network, and earn commissions with transparent referral stats.",
    icon: "users",
  },
  {
    title: "Premium verification",
    description: "Optional verification tiers and badges so top talent stands out to buyers.",
    icon: "badge",
  },
  {
    title: "Built for scale",
    description: "Modern stack, SEO-first marketing pages, and APIs ready for native mobile apps.",
    icon: "zap",
  },
] as const;

export const STATS = [
  { label: "Active writers", value: 12800, suffix: "+", prefix: "" },
  { label: "Tasks delivered", value: 420000, suffix: "+", prefix: "" },
  { label: "Countries", value: 94, suffix: "", prefix: "" },
  { label: "Top assignment pay", value: 30, suffix: "", prefix: "$" },
  { label: "Avg. payout time", value: 36, suffix: "h", prefix: "<" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "WritersNite replaced three fragmented tools for me. Deadlines, submissions, and payouts finally live in one premium workspace.",
    name: "Elena M.",
    role: "Senior copywriter",
    meta: "Remote · EU",
  },
  {
    quote:
      "The dashboard feels like a top-tier SaaS product. I can see wallet, referrals, and job health at a glance.",
    name: "Jordan K.",
    role: "Academic editor",
    meta: "Remote · US",
  },
  {
    quote:
      "Fair categories, clear briefs, and responsive support. This is the marketplace I want my team on.",
    name: "Priya S.",
    role: "Content operations lead",
    meta: "Agency · APAC",
  },
] as const;

export const PRICING = [
  {
    name: "Starter",
    price: "KES 200",
    period: "one-time",
    description: "One-time account activation to access the job board and core wallet features.",
    features: ["Job marketplace access", "Standard support", "Wallet & withdrawals", "Referral link"],
    highlighted: false,
    cta: "Activate",
  },
  {
    name: "Pro Writer",
    price: "$29",
    period: "/ month",
    description: "For full-time remote writers who want priority listings and advanced analytics.",
    features: [
      "Everything in Starter",
      "Priority job visibility",
      "Advanced earnings analytics",
      "Premium badge eligibility",
    ],
    highlighted: true,
    cta: "Go Pro",
  },
  {
    name: "Teams",
    price: "Custom",
    period: "",
    description: "Agencies and education partners managing distributed writing teams at scale.",
    features: ["Volume pricing", "Dedicated success manager", "Custom SLAs", "API roadmap access"],
    highlighted: false,
    cta: "Contact sales",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "How does account activation work?",
    a: "After you register, you pay a one-time activation fee. We verify the payment automatically where integrations allow, then unlock jobs, wallet, and withdrawals aligned with your region.",
  },
  {
    q: "Which payout methods are supported?",
    a: "We support M-Pesa, PayPal, and additional rails over time. Available methods can vary by country and verification tier.",
  },
  {
    q: "Is WritersNite only for creative writing?",
    a: "No. Categories span articles, academic work, transcription, translation, proofreading, blogging, captions, product copy, and AI prompt refinement.",
  },
  {
    q: "How do referrals pay out?",
    a: "Each user receives a unique referral link. When referred writers activate and perform qualifying work, commissions accrue to your wallet with transparent reporting.",
  },
  {
    q: "Who operates the platform?",
    a: `${COMPANY.brand} is owned and operated by ${COMPANY.legalName}, based in the ${COMPANY.country}.`,
  },
] as const;
