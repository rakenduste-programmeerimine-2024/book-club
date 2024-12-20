"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Rating({ bookId }: { bookId: string }) {
  const supabase = createClient();
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data?.user) return;

        const { data, error } = await supabase
          .from("ratings")
          .select("rating, comment")
          .eq("book_id", bookId)
          .eq("user_id", user.data.user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user rating:", error.message);
        } else if (data) {
          setCurrentRating(data.rating);
          setComment(data.comment || "");
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [bookId, supabase]);

  const handleSubmit = async () => {
    if (!currentRating) {
      alert("Please provide a rating before submitting.");
      return;
    }

    setLoading(true);
    try {
      const user = await supabase.auth.getUser();

      if (!user.data?.user) {
        alert("You must be logged in to rate and review this book.");
        return;
      }

      const { error } = await supabase
        .from("ratings")
        .upsert(
          {
            user_id: user.data.user.id,
            book_id: bookId,
            rating: currentRating,
            comment: comment.trim() || null,
          },
          { onConflict: "user_id,book_id" }
        );

      if (error) {
        console.error("Error saving rating and comment:", error.message);
        alert("An error occurred while saving your review.");
        return;
      }

      alert("Your review has been saved!");
    } catch (error) {
      console.error("Error submitting rating and comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f6f1] p-6 rounded-lg shadow-lg border border-[#b4a68f] mt-4">
      <p className="text-lg font-semibold mb-4 text-[#3b3b3b] text-center">
        Rate and Review this Book
      </p>

      {/* Star Rating */}
      <div className="flex justify-center items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-4xl transition-all duration-200 ${
              currentRating && star <= currentRating
                ? "text-yellow-500"
                : "text-gray-300"
            } hover:text-yellow-400`}
            onClick={() => setCurrentRating(star)}
            disabled={loading}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment Section */}
      <textarea
        className="w-full p-3 border rounded-md text-sm text-gray-700 bg-[#f2ebe3] focus:ring focus:ring-[#b4a68f] resize-none"
        rows={4}
        placeholder="Write your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
      ></textarea>

      {/* Submit Button */}
      <button
        className={`w-full mt-4 py-2 rounded-md text-white font-semibold ${
          loading ? "bg-[#b4a68f] cursor-not-allowed" : "bg-[#887d69] hover:bg-[#6f5e48]"
        }`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}