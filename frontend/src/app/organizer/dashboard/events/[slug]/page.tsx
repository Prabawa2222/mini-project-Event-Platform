"use client";

import { eventService } from "@/utils/api/organizer/events";
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
import {
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  TagIcon,
  TicketIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EventData } from "@/types/event";

const EventDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => eventService.getEventBySlug(eventSlug),
  });

  const { data: attendeesData } = useQuery({
    queryKey: ["eventAttendees", eventSlug],
    queryFn: () => eventService.getEventAttendees(eventSlug),
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
                <TableCell colSpan={2} className="p-5">
                  <Image
                    src={event.imageUrl}
                    className="w-full h-[400px] object-cover rounded-lg shadow-md"
                    alt="image-event"
                    width={980}
                    height={400}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableCell className="font-medium text-lg">
                  {event.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableCell className="text-gray-600">
                  {event.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Event Details</TableHead>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        Starts: {new Date(event.startDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        Ends: {new Date(event.endDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      <span>{event.category}</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ticket Types</TableHead>
                <TableCell>
                  <div className="grid grid-cols-2 gap-4">
                    {event.ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TicketIcon className="w-4 h-4" />
                          <span className="font-medium">{ticket.name}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="text-green-600 font-medium">
                            ${ticket.price}
                          </div>
                          <div className="text-gray-600">
                            {ticket.quantity} available
                          </div>
                          {ticket.description && (
                            <div className="text-gray-500">
                              {ticket.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Promotions</TableHead>
                <TableCell>
                  {event.promotions && event.promotions.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {event.promotions.map((promo) => (
                        <div
                          key={promo.id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-lg">
                                {promo.discount}% OFF
                              </span>
                              <Badge variant="outline">{promo.code}</Badge>
                            </div>
                            <div className="text-sm space-y-1 text-gray-600">
                              <div>
                                Valid from: {formatDate(promo.startDate)}
                              </div>
                              <div>
                                Valid until: {formatDate(promo.endDate)}
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        (promo.currentUses / promo.maxUses) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <div className="text-sm mt-1">
                                  {promo.currentUses} of {promo.maxUses} used
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No promotions available</p>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Reviews</TableHead>
                <TableCell>
                  {event.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {event.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, index) => (
                                <StarIcon
                                  key={index}
                                  className={`w-4 h-4 ${
                                    index < review.rating
                                      ? "fill-yellow-400"
                                      : "fill-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet</p>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableRow>
              <TableHead>Attendees ({attendeesData?.total || 0})</TableHead>
              <TableCell>
                {attendeesData?.data && attendeesData.data.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {attendeesData.data.map((attendee) => (
                      <div
                        key={`${attendee.userId}-${attendee.ticketType}`}
                        className="bg-gray-50 p-4 rounded-lg flex items-center gap-4"
                      >
                        <h1>{attendee.name.charAt(0)}</h1>
                        <div className="flex-1">
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-gray-500">
                            {attendee.ticketType} • {attendee.quantity}{" "}
                            ticket(s)
                          </div>
                          <div className="text-xs text-gray-400">
                            Purchased: {formatDate(attendee.purchaseDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No attendees yet</p>
                )}
              </TableCell>
            </TableRow>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetailsPage;
