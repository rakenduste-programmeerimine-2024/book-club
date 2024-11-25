import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Protected Page</h1>
      <p className="text-sm text-gray-600 mb-4">
        This page is only accessible to authenticated users.
      </p>
      <LogoutButton />
    </div>
  );
}