"use client";

import React from "react";
import { useState, useEffect } from "react";
import Seat from "./Seat";

interface SeatGridProps {
  onSeatsChange: (seats: string[]) => void;
  maxSeats?: number;
}

export default function SeatGrid({ onSeatsChange, maxSeats }: SeatGridProps) {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const cols = [1, 2, 3, 4, 5, 6, 7];
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Use useEffect to notify parent of seat changes
  useEffect(() => {
    onSeatsChange?.(selectedSeats);
  }, [selectedSeats, onSeatsChange]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // Deselecting a seat
        return prev.filter((s) => s !== seatId);
      } else {
        // Selecting a seat
        if (maxSeats && prev.length >= maxSeats) {
          // Already at max capacity, don't add more
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  return (
    <div className="flex flex-col bg-white/5 rounded-md shadow-md w-full max-w-sm items-center gap-4 p-6">
      <h2 className="font-heading text-white">Choose Seats</h2>
      {maxSeats && (
        <p className="text-sm text-white/60">
          Select {maxSeats} seat{maxSeats !== 1 ? "s" : ""} (
          {selectedSeats.length}/{maxSeats} selected)
        </p>
      )}
      <div className="text-center border-b border-white w-full font-medium text-white">
        Screen
      </div>
      <div className="grid grid-cols-8 gap-3 mt-4">
        <div></div>
        {cols.map((c) => (
          <div key={c} className="text-center font-body text-white">
            {c}
          </div>
        ))}
        {rows.map((r) => (
          <React.Fragment key={r}>
            <div className="font-body text-white flex items-center justify-center">
              {r}
            </div>
            {cols.map((c) => {
              const id = `${r}${c}`;
              return (
                <Seat
                  key={id}
                  selected={selectedSeats.includes(id)}
                  occupied={false}
                  onClick={() => toggleSeat(id)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
