"use client";
import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { SlideInOutForm, AnimatePresence } from '@/components/motion';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/schema/login-scheme";
import { registerSchema } from "@/schema/register-scheme";

export const AuthForm = ({
    isLogin,
}: {
    isLogin: boolean;
}) => {
    const {
        SignInGoogleMutation,
        isPending: isGooglePending,
        SignInEmailMutation,
        isSignInEmailPending,
        SignUpMutation,
        isSignUpPending
    } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const formSchema = isLogin ? loginSchema : registerSchema;

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const isLoading = isSignInEmailPending || isSignUpPending || isGooglePending;

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        if (isLogin) {
            SignInEmailMutation({ email: values.email, password: values.password });
        } else {
            SignUpMutation({
                email: values.email,
                password: values.password,
                name: values.name || ""
            });
        }
    };

    return (
        <Form {...form}>
            <AnimatePresence mode="wait">
                <SlideInOutForm
                    stateKey={isLogin ? 'login' : 'register'}
                    slideDirection={isLogin ? "left" : "right"}
                    distance={20}
                    duration={0.3}
                    className="space-y-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {!isLogin && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 ml-1">Ad Soyad</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                                            <Input
                                                placeholder="Ad Soyad"
                                                {...field}
                                                className="w-full pl-12 pr-4 h-12 bg-black/50 border-orange-500/30 rounded-xl text-white text-base placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 ml-1" />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300 ml-1">E-posta</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                                        <Input
                                            type="email"
                                            placeholder="E-posta"
                                            {...field}
                                            className="w-full pl-12 pr-4 h-12 bg-black/50 border-orange-500/30 rounded-xl text-white text-base placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400 ml-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300 ml-1">Şifre</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Şifre"
                                            {...field}
                                            className="w-full pl-12 pr-12 h-12 bg-black/50 border-orange-500/30 rounded-xl text-white text-base placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400 ml-1" />
                            </FormItem>
                        )}
                    />

                    {isLogin && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
                            >
                                Şifremi Unuttum?
                            </button>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </Button>

                    {/* Social Login */}
                    <div className="relative pt-2">
                        <div className="absolute inset-0 flex items-center pt-2">
                            <div className="w-full border-t border-orange-500/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-zinc-900 text-gray-400">veya</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => SignInGoogleMutation()}
                            className="w-full h-12 bg-black/50 border-orange-500/30 rounded-xl text-white hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-base"
                        >
                            <Mail className="w-5 h-5" /> Google ile Devam Et
                        </Button>
                    </div>
                </SlideInOutForm>
            </AnimatePresence>
        </Form>
    );
};
