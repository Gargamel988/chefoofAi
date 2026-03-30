import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Publisher from "@/components/publish/Publisher";

export default async function NewPublishPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <Publisher
      userId={user.id}
      user={profile}
      mode="create"
    />
  );
}
