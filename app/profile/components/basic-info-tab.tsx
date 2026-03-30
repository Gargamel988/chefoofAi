"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Loader2, Check } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type BasicInfoForm = {
    name: string;
    bio: string;
};

type Profile = {
    id: string;
    name?: string;
    bio?: string;
    avatar_url?: string;
};

export function BasicInfoTab({ profile }: { profile: Profile | null }) {
    const { updateProfile, uploadAvatar } = useProfiles();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile?.avatar_url);

    const {
        register,
        handleSubmit,
        watch,
        formState: { isSubmitting, errors },
    } = useForm<BasicInfoForm>({
        defaultValues: { name: profile?.name ?? "", bio: profile?.bio ?? "" },
    });

    const bio = watch("bio", "");

    /* ─── Avatar Upload ─── */
    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile?.id) return;

        // Only allow images up to 2 MB
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Dosya boyutu 2 MB'ı geçemez.");
            return;
        }

        try {
            const newUrl = await uploadAvatar.mutateAsync({ userId: profile.id, file });
            setAvatarUrl(newUrl);
            toast.success("Profil fotoğrafı güncellendi!");
        } catch (err: any) {
            toast.error("Profil fotoğrafı yüklenirken hata oluştu.");
            console.error(err);
        } finally {
            e.target.value = "";
        }
    };

    /* ─── Profile Info Save ─── */
    const onSubmit = async (data: BasicInfoForm) => {
        if (!profile?.id) return;
        try {
            await updateProfile.mutateAsync({ id: profile.id, ...data });
            toast.success("Profil bilgileri kaydedildi!");
        } catch {
            // Error is handled by hook
        }
    };

    const isUploadingAvatar = uploadAvatar.isPending;

    return (
        <div className="space-y-8">
            {/* Avatar Row */}
            <div className="flex items-center gap-5">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                />

                <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="relative group w-20 h-20 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 cursor-pointer shrink-0 shadow-lg disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-opacity"
                >
                    {/* Hover overlay or Loading overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center z-10",
                        isUploadingAvatar ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                        {isUploadingAvatar
                            ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                            : <Camera className="w-5 h-5 text-white" />}
                    </div>

                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="w-full h-full flex items-center justify-center text-2xl font-black text-zinc-500">
                            {(profile?.name ?? "U").charAt(0).toUpperCase()}
                        </span>
                    )}
                </button>

                <div>
                    <p className="font-semibold text-white">{profile?.name ?? "İsimsiz Şef"}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {isUploadingAvatar ? "Yükleniyor..." : "Fotoğrafı değiştirmek için tıklayın · PNG, JPG, WebP · Maks 2 MB"}
                    </p>
                </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Info Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300 font-semibold">Ad Soyad</Label>
                    <Input
                        id="name"
                        placeholder="Adınızı ve soyadınızı girin"
                        className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500 h-11 rounded-xl"
                        {...register("name", { required: "Ad Soyad zorunludur" })}
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="bio" className="text-zinc-300 font-semibold">Biyografi</Label>
                        <span className={`text-xs ${bio.length > 130 ? "text-orange-400" : "text-zinc-500"}`}>
                            {bio.length}/150
                        </span>
                    </div>
                    <textarea
                        id="bio"
                        maxLength={150}
                        placeholder="Kendinizden, yemek zevkinizden kısaca bahsedin."
                        className="flex min-h-[90px] w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 resize-none transition-all"
                        {...register("bio")}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-7 h-11 font-bold shadow-[0_4px_12px_rgba(255,107,44,0.3)]"
                    >
                        {isSubmitting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
                            : <><Check className="w-4 h-4" /> Kaydet</>}
                    </Button>
                </div>
            </form>
        </div>
    );
}
