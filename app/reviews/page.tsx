"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface Review {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    image_url: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: regularReviews } = await supabase
        .from("ratings")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          books:book_id (
            id,
            title,
            author,
            image_url
          )
        `
        )
        .eq("user_id", user.id);

      const { data: googleReviews } = await supabase
        .from("ratings_google_books")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          google_books:book_id (
            id,
            title,
            author,
            image_url
          )
        `
        )
        .eq("user_id", user.id);

      const transformedRegular = (regularReviews || []).map((item: any) => ({
        ...item,
        book: item.books,
      }));

      const transformedGoogle = (googleReviews || []).map((item: any) => ({
        ...item,
        book: item.google_books,
      }));

      const allReviews = [...transformedRegular, ...transformedGoogle].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setReviews(allReviews);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            You haven't written any reviews yet.
          </p>
          <Link
            href="/books"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go add a review to your books!
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-lg shadow-md p-6 flex gap-6"
            >
              <div className="w-32 flex-shrink-0">
                <img
                  src={review.book.image_url || "/placeholder.png"}
                  alt={review.book.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>

              <div className="flex-1">
                <Link href={`/books/${review.book.id}`}>
                  <h2 className="text-xl font-semibold hover:text-primary transition-colors">
                    {review.book.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground mb-2">
                  {review.book.author}
                </p>
                <div className="flex mb-3">{renderStars(review.rating)}</div>
                <p className="text-sm text-muted-foreground mb-2">
                  Reviewed on {new Date(review.created_at).toLocaleDateString()}
                </p>
                <p className="text-foreground">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
