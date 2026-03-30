export const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
export const DAY_FULL = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];
export const MEAL_ORDER = ["Kahvaltı", "Öğle", "Akşam"];

export const LOADING_STEPS = [
  "Profilin analiz ediliyor...",
  "Özel isteklerin değerlendiriliyor...",
  "Senin için tarifler seçiliyor...",
  "Kalori ve makrolar dengeleniyor...",
  "Lezzetli menün hazır ediliyor...",
];

export function getTodayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}
