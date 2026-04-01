"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Campaign() {
  return (
    <>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-4 mt-10 -mx-5 pb-4 md:pb-0 bg-black text-white">
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
      </div> */}

      <section className="relative py-24 md:py-32 border-y-4 border-black overflow-hidden -mx-5 mt-10">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-white text-5xl md:text-7xl lg:text-9xl tracking-tighter font-anton"
            >
              MADE FOR <br />
              THE STREETS
            </motion.h2>
            <p className="text-white text-lg md:text-xl uppercase tracking-widest">
              LIMITED EDITION SPRING/SUMMER 2026
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
