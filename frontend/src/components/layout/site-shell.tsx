import { Navbar } from "@/components/layout/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
    </>
  );
}
