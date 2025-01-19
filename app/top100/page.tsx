"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Book {
  id: string;
  title: string;
  author: string;
  averageRating: number;
  image_url: string | null;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState({
    title: "",
    minRating: 0,
    sort: "desc",
  });
  const [error, setError] = useState<string | null>(null);

  const fetchSupabaseBooks = async (): Promise<Book[]> => {
    const supabase = await createClient();
    try {
      // Fetch books without embedding ratings directly
      const { data: booksData, error: booksError } = await supabase
        .from("google_books")
        .select("id, title, author, image_url");

      if (booksError) {
        console.error("Error fetching books:", booksError.message);
        setError("Error loading books from Supabase");
        return [];
      }

      // Fetch ratings separately and calculate average ratings
      const bookIds = booksData.map((book) => book.id);
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("ratings_google_books")
        .select("book_id, rating");

      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError.message);
        setError("Error loading ratings from Supabase");
        return [];
      }

      // Create a map of book IDs to their ratings
      const ratingsMap: Record<string, number[]> = {};
      ratingsData.forEach(({ book_id, rating }) => {
        if (!ratingsMap[book_id]) {
          ratingsMap[book_id] = [];
        }
        ratingsMap[book_id].push(rating);
      });

      // Calculate average ratings and build the final book list
      return booksData.map((book) => {
        const ratings = ratingsMap[book.id] || [];
        const averageRating =
          ratings.length > 0
            ? parseFloat(
                (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
              )
            : 0;

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          averageRating: averageRating,
          image_url: book.image_url || null,
        };
      }).filter((book) => book.averageRating > 0); // Only include books with ratings
    } catch (err) {
      console.error("Unexpected error while fetching books:", err);
      setError("An unexpected error occurred while fetching books.");
      return [];
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const supabaseBooks = await fetchSupabaseBooks();
      const topBooks = supabaseBooks
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 100);
      setBooks(topBooks);
      setFilteredBooks(topBooks);
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = books.filter((book) => {
        const matchesTitle = book.title
          .toLowerCase()
          .includes(filter.title.toLowerCase());
        const matchesRating = book.averageRating >= filter.minRating;
        return matchesTitle && matchesRating;
      });

      filtered = filtered.sort((a, b) =>
        filter.sort === "asc"
          ? a.averageRating - b.averageRating
          : b.averageRating - a.averageRating
      );

      setFilteredBooks(filtered);
    };

    applyFilters();
  }, [filter, books]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!books || books.length === 0) {
    return <div>No books available</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Top 100 Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <div className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer hover:shadow-lg h-72 w-full flex flex-col">
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-lg font-bold">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {book.averageRating
                    ? `⭐ ${book.averageRating.toFixed(1)}/5`
                    : "No ratings yet"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}