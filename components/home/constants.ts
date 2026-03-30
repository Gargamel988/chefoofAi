export type UserInfo = {
  id: string;
  email: string;
  avatarUrl: string | null;
  displayName: string;
};
export type Profile = {
  name?: string;
  diet_type?: string;
  diets?: string;
  goal?: string;
  cuisines?: string[];
  allergies?: string[];
} | null;

export const ORANGE = "#FF6B2C";

export const MEALS = [
  {
    id: 1,
    name: "Avokadolu Yumurta Toast",
    cal: 420,
    protein: 22,
    carbs: 38,
    fat: 18,
    time: "15 dk",
    diff: "Kolay",
    match: 98,
    tags: ["Yüksek Protein", "Kahvaltı"],
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Somon Teriyaki & Kinoa",
    cal: 560,
    protein: 42,
    carbs: 48,
    fat: 14,
    time: "25 dk",
    diff: "Orta",
    match: 95,
    tags: ["Omega-3", "Öğle"],
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Mercimek & Sebze Çorbası",
    cal: 310,
    protein: 18,
    carbs: 42,
    fat: 6,
    time: "30 dk",
    diff: "Kolay",
    match: 91,
    tags: ["Vegan", "Akşam"],
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=700&auto=format&fit=crop",
  },
];

export const WEEK_DAYS = [
  { d: "Pzt", emoji: "🥗", name: "Bowl", cal: 480, done: true },
  { d: "Sal", emoji: "🍳", name: "Toast", cal: 420, done: true },
  { d: "Çar", emoji: "🐟", name: "Somon", cal: 560, done: true },
  { d: "Per", emoji: "🍲", name: "Çorba", cal: 310, done: false, today: true },
  { d: "Cum", emoji: "🥩", name: "Tavuk", cal: 490, done: false },
  { d: "Cmt", emoji: "🍜", name: "Makarna", cal: 530, done: false },
  { d: "Paz", emoji: "🥞", name: "Pancake", cal: 380, done: false },
];

export const FRIDGE_QUICK = [
  "🍗 Tavuk",
  "🍅 Domates",
  "🍚 Pirinç",
  "🧀 Peynir",
  "🥦 Brokoli",
  "🥚 Yumurta",
];

export const HISTORY = [
  {
    id: 1,
    name: "Kremalı Mantar Makarna",
    date: "Dün",
    cal: 540,
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Izgara Hindi Salatası",
    date: "2 gün önce",
    cal: 380,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Falafel & Hummus Tabağı",
    date: "3 gün önce",
    cal: 460,
    img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=400&auto=format&fit=crop",
  },
];
