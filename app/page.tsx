"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Book {
  id: string;
  title: string;
  author: string;
  averageRating: number;
  image_url: string | null;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_BOOKS_API_KEY = "AIzaSyAmpgtabwZ9s2sSN0ln8R_n5BcSz_0y0xg";

  const fetchSupabaseBooks = async (): Promise<Book[]> => {
    const supabase = await createClient();

    const { data: booksData, error: booksError } = await supabase.from("books")
      .select(`
        id,
        title,
        author,
        ratings (rating),
        image_url
      `);

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
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=100&key=${GOOGLE_BOOKS_API_KEY}`
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
      console.error("Error fetching books from Google:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const supabaseBooks = await fetchSupabaseBooks();
      const googleBooks = await fetchGoogleBooks();

      const allBooks = [...supabaseBooks, ...googleBooks];
      const topBooks = allBooks
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 9);
      setBooks(topBooks);
    };

    fetchBooks();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Explore Books</h2>
          <p className="text-muted-foreground">
            A glimpse of the books available on our platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="bg-card p-4 rounded-md shadow-md">
                {book.image_url && (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{book.author}</p>
                  <p className="text-primary mt-2">
                    ⭐ {book.averageRating.toFixed(1)}/5
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-center col-span-full">
              Loading books...
            </div>
          )}
        </div>
      </section>
    </>
  );
}
