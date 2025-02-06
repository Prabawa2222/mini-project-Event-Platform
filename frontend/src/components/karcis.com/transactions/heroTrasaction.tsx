import Image from "next/image";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function HeroTransaction() {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-[200px] h-[100px] flex items-center">
        <Image
          src="/banner.png"
          alt="Banner Image"
          layout="responsive"
          width={1500}
          height={250}
          className="object-cover"
        />
      </div>
      <div className="w-[200px] flex flex-col gap-1">
        <h1 className="text-base">Judul Event</h1>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <FaMapMarkerAlt />
          <span>Gelora Bung Karno, Jakarta</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <FaRegCalendarAlt />
          <span>25 Februari 2025</span>
        </div>
      </div>
    </div>
  );
}
