"use client";

import { useState, useEffect } from "react";
import HeroTransaction from "./heroTrasaction";
import { formatCurrency } from "@/lib/utils";

export interface EventDetailTransactionProps {
  eventData: {
    name: string;
    location: string;
    startDate: string;
    imageUrl: string;
    ticketTypes: { name: string; price: number }[];
  } | null;
  selectedTickets: { [key: string]: number };
}

const EventDetailTransaction: React.FC<EventDetailTransactionProps> = ({
  eventData,
  selectedTickets,
}) => {
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);

  useEffect(() => {
    const savedVoucherCode = localStorage.getItem("");
    if (savedVoucherCode) {
      setVoucherCode(savedVoucherCode);
      applyVoucher(savedVoucherCode);
    }
  }, []);

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const applyVoucher = (code: string) => {
    if (code === "DISCOUNT10") {
      setVoucherDiscount(0.1);
    } else {
      setVoucherDiscount(0);
    }
    localStorage.setItem("voucherCode", code);
  };

  const totalPrice = Object.entries(selectedTickets).reduce(
    (acc, [type, qty]) => {
      const ticket = eventData?.ticketTypes?.find((t) => t.name === type);
      return acc + (ticket ? ticket.price * qty : 0);
    },
    0
  );

  const finalTotal = totalPrice - totalPrice * voucherDiscount;

  return (
    <div className="w-[471px] h-[500px] flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Event Detail</h1>
      <div className="w-full px-4 flex justify-start">
        <HeroTransaction eventData={eventData} />
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
      <h1 className="text-xl font-semibold mt-1">Ticket Information</h1>
      <div className="w-full px-4 flex justify-between">
        <p>Ticket Type</p>
        <div className="text-right">
          {Object.entries(selectedTickets).map(([type, qty]) => (
            <p key={type} className="font-semibold">{`${qty} x ${type}`}</p>
          ))}
        </div>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
      <div className="w-full px-4 flex flex-col gap-1">
        <p className="font-semibold">Ticket Price</p>
        {Object.entries(selectedTickets).map(([type, qty]) => {
          const ticket = eventData?.ticketTypes?.find((t) => t.name === type);
          return ticket ? (
            <div key={type} className="flex justify-between">
              <p>{`${qty} x ${type}`}</p>
              <p className="font-semibold">
                {formatCurrency(ticket.price * qty).toLocaleString()}
              </p>
            </div>
          ) : null;
        })}
      </div>
      {/* Voucher Input */}
      <div className="w-full px-4 py-4 bg-gray-100 rounded-lg mt-4 flex flex-col gap-2">
        <label className="text-sm font-semibold">Voucher Code</label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={voucherCode}
            onChange={handleVoucherChange}
            placeholder="Enter voucher code"
            className="w-full border-2 border-[#7F7DF3] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F7DF3] placeholder-gray-400"
          />
          <button
            onClick={() => applyVoucher(voucherCode)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Apply
          </button>
        </div>
        {voucherDiscount > 0 && (
          <div className="text-sm text-green-600 mt-2">
            Voucher Applied: - Rp.{" "}
            {(totalPrice * voucherDiscount).toLocaleString()}
          </div>
        )}
      </div>
      <div className="w-full px-4 flex justify-between mt-4">
        <p>Admin Fee</p>
        <p className="font-semibold">-</p>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
      <div className="w-full px-4 flex justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">Rp. {finalTotal.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default EventDetailTransaction;
