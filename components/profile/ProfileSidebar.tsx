"use client";

import { cn } from "@/lib/utils";
import { User, Utensils, Settings, Shield, LogOut, ChevronRight, LayoutGrid, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const TABS = [
    { id: "basic-info",  label: "Temel Profil Bilgileri", icon: User },
    { id: "posts",       label: "Paylaşımlarım",          icon: LayoutGrid },
    { id: "statistics",  label: "İstatistikler",          icon: BarChart3 },
    { id: "food-prefs",  label: "Yemek Tercihleri",       icon: Utensils },
    { id: "account",     label: "Hesap Ayarları",         icon: Settings },
    { id: "privacy",     label: "Gizlilik Ayarları",      icon: Shield },
];

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
    const { SignOutMutation, isSignOutPending } = useAuth();

    return (
        <aside className="hidden md:flex w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/30 flex-col h-screen sticky top-0">
            {/* Desktop heading */}
            <div className="p-8 border-b border-zinc-800/50">
                <h1 className="text-2xl font-black text-white tracking-tight">Ayarlar</h1>
                <p className="text-sm text-zinc-400 mt-2">Hesabınızı ve tercihlerinizi yönetin.</p>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 border border-transparent",
                                isActive
                                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_4px_12px_rgba(255,107,44,0.05)]"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                            )}
                        >
                            <div className="flex items-center gap-3.5">
                                <Icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-zinc-500")} />
                                {tab.label}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                        </button>
                    );
                })}
            </nav>

            {/* Sign out */}
            <div className="p-4 border-t border-zinc-800/50">
                <button
                    onClick={() => SignOutMutation()}
                    disabled={isSignOutPending}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    {isSignOutPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
                </button>
            </div>
        </aside>
    );
}
