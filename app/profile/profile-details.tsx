"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function ProfileDetails({ user }: { user: User | null }) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select("full_name, username")
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.error(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const updateProfile = async ({
    username,
    fullname,
  }: {
    username: string | null;
    fullname: string | null;
  }) => {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/"); // Redirect to the main page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      className="p-8 rounded-md shadow-lg max-w-lg mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f]"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Your Profile
      </h1>
      <p className="mb-8 text-center text-black">
        Update your profile information below.
      </p>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-black"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            value={user?.email}
            disabled
            className="block w-full px-4 py-2 rounded-md bg-[#f2ebe3] text-black border border-[#c4b69e]"
          />
        </div>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium mb-2 text-black"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
            className="block w-full px-4 py-2 rounded-md bg-[#f2ebe3] text-black border border-[#c4b69e]"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-2 text-black"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-2 rounded-md bg-[#f2ebe3] text-black border border-[#c4b69e]"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => updateProfile({ fullname, username })}
            disabled={loading}
            className={`px-6 py-2 rounded-md shadow-md text-white ${
              loading ? "bg-[#b4a68f] cursor-not-allowed" : "bg-[#887d69]"
            }`}
          >
            {loading ? "Loading..." : "Update Profile"}
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-md shadow-md text-white bg-[#aa9b82] hover:bg-[#887d69]"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}