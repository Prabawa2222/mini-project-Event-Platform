import Image from "next/image";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

interface HeroTransactionProps {
  eventData: {
    name: string;
    location: string;
    startDate: string;
    imageUrl: string;
  } | null;
}

// Fungsi untuk memformat tanggal menjadi "DD MMMM YYYY"
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Tanggal Tidak Tersedia";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Tanggal Tidak Valid";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
};

export default function HeroTransaction({ eventData }: HeroTransactionProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-[200px] h-[100px] flex items-center">
        <Image
          src={eventData?.imageUrl || "/banner.png"}
          alt="Banner Image"
          layout="responsive"
          width={1500}
          height={250}
          className="object-cover"
        />
      </div>
      <div className="w-[200px] flex flex-col gap-1">
        <h1 className="text-base">{eventData?.name || "Judul Event"}</h1>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <FaMapMarkerAlt />
          <span>{eventData?.location || "Lokasi Tidak Diketahui"}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <FaRegCalendarAlt />
          <span>{formatDate(eventData?.startDate)}</span>
        </div>
      </div>
    </div>
  );
}
