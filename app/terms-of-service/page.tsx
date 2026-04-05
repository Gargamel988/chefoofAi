import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Kullanım Şartları | CheFood AI',
  description: 'CheFood AI platformunu kullanırken uymanız gereken kurullar burada listelenmiştir.',
  path: '/terms-of-service',
  keywords: [
    "chefood ai kullanım şartları",
    "gizlilik politikası",
    "veri güvenliği",
    "çerez politikası",
    "kişisel verilerin korunması",
    "gizlilik sözleşmesi",
    "ai yemek asistanı gizlilik",
    "tarif platformu gizlilik",
    "ödemeler ve güvenlik",
    "veri koruma",
    "gizlilik politikası",
  ],
});

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-zinc-300 space-y-8">
      <h1 className="text-4xl font-bold text-white mb-10">Kullanım Şartları</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">1. Kabul</h2>
        <p>
          CheFood AI'yı kullanarak, bu kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız, hizmeti kullanmayı durdurmanız gerekmektedir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">2. Hizmet ve Yapay Zeka</h2>
        <p>
          CheFood AI, yapay zeka destekli tarif önerileri sunar. AI tarafından üretilen tarifler bilgilendirme amaçlıdır; uygulama sonuçları ve mutfaktaki güvenlik konusunda sorumluluk kullanıcıya aittir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">3. Abonelik ve İptal</h2>
        <p>
          CheFood AI Pro aboneliği, belirtilen ücret karşılığında sınırsız tarif ve AI asistanlığı sunar. Abonelik ve iade durumları PayTR ödeme kurallarına tabidir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">4. Fikri Mülkiyet</h2>
        <p>
          CheFood AI içindeki tasarımlar, logo ve yazılım Hatay Yazılım'a aittir. İzinsiz kopyalanması ve dağıtılması yasaktır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-500">5. Feragatname</h2>
        <p>
          Hizmetimiz "olduğu gibi" sunulmaktadır. Herhangi bir garanti veya hata söz konusu olmadığında sorumluluk kullanıcıya aittir.
        </p>
      </section>

      <p className="pt-10 text-sm italic">Son güncellenme tarihi: 3 Nisan 2026</p>
    </div>
  );
}
