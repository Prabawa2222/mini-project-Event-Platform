"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TicketCardTransaction from "@/components/karcis.com/tickets/cardTicket.component";
import TicketSummary from "@/components/karcis.com/tickets/footerTicket";
import HeroTickets from "@/components/karcis.com/tickets/heroTickets";
import BackButton from "@/components/karcis.com/UI/buttonBack";
import SortButton from "@/components/karcis.com/UI/buttonSortby";
import Navbar from "@/components/karcis.com/common/Navbar";

interface TicketOption {
  id: number;
  name: string;
  price: number;
}

export default function getEventTicketBySlug() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [tickets, setTickets] = useState<TicketOption[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});
  const [sortedTickets, setSortedTickets] = useState<TicketOption[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    if (!slug) return;

    fetch(`http://localhost:8000/api/events/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.ticketTypes);
        setSortedTickets(data.ticketTypes);
      })
      .catch((err) => console.error("Error fetching tickets:", err));
  }, [slug, session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

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
      const ticket = tickets.find((t) => t.name === name);
      return acc + (ticket ? ticket.price * qty : 0);
    },
    0
  );

  const selectedTypes =
    Object.entries(selectedTickets)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => `${name} x${qty}`)
      .join(", ") || "None";

  const handleSort = (order: string) => {
    const sorted = [...tickets].sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price
    );
    setSortedTickets(sorted);
  };

  return (
    <div>
      <Navbar />
      <div className="w-full md:w-[80%] min-h-screen flex flex-col mx-auto mt-40 gap-6 md:gap-10 px-4 md:px-0">
        <div className="w-full md:w-[30%] h-[50px] flex flex-col md:flex-row items-center gap-4 md:gap-16">
          <BackButton href="/events" />
          <span className="text-2xl md:text-3xl font-semibold text-center md:text-left">
            Ticket Options
          </span>
        </div>
        <div className="w-full h-auto">
          <HeroTickets />
        </div>
        <div className="border border-b-1 border-[#4F4CEE] border-opacity-20 mt-10 md:mt-20">
          <hr />
        </div>
        <h1 className="flex justify-center text-xl md:text-2xl font-semibold">
          Tickets Type
        </h1>

        <div className="w-full h-auto flex flex-col gap-6 md:gap-10">
          <div className="flex justify-center md:justify-end">
            <SortButton onSort={handleSort} />
          </div>
          <div className="w-full h-auto flex flex-wrap justify-center gap-6">
            {sortedTickets.map((ticket) => (
              <TicketCardTransaction
                key={ticket.id}
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
        eventSlug={slug}
        selectedTickets={selectedTickets}
      />
    </div>
  );
}
