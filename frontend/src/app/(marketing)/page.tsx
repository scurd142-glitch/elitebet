import type { Metadata } from "next";
import { HomeLanding } from "@/components/landing/home-landing";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Join WRITERSNITE — curated writing jobs, wallet & withdrawals, referrals, ranks, and enterprise operations.",
};

export default function HomePage() {
  return <HomeLanding />;
}
