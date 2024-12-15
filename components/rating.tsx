"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Rating({ bookId }: { bookId: string }) {
  const supabase = createClient();
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data?.user) return;

        const { data, error } = await supabase
          .from("ratings")
          .select("rating")
          .eq("book_id", bookId)
          .eq("user_id", user.data.user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user rating:", error.message);
        } else if (data) {
          setCurrentRating(data.rating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [bookId, supabase]);

  const handleRatingChange = async (newRating: number) => {
    setLoading(true);
    try {
      const user = await supabase.auth.getUser();

      if (!user.data?.user) {
        alert("You must be logged in to rate a book.");
        return;
      }

      const { error } = await supabase
        .from("ratings")
        .upsert(
          {
            user_id: user.data.user.id,
            book_id: bookId,
            rating: newRating,
          },
          { onConflict: "user_id,book_id" } // Fixed here
        );

      if (error) {
        console.error("Error saving rating:", error.message);
        alert("An error occurred while saving your rating.");
        return;
      }

      setCurrentRating(newRating);
    } catch (error) {
      console.error("Error handling rating change:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`w-8 h-8 text-xl ${
            currentRating && star <= currentRating ? "text-yellow-500" : "text-gray-400"
          }`}
          onClick={() => handleRatingChange(star)}
          disabled={loading}
        >
          ★
        </button>
      ))}
    </div>
  );
}