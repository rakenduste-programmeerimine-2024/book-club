import HeroSection from "@/components/hero-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Explore Books</h2>
          <p className="text-muted-foreground">
            A glimpse of the books available on our platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card p-4 rounded-md shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Book 1"
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Book Title 1
              </h3>
              <p className="text-muted-foreground text-sm">Author Name</p>
              <p className="text-primary mt-2">⭐ 4.5/5</p>
            </div>
          </div>
          <div className="bg-card p-4 rounded-md shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Book 2"
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Book Title 2
              </h3>
              <p className="text-muted-foreground text-sm">Author Name</p>
              <p className="text-primary mt-2">⭐ 4.0/5</p>
            </div>
          </div>
          <div className="bg-card p-4 rounded-md shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Book 3"
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Book Title 3
              </h3>
              <p className="text-muted-foreground text-sm">Author Name</p>
              <p className="text-primary mt-2">⭐ 4.7/5</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
