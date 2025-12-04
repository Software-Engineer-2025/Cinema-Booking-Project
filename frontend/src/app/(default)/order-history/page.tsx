"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { userBookingsQuery } from "@/lib/utils/queries";
import { useQuery } from "@tanstack/react-query";

export default function OrderHistoryPage() {
  const { user } = useAuth();

  const { data: bookings, isLoading, error } = useQuery(
    user ? userBookingsQuery(user.id) : { queryKey: [], queryFn: async () => [] }
  );


  if (!user) {
    return (
        <p>Please log in to view your order history.</p>
    );
  }

  if (isLoading) {
    return (
        <p>Loading bookings...</p>
    );
  }

  if (error) {
    console.error("Bookings error:", error);
    return (
        <p className="text-red-400">Error loading bookings</p>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 text-white">
      {!bookings || bookings.length === 0 ? (
          <p className="text-white/60">No bookings found</p>
      ) : (
        <div>
            {JSON.stringify(bookings, null, 2)}
        </div>
      )}
    </div>
  );
}
