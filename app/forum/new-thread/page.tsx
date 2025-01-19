"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NewThreadPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createThread = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Title and content cannot be empty.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("threads")
        .insert([{ title, content, author: "Anonymous" }])
        .select()
        .single();

      if (error) throw error;

      router.push(`/forum/thread/${data.id}`);
    } catch (error: any) {
      console.error("Error creating thread:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        Create New Thread
      </h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <input
        type="text"
        placeholder="Thread Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md mb-3 bg-muted"
      />
      <textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-md mb-3 bg-muted"
      />
      <button
        onClick={createThread}
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Posting..." : "Create Thread"}
      </button>
    </div>
  );
}
