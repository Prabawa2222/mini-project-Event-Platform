"use client";

import { useState } from "react";
import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import CreateEventForm from "@/components/karcis.com/events/createEventsCard.component";
import { Ticket } from "@/components/karcis.com/events/createTicketsCategories.component";
import FooterCreateEvent from "@/components/karcis.com/UI/footerCreateEvent";
import TicketCategory from "@/components/karcis.com/events/createTicketsCategories.component";

interface EventData {
  eventName: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image?: File;
}

export default function CreateEvents() {
  const [isEventValid, setIsEventValid] = useState(false);
  const [isTicketValid, setIsTicketValid] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleCreateEvent = async () => {
    if (!eventData) {
      console.error("Event data is missing!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name: eventData.eventName, // Sesuaikan nama field
          category: eventData.category,
          startDate: eventData.startDate, // Pastikan format sudah valid
          endDate: eventData.endDate,
          location: eventData.location,
          description: eventData.description,
          organizerId: 1, // Bisa diambil dari state/auth jika dinamis
          ticketTypes: tickets, // Langsung array, tidak pakai JSON.stringify
        })
      );

      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      const eventResponse = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        body: formData,
      });

      if (!eventResponse.ok) throw new Error("Gagal membuat event");

      alert("Event berhasil dibuat!");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between">
      <NavbarAfterLogin />
      <div className="flex-1 w-full mt-28">
        <CreateEventForm
          setIsEventValid={setIsEventValid}
          setEventData={setEventData}
        />
        <TicketCategory
          setIsTicketValid={setIsTicketValid}
          tickets={tickets}
          setTickets={setTickets}
        />
      </div>
      <div className="w-full">
        <FooterCreateEvent
          isDisabled={!isEventValid || !isTicketValid}
          onCreate={handleCreateEvent}
        />
      </div>
    </div>
  );
}
