"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const LogoutButton = () => {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
