"use client";

import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import EventDetailTransaction from "@/components/karcis.com/transactions/eventDetailTransaction.component";
import FormTransaction from "@/components/karcis.com/transactions/formTransaction";
import BackButton from "@/components/karcis.com/UI/buttonBack";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Transactions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = useParams();
  const ticketsQuery = searchParams.get("tickets");
  const selectedTickets = ticketsQuery ? JSON.parse(ticketsQuery) : {};

  // Tambahkan state untuk eventData
  const [eventData, setEventData] = useState<{
    name: string;
    location: string;
    startDate: string;
    imageUrl: string;
    ticketTypes: { name: string; price: number }[];
  } | null>(null);

  // Fetch event data berdasarkan slug
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/${slug}`
        );
        const data = await response.json();
        setEventData(data.event || data);
      } catch (error) {
        console.error("Failed to fetch event data", error);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const handleProceed = () => {
    if (!selectedTickets.id) {
      alert("Please select a ticket before proceeding.");
      return;
    }

    const ticketsData = JSON.stringify(selectedTickets);
    router.push(
      `/transaction-summary?tickets=${encodeURIComponent(ticketsData)}`
    );
  };

  return (
    <div>
      <NavbarAfterLogin />
      <div className="w-[80%] min-h-screen flex flex-col mx-auto mt-40 gap-10">
        <div className="w-[50%] h-[50px] flex items-center gap-16">
          <BackButton href={`/events/${slug}`} />
          <span className="text-3xl font-semibold">
            Buyer Contact Information
          </span>
        </div>

        <div className="w-full h-[50px] ml-28 flex flex-col gap-10">
          <div className="w-full h-16 flex gap-[93px]">
            <div className="w-[628px] h-16 bg-[#4F4CEE] flex items-center bg-opacity-10 p-9">
              <p className="w-4/5 text-sm text-[#4F4CEE]">
                E-tickets will be sent to your email address, please make sure
                your email address is correct
              </p>
            </div>
            {eventData && (
              <EventDetailTransaction
                eventData={eventData}
                selectedTickets={selectedTickets}
              />
            )}
          </div>

          <div className="w-[655px] h-16">
            <FormTransaction selectedTickets={selectedTickets} />
          </div>
        </div>
      </div>
    </div>
  );
}
