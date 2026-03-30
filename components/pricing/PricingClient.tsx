"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Tier {
  name: string;
  price30Day: string;
  priceYearly: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
  icon: ReactNode;
  color: string;
}

const tiers: Tier[] = [
  {
    name: "Ücretsiz",
    price30Day: "0",
    priceYearly: "0",
    description: "Uygulamayı tanı ve AI ile ilk tariflerini keşfet.",
    features: [
      "Günde 3 AI Tarif Üretimi",
      "Günde 1 günlük yemek tarif AI Öneri",
      "Temel Diyet & Alerji Filtresi",
      "Haftalık Manuel Planlama",
      "Günlük İlerleme Takibi (Kalori)",
      "Son 7 Günlük Geçmiş & Analiz",
      "Topluluk Keşfet Akışı",
      "Reklamlı Deneyim"
    ],
    buttonText: "Ücretsiz Başla",
    popular: false,
    icon: <Zap className="w-5 h-5 text-zinc-400" />,
    color: "zinc",
  },
  {
    name: "Pro",
    price30Day: "79.99",
    priceYearly: "799.90",
    description: "Günlük aktif kullanım için gereken her şey.",
    features: [
      "Günde 15 AI Tarif Üretimi",
      "Günde 5 günlük yemek tarif AI Öneri",
      "'Buzdolabında Ne Var' Modu",
      "Tam Diyet & Alerji Filtresi",
      "Haftalık 1 AI Otomatik Plan",
      "Akıllı Alışveriş Listesi",
      "Detaylı Makro Analizi",
      "Son 30 Günlük Geçmiş & Analiz",
      "Tamamen Reklamsız"
    ],
    buttonText: "Pro'ya Geç",
    popular: true,
    icon: <Sparkles className="w-5 h-5 text-orange-400" />,
    color: "orange",
  },
  {
    name: "Premium",
    price30Day: "149.99",
    priceYearly: "1499.90",
    description: "Ciddi beslenme ve fitness hedefleri için tam paket.",
    features: [
      "Sınırsız AI Tarif Üretimi",
      "Sınırsız AI Otomatik Planlama",
      "Sınırsız günlük yemek tarif AI Öneri",
      "Detaylı Makro & Beslendi Trendleri",
      "Sınırsız Geçmiş & Analiz Grafikleri",
      "Fotoğraflı Malzeme Tarama (Yakında)",
      "Öncelikli Müşteri Desteği",
      "Premium Rozeti & Öne Çıkarılma",
      "Tamamen Reklamsız"
    ],
    buttonText: "Premium Ol",
    popular: false,
    icon: <Crown className="w-5 h-5 text-yellow-500" />,
    color: "yellow",
  },
];

export default function PricingClient() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'30-day' | 'yearly'>('30-day');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

  const handleCheckout = async (tier: Tier) => {
    if (tier.name === "Ücretsiz") {
      router.push(user ? "/onboarding" : "/auth?mode=register");
      return;
    }

    if (!user) {
      toast.error("Ödeme yapabilmek için giriş yapmalısınız.");
      router.push("/auth?mode=register");
      return;
    }

    setLoadingTier(tier.name);
    try {
      const response = await fetch("/api/payments/paytr/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tier.name,
          period: billingCycle
        }),
      });

      const data = await response.json();

      if (data.token) {
        router.push(`/checkout?token=${data.token}`);
      } else {
        toast.error(data.error || "Ödeme başlatılamadı.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoadingTier(null);
    }
  };


  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <motion.div
          // ... rest of the component
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Fiyatlandırma
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-400">
            Sana Uygun Planı <br /> <span className="text-orange-500">Seç</span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            CheFood AI ile beslenme düzenini yapay zeka ile profesyonel bir seviyeye taşı.
            İhtiyacın olan tüm araçlar burada.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-10">
            <div className="relative p-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex">
              <button
                onClick={() => setBillingCycle('30-day')}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${billingCycle === '30-day' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {billingCycle === '30-day' && (
                  <motion.div
                    layoutId="activeCycle"
                    className="absolute inset-0 bg-zinc-800 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">30 Günlük</span>
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {billingCycle === 'yearly' && (
                  <motion.div
                    layoutId="activeCycle"
                    className="absolute inset-0 bg-zinc-800 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  Yıllık
                  <Badge className="bg-orange-500/20 text-orange-400 border-none text-[10px] px-1.5 py-0">
                    %17 İndirim
                  </Badge>
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-10">
        {tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="h-full"
          >
            <Card
              className={`relative h-full flex flex-col border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${tier.popular ? 'ring-2 ring-orange-500 shadow-[0_0_30px_rgba(255,107,44,0.15)]' : ''
                }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-orange-500 text-white font-bold border-none px-3 py-1">
                    En Popüler
                  </Badge>
                </div>
              )}

              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-orange-500/10 border border-orange-500/20`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-white">{tier.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-black text-white">
                    {billingCycle === '30-day' ? tier.price30Day : tier.priceYearly}₺
                  </span>
                  <span className="text-zinc-500 font-medium font-sans">
                    /{billingCycle === '30-day' ? '30 gün' : 'yıl'}
                  </span>
                </div>
                <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="p-8 pt-6 grow">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 group">
                      <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 pt-0 mt-auto">
                <Button
                  onClick={() => handleCheckout(tier)}
                  disabled={loadingTier === tier.name}
                  className={`w-full h-14 rounded-2xl font-black text-base transition-all duration-300 ${tier.popular
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:scale-[1.02]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                >
                  {loadingTier === tier.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {tier.buttonText}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-zinc-500 text-sm font-medium">
          Ödemeleriniz <span className="text-zinc-300 italic">PayTR</span> tarafından güvenle işlenir.
          Bu bir <span className="text-orange-400">tek seferlik</span> pakettir, otomatik yenileme yapılmaz.
        </p>
      </div>
    </div>
  );
}
