"use client";

import { useEffect, useState } from "react";
import Button from "../ui/Button";
import NavbarSearch from "../ui/NavbarSearch";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check for scroll and blur navbar for better visiblity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <nav
        className={`w-full p-2 px-8 text-white flex justify-between items-center font-[var(--font-annapurna)] relative top-0 transition-all duration-300 bg-gradient-to-b from-black/90 from-60% to-black/0 ${
          scrolled ? "backdrop-blur-sm bg-black/50" : ""
        }`}
      >
        {/* LEFT: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <img
              src="/logo-cinema.png"
              alt="Logo"
              className="w-12 h-12 inline-block mr-2"
            />
            <span className="text-4xl uppercase font-special">Cinema</span>
          </Link>

          {/* Desktop Nav Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link href="/movies">
              <Button children="movies" />
            </Link>
            <Button children="book" />
          </div>
        </div>

        {/* RIGHT: Search + Profile OR Hamburger */}
        <div className="flex items-center gap-4">
          {/* Desktop Search + Profile */}
          <div className="hidden md:flex items-center gap-4">
            <NavbarSearch />
            <ProfileDropdown />
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M2.5 4C2.22386 4 2 4.22386 2 4.5C2 4.77614 2.22386 5 2.5 5H12.5C12.7761 5 13 4.77614 13 4.5C13 4.22386 12.7761 4 12.5 4H2.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.7761 12.7761 8 12.5 8H2.5C2.22386 8 2 7.7761 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4 space-y-2 font-special uppercase tracking-wider shadow-lg">
          <a
            href="/movies"
            className="block hover:text-gray-400 border-b border-dotted border-gray-600 pb-2"
          >
            Movies
          </a>
          <a
            href="/book"
            className="block hover:text-gray-400 border-b border-dotted border-gray-600 pb-2"
          >
            Book a Ticket
          </a>
          <a
            href="/dashboard"
            className="block hover:text-gray-400 border-b border-dotted border-gray-600 pb-2"
          >
            Dashboard
          </a>
          <a
            href="/settings"
            className="block hover:text-gray-400 border-b border-dotted border-gray-600 pb-2"
          >
            Settings
          </a>
          <button className="w-full text-left hover:text-gray-400 cursor-pointer">
            LOG OUT
          </button>
        </div>
      )}
    </div>
  );
}
