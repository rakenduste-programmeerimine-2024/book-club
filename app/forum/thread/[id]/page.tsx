"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Thread {
  id: string;
  title: string;
  author: string;
  content: string;
  created_at: string;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

export default function ThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThread = async () => {
      const supabase = createClient();

      const { data: threadData, error: threadError } = await supabase
        .from("threads")
        .select("id, title, author, content, created_at")
        .eq("id", id)
        .single();

      if (threadError) {
        console.error("Error fetching thread:", threadError.message);
        return;
      }

      setThread(threadData);

      const { data: repliesData, error: repliesError } = await supabase
        .from("replies")
        .select("id, author, content, created_at")
        .eq("thread_id", id)
        .order("created_at", { ascending: true });

      if (repliesError) {
        console.error("Error fetching replies:", repliesError.message);
      } else {
        setReplies(repliesData || []);
      }

      setLoading(false);
    };

    fetchThread();
  }, [id]);

  const postReply = async () => {
    if (!newReply.trim()) return;

    const supabase = createClient();

    const { data, error } = await supabase
      .from("replies")
      .insert([{ thread_id: id, author: "Anonymous", content: newReply }])
      .select()
      .single();

    if (error) {
      console.error("Error posting reply:", error.message);
      return;
    }

    setReplies([...replies, data]);
    setNewReply("");
  };

  if (loading) return <p className="text-foreground">Loading...</p>;
  if (!thread) return <p className="text-foreground">Thread not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        {thread.title}
      </h1>
      <p className="text-muted-foreground">
        Posted by {thread.author} •{" "}
        {new Date(thread.created_at).toLocaleString()}
      </p>
      <div className="bg-background p-4 rounded-md shadow-md my-4">
        {thread.content}
      </div>

      <h2 className="text-xl font-semibold mt-6 text-foreground">Replies</h2>
      <div className="mt-4">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-muted p-4 rounded-md shadow-md mb-2"
            >
              <p className="text-sm text-muted-foreground">
                By {reply.author} •{" "}
                {new Date(reply.created_at).toLocaleString()}
              </p>
              <p className="mt-2">{reply.content}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No replies yet.</p>
        )}
      </div>

      <div className="mt-6">
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Write your reply..."
          className="w-full p-3 border rounded-md bg-muted"
        />
        <button
          onClick={postReply}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Post Reply
        </button>
      </div>
    </div>
  );
}
