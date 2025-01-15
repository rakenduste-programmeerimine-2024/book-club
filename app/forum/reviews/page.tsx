"use client";

import { useState } from "react";

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  user_name: string;
  created_at: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    title: "Fantastic Read",
    content:
      "I absolutely loved this book! It kept me hooked from start to finish.",
    rating: 5,
    user_name: "John Doe",
    created_at: "2025-01-01",
  },
  {
    id: "2",
    title: "Not My Cup of Tea",
    content: "The writing style wasn't to my taste, but the plot was decent.",
    rating: 3,
    user_name: "Jane Smith",
    created_at: "2025-01-10",
  },
  {
    id: "3",
    title: "A Masterpiece",
    content:
      "This is one of the best books I've read in years. Highly recommended!",
    rating: 5,
    user_name: "Alex Johnson",
    created_at: "2025-01-12",
  },
];

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews);

  return (
    <div className="p-8 max-w-4xl mx-auto text-coffee-900">
      <h1 className="text-3xl font-bold mb-6">Book Reviews</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-coffee-100 p-6 rounded-md shadow-md hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{review.title}</h2>
            <p className="text-coffee-700 mt-2">
              ⭐ {review.rating} / 5 by {review.user_name}
            </p>
            <p className="text-coffee-600 mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
            <p className="text-coffee-800 mt-4">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
