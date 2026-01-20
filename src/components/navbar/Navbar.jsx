import React from 'react'

const Navbar = () => {
  return (
    <nav className="w-full py-4">
      <div className="mx-auto flex items-center">
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
  );
}

export default Navbar
