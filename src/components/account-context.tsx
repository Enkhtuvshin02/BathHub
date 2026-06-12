"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type StoredUser = User & { password: string };

// Pre-seeded demo account so the store isn't empty on first run.
export const demoUser: User = {
  firstName: "Энхтүвшин",
  lastName: "Энхтайван",
  email: "tuvshin674@gmail.com",
  phone: "86155401",
};
export const DEMO_PASSWORD = "demo1234";
const demoStored: StoredUser = { ...demoUser, password: DEMO_PASSWORD };

export type AuthResult = { ok: boolean; error?: string };
export type SignUpInput = User & { password: string };

type AccountState = {
  user: User | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (data: SignUpInput) => AuthResult;
  signOut: () => void;
};

const AccountContext = createContext<AccountState | null>(null);
const USERS_KEY = "bathmall-users";
const SESSION_KEY = "bathmall-account";

const strip = (u: StoredUser): User => {
  const { password: _pw, ...rest } = u;
  void _pw;
  return rest;
};

export function AccountProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>([demoStored]);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted users + session once on mount.
  useEffect(() => {
    try {
      const rawUsers = localStorage.getItem(USERS_KEY);
      const loaded: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [demoStored];
      // ensure the demo account always exists
      if (!loaded.some((u) => u.email === demoStored.email)) loaded.push(demoStored);
      setUsers(loaded);

      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) setUser(JSON.parse(rawSession));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }, [user, hydrated]);

  const signIn: AccountState["signIn"] = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "Бүртгэлтэй и-мэйл олдсонгүй." };
    if (found.password !== password) return { ok: false, error: "Нууц үг буруу байна." };
    setUser(strip(found));
    return { ok: true };
  };

  const signUp: AccountState["signUp"] = (data) => {
    const email = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: "Энэ и-мэйл хаягаар бүртгэл үүссэн байна." };
    }
    const stored: StoredUser = { ...data, email: data.email.trim() };
    setUsers((prev) => [...prev, stored]);
    setUser(strip(stored));
    return { ok: true };
  };

  return (
    <AccountContext.Provider
      value={{ user, hydrated, signIn, signUp, signOut: () => setUser(null) }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
