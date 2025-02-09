import {
  CreateEventDto,
  CreateEventPayload,
  EventPreview,
  UpdateEventDTO,
  EventFormData,
} from "@/types/event";

export const eventService = {
  async createEvent(data: CreateEventPayload): Promise<EventFormData> {
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

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
      method: "POST",
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
    organizerId: string
  ): Promise<EventPreview[]> {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/events/organizer?organizerId=${organizerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response);

    const data = await response.json();
    console.log("Parsed Data:", data);

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return data;
  },

  async searchOrganizerEvents(
    organizerId: string,
    name?: string,
    category?: string
  ) {
    const params = new URLSearchParams();
    if (name && name.trim()) {
      params.append("name", name.trim());
    }
    if (category && category.trim()) {
      params.append("category", category.trim());
    }

    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL
      }/api/events/organizer/${organizerId}/events/search?${params.toString()}`
    );
    console.log("Calling API with URL:", response);

    if (!response.ok) {
      throw new Error("Failed to search events");
    }

    return response.json();
  },

  async getEventBySlug(slug: string): Promise<EventFormData> {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/events/${slug}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }
    return response.json();
  },

  async updateEvent(slug: string, eventData: UpdateEventDTO): Promise<Event> {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/events/${slug}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update event");
    }
    return response.json();
  },

  async deleteEvent(slug: string): Promise<void> {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/${slug}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  },

  async searchEvents(searchParams: any): Promise<Event[]> {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/search?${queryString}`
    );
    if (!response.ok) {
      throw new Error("Failed to search events");
    }
    return response.json();
  },

  async getOrganizerEvents(organizerId: number): Promise<Event[]> {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/organizer/${organizerId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch organizer events");
    }
    return response.json();
  },
};
