import Link from "next/link";
import Image from "next/image";
import logoSrc from "../../public/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image src={logoSrc} alt="BathHub logo" height={40} className="w-auto shrink-0" />
      <span className="text-2xl font-extrabold leading-none">
        <span className="text-brand">Bath</span>
        <span className="text-foreground">Hub</span>
      </span>
    </Link>
  );
}
