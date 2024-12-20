import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero bg-background text-center py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-foreground leading-tight">
          Share your passion for books
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          Join a community where readers and reviewers connect over stories.
        </p>
        <Link href="/reviews">
          <button className="mt-8 px-6 py-3 bg-foreground text-background font-medium rounded-full hover:bg-muted">
            Explore Reviews
          </button>
        </Link>
      </div>
    </section>
  );
}