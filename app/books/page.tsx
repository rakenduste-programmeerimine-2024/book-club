"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Status = "CURRENTLY_READING" | "COMPLETED" | "PLAN_TO_READ" | "ON_HOLD" | "ALL";

interface Book {
  id: string;
  title: string;
  author: string;
  averageRating: number;
  image_url: string | null;
  status?: Status | null;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState({
    title: "",
    minRating: 0,
    sort: "desc",
    status: "ALL" as Status
  });
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select(`
        id,
        title,
        author,
        ratings (rating),
        is_favorite,
        image_url,
        reading_status!inner (
          status
        )
      `);

    if (booksError) {
      console.error("Error fetching books:", booksError.message);
      setError("Error loading books");
      return;
    }

    const processedBooks = booksData.map((book: any) => {
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
        status: book.reading_status?.[0]?.status || null
      };
    });

    setBooks(processedBooks);
    setFilteredBooks(processedBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = books.filter((book) => {
        const matchesTitle = book.title
          .toLowerCase()
          .includes(filter.title.toLowerCase());
        const matchesRating = book.averageRating >= filter.minRating;
        const matchesStatus = filter.status === "ALL" || book.status === filter.status;
        return matchesTitle && matchesRating && matchesStatus;
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

        <div className="flex items-center justify-between mb-4">
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

        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="statusFilter" className="font-medium text-gray-700">
            Reading Status:
          </label>
          <select
            id="statusFilter"
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, status: e.target.value as Status }))
            }
            className="p-2 border rounded-md"
          >
            <option value="ALL">All</option>
            <option value="CURRENTLY_READING">Currently Reading</option>
            <option value="COMPLETED">Completed</option>
            <option value="PLAN_TO_READ">Plan to Read</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {filteredBooks.map((book) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <div
              className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer hover:shadow-lg"
              style={{ width: "270px", height: "320px" }}
            >
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-2/3 object-cover"
                />
              )}
              <div className="p-4 h-1/3 flex flex-col justify-between">
                <h2 className="text-lg font-bold truncate">{book.title}</h2>
                <p className="text-gray-600 truncate">{book.author}</p>
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