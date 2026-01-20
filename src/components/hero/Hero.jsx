import Image from "next/image";

const Hero = () => {
  return (
    <>
      {/* TITLE */}
      <section className="w-full overflow-hidden pt-10 pb-4">
        <h1
          className="font-anton
              uppercase
              leading-[0.9]
              w-full
              flex
              justify-between
              text-[clamp(48px,16vw,48px)]
              md:text-[clamp(100px,12vw,240px)]"
        >
          <span>FALL</span>
          <span>WINTER</span>
          <span>2026</span>
        </h1>
      </section>

      {/* MOBILE */}
      <section className="md:hidden w-full flex justify-center px-6">
        <div className="relative aspect-square w-full max-w-[420px]">
          <Image
            src="/image/hero-image-2.webp"
            alt="Hero Mobile"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* DESKTOP (TIDAK DIUBAH) */}
      <section className="hidden md:grid grid-cols-[1fr_auto] gap-1 w-full h-[80vh]">
        <div className="relative w-full h-full">
          <Image
            src="/image/hero-image-1.webp"
            alt="Hero 1"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative aspect-square h-full">
          <Image
            src="/image/hero-image-2.webp"
            alt="Hero 2"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
