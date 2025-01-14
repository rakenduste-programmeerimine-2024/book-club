"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Thread {
  id: string;
  title: string;
  category: string;
  posts: number;
  lastActivity: string;
}

const ITEMS_PER_PAGE = 10;

export default function ForumPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchThreads = async () => {
      const mockThreads: Thread[] = Array.from({ length: 50 }, (_, i) => ({
        id: `thread-${i + 1}`,
        title: `Thread Title ${i + 1}`,
        category: i % 2 === 0 ? "General" : "Feedback",
        posts: Math.floor(Math.random() * 100),
        lastActivity: new Date(
          Date.now() - Math.floor(Math.random() * 100000000)
        ).toLocaleString(),
      }));

      setThreads(mockThreads);
      setFilteredThreads(mockThreads);
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const applyCategoryFilter = () => {
      if (categoryFilter === "All") {
        setFilteredThreads(threads);
      } else {
        setFilteredThreads(
          threads.filter((thread) => thread.category === categoryFilter)
        );
      }
    };

    applyCategoryFilter();
  }, [categoryFilter, threads]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredThreads.length / ITEMS_PER_PAGE);
  const paginatedThreads = filteredThreads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 max-w-6xl mx-auto bg-[#f5ebe0] text-[#6b4f4f]">
      <h1 className="text-4xl font-bold mb-6 text-center">Coffee Forum</h1>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <label htmlFor="category" className="mr-2 font-medium">
            Filter by Category:
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-2 py-1 bg-[#e8d5c4] text-[#6b4f4f]"
          >
            <option value="All">All</option>
            <option value="General">General</option>
            <option value="Feedback">Feedback</option>
          </select>
        </div>
      </div>

      <div className="bg-[#d7ccc8] shadow rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#bcaaa4] border-b text-white">
              <th className="px-4 py-2">Thread Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Posts</th>
              <th className="px-4 py-2">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedThreads.map((thread) => (
              <tr
                key={thread.id}
                className="border-b hover:bg-[#d3b8ae] transition-colors"
              >
                <td className="px-4 py-2">
                  <Link
                    href={`/forum/thread/${thread.id}`}
                    className="text-[#5d4037] hover:underline"
                  >
                    {thread.title}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded bg-[#d7ccc8] text-[#5d4037]">
                    {thread.category}
                  </span>
                </td>
                <td className="px-4 py-2">{thread.posts}</td>
                <td className="px-4 py-2">{thread.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-4 py-2 rounded ${
              page === currentPage
                ? "bg-[#6b4f4f] text-white"
                : "bg-[#e8d5c4] text-[#6b4f4f] hover:bg-[#d3b8ae]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
