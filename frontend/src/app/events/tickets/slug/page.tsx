"use client";

import { useState } from "react";
import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import TicketCardTransaction from "@/components/karcis.com/tickets/cardTicket.component";
import TicketSummary from "@/components/karcis.com/tickets/footerTicket";
import HeroTickets from "@/components/karcis.com/tickets/heroTickets";
import BackButton from "@/components/karcis.com/UI/buttonBack";
import SortButton from "@/components/karcis.com/UI/buttonSortby";

const ticketOptions = [
  { name: "Paket VIP", price: 371000 },
  { name: "Paket Reguler", price: 150000 },
  { name: "Paket Eksekutif", price: 500000 },
];

export default function getEventBySlug() {
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});
  const [sortedTickets, setSortedTickets] = useState(ticketOptions);

  const handleQuantityChange = (name: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [name]: quantity,
    }));
  };

  const totalQuantity = Object.values(selectedTickets).reduce(
    (acc, qty) => acc + qty,
    0
  );
  const totalPrice = Object.entries(selectedTickets).reduce(
    (acc, [name, qty]) => {
      const ticket = ticketOptions.find((t) => t.name === name);
      return acc + (ticket ? ticket.price * qty : 0);
    },
    0
  );

  const selectedTypes =
    Object.entries(selectedTickets)
      .filter(([name, qty]) => qty > 0)
      .map(([name, qty]) => `${name} x${qty}`)
      .join(", ") || "None";

  // Sorting function
  const handleSort = (order: string) => {
    const sorted = [...ticketOptions].sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setSortedTickets(sorted);
  };

  return (
    <div>
      <NavbarAfterLogin />
      <div className="w-[80%] min-h-screen flex flex-col mx-auto mt-40 gap-10">
        <div className="w-[30%] h-[50px] flex items-center gap-16">
          <BackButton href="/events/:slug" />
          <span className="text-3xl font-semibold">Ticket Options</span>
        </div>
        <div className="w-[1304px] h-[250px]">
          <HeroTickets />
        </div>
        <div className="border border-b-1 border-[#4F4CEE] border-opacity-20 mt-20">
          <hr />
        </div>
        <h1 className="flex justify-center text-2xl font-semibold">
          Tickets Type
        </h1>
        <div className="w-full h-auto flex flex-col gap-10">
          <div className="flex justify-end">
            <SortButton onSort={handleSort} />
          </div>
          <div className="w-full h-auto flex flex-wrap justify-center gap-6">
            {sortedTickets.map((ticket, index) => (
              <TicketCardTransaction
                key={index}
                ticket={{ ...ticket, onQuantityChange: handleQuantityChange }}
              />
            ))}
          </div>
        </div>
      </div>

      <TicketSummary
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        selectedType={selectedTypes}
      />
    </div>
  );
}
