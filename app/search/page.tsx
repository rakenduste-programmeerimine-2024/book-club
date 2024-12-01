import { createClient } from "@/utils/supabase/client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const supabase = createClient();
  const query = searchParams.q || "";

  // Fetch books matching the search query
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .ilike("title", `%${query}%`); // Case-insensitive search for titles

  if (error) {
    console.error("Error fetching search results:", error);
    return <p className="text-red-500">Error loading search results.</p>;
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {query.trim() === "" ? (
        <p className="text-gray-600">Please enter a search query.</p>
      ) : books.length === 0 ? (
        <p className="text-gray-600">No results found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="p-4 bg-white rounded-md shadow">
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-bold">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}