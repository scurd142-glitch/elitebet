import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type EliteBetLogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

export function EliteBetLogo({ className, size = 32, showText = false }: EliteBetLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image src="/logo.svg" alt="EliteBet" width={size} height={size} priority />
      {showText ? (
        <span className="text-lg font-bold tracking-tight text-foreground">EliteBet</span>
      ) : null}
    </Link>
  );
}
