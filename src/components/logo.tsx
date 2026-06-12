import Link from "next/link";
import { Bath } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-1.5 ${className}`}>
      <Bath className="size-7 text-brand" strokeWidth={2} />
      <span className="text-2xl font-extrabold leading-none">
        <span className="text-brand">BathMall</span>
        <span className="text-foreground">.mn</span>
      </span>
    </Link>
  );
}
