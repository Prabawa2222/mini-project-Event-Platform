import { FaTags, FaTicketAlt, FaUsers } from "react-icons/fa";

interface EventInfoProps {
  event: {
    availableSeats: number;
    category: string;
    description: string;
  };
}

export default function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="w-[1100px] h-[300px] mt-20">
      <h1 className="text-2xl font-semibold mb-9">Event Information</h1>
      <div className="flex justify-between">
        <div className="flex gap-5 bg-white shadow-lg p-5 rounded-lg border border-b-[6px] border-r-4 border-[#4F4CEE] hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <FaTicketAlt className="text-4xl" />
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Ticket Available</h3>
            <span className="text-md text-gray-600">
              {event.availableSeats} left!
            </span>
          </div>
        </div>
        <div className="flex gap-5 bg-white shadow-lg p-5 rounded-xl border border-b-[6px] border-r-4 border-[#4F4CEE] hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <FaTags className="text-4xl" />
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Category</h3>
            <span className="text-md text-gray-600">{event.category}</span>
          </div>
        </div>
        <div className="flex gap-5 bg-white shadow-lg p-5 rounded-xl border border-b-[6px] border-r-4 border-[#4F4CEE] hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <FaUsers className="text-4xl" />
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Platform</h3>
            <span className="text-md text-gray-600">Online</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-20">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p className="text-justify text-lg/7 tracking-wide ">
          {event.description}
        </p>
      </div>
    </div>
  );
}
