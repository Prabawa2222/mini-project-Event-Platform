import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function DetailEvent() {
  return (
    <div className="w-[550px] h-[200px] flex flex-col gap-2">
      <h1 className="font-semibold text-3xl">Judul Event</h1>
      <div className="flex items-center gap-4">
        <FaMapMarkerAlt />
        <span>Gelora Bung Karno, Jakarta | Indonesia</span>
      </div>
      <div className="flex items-center gap-4">
        <FaRegCalendarAlt />
        <span>25 Februari 2025</span>
      </div>
      <p className="text-[#1B1B25] text-justify mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
        tempora laborum excepturi ad quis necessitatibus recusandae est,
        suscipit odit itaque aut sit iste voluptas quos. Perferendis tempora
        nulla a fugit.
      </p>
    </div>
  );
}
