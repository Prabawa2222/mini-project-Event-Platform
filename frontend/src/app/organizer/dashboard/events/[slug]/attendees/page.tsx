"use client";

import { eventService } from "@/utils/api/organizer/events";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import AttendeeList from "@/components/dashboard/events/attendeeList";

const EventAttendeesPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  const { data: event } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
  });

  const { data: attendeesData, isLoading } = useQuery({
    queryKey: ["eventAttendees", eventSlug],
    queryFn: () => eventService.getEventAttendees(eventSlug),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!attendeesData) {
    return <div>No attendees found</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full max-w-[980px] mx-auto px-2 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl md:text-2xl font-bold break-words">
          Attendees for {event?.name || "Event"}
        </h1>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/organizer/dashboard/events/${eventSlug}`)
          }
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Back to Event Details
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <AttendeeList data={attendeesData.data} total={attendeesData.total} />
      </div>
    </div>
  );
};

export default EventAttendeesPage;
