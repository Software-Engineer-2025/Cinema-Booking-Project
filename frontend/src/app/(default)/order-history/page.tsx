"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { userBookingsQuery } from "@/lib/utils/queries";
import { useQuery } from "@tanstack/react-query";
import {use, useEffect, useState} from "react";
import OrderDropdown from "@/components/default/OrderDropdown";

export default function OrderHistoryPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
  }, [user]);

  const { data: userBookings = [], isLoading, error } = useQuery(
    user ? userBookingsQuery(user.id) : { queryKey: [], queryFn: async () => [] }
  );

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
      <div className="m-auto w-[80dvw] text-center text-white/80 mb-10">
        <h1 className={"mb-10 mt-5"}>Order History</h1>
        {!userBookings || userBookings.length === 0 ? (
            <p className="text-white/60">No bookings found</p>
        ) : (
            <>
              <div className={"flex flex-col gap-2"}>
                {userBookings.map((booking) => {
                  return <OrderDropdown order={booking}/>
                })}
              </div>
            </>
        )}
      </div>
  );
}
