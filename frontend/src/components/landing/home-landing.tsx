"use client";

import Link from "next/link";
import { PenLine, Wallet, Trophy, Users, BadgeCheck, Zap, ArrowRight } from "lucide-react";
import { WritersniteLogo } from "@/components/ui/writersnite-logo";
import { STATS } from "./constants";

const iconMap = {
  pen: PenLine,
  wallet: Wallet,
  trophy: Trophy,
  users: Users,
  badge: BadgeCheck,
  zap: Zap,
} as const;

const FEATURES = [
  {
    icon: "pen",
    title: "Curated Writing Jobs",
    description: "Access high-quality writing opportunities from verified clients worldwide.",
    badge: "Earn up to $30 per assignment",
  },
  {
    icon: "wallet",
    title: "Secure Wallet System",
    description: "Manage your earnings with transparent tracking and instant withdrawals.",
  },
  {
    icon: "trophy",
    title: "Writer Rankings",
    description: "Climb the ranks with badges and recognition for exceptional work.",
  },
];

export function HomeLanding() {
  return (
    <div className="relative min-h-screen" style={{ background: "#1B3A2B" }}>
      {/* Premium Glow Effects */}
      <div
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          position: "absolute",
          top: "-10%",
          left: "20%",
          zIndex: -1,
        }}
      />
      <div
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(232, 220, 196, 0.12) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          position: "absolute",
          top: "10%",
          right: "20%",
          zIndex: -1,
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Branding Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-8"
            style={{ background: "#234A37", border: "1px solid #C9A227" }}
          >
            <WritersniteLogo size={18} />
            <span className="text-sm font-semibold" style={{ color: "#F0EAD6" }}>
              WRITERSNITE PRODUCTION LIMITED
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "24px",
              background: "linear-gradient(to right, #F0EAD6, #E8DCC4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Premium Platform for Serious Writers
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              color: "#A8BFAE",
              marginBottom: "40px",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            Join WritersNite — curated writing jobs, secure wallet management, referral commissions, and enterprise-grade operations designed for remote professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              style={{
                background: "#C9A227",
                color: "#1B3A2B",
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start Writing <ArrowRight style={{ display: "inline", marginLeft: "8px", width: "16px", height: "16px" }} />
            </Link>
            <Link
              href="/#features"
              style={{
                background: "transparent",
                color: "#F0EAD6",
                border: "1px solid rgba(232, 220, 196, 0.3)",
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(232, 220, 196, 0.5)";
                e.currentTarget.style.background = "rgba(232, 220, 196, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(232, 220, 196, 0.3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#F0EAD6",
              marginBottom: "16px",
            }}
          >
            Everything You Need to Succeed
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#A8BFAE", lineHeight: 1.6 }}>
            A complete ecosystem designed for professional writers and remote teams.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}
        >
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                style={{
                  background: "rgba(35, 74, 55, 0.6)",
                  border: "1px solid rgba(58, 95, 74, 0.3)",
                  borderRadius: "16px",
                  padding: "32px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(35, 74, 55, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.4)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(35, 74, 55, 0.6)";
                  e.currentTarget.style.borderColor = "rgba(58, 95, 74, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(201, 162, 39, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Icon style={{ width: "24px", height: "24px", color: "#C9A227" }} />
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#F0EAD6",
                    marginBottom: "12px",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: "1rem", color: "#A8BFAE", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
                {feature.badge && (
                  <div
                    className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(201, 162, 39, 0.2)", color: "#C9A227", border: "1px solid rgba(201, 162, 39, 0.3)" }}
                  >
                    {feature.badge}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                background: "rgba(35, 74, 55, 0.4)",
                border: "1px solid rgba(58, 95, 74, 0.3)",
                borderRadius: "16px",
                padding: "32px 24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#C9A227",
                  marginBottom: "8px",
                }}
              >
                {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#A8BFAE",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div
          style={{
            background: "rgba(35, 74, 55, 0.4)",
            border: "1px solid rgba(58, 95, 74, 0.3)",
            borderRadius: "24px",
            padding: "64px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#F0EAD6",
              marginBottom: "16px",
            }}
          >
            Ready to Start Earning?
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#A8BFAE",
              lineHeight: 1.6,
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px",
            }}
          >
            Join thousands of writers who trust WritersNite for their remote career.
          </p>
          <Link
            href="/register"
            style={{
              background: "#C9A227",
              color: "#1B3A2B",
              fontWeight: 600,
              padding: "16px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "1.125rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer
        style={{
          background: "rgba(27, 58, 43, 0.95)",
          borderTop: "1px solid rgba(58, 95, 74, 0.3)",
          padding: "80px 6% 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "40px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          className="footer-grid"
        >
          <style jsx>{`
            @media (max-width: 768px) {
              .footer-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 32px !important;
              }
            }
            @media (max-width: 480px) {
              .footer-grid {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
              }
            }
          `}</style>
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <WritersniteLogo size={24} />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#F0EAD6",
                }}
              >
                WritersNite Production Limited
              </h3>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#A8BFAE",
                lineHeight: 1.6,
              }}
            >
              The premium platform for serious remote writers and enterprise teams.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#F0EAD6",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Product
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { label: "Features", href: "/#features" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Jobs", href: "/dashboard/jobs" },
                { label: "Wallet", href: "/dashboard/wallet" },
              ].map((link) => (
                <li key={link.label} style={{ marginBottom: "12px" }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "14px",
                      color: "#A8BFAE",
                      textDecoration: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#F0EAD6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#A8BFAE";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#F0EAD6",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Support", href: "/dashboard/support" },
              ].map((link) => (
                <li key={link.label} style={{ marginBottom: "12px" }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "14px",
                      color: "#A8BFAE",
                      textDecoration: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#F0EAD6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#A8BFAE";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#F0EAD6",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Legal
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Refund Policy", href: "/refund" },
              ].map((link) => (
                <li key={link.label} style={{ marginBottom: "12px" }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "14px",
                      color: "#A8BFAE",
                      textDecoration: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#F0EAD6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#A8BFAE";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "60px auto 0",
            paddingTop: "32px",
            borderTop: "1px solid rgba(58, 95, 74, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div className="flex items-center gap-2">
            <WritersniteLogo size={16} />
            <p style={{ fontSize: "14px", color: "#A8BFAE" }}>
              © 2026 WritersNite Production Limited. All rights reserved.
            </p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link
              href="/privacy"
              style={{
                fontSize: "14px",
                color: "#A8BFAE",
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F0EAD6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#A8BFAE";
              }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              style={{
                fontSize: "14px",
                color: "#A8BFAE",
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F0EAD6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#A8BFAE";
              }}
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
