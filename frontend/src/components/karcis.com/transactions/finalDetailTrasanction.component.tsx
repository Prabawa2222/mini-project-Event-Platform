"use client";

import { useState, useEffect } from "react";
import HeroTransaction from "./heroTrasaction";
import { EventDetailTransactionProps } from "./eventDetailTransaction.component";

const FinalDetailTransaction: React.FC<EventDetailTransactionProps> = ({
  eventData,
  selectedTickets,
}) => {
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);

  useEffect(() => {
    const savedVoucherCode = localStorage.getItem("voucherCode");
    if (savedVoucherCode) {
      setVoucherCode(savedVoucherCode);
      applyVoucher(savedVoucherCode);
    }
  }, []);

  const applyVoucher = (code: string) => {
    if (code === "DISCOUNT10") {
      setVoucherDiscount(0.1);
    } else {
      setVoucherDiscount(0);
    }
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
                Rp. {(ticket.price * qty).toLocaleString()}
              </p>
            </div>
          ) : null;
        })}
      </div>

      {/* Voucher Display */}
      {voucherDiscount > 0 && (
        <div className="w-full px-3 py-2 bg-green-100 rounded-md flex flex-col gap-1 text-xs">
          <label className="font-semibold text-green-700">
            Voucher Applied
          </label>
          <div className="flex justify-between items-center">
            <p className="text-green-700 font-medium">{voucherCode}</p>
            <p className="text-green-700">
              - Rp. {(totalPrice * voucherDiscount).toLocaleString()}
            </p>
          </div>
        </div>
      )}

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

export default FinalDetailTransaction;
