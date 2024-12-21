import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      {/* Profile Icon */}
      <Link href="/profile" className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
        {user.email?.charAt(0).toUpperCase() || "U"}
      </Link>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}