"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Thread {
  id: string;
  title: string;
  author: string;
  replies_count: number;
  created_at: string;
}

export default function ForumPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("threads")
        .select("id, title, author, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching threads:", error.message);
        return;
      }

      setLoading(false);
    };

    fetchThreads();
  }, []);

  if (loading) return <p className="text-foreground">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Forum</h1>

      <div className="mb-4 flex justify-between">
        <Link href="/forum/new-thread">
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
            New Thread
          </button>
        </Link>
      </div>

      <div className="bg-muted p-4 rounded-md shadow-md">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/forum/thread/${thread.id}`}
            className="block bg-background p-4 mb-2 rounded-md shadow hover:bg-muted/70"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {thread.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Started by {thread.author} •{" "}
                  {new Date(thread.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {thread.replies_count} replies
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
