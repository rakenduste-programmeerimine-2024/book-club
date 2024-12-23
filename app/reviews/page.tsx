import Link from "next/link";

export default function BooksPage() {
  return (
    <div className="w-full h-full bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-card-foreground mb-8">
          Books Reviews
        </h1>

        <div className="space-y-6">
          <div className="flex flex-col bg-card p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Book Title #1
            </h2>
            <p className="text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque euismod velit nec arcu varius, a consequat nulla
              interdum. In volutpat lacus in ante suscipit, sit amet interdum
              justo consectetur.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/book-details/1"
                className="text-primary font-medium underline hover:text-primary-foreground"
              >
                Read Full Review
              </Link>
              <span className="text-muted-foreground">
                Posted on: 12/01/2024
              </span>
            </div>
          </div>

          <div className="flex flex-col bg-card p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Book Title #2
            </h2>
            <p className="text-muted-foreground mb-4">
              Integer sit amet orci a erat varius sollicitudin. Sed vel turpis
              in neque convallis pharetra. Aliquam erat volutpat. Curabitur
              vitae velit ligula.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/book-details/2"
                className="text-primary font-medium underline hover:text-primary-foreground"
              >
                Read Full Review
              </Link>
              <span className="text-muted-foreground">
                Posted on: 12/01/2024
              </span>
            </div>
          </div>

          <div className="flex flex-col bg-card p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Book Title #3
            </h2>
            <p className="text-muted-foreground mb-4">
              Aenean sagittis ligula ut quam sollicitudin, non efficitur arcu
              fringilla. Nulla facilisi. Nam ut sem non nunc ultricies tempor
              nec sed arcu.
            </p>
            <div className="flex justify-between items-center">
              <Link
                href="/book-details/3"
                className="text-primary font-medium underline hover:text-primary-foreground"
              >
                Read Full Review
              </Link>
              <span className="text-muted-foreground">
                Posted on: 12/01/2024
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}