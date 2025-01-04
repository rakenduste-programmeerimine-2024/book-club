"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Status = "CURRENTLY_READING" | "COMPLETED" | "PLAN_TO_READ" | "ON_HOLD";

export default function ReadingStatus({ bookId }: { bookId: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  
  // Check if it's a Google Book by checking if the ID is not a UUID
  const isGoogleBook = !bookId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const table = isGoogleBook ? 'google_books_reading_status' : 'reading_status';
      
      const { data } = await supabase
        .from(table)
        .select('status')
        .eq('book_id', bookId)
        .eq('user_id', user.id)
        .single();

      if (data) setStatus(data.status);
    };

    fetchStatus();
  }, [bookId, isGoogleBook]);

  const updateStatus = async (newStatus: Status) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please log in to update reading status");
      setLoading(false);
      return;
    }

    const table = isGoogleBook ? 'google_books_reading_status' : 'reading_status';

    const { error } = await supabase
      .from(table)
      .upsert(
        {
          user_id: user.id,
          book_id: bookId,
          status: newStatus,
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: 'user_id,book_id',
          ignoreDuplicates: false 
        }
      );

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update reading status');
    } else {
      setStatus(newStatus);
    }
    setLoading(false);
  };

  return (
    <select
      value={status || ""}
      onChange={(e) => updateStatus(e.target.value as Status)}
      disabled={loading}
      className="px-3 py-2 rounded-md border border-[#b4a68f] bg-[#f8f6f1] text-sm"
    >
      <option value="" disabled>Set reading status</option>
      <option value="CURRENTLY_READING">Currently Reading</option>
      <option value="COMPLETED">Completed</option>
      <option value="PLAN_TO_READ">Plan to Read</option>
      <option value="ON_HOLD">On Hold</option>
    </select>
  );
}