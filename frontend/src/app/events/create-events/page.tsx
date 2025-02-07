"use client";

import { useState, useEffect } from "react";
import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import CreateEventForm from "@/components/karcis.com/events/createEventsCard.component";
import CreateTicketCategory from "@/components/karcis.com/events/createTicketsCategories.component";
import FooterCreateEvent from "@/components/karcis.com/UI/footerCreateEvent";

export default function CreateEvents() {
  const [isEventValid, setIsEventValid] = useState(false);
  const [isTicketValid, setIsTicketValid] = useState(false);

  useEffect(() => {
    setIsEventValid(false);
    setIsTicketValid(false);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between">
      <NavbarAfterLogin />
      <div className="flex-1 w-full mt-28">
        <CreateEventForm setIsEventValid={setIsEventValid} />
        <CreateTicketCategory setIsTicketValid={setIsTicketValid} />
      </div>
      <div className="w-full">
        <FooterCreateEvent isDisabled={!isEventValid || !isTicketValid} />
      </div>
    </div>
  );
}
