import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventService } from "@/utils/api/organizer/events";
import { EventPreview } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface EventTableProps {
  events: {
    id: string;
    slug: string;
    title: string;
    date: string;
    location: string;
    category: string;
    capacity: number;
    deleteAt?: string | null;
  }[];
  isLoading: boolean;
  onView?: (event: any) => void;
  onEdit?: (event: any) => void;
  onDelete?: (event: any) => void;
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
            <TableCell>
              {event.deleteAt ? (
                <Badge variant="destructive">Deleted</Badge>
              ) : (
                <Badge variant="default">Active</Badge>
              )}
            </TableCell>
            <TableCell className="space-x-1">
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
                disabled={Boolean(event.deleteAt)}
                className={
                  event.deleteAt ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete && onDelete(event)}
                disabled={Boolean(event.deleteAt)}
                className={
                  event.deleteAt ? "opacity-50 cursor-not-allowed" : ""
                }
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
