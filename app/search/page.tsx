export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
    const query = searchParams.q || "";
  
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        {/* Placeholder for search results */}
        {query ? (
          <p className="text-gray-600">Displaying results for: {query}</p>
        ) : (
          <p className="text-gray-600">Please enter a search query.</p>
        )}
      </main>
    );
  }  