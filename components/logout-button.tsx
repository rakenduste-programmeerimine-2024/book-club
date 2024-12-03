"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const LogoutButton = () => {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/"); // Redirect to the main page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;