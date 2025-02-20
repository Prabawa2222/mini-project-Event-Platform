"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/utils/api/organizer/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventTable from "@/components/dashboard/events/eventTable";
import { EventPreview } from "@/types/event";
import { useOrganizer } from "@/context/organizer/OrganizerContext";
import { useDebounce } from "use-debounce";
import { toast } from "@/hooks/use-toast";
import { EVENT_CATEGORIES } from "@/lib/utils";
import { EventTableSkeleton } from "@/components/ui/eventSkeleton";

const EventDashboardOrganizerPage = () => {
  const router = useRouter();
  const { organizerId } = useOrganizer();
  console.log("Current organizerId:", organizerId);
  const queryClient = useQueryClient();
  const [searchTerm, setsearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  //const organizerId = "1";

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", organizerId, debouncedSearchTerm, selectedCategory],
    queryFn: () => {
      console.log("QueryFn executing with:", {
        organizerId,
        debouncedSearchTerm,
        selectedCategory,
      });

      if (!organizerId) {
        console.log("No organizerId provided, returning empty array");
        return [];
      }

      if (!debouncedSearchTerm && !selectedCategory) {
        console.log(
          "Fetching all events for organizerId:",
          Number(organizerId)
        );
        return eventService.getAllEventsByOrganizerId(Number(organizerId));
      }

      console.log("Searching events with:", {
        organizerId,
        searchTerm: debouncedSearchTerm || undefined,
        category: selectedCategory || undefined,
      });

      return eventService.searchOrganizerEvents(
        organizerId,
        debouncedSearchTerm || undefined,
        selectedCategory || undefined
      );
    },
    retry: 1,
    staleTime: 30000,
  });
  console.log("Events data received:", events);

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => eventService.deleteEvent(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Event Deleted",
        description: "the event has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleView = (event: EventPreview) => {
    router.push(`/organizer/dashboard/events/${event.slug}`);
  };

  const handleEdit = (event: EventPreview) => {
    if (event.deletedAt) return;
    router.push(`/organizer/dashboard/events/edit/${event.slug}`);
  };

  const handleDelete = async (event: EventPreview) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(event.slug);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full max-w-[980px] mx-auto px-2 md:px-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Events Management
          </CardTitle>
          <Button
            onClick={() => router.push("/organizer/dashboard/events/create")}
          >
            Create Event
          </Button>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
            <Input
              placeholder="Search events..."
              className="w-full sm:max-w-sm"
              value={searchTerm}
              onChange={(e) => setsearchTerm(e.target.value)}
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
          {isLoading ? (
            <EventTableSkeleton />
          ) : !events || events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 text-lg">No events found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filters"
                  : "Create your first event to get started"}
              </p>
            </div>
          ) : (
            <EventTable
              events={events}
              isLoading={isLoading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDashboardOrganizerPage;
