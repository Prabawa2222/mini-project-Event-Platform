import {
  CreateEventDto,
  CreateEventPayload,
  EventPreview,
  UpdateEventDTO,
  EventFormData,
  EventDetails,
  AttendeesResponse,
} from "@/types/event";
import { getSession } from "next-auth/react";
import { fetchWithAuth } from "../auth";

export const eventService = {
  async createEvent(data: CreateEventPayload): Promise<EventFormData> {
    const session = await getSession();
    const formData = new FormData();

    if (data.image) {
      formData.append("image", data.image);
    }

    formData.append(
      "data",
      JSON.stringify({
        organizerId: data.organizerId,
        name: data.name,
        description: data.description,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        ticketTypes: data.ticketTypes,
        category: data.category,
      })
    );

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(`Failed to create event: ${errorText}`);
    }
    return response.json();
  },

  async getAllEventsByOrganizerId(
    organizerId: number
  ): Promise<EventPreview[]> {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API}/api/events/organizer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ organizerId }),
        }
      );

      console.log("Full response object:", response);
      if (!(response instanceof Response)) {
        return response;
      }
      const data = await response.json();
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error("Error in getAllEventsByOrganizerId:", error);
      throw error;
    }
  },

  async searchOrganizerEvents(
    organizerId: string,
    name?: string,
    category?: string
  ) {
    const params = new URLSearchParams();
    if (name?.trim()) {
      params.append("name", name.trim());
    }
    if (category?.trim()) {
      params.append("category", category.trim());
    }

    return fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API
      }/api/events/organizer/${organizerId}/events/search?${params.toString()}`
    );
  },

  async getEventBySlug(slug: string): Promise<EventDetails> {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/api/events/${slug}`);
  },

  async getEventAttendees(slug: string): Promise<AttendeesResponse> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/events/${slug}/attendees`
    );
  },

  async updateEvent(slug: string, eventData: UpdateEventDTO): Promise<Event> {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/api/events/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(slug: string): Promise<void> {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/api/events/${slug}`, {
      method: "DELETE",
    });
  },

  async searchEvents(searchParams: any): Promise<Event[]> {
    const queryString = new URLSearchParams(searchParams).toString();
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/events/search?${queryString}`
    );
  },

  async getOrganizerEvents(organizerId: number): Promise<Event[]> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/events/organizer/${organizerId}`
    );
  },
};
