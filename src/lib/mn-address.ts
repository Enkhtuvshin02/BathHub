const UB_DISTRICTS = [
  "Багануур дүүрэг",
  "Багахангай дүүрэг",
  "Баянгол дүүрэг",
  "Баянзүрх дүүрэг",
  "Налайх дүүрэг",
  "Сонгинохайрхан дүүрэг",
  "Сүхбаатар дүүрэг",
  "Хан-Уул дүүрэг",
  "Чингэлтэй дүүрэг",
];

const UB_KHOROOS: Record<string, string[]> = {
  "Багануур дүүрэг": k(4),
  "Багахангай дүүрэг": k(1),
  "Баянгол дүүрэг": k(20),
  "Баянзүрх дүүрэг": k(28),
  "Налайх дүүрэг": k(5),
  "Сонгинохайрхан дүүрэг": k(32),
  "Сүхбаатар дүүрэг": k(20),
  "Хан-Уул дүүрэг": k(16),
  "Чингэлтэй дүүрэг": k(19),
};

function k(n: number) {
  return Array.from({ length: n }, (_, i) => `${i + 1}-р хороо`);
}

export function getDistricts(): string[] {
  return UB_DISTRICTS;
}

export function getKhoroos(district: string): string[] {
  return UB_KHOROOS[district] ?? [];
}
