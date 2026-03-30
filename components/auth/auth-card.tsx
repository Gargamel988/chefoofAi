"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AuthForm } from "./auth-form";

export const AuthCard = ({ isLogin }: { isLogin: boolean }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full relative z-10"
        >
            <div className="relative">
                {/* Card Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-orange-600 to-orange-400 rounded-3xl blur-xl opacity-30"></div>

                {/* Main Card */}
                <div className="relative bg-linear-to-br from-zinc-900 to-black border border-orange-500/20 rounded-3xl p-8 backdrop-blur-xl">
                    {/* Toggle Buttons */}
                    <div className="flex gap-2 mb-8 p-1 bg-black/50 rounded-2xl border border-orange-500/20">
                        <Link
                            href="/auth?mode=login"
                            className={cn(
                                "flex-1 py-3 text-center rounded-xl font-semibold transition-all duration-300",
                                isLogin
                                    ? "bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/50"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            Giriş Yap
                        </Link>
                        <Link
                            href="/auth?mode=register"
                            className={cn(
                                "flex-1 py-3 text-center rounded-xl font-semibold transition-all duration-300",
                                !isLogin
                                    ? "bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/50"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            Kayıt Ol
                        </Link>
                    </div>

                    {/* Form */}
                    <AuthForm isLogin={isLogin} />

                    {/* Footer Text */}
                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
                        <Link
                            href={isLogin ? "/auth?mode=register" : "/auth?mode=login"}
                            className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
                        >
                            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
