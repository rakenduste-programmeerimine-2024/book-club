"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaStar } from "react-icons/fa";

interface AddToFavoritesButtonProps {
  bookId: string;
}

export default function AddToFavoritesButton({ bookId }: AddToFavoritesButtonProps) {
  const supabase = createClientComponentClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("is_favorite")
        .eq("id", bookId)
        .single();

      if (error) {
        console.error("Error fetching favorite status:", error);
      } else if (data) {
        setIsFavorite(data.is_favorite);
      }
    };

    fetchFavoriteStatus();
  }, [bookId]);

  async function handleToggleFavorite() {
    setLoading(true);

    console.log("Current favorite status:", isFavorite);
    
    const { data, error } = await supabase
      .from("books")
      .update({ is_favorite: !isFavorite })
      .eq("id", bookId)
      .select();

    if (error) {
      console.error("Error updating favorite status:", error);
      alert("Failed to update favorite status. Please try again.");
    } else {
      console.log("Updated book data:", data); 
      setIsFavorite((prev) => !prev);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        isFavorite ? "text-yellow-500" : "text-gray-700"
      } hover:text-yellow-600`}
      disabled={loading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <span>{isFavorite ? "Added to Favorites" : "Add to Favorites"}</span>
      <FaStar className={`text-2xl ${isFavorite ? "text-yellow-500" : "text-gray-400"}`} />
    </button>
  );
}