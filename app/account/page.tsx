import AccountForm from "./account-form";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>You need to be logged in to view this page.</p>; // Redirect if not logged in (optional)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <AccountForm user={user} />
    </div>
  );
}