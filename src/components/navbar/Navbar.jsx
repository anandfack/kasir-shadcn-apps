"use client";

import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShow(false); // scroll ke bawah
      } else {
        setShow(true); // scroll ke atas
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <nav
        className={`w-full sticky top-0 z-50 transition-all duration-700 ${
          show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } bg-white text-black md:px-5 py-2 md:py-4 shadow-lg`}
      >
        <div className="flex justify-between items-center md:hidden px-4 py-3">
          <MenuIcon size={20} />
          <span className="font-anton uppercase text-3xl">ATELIER 01</span>
          <ShoppingCartIcon size={20} />
        </div>

        <div className="mx-auto hidden items-center md:flex">
          {/* LEFT */}
          <ul className="flex gap-48 font-jakarta text-sm uppercase">
            <li>Shop</li>
            <li>New In</li>
            <li>Women</li>
          </ul>

          {/* CENTER (LOGO) */}
          <div className="flex-1 text-center">
            <span className="font-anton uppercase text-4xl">ATELIER 01</span>
          </div>

          {/* RIGHT */}
          <ul className="flex gap-48 font-jakarta text-sm uppercase justify-end">
            <li>Men</li>
            <li>Accessories</li>
            <li>Journal</li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
