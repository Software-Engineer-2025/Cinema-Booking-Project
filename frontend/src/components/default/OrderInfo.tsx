import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { allMoviesQuery } from "@/lib/utils/queries";

interface OrderInfoProps {
  movieId: string | null;
  showtime: string | null;
  adultTickets: number;
  childTickets: number;
  seniorTickets: number;
  selectedSeats: string[];
  isCheckout?: boolean; // Flag to know if we're on checkout page
}

export default function OrderInfo({
  movieId,
  showtime,
  adultTickets,
  childTickets,
  seniorTickets,
  selectedSeats,
  isCheckout = false,
}: OrderInfoProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: allMovies = [] } = useQuery(allMoviesQuery());

  const movie = useMemo(() => {
    if (!movieId) return null;
    return allMovies.find((m) => m.movie_id === Number(movieId));
  }, [movieId, allMovies]);

  const adultPrice = 12;
  const childPrice = 8;
  const seniorPrice = 10;

  const totalPrice = useMemo(() => {
    return (
      adultTickets * adultPrice +
      childTickets * childPrice +
      seniorTickets * seniorPrice
    );
  }, [adultTickets, childTickets, seniorTickets]);

  const totalTickets = adultTickets + childTickets + seniorTickets;
  const requiredSeats = totalTickets;
  const canContinue = selectedSeats.length === requiredSeats;

  const handleContinue = async () => {
    if (!canContinue) return;

    setIsProcessing(true);

    try {
      if (isCheckout) {
        // On checkout page - actually process the booking
        // TODO: Call your booking API here
        console.log("Processing payment and creating booking...");

        // Example booking API call:
        // const response = await fetch("/api/v1/bookings", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     user_id: currentUserId,
        //     show_id: showIdFromShowtime,
        //     total_amount: totalPrice,
        //     tickets: tickets
        //   })
        // });

        // Navigate to confirmation with booking details
        const params = new URLSearchParams({
          movieId: movieId || "",
          showtime: showtime || "",
          adultTickets: adultTickets.toString(),
          childTickets: childTickets.toString(),
          seniorTickets: seniorTickets.toString(),
          seats: selectedSeats.join(","),
          total: totalPrice.toFixed(2),
        });

        router.push(`/confirmation?${params.toString()}`);
      } else {
        // On seat selection page - navigate to checkout
        const tickets = [];

        // Assign seats to adult tickets first
        for (let i = 0; i < adultTickets; i++) {
          tickets.push({
            seat: selectedSeats[tickets.length],
            ticket_type: "adult",
            price: adultPrice,
          });
        }

        // Then child tickets
        for (let i = 0; i < childTickets; i++) {
          tickets.push({
            seat: selectedSeats[tickets.length],
            ticket_type: "child",
            price: childPrice,
          });
        }

        // Then senior tickets
        for (let i = 0; i < seniorTickets; i++) {
          tickets.push({
            seat: selectedSeats[tickets.length],
            ticket_type: "senior",
            price: seniorPrice,
          });
        }

        // Navigate to checkout with all the booking details
        const params = new URLSearchParams({
          movieId: movieId || "",
          showtime: showtime || "",
          adultTickets: adultTickets.toString(),
          childTickets: childTickets.toString(),
          seniorTickets: seniorTickets.toString(),
          seats: selectedSeats.join(","),
          total: totalPrice.toFixed(2),
        });

        router.push(`/confirm-payment?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 rounded-md shadow-md w-full max-w-md text-white">
      {/* Header */}
      <h2 className="text-2xl font-heading mb-4">Order Information</h2>

      {/* Body */}
      <div className="mb-4">
        <p className="mb-2">
          Tickets for{" "}
          <span className="font-bold">{movie?.title || "Select a movie"}</span>
        </p>

        {showtime && (
          <p className="text-sm text-white/60 mb-4">
            Showtime: {decodeURIComponent(showtime)}
          </p>
        )}

        {/* TICKETS row */}
        <p className="uppercase text-sm text-white/40 font-medium mb-1">
          TICKETS
        </p>
        {adultTickets > 0 && (
          <div className="flex justify-between mb-2">
            <span>Adult Tickets x{adultTickets}</span>
            <span>${(adultTickets * adultPrice).toFixed(2)}</span>
          </div>
        )}
        {childTickets > 0 && (
          <div className="flex justify-between mb-2">
            <span>Child Tickets x{childTickets}</span>
            <span>${(childTickets * childPrice).toFixed(2)}</span>
          </div>
        )}
        {seniorTickets > 0 && (
          <div className="flex justify-between mb-2">
            <span>Senior Tickets x{seniorTickets}</span>
            <span>${(seniorTickets * seniorPrice).toFixed(2)}</span>
          </div>
        )}

        {/* SEATS row */}
        <p className="uppercase text-sm text-white/40 font-medium mb-1 mt-4">
          SEATS
        </p>
        <div className="mb-2">
          {selectedSeats.length > 0 ? (
            <>
              <span className="font-bold">{selectedSeats.join(", ")}</span>{" "}
              Currently Selected
            </>
          ) : (
            <span className="text-white/60">
              Please select {requiredSeats} seat{requiredSeats !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="border-b border-gray-300 mb-4"></div>

        {/* Total row */}
        <div className="flex justify-between mb-4">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        {/* Continue button */}
        <Button
          className="text-black bg-gray-300/50 rounded-md py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canContinue || isProcessing}
          onClick={handleContinue}
        >
          {isProcessing
            ? "Processing..."
            : canContinue
            ? isCheckout
              ? "Complete Purchase"
              : "Continue to Checkout"
            : `Select ${requiredSeats - selectedSeats.length} more seat${
                requiredSeats - selectedSeats.length !== 1 ? "s" : ""
              }`}
        </Button>
      </div>
    </div>
  );
}
