import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

interface EventDetailsProps {
  event: {
    name: string;
    location: string;
    startDate: string | Date;
    description: string;
  };
}

export default function DetailEvent({ event }: EventDetailsProps) {
  const shortDescription =
    event.description.split(" ").slice(0, 20).join(" ") + "..."; // Menampilkan 10 kata pertama

  return (
    <div className="w-[550px] h-[200px] flex flex-col gap-2">
      <h1 className="font-semibold text-3xl">{event.name}</h1>
      <div className="flex items-center gap-4">
        <FaMapMarkerAlt />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center gap-4">
        <FaRegCalendarAlt />
        <span>{new Date(event.startDate).toLocaleDateString()}</span>
      </div>
      <p className="text-[#1B1B25] text-justify mt-3 mb-10">
        {shortDescription}
      </p>
    </div>
  );
}
