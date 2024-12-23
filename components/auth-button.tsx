"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
      setIsDropdownOpen(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleGoToProfile = () => {
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setIsDropdownOpen(false);
    }
  }, [user]);

  return user ? (
    <div className="flex items-center gap-4 relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
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