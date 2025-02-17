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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Attendees for {event?.name || "Event"}
        </h1>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/organizer/dashboard/events/${eventSlug}`)
          }
        >
          Back to Event Details
        </Button>
      </div>
      <AttendeeList data={attendeesData.data} total={attendeesData.total} />
    </div>
  );
};

export default EventAttendeesPage;
