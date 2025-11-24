"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderInfo from "@/components/default/OrderInfo";
import AccountDropdown from "@/components/ui/AccountDropdown";
import { allMoviesQuery } from "@/lib/utils/queries";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

interface Card {
  cardNumber: string;
  name: string;
  expDate: string;
  cvv: string;
}

interface ShippingAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function ConfirmPayment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: allMovies = [] } = useQuery(allMoviesQuery());

  // Get booking details from URL
  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const adultTickets = Number(searchParams.get("adultTickets")) || 0;
  const childTickets = Number(searchParams.get("childTickets")) || 0;
  const seniorTickets = Number(searchParams.get("seniorTickets")) || 0;
  const seatsParam = searchParams.get("seats");
  const selectedSeats = seatsParam ? seatsParam.split(",") : [];
  const totalTickets = adultTickets + childTickets + seniorTickets;

  // Payment and address states
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<Card[]>([]);
  const [promoCode, setPromoCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirmBooking = async () => {
    setErrorMsg(null);

    if (!user) {
      setErrorMsg("You must be logged in to complete booking.");
      toast.error("Log in to complete your booking.");
      router.push("/login");
      return;
    }
    if (!movieId || !showtime) {
      setErrorMsg("Missing movie or showtime information.");
      toast.error("Select a movie and showtime.");
      return;
    }
    if (selectedSeats.length !== totalTickets || totalTickets === 0) {
      setErrorMsg("Please select seats matching your ticket count.");
      toast.error("Select seats matching your tickets.");
      return;
    }
    if (paymentMethods.length === 0) {
      setErrorMsg("Add a payment method to continue.");
      toast.error("Add a payment method to continue.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) Find matching show_id by movie and showtime
      const movieIdNum = Number(movieId);
      const showsResp = await fetch(`http://localhost:8000/api/v1/shows/movie/${movieIdNum}`);
      if (!showsResp.ok) {
        throw new Error("Failed to fetch shows for movie.");
      }
      const shows = await showsResp.json();

      // Expect showtime in format "YYYY-MM-DD HH:MM:SS"
      const [datePart, timePart] = showtime.split(" ");
      const matchedShow = shows.find((s: any) => s.date === datePart && s.time === timePart);
      if (!matchedShow) {
        throw new Error("Selected showtime not found.");
      }

      // 2) Get available seats for the show to map seat labels to seat_id
      const seatsResp = await fetch(`http://localhost:8000/api/v1/seats/show/${matchedShow.show_id}/available`);
      if (!seatsResp.ok) {
        throw new Error("Failed to fetch available seats.");
      }
      const availableSeats = await seatsResp.json();
      const seatLabelToSeatId: Record<string, number> = {};
      for (const seat of availableSeats) {
        const label = `${seat.row_letter}${seat.column_number}`;
        seatLabelToSeatId[label] = seat.seat_id;
      }

      // Ensure all selected seats are available and mapped
      const selectedSeatIds: number[] = [];
      for (const label of selectedSeats) {
        const seatId = seatLabelToSeatId[label];
        if (!seatId) {
          throw new Error(`Seat ${label} is no longer available. Please reselect seats.`);
        }
        selectedSeatIds.push(seatId);
      }

      // 3) Build tickets payload honoring ticket type counts
      const tickets: Array<{ seat_id: number; ticket_type: string; price: number }> = [];
      let remainingAdult = adultTickets;
      let remainingChild = childTickets;
      let remainingSenior = seniorTickets;
      const prices = { adult: 12, child: 8, senior: 10 } as const;

      for (const seatId of selectedSeatIds) {
        let type: "adult" | "child" | "senior" = "adult";
        if (remainingAdult > 0) {
          type = "adult";
          remainingAdult--;
        } else if (remainingChild > 0) {
          type = "child";
          remainingChild--;
        } else if (remainingSenior > 0) {
          type = "senior";
          remainingSenior--;
        }
        tickets.push({ seat_id: seatId, ticket_type: type, price: prices[type] });
      }

      const totalAmount = tickets.reduce((sum, t) => sum + t.price, 0);

      // 4) POST booking
      const bookingPayload = {
        user_id: user.id,
        show_id: matchedShow.show_id,
        total_amount: totalAmount,
        tickets,
      };

      const bookingResp = await fetch("http://localhost:8000/api/v1/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (!bookingResp.ok) {
        const errData = await bookingResp.json().catch(() => ({}));
        throw new Error(errData?.detail || "Failed to create booking.");
      }

      // 5) Redirect to confirmation page with the same query params for display
      const params = new URLSearchParams();
      params.set("movieId", String(movieId));
      params.set("showtime", String(showtime));
      params.set("adultTickets", String(adultTickets));
      params.set("childTickets", String(childTickets));
      params.set("seniorTickets", String(seniorTickets));
      params.set("seats", selectedSeats.join(","));

      router.push(`/confirmation?${params.toString()}`);
    } catch (error: any) {
      const msg = error.message || "An unexpected error occurred.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Left Section - Payment Info */}
        <div className="p-6 bg-white/5 rounded-md shadow-md w-full max-w-md text-white">
          <h2 className="text-2xl font-heading mb-6">Add Payment Info</h2>

          <div className="flex flex-col gap-4">
            {/* Billing Address Dropdown */}
            <AccountDropdown
              label="Add a Billing Address"
              type="shipping"
              onShippingChange={setBillingAddress}
            />

            {/* Payment Method Dropdown */}
            <AccountDropdown
              label="Add a Payment Method"
              type="payment"
              onPaymentChange={setPaymentMethods}
            />

            {/* Promo Code Section */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">
                Coupons, Discounts or Promos
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                />
                <button
                  onClick={() => {
                    // Handle promo code application
                    console.log("Applying promo code:", promoCode);
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Confirm and Pay Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="mt-4 w-full px-4 py-3 bg-white text-black rounded-md disabled:opacity-60"
            >
              {isSubmitting ? "Processing..." : "Confirm and Pay"}
            </button>
            {paymentMethods.length === 0 && (
              <p className="mt-2 text-xs text-yellow-300">Add a payment method to continue.</p>
            )}
            {errorMsg && (
              <p className="mt-2 text-sm text-red-300">{errorMsg}</p>
            )}
          </div>
        </div>

        {/* Right Section - Order Info */}
        <OrderInfo
          movieId={movieId}
          showtime={showtime}
          adultTickets={adultTickets}
          childTickets={childTickets}
          seniorTickets={seniorTickets}
          selectedSeats={selectedSeats}
        />
      </div>
    </div>
  );
}