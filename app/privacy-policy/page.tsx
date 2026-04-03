import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | CheFood AI',
  description: 'CheFood AI olarak verilerinizin güvenliğini önemsiyoruz. Gizlilik politikamızı buradan okuyabilirsiniz.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-zinc-300 space-y-8">
      <h1 className="text-4xl font-bold text-white mb-10">Gizlilik Politikası</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">1. Veri Toplama</h2>
        <p>
          CheFood AI ("biz", "tarafımız"), hesabınızı oluştururken sağladığınız e-posta adresi, ad ve profil bilgilerini toplar. Bu veriler, kişiselleştirilmiş tarifler sunmak ve hesabınızı yönetmek için kullanılır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">2. Ödeme Bilgileri</h2>
        <p>
          Ödemeler, güvenli ödeme altyapısı PayTR üzerinden gerçekleştirilir. Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz. Ödeme sırasındaki tüm güvenlik işlemleri doğrudan PayTR altyapısı ile yönetilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">3. Çerezler ve AdSense</h2>
        <p>
          Sitemizde, Google AdSense gibi üçüncü taraf sağlayıcılar tarafından sunulan reklamlar gösterilmektedir. Bu sağlayıcılar, ilgi alanlarınıza göre reklam göstermek amacıyla cihazınızda çerezler kullanabilir. Google'ın çerez kullanımını yönetmek için Google Reklam ve İçerik Ağı gizlilik politikasını ziyaret edebilirsiniz.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">4. Veri Güvenliği</h2>
        <p>
          Verileriniz, endüstri standardı güvenlik protokolleri (SSL) ve Supabase altyapısı kullanılarak korunmaktadır. Ancak, internet üzerinden hiçbir iletim yönteminin %100 güvenli olmadığını hatırlatırız.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">5. İletişim</h2>
        <p>
          Gizlilik politikamızla ilgili her türlü sorunuz için <strong>omeraydin1.web@gmail.com</strong> adresinden bize ulaşabilirsiniz.
        </p>
      </section>
      
      <p className="pt-10 text-sm italic">Son güncellenme tarihi: 3 Nisan 2026</p>
    </div>
  );
}
