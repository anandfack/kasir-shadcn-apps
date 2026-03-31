"use client";

import Image from "next/image";

export default function Campaign() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-4 mt-10 -mx-5 pb-4 md:pb-0 bg-black text-white">
        <div className="relative h-[90vh] md:h-[750px] w-full md:order-1">
          <Image src="/image/hero-image-1.webp" alt="Campaign" fill />
        </div>
        <div className="mx-8 md:ml-10">
          <h1 className="font-anton uppercase text-3xl md:text-8xl ">
            Lorem Ipsum
          </h1>
          <h1 className="font-anton uppercase text-3xl md:text-8xl ">
            Dolor Sit Amet
          </h1>
          <p className="text-xs mt-4 md:mt-0 md:text-md font-extralight">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
            iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
            tristique tortor pretium ut. Curabitur elit justo, consequat id
            condimentum ac, volutpat ornare.
          </p>
        </div>
      </div>
    </>
  );
}
