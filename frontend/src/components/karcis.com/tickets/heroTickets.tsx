import Image from "next/image";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function HeroTickets() {
  return (
    <div className="ml-[120px] flex gap-10">
      <div className="w-[780px] h-[250px]">
        <Image
          src="/banner.png"
          alt="Banner Image"
          layout="responsive"
          width={1500}
          height={250}
          className="object-cover"
        />
      </div>
      <div className="w-[370px] h-[220px] flex flex-col">
        <h1 className="font-semibold text-2xl mb-4">Judul Event</h1>
        <div className="flex items-center gap-4 mb-2 text-gray-600">
          <FaMapMarkerAlt />
          <span>Gelora Bung Karno, Jakarta | Indonesia</span>
        </div>
        <div className="flex items-center gap-4 mb-2 text-gray-600">
          <FaRegCalendarAlt />
          <span>25 Februari 2025</span>
        </div>
        <p className="text-justify mt-3 text-gray-600">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos in quae
          a itaque iste tenetur veniam, aperiam exercitationem illum debitis?
        </p>
      </div>
    </div>
  );
}
