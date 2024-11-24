import Link from "next/link";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body>
        <nav className="fixed w-full p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              Book Club
            </Link>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {}
            </div>
          </div>
        </nav>
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}