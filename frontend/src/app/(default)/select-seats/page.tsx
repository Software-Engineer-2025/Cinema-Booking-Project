"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import SeatGrid from "@/components/default/SeatGrid";
import OrderInfo from "@/components/default/OrderInfo";

export default function SelectSeats() {
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const adultTickets = Number(searchParams.get("adultTickets")) || 0;
  const childTickets = Number(searchParams.get("childTickets")) || 0;
  const seniorTickets = Number(searchParams.get("seniorTickets")) || 0;

  const totalTickets = useMemo(
    () => adultTickets + childTickets + seniorTickets,
    [adultTickets, childTickets, seniorTickets]
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <SeatGrid
          onSeatsChange={(seats) => setSelectedSeats(seats)}
          maxSeats={totalTickets}
        />
        <OrderInfo
          movieId={movieId}
          showtime={showtime}
          adultTickets={adultTickets}
          childTickets={childTickets}
          seniorTickets={seniorTickets}
          selectedSeats={selectedSeats}
          isCheckout={false}
        />
      </div>
    </div>
  );
}