import Image from "next/image";
import Link from "next/link";

export default function TopSellingEvent() {
  return (
    <div className="flex justify-center mt-20 md:mt-[150px] my-20 md:my-40">
      <div className="w-[95%] md:w-[80%] h-auto md:h-[400px] flex flex-col gap-5 relative">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Top Selling</h1>
          <Link
            href="#"
            className="text-sm md:text-[13px] text-[#4F4CEE] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Container untuk event */}
        <div className="w-full flex flex-col md:flex-row justify-between gap-6 md:gap-4">
          {/* Event 1 */}
          <div className="w-full md:w-1/3 relative rounded-lg shadow-md md:shadow-none">
            <Image
              src="/topsell1.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-60 md:h-full rounded-lg bg-transparent object-cover"
            />
            {/* Overlay Teks */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
              <h1 className="text-white text-lg md:text-2xl font-bold">
                Hillsong: Wonder Tour
              </h1>
              <p className="text-[#EB5757] text-sm md:text-lg pb-2 md:pb-4">
                5 tickets left!
              </p>
            </div>
          </div>

          {/* Event 2 */}
          <div className="w-full md:w-1/3 relative rounded-lg shadow-md md:shadow-none">
            <Image
              src="/topsell2.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-60 md:h-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
              <h1 className="text-white text-lg md:text-2xl font-bold">
                Hamilton the Musical
              </h1>
              <p className="text-[#EB5757] text-sm md:text-lg pb-2 md:pb-4">
                8 tickets left!
              </p>
            </div>
          </div>

          {/* Event 3 */}
          <div className="w-full md:w-1/3 relative rounded-lg shadow-md md:shadow-none">
            <Image
              src="/topsell3.png"
              width={1000}
              height={100}
              alt="example event"
              className="w-full h-60 md:h-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
              <h1 className="text-white text-lg md:text-2xl font-bold">
                Batavia Madrigal Singer
              </h1>
              <p className="text-[#EB5757] text-sm md:text-lg pb-2 md:pb-4">
                11 tickets left!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
