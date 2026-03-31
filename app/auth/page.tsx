import { Metadata } from 'next';
import { BGPattern } from '@/components/ui/bg-pattern';
import { BrandingSection } from '@/components/auth/branding-section';
import { AnimatedBackground } from '@/components/auth/animated-background';
import { AuthCard } from '@/components/auth/auth-card';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ mode?: string }> }): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const isLogin = resolvedParams?.mode !== 'register';

    const title = isLogin ? "Giriş Yap | CheFood AI" : "Hesap Oluştur | CheFood AI";
    const description = isLogin
        ? "CheFood AI hesabınıza giriş yapın. Yapay zeka asistanımızla elinizdeki malzemelerden harika tarifler oluşturun."
        : "CheFood AI'ya hemen kayıt olun. Mutfakta yapay zeka devrimine katılın ve size özel tarifleri keşfedin.";

    return {
        title,
        description,
        alternates: {
            canonical: "/auth",
        },
        openGraph: {
            title,
            description,
            url: "https://chefoodai.com/auth",
            siteName: "CheFood AI",
            images: [
                {
                    url: "https://chefoodai.com/fotochef.webp",
                    width: 1200,
                    height: 630,
                    alt: isLogin ? "CheFood AI Giriş Paneli" : "CheFood AI Kayıt Paneli",
                },
            ],
            locale: "tr_TR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://chefoodai.com/fotochef.webp"],
            creator: "@omerAIdev",
        },
    };
}

// Main Auth Component (Server Component)
const AuthPage = async ({ searchParams }: { searchParams: Promise<{ mode?: string }> }) => {
    // Next.js 15+ searchParams Promise should be awaited in Server Components
    const resolvedParams = await searchParams;
    const mode = resolvedParams?.mode;
    const isLogin = mode !== 'register';

    return (
        <div
            className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center p-4"
        >
            {/* Background Pattern */}
            <BGPattern
                variant="dots"
                mask="fade-edges"
                size={20}
                fill="rgba(255, 140, 0, 0.15)"
                className="opacity-50"
            />

            {/* Mouse Tracking Animated Background */}
            <AnimatedBackground />

            {/* Main Container */}
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left Side - Branding */}
                <BrandingSection />

                {/* Right Side - Auth Form Card */}
                <AuthCard isLogin={isLogin} />
            </div>
        </div>
    );
};

export default AuthPage;
