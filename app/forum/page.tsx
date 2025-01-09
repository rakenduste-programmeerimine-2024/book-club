import React from "react";
import Link from "next/link";

export default function Forum() {
  return (
    <div className="w-full h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center text-card-foreground mb-14">
        Book Club Forum
      </h1>
      <div className="flex justify-center space-x- 6">
        <Link href={"/forum/general"}>
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs transform rotate-2 hover:rotate-0 transition-transfrom duration-300 cursor-pointer">
            <h2 className="text-x1 font-semibold text-card-foreground mb-4">
              General Discussion
            </h2>
            <p className="text-muted-foreground">
              Share your thoughts, ask questions about your favorite books,
              authors and plots
            </p>
          </div>
        </Link>

        <Link href={"/forum/recommendations"}>
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer">
            <h2 className="text-x1 font-semibold text-card-foreground mb-4">
              Book Recommendations
            </h2>
            <p className="text-muted-foreground">
              Looking for a new read? Wish to share your favorites? You are
              awaited here!
            </p>
          </div>
        </Link>

        <Link href={"/forum/reviews"}>
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer">
            <h2 className="text-x1 font-semibold text-card-foreground mb-4">
              Book Reviews
            </h2>
            <p className="text-muted-foreground">
              Write and add your own reviews to existing discourse with other
              club members here!
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
