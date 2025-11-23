"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import SeatGrid from "@/components/default/SeatGrid";
import OrderInfo from "@/components/default/OrderInfo";
import { toast } from "sonner";

export default function SelectSeats() {
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeatLabels, setOccupiedSeatLabels] = useState<string[]>([]);

  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const adultTickets = Number(searchParams.get("adultTickets")) || 0;
  const childTickets = Number(searchParams.get("childTickets")) || 0;
  const seniorTickets = Number(searchParams.get("seniorTickets")) || 0;

  const totalTickets = useMemo(
    () => adultTickets + childTickets + seniorTickets,
    [adultTickets, childTickets, seniorTickets]
  );

  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      try {
        if (!movieId || !showtime) {
          return;
        }
        const movieIdNum = Number(movieId);
        const showsResp = await fetch(
          `http://localhost:8000/api/v1/shows/movie/${movieIdNum}`
        );
        if (!showsResp.ok) {
          throw new Error("Failed to fetch shows for movie.");
        }
        const shows = await showsResp.json();
        const [datePart, timePart] = String(showtime).split(" ");
        const matchedShow = shows.find(
          (s: any) => s.date === datePart && s.time === timePart
        );
        if (!matchedShow) {
          throw new Error("Selected showtime not found.");
        }

        const seatsResp = await fetch(
          `http://localhost:8000/api/v1/seats/show/${matchedShow.show_id}/available`
        );
        if (!seatsResp.ok) {
          throw new Error("Failed to fetch available seats.");
        }
        const availableSeats = await seatsResp.json();
        const availableLabels = new Set(
          availableSeats.map(
            (seat: any) => `${seat.row_letter}${seat.column_number}`
          )
        );
        const rows = ["A", "B", "C", "D", "E", "F", "G"];
        const cols = [1, 2, 3, 4, 5, 6, 7];
        const occupied: string[] = [];
        for (const r of rows) {
          for (const c of cols) {
            const id = `${r}${c}`;
            if (!availableLabels.has(id)) {
              occupied.push(id);
            }
          }
        }
        setOccupiedSeatLabels(occupied);
      } catch (e: any) {
        toast.error(e.message || "Error loading seat availability.");
      }
    };
    fetchOccupiedSeats();
  }, [movieId, showtime]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <SeatGrid
          onSeatsChange={(seats) => setSelectedSeats(seats)}
          maxSeats={totalTickets}
          occupiedSeatLabels={occupiedSeatLabels}
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