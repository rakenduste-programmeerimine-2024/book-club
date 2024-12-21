import Link from "next/link";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
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
            <Link href="/" className="font-bold text-xl">
              Book Club
            </Link>

            {/* Navigation and Search */}
            <div className="flex items-center gap-6">
              <Link href="/books" className="hover:underline">
                Books
              </Link>
              <Link href="/reviews" className="hover:underline">
                Reviews
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>

              {/* Search Bar */}
              <form
                action="/search"
                method="GET"
                className="relative flex items-center"
              >
                <input
                  type="text"
                  name="q"
                  placeholder="Search..."
                  className="px-4 py-2 border rounded-md text-sm bg-gray-100 focus:ring focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-gray-500 hover:text-primary"
                >
                  🔍
                </button>
              </form>

              {/* Authentication */}
              <AuthButton />
            </div>
          </div>
        </nav>
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}