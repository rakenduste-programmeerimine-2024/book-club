"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";
import { useRouter } from "next/navigation";

export default function ProfileDetails({ user }: { user: User | null }) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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
    avatarUrl,
  }: {
    username: string | null;
    fullname: string | null;
    avatarUrl: string | null;
  }) => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id || "",
        full_name: fullname,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarUpload = (filePath: string) => {
    setAvatarUrl(filePath);
    updateProfile({ fullname, username, avatarUrl: filePath });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="p-8 rounded-md shadow-lg max-w-lg mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f]">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Your Profile
      </h1>

      {/* Avatar Component */}
      <div className="mb-6 flex justify-center">
        <Avatar
          uid={user?.id || ""}
          url={avatarUrl}
          size={150}
          onUpload={handleAvatarUpload}
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Email
          </label>
          <input
            type="text"
            value={user?.email || ""}
            disabled
            className="block w-full px-4 py-2 rounded-md bg-[#f2ebe3] text-black border border-[#c4b69e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Full Name
          </label>
          <input
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
            className="block w-full px-4 py-2 rounded-md bg-[#f2ebe3] text-black border border-[#c4b69e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Username
          </label>
          <input
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-2 rounded-md bg-[#f2ebe3] text-black border border-[#c4b69e]"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => updateProfile({ fullname, username, avatarUrl })}
            disabled={loading}
            className={`px-6 py-2 rounded-md shadow-md text-white ${
              loading ? "bg-[#b4a68f] cursor-not-allowed" : "bg-[#887d69]"
            }`}
          >
            {loading ? "Loading..." : "Update Profile"}
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-md shadow-md text-white bg-[#ff0000] hover:bg-[#950606]"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}