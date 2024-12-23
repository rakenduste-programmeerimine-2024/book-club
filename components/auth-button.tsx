"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });


    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return user ? (
    <div className="flex items-center gap-4">
      {/* Profile Icon */}
      <Link
        href="/profile"
        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold"
      >
        {user.email?.charAt(0).toUpperCase() || "U"}
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-40 bg-white shadow-md rounded-md w-48 p-2"
        >
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleGoToProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Go to Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/sign-in"
        className="px-4 py-2 text-sm font-medium text-black hover:underline"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800"
      >
        Get started
      </Link>
    </div>
  );
}