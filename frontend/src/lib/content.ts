export const FEATURES = [
  {
    title: "Quality Writing Jobs",
    description:
      "Access curated writing opportunities matched to your skills — from articles to research and copywriting.",
    icon: "FileText",
  },
  {
    title: "Secure Earnings",
    description:
      "Track earnings, referrals, and withdrawals in one professional dashboard built for writers.",
    icon: "Wallet",
  },
  {
    title: "Writer Growth",
    description:
      "Activity logs, referrals, and performance insights help you grow your reputation on the platform.",
    icon: "TrendingUp",
  },
  {
    title: "Fast Payments",
    description:
      "One-time M-Pesa activation (KES 200) unlocks jobs, wallet, and withdrawals.",
    icon: "Zap",
  },
  {
    title: "Referral Rewards",
    description:
      "Invite writers and earn 10% commission when your network completes jobs on WritersNite.",
    icon: "Users",
  },
  {
    title: "24/7 Support",
    description:
      "Built-in support tickets, contact form, and notifications keep you connected to the team.",
    icon: "Shield",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Amina K.",
    role: "Freelance Writer, Nairobi",
    quote:
      "WritersNite feels like a real company platform — professional, clean, and built for serious writers.",
  },
  {
    name: "James O.",
    role: "Content Specialist",
    quote:
      "The dashboard makes it easy to track jobs, wallet balance, and referrals in one place.",
  },
  {
    name: "Faith M.",
    role: "Academic Writer",
    quote:
      "Finally a Kenyan-focused writing platform with premium UI. WritersNite Production Limited did an excellent job.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: "what-is",
    question: "What is WritersNite?",
    answer:
      "WritersNite is a writing platform owned by WRITERSNITE PRODUCTION LIMITED where writers register, access jobs, earn money, and grow through referrals.",
  },
  {
    id: "who-can-join",
    question: "Who can join the platform?",
    answer:
      "Register for free, complete M-Pesa activation (KES 200), then access jobs, wallet, referrals, and withdrawals.",
  },
  {
    id: "features",
    question: "What can I do on the platform?",
    answer:
      "Register and log in, accept writing jobs, submit work, track earnings in your wallet, invite referrals, request withdrawals, and open support tickets from your dashboard.",
  },
  {
    id: "payments",
    question: "How do payments work?",
    answer:
      "You earn when admins approve completed jobs. Withdraw to M-Pesa from your dashboard (minimum KES 200). Payouts are processed manually by our team.",
  },
  {
    id: "support",
    question: "How do I get support?",
    answer:
      "Use the Contact page, email support@writersnite.com, or open a support ticket from Dashboard → Support after you log in.",
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "to explore",
    description: "Browse the platform and create your writer profile.",
    features: [
      "Public platform access",
      "Register & login",
      "Writer dashboard",
      "Announcements & notifications",
    ],
    cta: "Create Account",
    highlighted: false,
  },
  {
    name: "Writer",
    price: "KES 200",
    period: "one-time activation",
    description: "M-Pesa activation unlocks jobs, wallet, referrals, and withdrawals.",
    features: [
      "M-Pesa paybill activation",
      "Accept writing jobs",
      "Submit completed work",
      "Wallet & earnings",
      "Referral commissions",
      "Automatic M-Pesa withdrawal payouts",
    ],
    cta: "Start Writing",
    highlighted: true,
  },
  {
    name: "Pro Writer",
    price: "Grow",
    period: "with us",
    description: "Top performers get priority support and platform visibility.",
    features: [
      "Support tickets",
      "Activity tracking",
      "Referral network",
      "Premium platform access",
    ],
    cta: "Grow With Us",
    highlighted: false,
  },
] as const;
