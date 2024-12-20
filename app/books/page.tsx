import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default async function BooksPage() {
  const supabase = await createClient();

  // Fetch books and their average ratings
  const { data: books, error: booksError } = await supabase
    .from("books")
    .select(`
      *,
      ratings (rating)
    `);

  if (booksError) {
    console.error("Error fetching books:", booksError.message);
    return <div>Error loading books</div>;
  }

  if (!books || books.length === 0) {
    return <div>No books available</div>;
  }

  // Calculate the average rating for each book
  const booksWithRatings = books.map((book) => {
    const ratings: { rating: number }[] = book.ratings || [];
    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
           ratings.length).toFixed(1)
        : "No ratings yet";
    return { ...book, averageRating };
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {booksWithRatings.map((book) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <div className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer hover:shadow-lg">
              {/* Book Image */}
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              )}
              {/* Book Details */}
              <div className="p-4">
                <h2 className="text-lg font-bold">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
                {/* Display Average Rating */}
                <p className="text-sm text-gray-700 mt-2">
                  {typeof book.averageRating === "string"
                    ? book.averageRating
                    : `⭐ ${book.averageRating}/5`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}