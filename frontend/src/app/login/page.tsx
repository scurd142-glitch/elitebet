import type { Metadata } from "next";
import { COMPANY } from "@/components/landing/constants";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: `Sign in to ${COMPANY.brand}.`,
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1B3A2B" }}>
      <LoginForm />
    </div>
  );
}
