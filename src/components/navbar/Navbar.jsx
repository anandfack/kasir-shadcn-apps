"use client";

import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatRupiah } from "@/lib/formatRupiah";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const [openCart, setOpenCart] = useState(false);

  const cart = useSelector((state) => state.cart);

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
        } bg-white text-black md:px-5 py-2 md:py-4 border-black border-b-4`}
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
            <div>
              <div
                onClick={() => setOpenCart(!openCart)}
                className="cursor-pointer"
              >
                <ShoppingCartIcon size={20} />
              </div>
            </div>
          </ul>
        </div>
      </nav>
      {openCart && (
        <div
          onClick={() => setOpenCart(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
      {openCart && (
        <div className="fixed right-0 top-0 h-full w-[350px] bg-white border-l-4 border-black z-50 p-5 overflow-y-auto">
          <h2 className="text-2xl font-anton mb-4">CART</h2>

          {cart.items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="border-b pb-2 flex gap-3">
                  {/* ✅ IMAGE */}
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="grayscale"
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p>Size: {item.size}</p>
                    <p>Qty: {item.quantity}</p>

                    <p>{formatRupiah(item.price)}</p>
                  </div>
                </div>
              ))}
              <div className="mt-5 border-t pt-4">
                <p>Total Item: {cart.totalQuantity}</p>
                <p>Total Harga: {formatRupiah(cart.totalPrice)}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpenCart(false)}
            className="mt-5 w-full border-2 border-black py-2 hover:bg-black hover:text-white"
          >
            CLOSE
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
