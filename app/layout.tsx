import Link from "next/link";
import "./globals.css";
import AuthButton from "@/components/auth-button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Book Club</title>
      </head>
      <body>
        <nav className="fixed w-full p-4 border-b bg-background z-50 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-foreground">
              Book Club
            </Link>

            <div className="flex-1 flex justify-center gap-6">
              <Link href="/books" className="hover:underline text-foreground">
                My books
              </Link>
              <Link href="/reviews" className="hover:underline text-foreground">
                My reviews
              </Link>
              <Link href="/forum" className="hover:underline text-foreground">
                Forum
              </Link>
              <Link href="/top100" className="hover:underline text-foreground">
                Top 100
              </Link>
            </div>

            <form
              action="/search"
              method="GET"
              className="relative flex items-center mr-4"
            >
              <input
                type="text"
                name="q"
                placeholder="Search..."
                className="px-4 py-2 border rounded-md text-sm bg-muted focus:ring focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 text-muted-foreground hover:text-primary"
              >
                🔍
              </button>
            </form>

            <div className="ml-auto">
              <AuthButton />
            </div>
          </div>
        </nav>

        <div className="pt-[calc(64px+1rem)] bg-background">{children}</div>
      </body>
    </html>
  );
}
