"use client";

import { useState, useEffect } from "react";
import HeroTransaction from "./heroTrasaction";
import { EventDetailTransactionProps } from "./eventDetailTransaction.component";

const FinalDetailTransaction: React.FC<EventDetailTransactionProps> = ({
  eventData,
  selectedTickets,
}) => {
  const totalPrice = Object.entries(selectedTickets).reduce(
    (acc, [type, qty]) => {
      const ticket = eventData?.ticketTypes?.find((t) => t.name === type);
      return acc + (ticket ? ticket.price * qty : 0);
    },
    0
  );

  const finalTotal = totalPrice;

  return (
    <div className="w-full md:w-[471px] h-auto flex flex-col gap-2 md:gap-4 px-4 md:px-0">
      <h1 className="text-lg md:text-xl font-semibold text-center md:text-left">
        Event Detail
      </h1>
      <div className="w-full flex justify-center md:justify-start">
        <HeroTransaction eventData={eventData} />
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
      <h1 className="text-lg md:text-xl font-semibold mt-1 text-center md:text-left">
        Ticket Information
      </h1>
      <div className="w-full flex flex-wrap justify-between">
        <p>Ticket Type</p>
        <div className="text-right">
          {Object.entries(selectedTickets).map(([type, qty]) => (
            <p key={type} className="font-semibold">{`${qty} x ${type}`}</p>
          ))}
        </div>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
      <div className="w-full flex flex-col gap-1">
        <p className="font-semibold">Ticket Price</p>
        {Object.entries(selectedTickets).map(([type, qty]) => {
          const ticket = eventData?.ticketTypes?.find((t) => t.name === type);
          return ticket ? (
            <div key={type} className="flex flex-wrap justify-between">
              <p>{`${qty} x ${type}`}</p>
              <p className="font-semibold">
                Rp. {(ticket.price * qty).toLocaleString()}
              </p>
            </div>
          ) : null;
        })}
      </div>

      <div className="w-full flex flex-wrap justify-between mt-4">
        <p>Admin Fee</p>
        <p className="font-semibold">-</p>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
      <div className="w-full flex flex-wrap justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">Rp. {finalTotal.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FinalDetailTransaction;
