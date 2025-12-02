import React from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrderInfoProps {
  movieId?: string | null;
  showtime?: string | null;
  adultTickets?: number;
  childTickets?: number;
  seniorTickets?: number;
  selectedSeats?: string[];
  discount?: number;
  bookingFee?: number;
  isConfirmPaymentPage?: boolean;
  hasPaymentMethod?: boolean;
  onConfirmBooking?: () => Promise<void>;
}

export default function OrderInfo({
  movieId,
  showtime,
  adultTickets = 0,
  childTickets = 0,
  seniorTickets = 0,
  selectedSeats = [],
  discount = 0,
  bookingFee = 2.50,
  isConfirmPaymentPage = false,
  hasPaymentMethod = false,
  onConfirmBooking,
}: OrderInfoProps) {
  const router = useRouter();

  const TICKET_PRICES = {
     adult: 12, 
     child: 8, 
     senior: 10 
  } as const;

  const SALES_TAX_RATE = 0.07;

  const totalTickets = adultTickets + childTickets + seniorTickets;
  const ticketsSubtotal =
    adultTickets * TICKET_PRICES.adult +
    childTickets * TICKET_PRICES.child +
    seniorTickets * TICKET_PRICES.senior;
  
  const discountAmount = ticketsSubtotal * (discount / 100);
  const subtotalAfterDiscount = ticketsSubtotal - discountAmount;
  const salesTax = subtotalAfterDiscount * SALES_TAX_RATE;
  const total = subtotalAfterDiscount + salesTax + bookingFee;

  const handleContinue = () => {
    if (totalTickets === 0) {
      toast.error("Choose at least one ticket to continue.");
      return;
    }
    if (selectedSeats.length !== totalTickets) {
      toast.error(
        `Please select exactly ${totalTickets} seat${totalTickets === 1 ? "" : "s"}.`
      );
      return;
    }
    const params = new URLSearchParams({
      movieId: String(movieId),
      showtime: String(showtime),
      adultTickets: String(adultTickets),
      childTickets: String(childTickets),
      seniorTickets: String(seniorTickets),
      seats: selectedSeats.join(","),
    });

    router.push(`/confirm-payment?${params}`);
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
          <span>Adult Tickets x{adultTickets}</span>
          <span>${(adultTickets * TICKET_PRICES.adult).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Child Tickets x{childTickets}</span>
          <span>${(childTickets * TICKET_PRICES.child).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Senior Tickets x{seniorTickets}</span>
          <span>${(seniorTickets * TICKET_PRICES.senior).toFixed(2)}</span>
        </div>

        {/* SEATS row */}
        <p className="uppercase text-sm text-white/40 font-medium mb-1">SEATS</p>
        <div className="mb-2">
          <span className="font-bold">{selectedSeats.join(", ") || "None"}</span> Currently Selected
        </div>

        <div className="border-b border-gray-300 mb-4"></div>

        {/* Subtotal */}
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${ticketsSubtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between mb-2">
            <span>
              <span className="text-white/40">Promotion</span>{" "}
              <span className="text-white">({discount}%)</span>
            </span>
            <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        {/* Sales Tax */}
        <div className="flex justify-between mb-2">
          <span>Sales Tax (7%)</span>
          <span>${salesTax.toFixed(2)}</span>
        </div>

        {/* Booking Fee */}
        <div className="flex justify-between mb-2">
          <span>Booking Fee</span>
          <span>${bookingFee.toFixed(2)}</span>
        </div>

        <div className="border-b border-gray-300 mb-4"></div>

        {/* Total row */}
        <div className="flex justify-between mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Continue button */}
        {isConfirmPaymentPage ? (
          <>
            <button
              className={`rounded-md py-4 w-full transition-colors ${
                hasPaymentMethod
                  ? "text-black bg-white hover:bg-gray-200"
                  : "text-black bg-gray-300/50 cursor-not-allowed opacity-60"
              }`}
              onClick={hasPaymentMethod ? onConfirmBooking : undefined}
              disabled={!hasPaymentMethod}
            >
              Confirm and Pay
            </button>
            {!hasPaymentMethod && (
              <p className="mt-2 text-xs text-yellow-300">
                Select a payment method to continue.
              </p>
            )}
          </>
        ) : (
          <>
            <Button
              className="text-black bg-gray-300/50 rounded-md py-4 w-full"
              onClick={handleContinue}
            >
              Continue
            </Button>
            {selectedSeats.length !== totalTickets && (
              <p className="mt-2 text-xs text-red-300">
                Please select exactly {totalTickets} seat{totalTickets === 1 ? "" : "s"} to continue.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
