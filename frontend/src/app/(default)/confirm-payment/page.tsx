"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderInfo from "@/components/default/OrderInfo";
import AccountDropdown from "@/components/ui/AccountDropdown";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";
import { cardsQuery } from "@/lib/utils/queries";
import { zipRegex } from "@/lib/utils/regex";

interface Card {
  id?: string;
  card_id?: string;
  cardNumber?: string;
  card_last_four?: string;
  card_details?: {
    cardNumber: string;
    name: string;
    expDate: string;
    cvv: string;
  };
  name?: string;
  expDate?: string;
  cvv?: string;
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
  
  const { data: savedCards = [] } = useQuery({
    ...cardsQuery(),
    enabled: !!user,
  });

  const { data: prices = [] } = useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/v1/prices/");
      if (!response.ok) return [];
      return response.json();
    },
  });
  
  const bookingFee = prices.find((p: any) => p.price_name === "bookingFee")?.amount || 1.50;

  // Get booking details from URL
  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const adultTickets = Number(searchParams.get("adultTickets")) || 0;
  const childTickets = Number(searchParams.get("childTickets")) || 0;
  const seniorTickets = Number(searchParams.get("seniorTickets")) || 0;
  const seatsParam = searchParams.get("seats");
  const selectedSeats = seatsParam ? seatsParam.split(",") : [];

  useEffect(() => {
    if(!user) {
      toast("User not logged in!", {
        description: "If confirm payment is selected you will be redirected to the login page and have to restart.",
        action: {
          label: "done",
          onClick: () => {}
        }
      });
    }
  }, [user]);

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
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidCardNumber = (num: string) => {
    const digits = (num || "").replace(/\s|-/g, "");
    return /^\d{13,19}$/.test(digits);
  };

  const isValidExpDate = (exp: string) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp || "")) return false;
    const [mm, yy] = exp.split("/");
    const month = parseInt(mm, 10);
    const year = 2000 + parseInt(yy, 10);
    const now = new Date();
    const expiry = new Date(year, month);
    return expiry > now;
  };

  const isValidCvv = (cvv: string) => /^\d{3,4}$/.test(cvv || "");

  const getCardDetails = (c: Card | undefined | null) => {
    if (!c) return null;
    const d = c.card_details;
    return {
      cardNumber: d?.cardNumber ?? c.cardNumber ?? "",
      name: d?.name ?? c.name ?? "",
      expDate: d?.expDate ?? c.expDate ?? "",
      cvv: d?.cvv ?? c.cvv ?? "",
    };
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return toast.error("Enter a promo code");

    try {
      const response = await fetch("http://localhost:8000/api/v1/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promo_code: promoCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        setAppliedDiscount(0);
        return toast.error(error.detail || "Invalid promo code");
      }

      const data = await response.json();
      setAppliedDiscount(data.discount);
      toast.success(`${data.discount}% discount applied!`);
    } catch {
      setAppliedDiscount(0);
      toast.error("Failed to validate promo code");
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
              initialCards={savedCards}
              onSelectedCardChange={(card) => card && setPaymentMethods([card])}
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
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedDiscount > 0 && (
                <p className="text-sm text-green-400">
                  {appliedDiscount}% discount applied!
                </p>
              )}
            </div>


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
          discount={appliedDiscount}
          bookingFee={bookingFee}
          isConfirmPaymentPage={true}
          hasPaymentMethod={paymentMethods.length > 0}
          onConfirmBooking={async () => {
            if (!user) {
              toast.error("Log in to complete your booking.");
              router.push("/login");
              return;
            }
            if (!movieId || !showtime) {
              toast.error("Select a movie and showtime.");
              return;
            }
            if (selectedSeats.length === 0) {
              toast.error("Please select seats.");
              return;
            }
            if (paymentMethods.length === 0) {
              toast.error("Add a payment method to continue.");
              return;
            }

            const addr = billingAddress;
            if (!addr.address1 || !addr.city || !addr.state || !addr.zip || !addr.country) {
              toast.error("Complete shipping address to continue.");
              return;
            }
            if (!zipRegex.test(addr.zip)) {
              toast.error("Enter a valid ZIP code.");
              return;
            }

            const details = getCardDetails(paymentMethods[0]);
            if (!details || !details.cardNumber || !details.name || !details.expDate || !details.cvv) {
              toast.error("Add a valid payment method.");
              return;
            }
            if (!isValidCardNumber(details.cardNumber)) {
              toast.error("Enter a valid card number.");
              return;
            }
            if (!isValidExpDate(details.expDate)) {
              toast.error("Enter a valid expiry date (MM/YY).");
              return;
            }
            if (!isValidCvv(details.cvv)) {
              toast.error("Enter a valid CVV.");
              return;
            }
            
            setIsSubmitting(true);
            try {
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

              const ticketsSubtotal = tickets.reduce((sum, t) => sum + t.price, 0);
              const SALES_TAX_RATE = 0.07;
              
              const discountAmount = ticketsSubtotal * (appliedDiscount / 100);
              const subtotalAfterDiscount = ticketsSubtotal - discountAmount;
              const salesTax = subtotalAfterDiscount * SALES_TAX_RATE;
              const totalAmount = subtotalAfterDiscount + salesTax + bookingFee;

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
              if (appliedDiscount > 0) {
                params.set("discount", String(appliedDiscount));
              }

              router.push(`/confirmation?${params.toString()}`);
            } catch (error: any) {
              toast.error(error.message || "Failed to create booking.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      </div>
    </div>
  );
}