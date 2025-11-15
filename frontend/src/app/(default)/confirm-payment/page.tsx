"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderInfo from "@/components/default/OrderInfo";
import AccountDropdown from "@/components/ui/AccountDropdown";
import { allMoviesQuery } from "@/lib/utils/queries";

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
  const { data: allMovies = [] } = useQuery(allMoviesQuery());

  // Get booking details from URL
  const movieId = searchParams.get("movieId");
  const showtime = searchParams.get("showtime");
  const adultTickets = Number(searchParams.get("adultTickets")) || 0;
  const childTickets = Number(searchParams.get("childTickets")) || 0;
  const seniorTickets = Number(searchParams.get("seniorTickets")) || 0;
  const seatsParam = searchParams.get("seats");
  const selectedSeats = seatsParam ? seatsParam.split(",") : [];

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
          isCheckout={true}
        />
      </div>
    </div>
  );
}