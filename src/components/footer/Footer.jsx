"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex justify-center gap-2 bg-black -mx-5 px-[300px] text-white mt-10 py-10">
      <div className="w-full max-w-[400px]">
        <h1 className="font-anton text-lg border-b-2 border-white py-1">
          Lorem Ipsum
        </h1>
        <h1 className="font-anton text-lg border-b-2 border-white py-1">
          Lorem Ipsum
        </h1>
        <h1 className="font-anton text-lg border-b-2 border-white py-1">
          Lorem Ipsum
        </h1>
        <h1 className="font-anton text-lg border-b-2 border-white py-1">
          Lorem Ipsum
        </h1>
        <h1 className="font-anton text-lg border-b-2 border-white py-1">
          Lorem Ipsum
        </h1>
      </div>
      <div className="w-full max-w-[400px] text-right">
        <h1 className="font-anton uppercase text-2xl">Logo</h1>
        <h1 className="text-sm uppercase font-anton">Find Us On</h1>
        <div className="flex justify-end items-center gap-2">
          <Image
            src="/image/instagram.png"
            alt="Logo Instagram"
            width={15}
            height={15}
          />
          <Image
            src="/image/instagram.png"
            alt="Logo Instagram"
            width={15}
            height={15}
          />
          <Image
            src="/image/instagram.png"
            alt="Logo Instagram"
            width={15}
            height={15}
          />
          <Image
            src="/image/instagram.png"
            alt="Logo Instagram"
            width={15}
            height={15}
          />
          <Image
            src="/image/instagram.png"
            alt="Logo Instagram"
            width={15}
            height={15}
          />
        </div>
      </div>
    </div>
  );
}
