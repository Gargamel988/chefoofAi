import { z } from "zod";
import { weeklyPlanFormSchema } from "./schema";

export const days = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];
export const mealTypesData = [
  {
    type: "Kahvaltı",
    iconName: "Coffee",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    type: "Öğle",
    iconName: "Apple",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    type: "Akşam",
    iconName: "Beef",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
  },
];

export type WeeklyPlanFormData = z.infer<typeof weeklyPlanFormSchema>;

export type WeeklyMeal = {
  id?: string;
  day: string;
  meal_type: string;
  recipe_title: string;
  description?: string;
  difficulty: string;
  ingredients: { name: string; amount: string; unit: string }[];
  steps: { description: string }[];
  nutrition: { cal: number; protein: number; carbs: number; fat: number };
  times: { prep: number; cook: number };
};
