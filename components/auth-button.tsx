import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      {/* Profile Icon */}
      <Link
        href="/profile"
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
      >
        {user.email?.charAt(0).toUpperCase() || "U"}
      </Link>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/sign-in" className="px-4 py-2 bg-gray-800 text-white rounded-md">
        Sign In
      </Link>
      <Link href="/sign-up" className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Get Started
      </Link>
    </div>
  );
}