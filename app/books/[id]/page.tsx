import { createClient } from "@/utils/supabase/server";
import Rating from "@/components/rating";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params; // Await params since it's a Promise

  const supabase = await createClient(); // Await createClient to get the Supabase client

  // Fetch the book details
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (bookError || !book) {
    console.error("Error fetching book details:", bookError);
    return <p>Failed to load book details. Please try again later.</p>;
  }

  // Fetch the average rating for this book
  const { data: ratings, error: ratingsError } = await supabase
    .from("ratings")
    .select("rating")
    .eq("book_id", id);

  // Calculate the average rating
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
          src={book.image_url}
          alt={book.title}
          className="w-full h-auto rounded-md"
        />
      </div>
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-4 text-black">{book.title}</h1>
        <p className="text-sm text-gray-700 mb-6">Written by: {book.author}</p>
        <p className="text-black mb-4">{book.description}</p>
        <div className="mb-4">
          <p className="text-lg text-gray-800 font-semibold">
            Average Rating: {averageRating} ⭐
          </p>
        </div>
        <Rating bookId={id} />
      </div>
    </div>
  );
}