import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function BooksPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <p className="text-center mt-20">You must be logged in to see reviews.</p>;
  }

  const userId = session.user.id;

  const { data: reviews, error } = await supabase
    .from("ratings")
    .select(`
      id, 
      comment,
      created_at,
      books (
        id,
        title
      ),
      profiles (
        username
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error.message);
    return <p className="text-center mt-20">Failed to load reviews.</p>;
  }

  return (
    <div className="w-full h-full bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-card-foreground mb-8">
          Your Reviews
        </h1>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col bg-card p-6 rounded-md shadow-md"
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                <Link
                  href={`/books/${review.books?.id}`}
                  className="text-primary font-medium underline hover:text-primary-foreground"
                >
                  {review.books?.title || "Untitled Book"}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">{review.comment}</p>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Posted by: {review.profiles?.username || "Anonymous"} on{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
