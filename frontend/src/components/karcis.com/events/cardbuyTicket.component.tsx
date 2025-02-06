import React from "react";
import Link from "next/link";

interface TicketCardProps {
  href: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ href }) => {
  return (
    <div className="bg-white shadow-lg h-[150px] rounded-xl p-4 text-center border border-gray-200 w-72 hover:border-b-[6px] hover:border-r-4 hover:border-[#4F4CEE]">
      <p className="text-gray-500 text-lg">Tickets starting at</p>
      <p className="text-xl font-semibold">Rp. 212.000</p>
      <Link href={`/events/${href}`} passHref>
        <button className="mt-3 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg w-full hover:bg-indigo-700">
          Buy Tickets
        </button>
      </Link>
    </div>
  );
};

export default TicketCard;
