import Image from "next/image";
import Link from "next/link";

export default function TopSellingEvent() {
  return (
    <div className="flex justify-center mt-[150px] my-40">
      <div className="w-[80%] h-[400px] flex flex-col gap-5 relative">
        {/* Header */}
        <div className="w-full h-[40px] flex justify-between items-center">
          <h1 className="text-2xl font-bold ">Hot Offers</h1>
          <Link
            href="#"
            className="text-[13px] text-[#4F4CEE] hover:underline mr-10 pt-5"
          >
            View All
          </Link>
        </div>

        <div className="w-full h-[400px] flex justify-between gap-4">
          <div className="w-1/3 relative rounded-lg">
            {/* Gambar */}
            <Image
              src="/topsell1.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-auto rounded-lg bg-transparent"
            />

            {/* Overlay Teks */}
            <div className="absolute top-16 left-0 w-full h-full rounded-lg flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent gap-2">
              <h1 className="text-white text-2xl font-bold">
                Hillsong: Wonder Tour
              </h1>
              <p className="text-[#EB5757] text-lg pb-4">5 tickets left!</p>
            </div>
          </div>

          <div className="w-1/3 relative">
            {/* Gambar */}
            <Image
              src="/topsell2.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-auto overflow-hidden group transition-all duration-300 ease-in-out rounded-lg shadow-lg group-hover:shadow-[0px_10px_30px_#4F4CEE]"
            />

            {/* Overlay Teks */}
            <div className="absolute top-16 left-0 w-full h-full rounded-lg flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent gap-2">
              <h1 className="text-white text-2xl font-bold">
                Hamilton the Musical
              </h1>
              <p className="text-[#EB5757] text-lg pb-4">8 tickets left!</p>
            </div>
          </div>

          <div className="w-1/3 relative">
            {/* Gambar */}
            <Image
              src="/topsell3.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-auto overflow-hidden group transition-all duration-300 ease-in-out rounded-lg shadow-lg group-hover:shadow-[0px_10px_30px_#4F4CEE]"
            />

            {/* Overlay Teks */}
            <div className="absolute top-16 left-0 w-full h-full flex rounded-lg flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent gap-2">
              <h1 className="text-white text-2xl font-bold">
                Batavia Madrigal Singer
              </h1>
              <p className="text-[#EB5757] text-lg pb-4">11 tickets left!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
