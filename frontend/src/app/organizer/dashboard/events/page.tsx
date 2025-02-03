"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
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
} from "@radix-ui/react-select";
import EventTable from "@/components/dashboard/events/eventTable";

const EventDashboardOrganizerPage = () => {
  //const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  //fetch events with react query
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventService.getAllEvents,
  });

  // delete

  const categories = ["Sport", "Music"];

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
            <Input placeholder="Search events..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
          <EventTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDashboardOrganizerPage;
