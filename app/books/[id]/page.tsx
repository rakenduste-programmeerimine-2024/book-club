import { createClient } from "@/utils/supabase/server";

interface BookDetailsProps {
  params: { id: string };
}

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !book) {
    console.error("Error fetching book details:", error);
    return <p>Failed to load book details. Please try again later.</p>;
  }

  return (
    <div className="p-8 rounded-md shadow-lg max-w-4xl mx-auto mt-12 bg-[#dbd2c3] border border-[#b4a68f] flex gap-8">
      {/* Book Image */}
      <div className="w-1/3">
        <img
          src={book.image_url}
          alt={book.title}
          className="w-full h-auto rounded-md"
        />
      </div>

      {/* Book Details */}
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-4 text-black">{book.title}</h1>
        <p className="text-sm text-gray-700 mb-6">Written by: {book.author}</p> {/* Optional: Include author */}
        <p className="text-black">{book.description}</p>
      </div>
    </div>
  );
}