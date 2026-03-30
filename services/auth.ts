"use server";
import { createClient } from "@/lib/supabase/server";

export const SignInGoogle = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    return { error: error.message };
  }
  return { url: data.url };
};

export const SignUp = async (email: string, password: string, name: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
      },
    },
  });

  return { error };
};

export const SignInEmail = async (email: string, password: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
};

export const VerifyOTP = async (email: string, token: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  return { error };
};

export const SignOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};
