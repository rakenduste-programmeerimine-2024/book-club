import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Book {
  id: string;
  title: string;
  author: string;
  image_url: string | null;
}

export default async function SearchPage(props: {
  searchParams: { q: string };
}) {
  const supabase = createClient();
  const query = props.searchParams.q || "";

  const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

  let supabaseBooks: Book[] = [];
  let googleBooks: Book[] = [];

  if (query) {

    const { data, error } = await supabase
      .from("books")
      .select("id, title, author, image_url")
      .ilike("title", `%${query}%`);

    if (!error && data) {
      supabaseBooks = data;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20`
      );
      const googleData = await response.json();

      if (googleData.items) {
        googleBooks = googleData.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || "Unknown Title",
          author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
          image_url: item.volumeInfo.imageLinks?.thumbnail || null,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching Google Books:", error.message);
    }
  }

  const books = [...supabaseBooks, ...googleBooks];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="block border rounded-md shadow hover:shadow-lg transition"
            >
              <div className="p-4">
                <img
                  src={book.image_url || "/placeholder.png"}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-md"
                />
                <div className="p-2">
                  <h2 className="font-bold text-lg">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          {query ? "No results found." : "Please enter a search query."}
        </p>
      )}
    </main>
  );
}
