"use client";

import { useState } from "react";
import Button from "../ui/Button";
import NavbarSearch from "../ui/NavbarSearch";
import ProfileDropdown from "../default/ProfileDropdown";
import Link from "next/link";

export default function AuthNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <nav className="w-full p-4 px-8 text-white flex justify-center items-center font-[var(--font-annapurna)] bg-black relative">
        {/* LEFT: Logo + Nav */}
        <div className="flex items-center justify-center gap-6">
          <Link href="/" className="flex items-center">
            <img
              src="/logo-cinema.png"
              alt="Logo"
              className="w-12 h-12 inline-block mr-2"
            />
            <span className="text-4xl uppercase font-special">Cinema</span>
          </Link>

       
        </div>

        
      </nav>

     

      {/* BLACK GRADIENT EFFECT */}
      <div className="left-0 w-full h-8 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
    </div>
  );
}
