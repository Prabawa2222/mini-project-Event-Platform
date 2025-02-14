import Link from "next/link";
import React from "react";

interface SummaryProps {
  totalQuantity: number;
  totalPrice: number;
  selectedType: string | null;
  eventSlug: string;
  selectedTickets: { [key: string]: number }; // Tambahkan ini
}

const TicketSummary: React.FC<SummaryProps> = ({
  totalQuantity,
  totalPrice,
  selectedType,
  eventSlug,
  selectedTickets, // Tambahkan ini
}) => {
  return (
    <div className="bg-indigo-500 text-white p-4 px-20 flex justify-between items-center w-full">
      {totalQuantity === 0 ? (
        <div className="w-full text-center p-5">
          <p className="text-base">Choose your tickets and quantity</p>
        </div>
      ) : (
        <div className="flex space-x-8 gap-10">
          <div className="text-center">
            <p className="text-sm">Qty</p>
            <p className="text-lg font-semibold">{totalQuantity}</p>
          </div>
          <div className="text-center">
            <p className="text-sm">Type</p>
            <p className="text-lg font-semibold">{selectedType || "None"}</p>
          </div>
          <div className="text-center">
            <p className="text-sm">Price Total (IDR)</p>
            <p className="text-lg font-semibold">
              Rp. {totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      )}
      {totalQuantity > 0 && (
        <Link
          href={{
            pathname: `/events/transactions/${eventSlug}`,
            query: { tickets: JSON.stringify(selectedTickets) },
          }}
        >
          <button className="bg-white text-indigo-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
            Buy Tickets
          </button>
        </Link>
      )}
    </div>
  );
};

export default TicketSummary;
