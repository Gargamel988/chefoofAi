import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Ad Soyad en az 2 karakter olmalıdır.")
    .max(50, "Ad Soyad çok uzun."),
  email: z
    .string()
    .min(1, "E-posta alanı zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .regex(/[A-Z]/, "Şifre en az 1 büyük harf içermelidir.")
    .regex(/[a-z]/, "Şifre en az 1 küçük harf içermelidir.")
    .regex(/[0-9]/, "Şifre en az 1 rakam içermelidir."),
});
