"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { allMoviesQuery } from "@/lib/utils/queries";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { data: allMovies = [] } = useQuery(allMoviesQuery());

  // Get booking details from URL
  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const adultTickets = Number(searchParams.get("adultTickets")) || 0;
  const childTickets = Number(searchParams.get("childTickets")) || 0;
  const seniorTickets = Number(searchParams.get("seniorTickets")) || 0;
  const seatsParam = searchParams.get("seats");
  const selectedSeats = seatsParam ? seatsParam.split(",") : [];

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

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Left Section - Confirmation Message */}
        <div className="p-6 bg-white/5 rounded-md shadow-md w-full max-w-md text-white flex flex-col gap-4">
          <h2 className="text-2xl font-heading">Order Confirmed</h2>
          <p className="text-white/80">
            A confirmation email will be sent to the email address associated
            with your account.
          </p>
          <Link
            href="/"
            className="mt-4 text-center bg-gray-300/50 text-black rounded-md py-4 hover:bg-gray-300/70 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        {/* Right Section - Order Summary (No Button) */}
        <div className="p-6 bg-white/5 rounded-md shadow-md w-full max-w-md text-white">
          <h2 className="text-2xl font-heading mb-4">Order Summary</h2>

          <div className="mb-4">
            <p className="mb-2">
              Tickets for{" "}
              <span className="font-bold">
                {movie?.title || "Select a movie"}
              </span>
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
                  <span className="font-bold">{selectedSeats.join(", ")}</span>
                </>
              ) : (
                <span className="text-white/60">No seats selected</span>
              )}
            </div>

            <div className="border-b border-gray-300 mb-4"></div>

            {/* Total row */}
            <div className="flex justify-between mb-4">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}