"use client";

import { useState, useRef, useEffect } from "react";
import ProfileIcon from "../ui/ProfileIcon";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`rounded-full focus:outline-none transition-all cursor-pointer ${
          open ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" : ""
        }`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <ProfileIcon size={40} />
      </button>


      {/* Dropdown Menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48 
            bg-black text-white uppercase font-special
            rounded-md shadow-lg z-50
          "
        >
          <a
            href="/dashboard"
            className="block px-4 py-2 hover:text-gray-400 border-b border-dotted border-white"
          >
            Dashboard
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 hover:text-gray-400 border-b border-dotted border-white"
          >
            Settings
          </a>
          <button
            className="w-full text-left px-4 py-2 cursor-pointer hover:text-gray-400"
          >
            LOG OUT
          </button>
        </div>
      )}
    </div>
  );
}
