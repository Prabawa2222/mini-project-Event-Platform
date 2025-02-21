import Link from "next/link";
import React from "react";

interface SummaryProps {
  totalQuantity: number;
  totalPrice: number;
  selectedType: string | null;
  eventSlug: string;
  selectedTickets: { [key: string]: number };
}

const TicketSummary: React.FC<SummaryProps> = ({
  totalQuantity,
  totalPrice,
  selectedType,
  eventSlug,
  selectedTickets,
}) => {
  return (
    <div className="bg-indigo-500 text-white p-4 px-5 md:px-20 flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-10">
      {totalQuantity === 0 ? (
        <div className="w-full text-center p-5">
          <p className="text-sm md:text-base">
            Choose your tickets and quantity
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm">Qty</p>
            <p className="text-base md:text-lg font-semibold">
              {totalQuantity}
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm">Type</p>
            <p className="text-base md:text-lg font-semibold">
              {selectedType || "None"}
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm">Price Total (IDR)</p>
            <p className="text-base md:text-lg font-semibold">
              Rp. {totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      )}
      {totalQuantity > 0 && (
        <Link
          href={{
            pathname: `/events/transactions/${eventSlug}/transaction-summary`,
            query: { tickets: JSON.stringify(selectedTickets) },
          }}
        >
          <button className="bg-white text-indigo-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 w-full md:w-auto">
            Buy Tickets
          </button>
        </Link>
      )}
    </div>
  );
};

export default TicketSummary;
