import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TicketCardProps {
  href: string;
  price: number;
}

const TicketCard: React.FC<TicketCardProps> = ({ href, price }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBuyTicket = () => {
    if (!session) {
      router.push("/login");
    } else {
      router.push(href);
    }
  };

  return (
    <div className="bg-white shadow-lg h-[150px] rounded-xl p-4 text-center border border-gray-200 max-w-full w-72 md:w-72 hover:border-b-[6px] hover:border-r-4 hover:border-[#4F4CEE]">
      <p className="text-gray-500 text-base md:text-lg">Tickets starting at</p>
      <p className="text-lg md:text-xl font-semibold">
        Rp. {price.toLocaleString()}
      </p>
      <button
        onClick={handleBuyTicket}
        className="mt-3 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg w-full hover:bg-indigo-700"
      >
        Buy Tickets
      </button>
    </div>
  );
};

export default TicketCard;
