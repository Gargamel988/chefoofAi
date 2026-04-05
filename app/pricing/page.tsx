import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PricingClient from "@/components/pricing/PricingClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Fiyatlandırma | CheFood AI",
    description: "CheFood AI Pro ve Premium planları ile beslenme düzeninizi yapay zeka ile profesyonel bir seviyeye taşıyın. Size özel haftalık planlar ve sınırsız tarif üretimi.",
    path: "/pricing",
    keywords: [
        "chefood ai fiyatlandırma",
        "yapay zeka yemek tarifleri abonelik",
        "haftalık yemek planlayıcı",
        "sınırsız tarif üretimi",
        " premium yemek tarifleri",
        "ai diyet asistanı fiyatları",
        "chefood pro avantajları",
        "yemek planlama ücretleri",
        "ai şef üyeliği",
    ],
});

const tiers = [
    { name: "Ücretsiz", price: "0" },
    { name: "Pro", price: "79.99" },
    { name: "Premium", price: "149.99" },
];

export default function PricingPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "CheFood AI Abonelik Planları",
        "description": "Yapay zeka destekli kişiselleştirilmiş yemek planlama ve tarif üretme paketleri.",
        "offers": tiers.map(tier => ({
            "@type": "Offer",
            "name": tier.name,
            "price": tier.price,
            "priceCurrency": "TRY",
            "availability": "https://schema.org/InStock"
        }))
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30">
            <JsonLd data={structuredData} />

            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[30%] h-[50%] bg-orange-600/5 rounded-full blur-[100px]" />
            </div>

            <PricingClient />
        </main>
    );
}
