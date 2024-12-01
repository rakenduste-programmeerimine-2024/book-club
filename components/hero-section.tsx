export default function HeroSection() {
    return (
      <section className="hero bg-[#faf6f0] text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-black leading-tight">
            Share your passion for books
          </h1>
          <p className="text-lg text-[#7a7a7a] mt-4">
            Join a community where readers and reviewers connect over stories.
          </p>
          <button className="mt-8 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-[#444444]">
            Explore Reviews
          </button>
        </div>
      </section>
    );
  }  