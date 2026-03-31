"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <>
      <div className="pt-10 pb-3 mt-10 bg-black text-white -mx-5 px-5 ">
        <div className="md:flex md:justify-center md:gap-2 md:px-[300px]">
          <div className="grid grid-cols-1 gap-3 md:w-full md:max-w-[400px]">
            <h1 className="text-md capitalize font-semibold border-b border-white py-1">
              Lorem Ipsum
            </h1>
            <h1 className="text-md capitalize font-semibold border-b border-white py-1">
              Lorem Ipsum
            </h1>
            <h1 className="text-md capitalize font-semibold border-b border-white py-1">
              Lorem Ipsum
            </h1>
            <h1 className="text-md capitalize font-semibold border-b border-white py-1">
              Lorem Ipsum
            </h1>
            <h1 className="text-md capitalize font-semibold border-b border-white py-1">
              Lorem Ipsum
            </h1>
          </div>
          <div className="text-center mt-4 md:text-right md:w-full md:max-w-[400px]">
            <h1 className="font-anton uppercase text-2xl">Logo</h1>
            <h1 className="text-sm uppercase font-anton">Find Us On</h1>
            <div className="flex justify-center gap-2 mt-4 md:justify-end md:items-center md:gap-2">
              <Image
                src="/image/instagram.png"
                alt="Logo Instagram"
                width={20}
                height={20}
              />
              <Image
                src="/image/instagram.png"
                alt="Logo Instagram"
                width={20}
                height={20}
              />
              <Image
                src="/image/instagram.png"
                alt="Logo Instagram"
                width={20}
                height={20}
              />
              <Image
                src="/image/instagram.png"
                alt="Logo Instagram"
                width={20}
                height={20}
              />
              <Image
                src="/image/instagram.png"
                alt="Logo Instagram"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-center bg-black text-white -mx-5 mt-4 md:font-bold md:mt-8">
            &copy; 2023 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
