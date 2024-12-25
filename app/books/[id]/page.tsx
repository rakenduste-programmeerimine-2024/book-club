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

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (book) {
    const { data: ratings } = await supabase
      .from("ratings")
      .select("rating")
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
      <div className="p-8 rounded-md shadow-lg max-w-4xl mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f] flex gap-8">
        <div className="w-1/3">
          <img
            src={book.image_url || "/placeholder.png"}
            alt={book.title}
            className="w-full h-auto rounded-md"
          />
        </div>
        <div className="w-2/3">
          <h1 className="text-3xl font-bold mb-4 text-black">{book.title}</h1>
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
    );
  }

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
      <div className="p-8 rounded-md shadow-lg max-w-4xl mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f] flex gap-8">
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
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Error fetching Google Books API:", error.message);
    return <p>Failed to load book details. Please try again later.</p>;
  }
}