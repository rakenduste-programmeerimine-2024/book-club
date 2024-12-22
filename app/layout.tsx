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
      <body>
        <nav className="fixed w-full p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            {/* Site Logo */}
            <Link href="/" className="font-bold text-xl text-foreground">
              Book Club
            </Link>

            {/* Navigation Links */}
            <div className="flex-1 flex justify-center gap-6">
              <Link href="/books" className="hover:underline text-foreground">
                Books
              </Link>
              <Link href="/reviews" className="hover:underline text-foreground">
                Reviews
              </Link>
              <Link href="/about" className="hover:underline text-foreground">
                About
              </Link>
            </div>

            {/* Search Bar */}
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

            {/* Authentication or Profile */}
            <div className="ml-auto">
              <AuthButton />
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="pt-16 bg-background">{children}</div>
      </body>
    </html>
  );
}