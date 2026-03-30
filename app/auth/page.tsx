import { BGPattern } from '@/components/ui/bg-pattern';
import { BrandingSection } from '@/components/auth/branding-section';
import { AnimatedBackground } from '@/components/auth/animated-background';
import { AuthCard } from '@/components/auth/auth-card';

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
