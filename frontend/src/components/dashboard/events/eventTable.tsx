import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventService } from "@/lib/api/events";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface EventTableProps {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onView: (event: Event) => void;
}

const events = [
  {
    id: "1",
    title: "Tech Conference 2025",
    date: "2025-04-15T10:00:00Z",
    location: "San Francisco, CA",
    capacity: 500,
    status: "Upcoming",
  },
  {
    id: "2",
    title: "React Summit",
    date: "2025-02-20T09:00:00Z",
    location: "New York, NY",
    capacity: 300,
    status: "Ongoing",
  },
  {
    id: "3",
    title: "AI & Machine Learning Expo",
    date: "2024-12-10T11:30:00Z",
    location: "Los Angeles, CA",
    capacity: 800,
    status: "Completed",
  },
  {
    id: "4",
    title: "Cybersecurity Workshop",
    date: "2025-06-05T14:00:00Z",
    location: "Austin, TX",
    capacity: 200,
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Blockchain Meetup",
    date: "2025-01-12T16:00:00Z",
    location: "Seattle, WA",
    capacity: 150,
    status: "Canceled",
  },
];

const EventTable = ({ onEdit, onDelete, onView }: EventTableProps) => {
  // const { data: events, isLoading } = useQuery({
  //   queryKey: ["events"],
  //   queryFn: eventService.getAllEvents,
  // });

  //if (isLoading) return <div>Loading....</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.title}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{event.capacity}</TableCell>
            <TableCell>{event.status}</TableCell>
            <TableCell className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => onView(event)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventTable;
