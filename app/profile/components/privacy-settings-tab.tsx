"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Lock, Navigation, Users, Sparkles, Loader2, Check } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PrivacyForm = {
    is_public: boolean;
    favorites_public: boolean;
    followers_public: boolean;
};

type Profile = {
    id: string;
    is_public?: boolean;
    favorites_public?: boolean;
    followers_public?: boolean;
};

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
                checked ? "bg-orange-500" : "bg-zinc-700"
            )}
        >
            <span className={cn("pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform", checked ? "translate-x-5" : "translate-x-0")} />
        </button>
    );
}

const ITEMS: Array<{
    field: keyof PrivacyForm;
    icon: React.ReactNode;
    title: string;
    desc: string;
    highlight?: boolean;
}> = [
        { field: "is_public", icon: <Lock className="w-5 h-5" />, title: "Profil Gizliliği", desc: "Profilinizi herkese açık yapın. Kapalıysa sadece takipçileriniz görebilir." },
        { field: "favorites_public", icon: <Navigation className="w-5 h-5 fill-current opacity-80" />, title: "Favorilerimi Göster", desc: "Kaydettiğiniz ve beğendiğiniz tarifler profilinizde listelensin." },
        { field: "followers_public", icon: <Users className="w-5 h-5" />, title: "Takipçileri Göster", desc: "Takipçi ve takip edilen listelerinizi diğer kullanıcılar görebilsin." },
    ];

export function PrivacySettingsTab({ profile }: { profile: Profile | null }) {
    const { updateProfile } = useProfiles();

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<PrivacyForm>({
        defaultValues: {
            is_public: profile?.is_public ?? true,
            favorites_public: profile?.favorites_public ?? false,
            followers_public: profile?.followers_public ?? true,
        },
    });



    const onSubmit = async (data: PrivacyForm) => {
        if (!profile?.id) return;
        try {
            await updateProfile.mutateAsync({ id: profile.id, ...data });
            toast.success("Gizlilik ayarları kaydedildi!");
        } catch {
            // Handled by hook
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
                <h3 className="text-base font-bold text-white">Gizlilik Ayarları</h3>
                <p className="text-sm text-zinc-400 mt-0.5">Profilinizdeki hangi bilgilerin diğer kullanıcılar tarafından görülebileceğini seçin.</p>
            </div>

            <div className="space-y-3">
                {ITEMS.map(({ field, icon, title, desc, highlight }) => (
                    <div
                        key={field}
                        className={cn(
                            "flex items-center justify-between p-5 rounded-2xl border gap-4 transition-colors",
                            highlight ? "border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10" : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn("p-2.5 rounded-xl shrink-0", highlight ? "bg-orange-500/20 text-orange-400" : "bg-zinc-800 text-zinc-300")}>
                                {icon}
                            </div>
                            <div>
                                <Label className="font-bold text-white cursor-pointer">{title}</Label>
                                <p className="text-sm text-zinc-400 mt-0.5">{desc}</p>
                            </div>
                        </div>
                        <Controller
                            name={field}
                            control={control}
                            render={({ field: f }) => <Switch checked={f.value} onChange={f.onChange} />}
                        />
                    </div>
                ))}
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-7 h-11 font-bold shadow-[0_4px_12px_rgba(255,107,44,0.3)]"
                >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</> : <><Check className="w-4 h-4" /> Gizlilik Ayarlarını Kaydet</>}
                </Button>
            </div>
        </form>
    );
}
