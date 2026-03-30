"use client";
import { useState, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BGPattern } from '@/components/ui/bg-pattern';
import { KeyRound, ArrowRight } from 'lucide-react';
import Loading from "@/app/loading";
import { useSearchParams } from 'next/navigation';
function CallbackForm() {

    const { VerifyOTPMutation, isVerifyOTPPending } = useAuth();
    const searchParams = useSearchParams();

    const [token, setToken] = useState('');
    const [email, setEmail] = useState(searchParams.get('email') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        VerifyOTPMutation({ email, token });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            <BGPattern />

            <div className="w-full max-w-2xl bg-zinc-950/80 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                        <KeyRound className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        E-posta Doğrulama
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu giriniz.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="E-posta Adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-4 pr-4 h-12 bg-black/50 border-orange-500/30 rounded-xl text-white text-center text-lg focus-visible:ring-orange-500 focus-visible:border-orange-500 tracking-widest"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Doğrulama Kodu"
                            inputMode="numeric"
                            autoFocus
                            pattern="[0-9]*"
                            value={token}
                            onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={8}
                            className="w-full pl-4 pr-4 h-14 bg-black/50 border-orange-500/30 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:tracking-normal placeholder:text-sm"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isVerifyOTPPending || token.length < 6 || !email}
                        className="w-full h-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                    >
                        {isVerifyOTPPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Doğrula
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<Loading />}>
            <CallbackForm />
        </Suspense>
    );
}
