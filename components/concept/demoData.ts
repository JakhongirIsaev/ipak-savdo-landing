export type Locale = "ru" | "uz";
export type Filter = "top" | "noshk" | "all";
export type Period = "day" | "week" | "month";

export type Product = {
  id: string;
  ru: string;
  uz: string;
  emoji: string;
  image?: string;
  price: number;
  stock: number;
  catRu: string;
  catUz: string;
  tags: Filter[];
};

export const PRODUCTS: Product[] = [
  { id: "water", ru: "Бутылка воды", uz: "Suv shishasi", emoji: "💧", image: "/products/water.svg", price: 7000, stock: 42, catRu: "Напитки", catUz: "Ichimliklar", tags: ["top", "noshk"] },
  { id: "coffee", ru: "Кофе 3-в-1", uz: "Kofe 3-in-1", emoji: "☕", image: "/products/coffee.svg", price: 3500, stock: 71, catRu: "Напитки", catUz: "Ichimliklar", tags: ["top"] },
  { id: "bread", ru: "Лепёшка", uz: "Non", emoji: "🍞", image: "/products/bread.svg", price: 4000, stock: 18, catRu: "Продукты", catUz: "Oziq-ovqat", tags: ["noshk"] },
  { id: "juice", ru: "Сок апельсиновый", uz: "Apelsin sharbati", emoji: "🧃", image: "/products/juice.svg", price: 12000, stock: 9, catRu: "Напитки", catUz: "Ichimliklar", tags: [] },
  { id: "choco", ru: "Шоколад", uz: "Shokolad", emoji: "🍫", image: "/products/choco.svg", price: 9000, stock: 33, catRu: "Сладкое", catUz: "Shirinlik", tags: ["top"] },
  { id: "gum", ru: "Жвачка", uz: "Saqich", emoji: "🍬", image: "/products/gum.svg", price: 2000, stock: 120, catRu: "Сладкое", catUz: "Shirinlik", tags: ["noshk"] },
  { id: "chips", ru: "Чипсы", uz: "Chips", emoji: "🍟", image: "/products/chips.svg", price: 8000, stock: 24, catRu: "Снеки", catUz: "Snek", tags: [] },
  { id: "milk", ru: "Молоко", uz: "Sut", emoji: "🥛", image: "/products/milk.svg", price: 13000, stock: 15, catRu: "Продукты", catUz: "Oziq-ovqat", tags: ["top", "noshk"] },
  { id: "energy", ru: "Энергетик", uz: "Energetik", emoji: "⚡", image: "/products/energy.svg", price: 11000, stock: 28, catRu: "Напитки", catUz: "Ichimliklar", tags: ["top"] },
  { id: "sugar", ru: "Сахар", uz: "Shakar", emoji: "🧂", image: "/products/sugar.svg", price: 9000, stock: 64, catRu: "Продукты", catUz: "Oziq-ovqat", tags: ["noshk"] },
];

export type Sale = { time: string; no: string; sum: number; method: "cash" | "card" | "qr" | "debt"; cashierRu: string; cashierUz: string };

export const SALES: Sale[] = [
  { time: "14:32", no: "1042", sum: 23000, method: "card", cashierRu: "Азиз К.", cashierUz: "Aziz K." },
  { time: "14:18", no: "1041", sum: 7000, method: "cash", cashierRu: "Дилноза", cashierUz: "Dilnoza" },
  { time: "13:54", no: "1040", sum: 41000, method: "qr", cashierRu: "Рустам", cashierUz: "Rustam" },
  { time: "13:31", no: "1039", sum: 12000, method: "cash", cashierRu: "Азиз К.", cashierUz: "Aziz K." },
  { time: "12:47", no: "1038", sum: 25000, method: "debt", cashierRu: "Дилноза", cashierUz: "Dilnoza" },
  { time: "12:20", no: "1037", sum: 16500, method: "card", cashierRu: "Рустам", cashierUz: "Rustam" },
  { time: "11:58", no: "1036", sum: 9000, method: "qr", cashierRu: "Дилноза", cashierUz: "Dilnoza" },
  { time: "11:30", no: "1035", sum: 33000, method: "cash", cashierRu: "Азиз К.", cashierUz: "Aziz K." },
];

export type Employee = { nameRu: string; nameUz: string; roleRu: string; roleUz: string; onShift: boolean; revenue: number };

export const EMPLOYEES: Employee[] = [
  { nameRu: "Азиз Каримов", nameUz: "Aziz Karimov", roleRu: "Владелец", roleUz: "Egasi", onShift: true, revenue: 1850000 },
  { nameRu: "Дилноза", nameUz: "Dilnoza", roleRu: "Кассир", roleUz: "Kassir", onShift: true, revenue: 1240000 },
  { nameRu: "Рустам", nameUz: "Rustam", roleRu: "Кассир", roleUz: "Kassir", onShift: false, revenue: 360000 },
];

export const KPIS: Record<Period, { revenue: number; checks: number; avg: number; returns: number }> = {
  day: { revenue: 3450000, checks: 42, avg: 82000, returns: 1 },
  week: { revenue: 19800000, checks: 287, avg: 69000, returns: 6 },
  month: { revenue: 84200000, checks: 1240, avg: 68000, returns: 24 },
};

export const CHART: Record<Period, number[]> = {
  day: [12, 19, 8, 22, 17, 26, 14],
  week: [21, 28, 18, 24, 30, 26, 33],
  month: [54, 61, 48, 66, 72, 59, 77, 64, 70, 81, 58, 84],
};

export const CHART_LABELS: Record<Locale, Record<Period, string[]>> = {
  ru: {
    day: ["09", "11", "13", "15", "17", "19", "21"],
    week: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    month: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  },
  uz: {
    day: ["09", "11", "13", "15", "17", "19", "21"],
    week: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    month: ["Y", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
  },
};

export const TOP_SOLD: { id: string; qty: number }[] = [
  { id: "water", qty: 38 },
  { id: "coffee", qty: 31 },
  { id: "milk", qty: 22 },
  { id: "choco", qty: 19 },
  { id: "chips", qty: 14 },
];

export function money(n: number, locale: Locale = "uz") {
  const grouped = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} ${locale === "ru" ? "сум" : "so'm"}`;
}

export function shortMoney(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} млн`;
  if (n >= 1_000) return `${Math.round(n / 1000)} тыс`;
  return `${n}`;
}
