"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface AddToLibraryButtonProps {
  book: {
    id: string;
    title: string;
    author: string;
    description?: string;
    imageUrl?: string;
  };
}

export default function AddToLibraryButton({ book }: AddToLibraryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkIfInLibrary = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('google_books')
        .select('id')
        .eq('id', book.id)
        .eq('user_id', user.id)
        .single();
      
      setIsInLibrary(!!data);
    };

    checkIfInLibrary();
  }, [book.id]);

  const addToLibrary = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please log in to add books to your library");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('google_books')
        .insert({
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description || null,
          image_url: book.imageUrl || null,
          created_at: new Date().toISOString(),
          user_id: user.id
        });

      if (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book to library');
      } else {
        setIsInLibrary(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add book to library');
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('google_books')
        .delete()
        .eq('id', book.id);

      if (error) {
        console.error('Error removing book:', error);
        alert('Failed to remove book from library');
      } else {
        setIsInLibrary(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove book from library');
    } finally {
      setLoading(false);
    }
  };

  if (isInLibrary) {
    return (
      <button 
        onClick={removeFromLibrary}
        disabled={loading}
        className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Removing...' : 'Remove from Library'}
      </button>
    );
  }

  return (
    <button
      onClick={addToLibrary}
      disabled={loading}
      className={`px-4 py-2 bg-[#887d69] hover:bg-[#6f5e48] text-white rounded-md ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Adding...' : 'Add to Library'}
    </button>
  );
}