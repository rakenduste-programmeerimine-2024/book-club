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

  const GOOGLE_BOOKS_API_KEY = "AIzaSyAmpgtabwZ9s2sSN0ln8R_n5BcSz_0y0xg";

  const fetchSupabaseBooks = async (): Promise<Book[]> => {
    const supabase = await createClient();

    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select(
        `
        id,
        title,
        author,
        ratings (rating),
        is_favorite,
        image_url
      `
      )
      .eq("is_favorite", true);

    if (booksError) {
      console.error("Error fetching books:", booksError.message);
      setError("Error loading books from Supabase");
      return [];
    }

    return booksData.map((book: any) => {
      const ratings = book.ratings || [];
      const averageRating =
        ratings.length > 0
          ? (
              ratings.reduce(
                (sum: number, r: { rating: number }) => sum + r.rating,
                0
              ) / ratings.length
            ).toFixed(1)
          : "0";
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        averageRating: parseFloat(averageRating) || 0,
        image_url: book.image_url || null,
      };
    });
  };

  const fetchGoogleBooks = async (query = "fiction"): Promise<Book[]> => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`
      );
      const data = await response.json();
      if (!data.items) return [];

      return data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || "Unknown Title",
        author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
        averageRating: item.volumeInfo.averageRating || 0,
        image_url: item.volumeInfo.imageLinks?.thumbnail || null,
      }));
    } catch (err) {
      console.error("Error fetching books from Google:");
      return [];
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const supabaseBooks = await fetchSupabaseBooks();
      const googleBooks = await fetchGoogleBooks();

      setBooks([...supabaseBooks, ...googleBooks]);
      setFilteredBooks([...supabaseBooks, ...googleBooks]);
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
      <h1 className="text-3xl font-bold mb-6">Books</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title"
          value={filter.title}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-2 border rounded-md mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label htmlFor="minRating" className="font-medium text-gray-700">
              Minimum Rating:
            </label>
            <input
              id="minRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={filter.minRating}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  minRating: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-20 p-2 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="font-medium text-gray-700 mr-2"
            >
              Sort by Rating:
            </label>
            <select
              id="sortOrder"
              value={filter.sort}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, sort: e.target.value }))
              }
              className="p-2 border rounded-md"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <div className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer hover:shadow-lg">
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
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
