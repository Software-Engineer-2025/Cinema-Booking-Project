"use client";
import { useState, useEffect } from "react";

type TicketCounterProps = {
  label: string;
  price: number;
  className?: string;
  onChange?: (label: string, total: number) => void;
};

export default function TicketCounter({ label, price, className = "", onChange }: TicketCounterProps) {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => (c > 0 ? c - 1 : c));

  // Notify parent of changes
  useEffect(() => {
    if (onChange) onChange(label, count * price);
  }, [count, price, label]); // Only depend on values that actually change

  return (
    <div className={`flex flex-row rounded-md bg-white/10 items-center justify-between py-3 px-4 sm:px-7 ${className}`}>
      {/* Label + Price grouped together */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="font-body font-bold text-base sm:text-lg">{label}</span>
        <span className="text-sm text-white">${price.toFixed(2)}</span>
      </div>
      
      {/* Counter at the right end */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={decrement}
          className="p-2 bg-gray-300/30 rounded-full hover:bg-gray-300/50 touch-manipulation"
        >
          {/* Minus Icon */}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="min-w-[20px] text-center font-bold text-base sm:text-lg">{count}</span>
        <button
          onClick={increment}
          className="p-2 bg-gray-300/30 rounded-full hover:bg-gray-300/50 touch-manipulation"
        >
          {/* Plus Icon */}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
