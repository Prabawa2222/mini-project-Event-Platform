import Image from "next/image";
import Link from "next/link";

export default function HotOfferEvent() {
  return (
    <div className="flex justify-center mt-[150px] my-40">
      <div className="w-[90%] md:w-[80%] h-auto md:h-[400px] flex flex-col gap-5 relative">
        {/* Header */}
        <div className="w-full h-[40px] flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hot Offers</h1>
          <Link
            href="#"
            className="text-sm md:text-[13px] text-[#4F4CEE] hover:underline mr-5 md:mr-10 pt-2 md:pt-5"
          >
            View All
          </Link>
        </div>

        {/* Image Container */}
        <div className="w-full flex flex-col md:flex-row justify-between gap-4">
          {/* Card 1 */}
          <div className="w-full md:w-[49%] h-[250px] md:h-[400px] bg-transparent overflow-hidden group transition-all duration-300 ease-in-out rounded-lg shadow-lg group-hover:shadow-[0px_10px_30px_#4F4CEE]">
            <Image
              src="/offer1.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
          </div>

          {/* Card 2 */}
          <div className="w-full md:w-[49%] h-[250px] md:h-[400px] bg-transparent overflow-hidden group transition-all duration-300 ease-in-out rounded-lg shadow-lg group-hover:shadow-[0px_10px_30px_#4F4CEE]">
            <Image
              src="/offer2.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
