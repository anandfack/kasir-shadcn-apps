import DetailsProduct from "@/components/details-product/DetailsProduct";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="mx-5">
        {/* <Breadcrumbs /> */}
        <DetailsProduct />
        {/* <Hero /> */}
        {/* <SignaturePieces /> */}
        {/* <OurProduct /> */}
        {/* <Campaign /> */}
        {/* <Tagline /> */}
      </section>
      <Footer />
    </>
  );
}
