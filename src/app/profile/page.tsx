"use client";

import Link from "next/link";
import { Package, User as UserIcon } from "lucide-react";
import { useAccount } from "@/components/account-context";
import { SignInPrompt } from "@/components/auth/sign-in-prompt";

export default function ProfilePage() {
  const { user, hydrated } = useAccount();

  if (!hydrated) {
    return <div className="mx-auto max-w-[800px] px-4 py-16 text-center text-muted-foreground">Уншиж байна…</div>;
  }

  if (!user) return <SignInPrompt redirect="/profile" />;

  const rows = [
    { label: "Нэр", value: user.firstName },
    { label: "Овог", value: user.lastName },
    { label: "Утасны дугаар", value: user.phone },
    { label: "И-Мэйл хаяг", value: user.email },
  ];

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <UserIcon className="size-6 text-brand" /> Хувийн мэдээлэл
      </h1>

      <div className="rounded-card border border-border-subtle p-6">
        <div className="mb-5 flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-brand/10 text-brand">
            <UserIcon className="size-8" />
          </span>
          <div>
            <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <dl className="divide-y divide-border-subtle">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between py-3 text-sm">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-medium">{r.value || "—"}</dd>
            </div>
          ))}
        </dl>

        <Link href="/orders" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">
          <Package className="size-4" /> Миний захиалгууд
        </Link>
      </div>
    </div>
  );
}
