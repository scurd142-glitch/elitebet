import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { EliteBetLogo } from "@/components/ui/elitebet-logo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Log in",
  description: `Sign in to ${SITE.name}.`,
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-4 py-8">
      <div className="mb-8">
        <EliteBetLogo size={64} showText />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
