"use client";

import { useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, Calendar, Check } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { toast } from "sonner";

function Switch({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${checked ? 'bg-orange-500' : 'bg-zinc-800'}`}
        >
            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}

export function NotificationSettingsTab({ profile }: { profile: any }) {
    const { updateProfile } = useProfiles();
    const [notifyLikes, setNotifyLikes] = useState(profile?.notify_likes ?? true);
    const [notifyComments, setNotifyComments] = useState(profile?.notify_comments ?? true);
    const [notifyFollows, setNotifyFollows] = useState(profile?.notify_follows ?? true);
    const [notifySaves, setNotifySaves] = useState(profile?.notify_saves ?? true);
    const [emailWeekly, setEmailWeekly] = useState(profile?.notify_weekly_email ?? true);
    const [emailAiRecommends, setEmailAiRecommends] = useState(profile?.notify_ai_recs ?? true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile.mutateAsync({
                id: profile?.id,
                notify_likes: notifyLikes,
                notify_comments: notifyComments,
                notify_follows: notifyFollows,
                notify_saves: notifySaves,
                notify_weekly_email: emailWeekly,
                notify_ai_recs: emailAiRecommends,
            });
            toast.success("Bildirim ayarları kaydedildi!");
        } catch {
            toast.error("Kaydedilemedi, tekrar deneyin.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* In-App Notifications */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-500" /> Uygulama İçi Bildirimler
                    </h3>
                    <p className="text-sm font-medium text-zinc-400">Size ne zaman bildirim göndereceğimizi seçin.</p>
                </div>

                <div className="space-y-4">
                    {[
                        { icon: <Heart className="w-5 h-5" />, title: "Beğeniler", desc: "Biri tarifinizi beğendiğinde bildirim alın.", checked: notifyLikes, onChange: setNotifyLikes },
                        { icon: <MessageCircle className="w-5 h-5" />, title: "Yorumlar", desc: "Tariflerinize yorum yapıldığında veya etiketlendiğinizde bildirim alın.", checked: notifyComments, onChange: setNotifyComments },
                        { icon: <UserPlus className="w-5 h-5" />, title: "Yeni Takipçiler", desc: "Biri sizi takip etmeye başladığında bildirim alın.", checked: notifyFollows, onChange: setNotifyFollows },
                    ].map(item => (
                        <div key={item.title} className="flex items-center justify-between p-5 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors shadow-sm gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-2xl bg-zinc-800 text-zinc-300 shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold text-white mb-0.5">{item.title}</h4>
                                    <p className="text-sm font-medium text-zinc-400">{item.desc}</p>
                                </div>
                            </div>
                            <Switch checked={item.checked} onChange={item.onChange} />
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-zinc-800/80 w-full" />

            {/* Email Notifications */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1 tracking-tight">E-posta Bildirimleri</h3>
                    <p className="text-sm font-medium text-zinc-400">Hangi konularda e-posta almak istediğinizi seçin.</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors shadow-sm gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-2xl bg-zinc-800 text-zinc-300 shrink-0"><Calendar className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-white mb-0.5">Haftalık Özet</h4>
                                <p className="text-sm font-medium text-zinc-400">Haftalık beslenme özetiniz ve popüler tarifler.</p>
                            </div>
                        </div>
                        <Switch checked={emailWeekly} onChange={setEmailWeekly} />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-3xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors shadow-sm gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-400 shrink-0"><Sparkles className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-white mb-0.5">AI Tavsiyeleri</h4>
                                <p className="text-sm font-medium text-zinc-400">Yapay zekanın size özel hazırladığı yeni tarif önerileri.</p>
                            </div>
                        </div>
                        <Switch checked={emailAiRecommends} onChange={setEmailAiRecommends} />
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 shadow-[0_4px_12px_rgba(255,107,44,0.3)]"
                >
                    {isSaving ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Kaydediliyor...</>
                    ) : (
                        <><Check className="w-4 h-4" />Bildirim Ayarlarını Kaydet</>
                    )}
                </button>
            </div>
        </div>
    );
}
