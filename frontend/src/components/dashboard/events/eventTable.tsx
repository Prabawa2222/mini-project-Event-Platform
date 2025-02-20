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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";

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
  const [eventToDelete, setEventToDelete] = useState<any>(null);

  const handleDelete = () => {
    if (eventToDelete && onDelete) {
      onDelete(eventToDelete);
      setEventToDelete(null);
    }
  };
  if (isLoading) return <div>Loading....</div>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] md:w-auto">Title</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">
              Available Seats
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                <div>
                  {event.title}
                  {/* Mobile-only info */}
                  <div className="md:hidden space-y-1 mt-1 text-sm text-gray-500">
                    <div>{new Date(event.date).toLocaleDateString()}</div>
                    <div>{event.location}</div>
                    <div>{event.category}</div>
                    <div>Seats: {event.capacity}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(event.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {event.location}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {event.category}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {event.capacity}
              </TableCell>
              <TableCell>
                {event.deleteAt ? (
                  <Badge variant="destructive" className="whitespace-nowrap">
                    Deleted
                  </Badge>
                ) : (
                  <Badge variant="default" className="whitespace-nowrap">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView && onView(event)}
                    className="whitespace-nowrap"
                  >
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={Boolean(event.deleteAt)}
                        className={`px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 ${
                          event.deleteAt ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => setEventToDelete(event)}
                      >
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{event.title}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setEventToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventTable;
