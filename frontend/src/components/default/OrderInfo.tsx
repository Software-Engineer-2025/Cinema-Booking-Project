import React from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface OrderInfoProps {
  movieId?: string | null;
  showtime?: string | null;
  adultTickets?: number;
  childTickets?: number;
  seniorTickets?: number;
  selectedSeats?: string[];
}

export default function OrderInfo({
  movieId,
  showtime,
  adultTickets = 0,
  childTickets = 0,
  seniorTickets = 0,
  selectedSeats = [],
}: OrderInfoProps) {
  const router = useRouter();

  const ticketPrices = {
    adult: 12,
    child: 8,
    senior: 10,
  } as const;

  const totalTickets = (adultTickets || 0) + (childTickets || 0) + (seniorTickets || 0);
  const subtotal =
    (adultTickets || 0) * ticketPrices.adult +
    (childTickets || 0) * ticketPrices.child +
    (seniorTickets || 0) * ticketPrices.senior;

  const handleContinue = () => {
    const params = new URLSearchParams();
    if (movieId) params.set("movieId", String(movieId));
    if (showtime) params.set("showtime", String(showtime));
    params.set("adultTickets", String(adultTickets || 0));
    params.set("childTickets", String(childTickets || 0));
    params.set("seniorTickets", String(seniorTickets || 0));
    // Pass seats as comma-separated list to match confirm-payment and confirmation pages
    const seatsParam = selectedSeats.join(",");
    if (seatsParam) params.set("seats", seatsParam);

    router.push(`/confirm-payment?${params.toString()}`);
  };

  return (
    <div className="p-6 bg-white/5 rounded-md shadow-md w-full max-w-md text-white">
      {/* Header */}
      <h2 className="text-2xl font-heading mb-4">Order Information</h2>

      {/* Body */}
      <div className="mb-4">
        {/* TICKET row */}
        <p className="uppercase text-sm text-white/40 font-medium mb-1">TICKETS</p>
        <div className="flex justify-between mb-2">
          <span>Adult Tickets x{adultTickets || 0}</span>
          <span>${((adultTickets || 0) * ticketPrices.adult).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Child Tickets x{childTickets || 0}</span>
          <span>${((childTickets || 0) * ticketPrices.child).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Senior Tickets x{seniorTickets || 0}</span>
          <span>${((seniorTickets || 0) * ticketPrices.senior).toFixed(2)}</span>
        </div>

        {/* SEATS row */}
        <p className="uppercase text-sm text-white/40 font-medium mb-1">SEATS</p>
        <div className="mb-2">
          <span className="font-bold">{selectedSeats.join(", ") || "None"}</span> Currently Selected
        </div>

        <div className="border-b border-gray-300 mb-4"></div>

        {/* Total row */}
        <div className="flex justify-between mb-4">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Continue button */}
        <Button
          className="text-black bg-gray-300/50 rounded-md py-4 w-full"
          onClick={handleContinue}
          disabled={selectedSeats.length !== totalTickets || totalTickets === 0}
        >
          Continue
        </Button>
        {selectedSeats.length !== totalTickets && (
          <p className="mt-2 text-xs text-red-300">
            Please select exactly {totalTickets} seat{totalTickets === 1 ? "" : "s"} to continue.
          </p>
        )}
      </div>
    </div>
  );
}
