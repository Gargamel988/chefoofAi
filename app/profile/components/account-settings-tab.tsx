"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProfiles } from "@/hooks/useProfiles";

type EmailForm = { email: string };
type PasswordForm = { currentPassword: string; newPassword: string };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Profile = {};

export function AccountSettingsTab({ profile: _ }: { profile: Profile | null }) {
    const { updateEmail, updatePassword } = useProfiles();

    // --- Email ---
    const emailForm = useForm<EmailForm>({ defaultValues: { email: "" } });

    const onEmailChange = async (data: EmailForm) => {
        try {
            await updateEmail.mutateAsync(data.email);
        } catch {
            // Handled by hook
        }
    };

    // --- Password ---
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const pwForm = useForm<PasswordForm>({ defaultValues: { currentPassword: "", newPassword: "" } });

    const onPasswordChange = async (data: PasswordForm) => {
        try {
            await updatePassword.mutateAsync(data.newPassword);
            pwForm.reset();
        } catch {
            // Handled by hook
        }
    };

    const inputCls = "bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500 h-11 rounded-xl";

    return (
        <div className="space-y-10">
            {/* Email */}
            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-bold text-white">E-posta Adresi Değiştir</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">Yeni e-posta adresinize bir doğrulama bağlantısı gönderilecektir.</p>
                </div>
                <form onSubmit={emailForm.handleSubmit(onEmailChange)} className="flex gap-3 flex-wrap items-end">
                    <div className="space-y-1.5 flex-1 min-w-[220px]">
                        <Label className="text-zinc-300 font-semibold">Yeni E-posta</Label>
                        <Input type="email" placeholder="yeni@email.com" className={inputCls} {...emailForm.register("email", { required: true })} />
                    </div>
                    <Button
                        type="submit"
                        disabled={emailForm.formState.isSubmitting}
                        variant="outline"
                        className="h-11 rounded-xl border-zinc-700 text-white hover:bg-zinc-800"
                    >
                        {emailForm.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bağlantı Gönder"}
                    </Button>
                </form>
            </section>

            <Separator className="bg-zinc-800" />

            {/* Password */}
            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-bold text-white">Şifre Değiştir</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">Hesap güvenliğiniz için güçlü bir şifre kullanın.</p>
                </div>
                <form onSubmit={pwForm.handleSubmit(onPasswordChange)} className="space-y-4 max-w-sm">
                    {/* Current */}
                    <div className="space-y-1.5">
                        <Label className="text-zinc-300 font-semibold">Mevcut Şifre</Label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? "text" : "password"}
                                className={`${inputCls} pr-11`}
                                {...pwForm.register("currentPassword", { required: true })}
                            />
                            <button type="button" onClick={() => setShowCurrent(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    {/* New */}
                    <div className="space-y-1.5">
                        <Label className="text-zinc-300 font-semibold">Yeni Şifre</Label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                className={`${inputCls} pr-11`}
                                {...pwForm.register("newPassword", { required: true, minLength: { value: 8, message: "En az 8 karakter" } })}
                            />
                            <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {pwForm.formState.errors.newPassword && <p className="text-xs text-red-400">{pwForm.formState.errors.newPassword.message}</p>}
                    </div>
                    <Button type="submit" disabled={pwForm.formState.isSubmitting} variant="outline" className="w-full h-11 rounded-xl border-zinc-700 text-white hover:bg-zinc-800">
                        {pwForm.formState.isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Güncelleniyor...</> : "Şifreyi Güncelle"}
                    </Button>
                </form>
            </section>

        </div>
    );
}
