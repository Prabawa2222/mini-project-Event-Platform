"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/lib/api/events";
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

const EventDashboardOrganizerPage = () => {
  const router = useRouter();
  const { organizerId } = useOrganizer();
  const [searchTerm, setsearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  //const organizerId = "1";

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", organizerId, debouncedSearchTerm, selectedCategory],
    queryFn: () => {
      if (!organizerId) return [];

      if (!debouncedSearchTerm && !selectedCategory) {
        return eventService.getAllEventsByOrganizerId(organizerId as string);
      }

      return eventService.searchOrganizerEvents(
        organizerId as string,
        debouncedSearchTerm || undefined,
        selectedCategory || undefined
      );
    },
  });

  const handleView = (event: EventPreview) => {
    router.push(`/organizer/dashboard/events/${event.slug}`);
  };

  const handleEdit = (event: EventPreview) => {
    router.push(`/organizer/dashboard/events/edit/${event.slug}`);
  };

  const handleDelete = (event: EventPreview) => {
    // Implement delete functionality
    console.log("Delete event:", event);
  };

  return (
    <div className="p-6 space-y-6 w-[980px] mr-16">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
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
          <form className="flex gap-4 mb-6">
            <Input
              placeholder="Search events..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setsearchTerm(e.target.value)}
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Categories</SelectItem>
                <SelectItem value="MUSIC">Music</SelectItem>
                <SelectItem value="SPORTS">Sports</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </form>
          <EventTable
            events={events}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDashboardOrganizerPage;
