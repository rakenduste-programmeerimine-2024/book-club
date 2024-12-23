"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Reviews({ bookId }: { bookId: string }) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<{ rating: number; comment: string; user_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("ratings")
          .select("rating, comment, user_id")
          .eq("book_id", bookId);

        if (error) {
          console.error("Error fetching reviews:", error.message);
        } else {
          setReviews(data || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId, supabase]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Book reviews</h1>

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to leave a review!</p>
      ) : (
        <div>
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#f8f6f1] p-4 rounded-lg shadow-lg mb-4 border border-[#b4a68f]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">User {review.user_id}</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl ${
                      index < review.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700">{review.comment || "No comment provided."}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}