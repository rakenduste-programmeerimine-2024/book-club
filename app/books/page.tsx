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
  isGoogleBook: boolean;
}

// Add type definition
type ReadingStatuses = {
  [key: string]: Status;
};

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
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to view your books");
      return;
    }

    // Fetch regular books
    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select(`
        id,
        title,
        author,
        ratings (rating),
        image_url
      `);

    // Fetch Google books (only user's books)
    const { data: googleBooksData, error: googleBooksError } = await supabase
      .from("google_books")
      .select(`
        id,
        title,
        author,
        image_url
      `)
      .eq('user_id', user.id); // Only fetch books added by this user

    // If user is logged in, fetch reading statuses separately
    let readingStatuses: ReadingStatuses = {};
    if (user) {
      const { data: statusData } = await supabase
        .from('reading_status')
        .select('book_id, status')
        .eq('user_id', user.id);
      
      readingStatuses = (statusData || []).reduce((acc: ReadingStatuses, curr) => {
        acc[curr.book_id] = curr.status;
        return acc;
      }, {});
    }

    if (booksError || googleBooksError) {
      console.error("Error fetching books:", booksError || googleBooksError);
      setError("Error loading books");
      return;
    }

    // Process regular books
    const processedBooks = (booksData || []).map((book: any) => {
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
        status: readingStatuses[book.id] || null,
        isGoogleBook: false
      };
    });

    // Process Google books
    const processedGoogleBooks = (googleBooksData || []).map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      averageRating: 0,
      image_url: book.image_url || null,
      status: readingStatuses[book.id] || null,
      isGoogleBook: true
    }));

    const allBooks = [...processedBooks, ...processedGoogleBooks];
    setBooks(allBooks);
    setFilteredBooks(allBooks);
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
              style={{ width: "270px", height: "400px" }}
            >
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-2/3 object-cover"
                />
              )}
              <div className="p-4 h-1/3 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold truncate">{book.title}</h2>
                  <p className="text-gray-600 truncate">{book.author}</p>
                  {book.status && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      book.status === 'CURRENTLY_READING' ? 'bg-blue-100 text-blue-800' :
                      book.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      book.status === 'PLAN_TO_READ' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {book.status.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">
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