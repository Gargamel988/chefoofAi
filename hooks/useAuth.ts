"use client";
import { useMutation } from "@tanstack/react-query";
import {
  SignInGoogle,
  SignUp,
  SignInEmail,
  VerifyOTP,
  SignOut,
} from "@/services/auth";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";
import { useRouter } from "next/navigation";

function useAuth() {
  const router = useRouter();
  const { mutate: SignInGoogleMutation, isPending } = useMutation({
    mutationFn: SignInGoogle,
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.success("Giriş işlemi başlatıldı");
      }
    },
    onError: (error) => {
      toast.error(translateSupabaseError(error.message));
    },
  });

  const { mutate: SignUpMutation, isPending: isSignUpPending } = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => SignUp(email, password, name),
    onSuccess: (_, variables) => {
      toast.success("Kayıt başarılı! E-postanızı kontrol edin.");
      router.push(
        `/auth/callback?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error) => {
      toast.error(translateSupabaseError(error.message));
    },
  });

  const { mutate: SignInEmailMutation, isPending: isSignInEmailPending } =
    useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) =>
        SignInEmail(email, password),
      onSuccess: () => {
        toast.success("Giriş başarılı!");
      },
      onError: (error) => {
        toast.error(translateSupabaseError(error.message));
      },
    });

  const { mutate: VerifyOTPMutation, isPending: isVerifyOTPPending } =
    useMutation({
      mutationFn: ({ email, token }: { email: string; token: string }) =>
        VerifyOTP(email, token),
      onSuccess: () => {
        toast.success("E-posta doğrulandı!");
        router.push("/onboarding");
      },
      onError: (error) => {
        toast.error(translateSupabaseError(error.message));
      },
    });

  const { mutate: SignOutMutation, isPending: isSignOutPending } = useMutation({
    mutationFn: SignOut,
    onSuccess: () => {
      toast.success("Çıkış yapıldı!");
    },
    onError: (error) => {
      toast.error(translateSupabaseError(error.message));
    },
  });

  return {
    SignInGoogleMutation,
    isPending,
    SignUpMutation,
    isSignUpPending,
    SignInEmailMutation,
    isSignInEmailPending,
    VerifyOTPMutation,
    isVerifyOTPPending,
    SignOutMutation,
    isSignOutPending,
  };
}

export { useAuth };
