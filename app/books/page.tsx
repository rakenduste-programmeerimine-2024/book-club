import { createClient } from "@/utils/supabase/client";

export default async function BooksPage() {
  const supabase = await createClient();
  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Error fetching books:", error.message);
    return <div>Error loading books</div>;
  }

  if (!books || books.length === 0) {
    return <div>No books available</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white shadow-md rounded-md overflow-hidden">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}