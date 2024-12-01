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
        <nav className="fixed w-full p-4 border-b bg-[#faf6f0] backdrop-blur supports-[backdrop-filter]:bg-[#faf6f0]/60">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            {/* Site Logo */}
            <Link href="/" className="font-bold text-xl text-black">
              Book Club
            </Link>

            {/* Navigation and Search */}
            <div className="flex items-center gap-6">
              <Link href="/books" className="hover:underline text-black">
                Books
              </Link>
              <Link href="/reviews" className="hover:underline text-black">
                Reviews
              </Link>
              <Link href="/about" className="hover:underline text-black">
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
                  className="px-4 py-2 border rounded-md text-sm bg-gray-100 focus:ring focus:ring-black"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-gray-500 hover:text-black"
                >
                  🔍
                </button>
              </form>

              {/* Authentication or Profile */}
              <AuthButton />
            </div>
          </div>
        </nav>
        <div className="pt-16 bg-[#faf6f0]">{children}</div>
      </body>
    </html>
  );
}