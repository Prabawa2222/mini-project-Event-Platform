"use client";

import { eventService } from "@/lib/api/events";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const EventDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="p-6 space-y-6 w-[980px] mr-16">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Event Details</CardTitle>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/organizer/dashboard/events/edit/${event.slug}`)
              }
            >
              Edit Event
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/organizer/dashboard/events")}
            >
              Back to Events
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>
                  <Image
                    src={event.imageUrl}
                    className="w-full"
                    alt="image-event"
                    width={100}
                    height={100}
                  />
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableCell>{event.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableCell>
                  {new Date(event.startDate).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>End Date</TableHead>
                <TableCell>
                  {new Date(event.endDate).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableCell>{event.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableCell>{event.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Available Seats</TableHead>
                <TableCell>{event.availableSeats}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableCell>{event.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ticket Type:</TableHead>
                <TableCell colSpan={2}>
                  {event.ticketTypes.map((ticket) => (
                    <div key={ticket.id}>
                      <strong>{ticket.name}</strong>: ${ticket.price} (
                      {ticket.quantity} available)
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetailsPage;
