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
import { EventPreview } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface EventTableProps {
  events?: EventPreview[];
  isLoading?: boolean;
  onEdit?: (event: EventPreview) => void;
  onDelete?: (event: EventPreview) => void;
  onView?: (event: EventPreview) => void;
}

const EventTable = ({
  events,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: EventTableProps) => {
  //if (isLoading) return <div>Loading....</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Available Seats</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.title}</TableCell>
            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{event.category}</TableCell>
            <TableCell>{event.capacity}</TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView && onView(event)}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit && onEdit(event)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete && onDelete(event)}
              >
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
