import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Rating from "@/components/rating";
import AddToFavoritesButton from "@/components/add-to-favorites-button";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const stripHtmlTags = (input: string): string => {
  return input.replace(/<[^>]*>/g, ""); // This removes all HTML tags
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const renderStars = (rating: number): JSX.Element[] => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={i <= rating ? "gold" : "gray"}
        className="w-5 h-5"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  return stars;
};

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (book) {
    // Fetch ratings with user details
    const { data: ratings } = await supabase
      .from("ratings")
      .select("rating, comment, created_at, user_id, profiles(username)")
      .eq("book_id", id);

    const averageRating =
      ratings && ratings.length > 0
        ? (
            ratings.reduce(
              (sum: number, r: { rating: number }) => sum + r.rating,
              0
            ) / ratings.length
          ).toFixed(1)
        : "No ratings yet";

    return (
      <div className="p-8 rounded-md shadow-lg max-w-4xl mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f] flex flex-col gap-8">
        {/* Book Details */}
        <div className="flex gap-8">
          <div className="w-1/3">
            <img
              src={book.image_url || "/placeholder.png"}
              alt={book.title}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="w-2/3 relative">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-black">{book.title}</h1>
              <AddToFavoritesButton bookId={id} isFavorite={book.is_favorite} />
            </div>
            <p className="text-sm text-gray-700 mb-6">Written by: {book.author}</p>
            <p className="text-black mb-4">
              {book.description ? stripHtmlTags(book.description) : "No description available."}
            </p>
            <div className="mb-4">
              <p className="text-lg text-gray-800 font-semibold">
                Average Rating: {averageRating}
              </p>
            </div>
            <Rating bookId={id} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Reviews</h2>
          {ratings && ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((ratings, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-md shadow-md border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">
                      {ratings.profiles?.[0]?.username ? (
                        <Link
                          href={`/profiles/${ratings.user_id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {ratings.profiles[0].username}
                        </Link>
                      ) : (
                        "Anonymous"
                      )}
                    </p>
                    <div className="flex gap-1">
                      {renderStars(ratings.rating)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="font-semibold mr-2">Reviewed on</span> - 
                    <span className="ml-2">{formatDateTime(ratings.created_at)}</span>
                  </div>
                  <p className="text-lg text-black mt-2">
                    {ratings.comment || "No comment provided."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No reviews available for this book.</p>
          )}
        </div>
      </div>
    );
  }

  // Fallback to Google Books API
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_API_KEY}`
    );
    const googleBook = await response.json();

    if (!googleBook || googleBook.error) {
      console.error("Error fetching book details from Google Books API:", googleBook.error);
      return <p>Failed to load book details. Please try again later.</p>;
    }

    const {
      volumeInfo: { title, authors, description, imageLinks },
    } = googleBook;

    return (
      <div className="p-8 rounded-md shadow-lg max-w-4xl mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f] flex flex-col gap-8">
        {/* Fallback Book Details */}
        <div className="flex gap-8">
          <div className="w-1/3">
            <img
              src={imageLinks?.thumbnail || "/placeholder.png"}
              alt={title || "Unknown Title"}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="w-2/3">
            <h1 className="text-3xl font-bold mb-4 text-black">{title || "Unknown Title"}</h1>
            <p className="text-sm text-gray-700 mb-6">
              Written by: {authors?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-black mb-4">
              {description ? stripHtmlTags(description) : "No description available."}
            </p>
            <div className="mb-4">
              <p className="text-lg text-gray-800 font-semibold">
                Average Rating: Not available
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Rating bookId={id} />
              <AddToFavoritesButton bookId={id} isFavorite={false} />
            </div>
          </div>
        </div>

        {/* No Reviews for Fallback */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Reviews</h2>
          <p className="text-gray-700">No reviews available for this book.</p>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Error fetching Google Books API:", error.message);
    return <p>Failed to load book details. Please try again later.</p>;
  }
}