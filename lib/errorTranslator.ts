export function translateSupabaseError(message: string): string {
  const map: Record<string, string> = {
    // Auth errors
    "Invalid login credentials": "Geçersiz e-posta veya şifre.",
    "Email not confirmed": "E-posta adresiniz henüz doğrulanmamış.",
    "User already registered": "Bu e-posta adresi zaten kayıtlı.",
    "Email already in use": "Bu e-posta adresi başka bir hesapta kullanılıyor.",
    "Password should be at least 6 characters":
      "Şifre en az 6 karakter olmalıdır.",
    "Token has expired or is invalid":
      "Doğrulama kodu süresi dolmuş veya geçersiz. Lütfen tekrar deneyin.",
    "User not found": "Kullanıcı bulunamadı.",
    "Invalid OTP": "Geçersiz doğrulama kodu.",
    "OTP expired": "Doğrulama kodunun süresi dolmuş.",
    "Signup is disabled": "Kayıt şu anda devre dışı.",
    "Email link is invalid or has expired":
      "E-posta bağlantısı geçersiz veya süresi dolmuş.",
    "New password should be different from the old password":
      "Yeni şifre eski şifreden farklı olmalıdır.",
    "Auth session missing":
      "Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.",
    "No user found": "Kullanıcı bulunamadı.",
    "Rate limit exceeded":
      "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.",
    // DB / PostgREST errors
    "duplicate key value violates unique constraint": "Bu kayıt zaten mevcut.",
    'null value in column "id" of relation': "Kimlik bilgisi eksik.",
    "violates foreign key constraint": "İlişkili bir kayıt bulunamadı.",
    "permission denied": "Bu işlem için yetkiniz yok.",
    "JWT expired": "Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.",
    "invalid input syntax": "Geçersiz veri formatı.",
    "value too long": "Girilen değer çok uzun.",
    "not-null constraint": "Zorunlu alan boş bırakılamaz.",
    // Network / misc
    "Failed to fetch":
      "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.",
    NetworkError: "Ağ hatası oluştu. Lütfen tekrar deneyin.",
    timeout: "Sunucu yanıt vermedi. Lütfen tekrar deneyin.",
  };

  for (const [en, tr] of Object.entries(map)) {
    if (message.toLowerCase().includes(en.toLowerCase())) {
      return tr;
    }
  }

  // Fallback — return original if no match
  return message;
}
