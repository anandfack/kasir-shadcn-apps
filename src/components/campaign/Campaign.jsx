"use client";

import Image from "next/image";

export default function Campaign() {
  return (
    <div className="grid grid-cols-2 gap-2 items-center -mx-5 mt-10 bg-black text-white -p-0">
      <div className="ml-10">
        <h1 className="font-anton uppercase text-8xl">Lorem Ipsum</h1>
        <h1 className="font-anton uppercase text-8xl">Dolor Sit Amet</h1>
        <p className="mt-5 text-md font-extralight">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
          iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
          tristique tortor pretium ut. Curabitur elit justo, consequat id
          condimentum ac, volutpat ornare.
        </p>
      </div>
      <div className="relative  h-[750px] w-full">
        <Image src="/image/hero-image-1.webp" alt="Campaign" fill />
      </div>
    </div>
  );
}
