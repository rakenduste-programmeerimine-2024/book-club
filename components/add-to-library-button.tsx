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
        .select('id, user_id')
        .eq('id', book.id)
        .single();

      if (data && data.user_id && Array.isArray(data.user_id) && data.user_id.includes(user.id)) {
        setIsInLibrary(true);
      } else {
        setIsInLibrary(false);
      }
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

      // Check if the book is already in the library
      const { data: existingBook } = await supabase
        .from('google_books')
        .select('id, user_id')
        .eq('id', book.id)
        .single();

      if (existingBook) {
        const userIds = existingBook.user_id || [];
        if (!userIds.includes(user.id)) {
          // Add user_id to the array if not already present
          const { error } = await supabase
            .from('google_books')
            .update({
              user_id: [...userIds, user.id]
            })
            .eq('id', book.id);

          if (error) {
            console.error('Error adding user to book:', error);
            alert(`Failed to add user to book in library: ${error.message || error}`);
          } else {
            console.log('Book updated successfully');
            setIsInLibrary(true);
          }
        } else {
          // User is already in the library
          setIsInLibrary(true);
        }
      } else {
        // Book doesn't exist, insert new book with user_id
        const { error } = await supabase
          .from('google_books')
          .insert({
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description || null,
            image_url: book.imageUrl || null,
            user_id: [user.id], // Store user_id as an array
            created_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error adding book:', error);
          alert(`Failed to add book to library: ${error.message || error}`);
        } else {
          console.log('Book added successfully');
          setIsInLibrary(true);
        }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to remove books from your library");
        setLoading(false);
        return;
      }

      const { data: existingBook } = await supabase
        .from('google_books')
        .select('id, user_id')
        .eq('id', book.id)
        .single();

      if (existingBook && existingBook.user_id) {
        const updatedUserIds = existingBook.user_id.filter((id: string) => id !== user.id);

        // Update the user_id array
        const { error } = await supabase
          .from('google_books')
          .update({
            user_id: updatedUserIds
          })
          .eq('id', book.id);

        if (error) {
          console.error('Error removing user from book:', error);
          alert(`Failed to remove user from book in library: ${error.message || error}`);
        } else {
          console.log('User removed from book successfully');
          setIsInLibrary(false);
        }
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