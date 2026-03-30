"use client";

import { useState } from "react";
import { useProfiles } from "@/hooks/useProfiles";

import ProfileSidebar, { TABS } from "./ProfileSidebar";

import { BasicInfoTab } from "@/app/profile/components/basic-info-tab";
import { FoodPreferencesTab } from "@/app/profile/components/food-preferences-tab";
import { AccountSettingsTab } from "@/app/profile/components/account-settings-tab";
import { PrivacySettingsTab } from "@/app/profile/components/privacy-settings-tab";
import { PostsTab } from "@/app/profile/components/posts-tab";
import { StatisticsTab } from "@/app/profile/components/statistics-tab";

import LoadingScreen from '@/app/loading'

export default function ProfileClient() {
    const { myProfile } = useProfiles();
    const [activeTab, setActiveTab] = useState(TABS[0].id);

    const userProfile = myProfile;


    const renderContent = () => {
        const profile = userProfile as any;
        switch (activeTab) {
            case "basic-info": return <BasicInfoTab profile={profile} />;
            case "posts": return <PostsTab profile={profile} />;
            case "statistics": return <StatisticsTab profile={profile} />;
            case "food-prefs": return <FoodPreferencesTab profile={profile} />;
            case "account": return <AccountSettingsTab profile={profile} />;
            case "privacy": return <PrivacySettingsTab profile={profile} />;
            default: return <BasicInfoTab profile={profile} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-row font-sans">
            <ProfileSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <main className="flex-1 overflow-y-auto scrollbar-none">
                <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-full">
                    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                        <div className="mb-6 md:mb-10">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                                {TABS.find(t => t.id === activeTab)?.label}
                            </h2>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
