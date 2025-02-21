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
    event.description.split(" ").slice(0, 20).join(" ") + "..."; // Menampilkan 20 kata pertama

  return (
    <div className="max-w-full md:w-[550px] h-auto flex flex-col gap-2 px-4 md:px-0">
      <h1 className="font-semibold text-2xl md:text-3xl">{event.name}</h1>
      <div className="flex items-center gap-2 md:gap-4">
        <FaMapMarkerAlt />
        <span className="text-sm md:text-base">{event.location}</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <FaRegCalendarAlt />
        <span className="text-sm md:text-base">
          {new Date(event.startDate).toLocaleDateString()}
        </span>
      </div>
      <p className="text-[#1B1B25] text-justify mt-3 md:mt-3 mb-6 md:mb-10 text-sm md:text-base">
        {shortDescription}
      </p>
    </div>
  );
}
