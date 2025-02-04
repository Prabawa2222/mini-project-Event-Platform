import {
  CreateEventDto,
  CreateEventPayload,
  EventPreview,
  UpdateEventDTO,
} from "@/types/event";

const API_URL = `${process.env.NEXTAUTH_URL}`;

export const eventService = {
  async createEvent(data: CreateEventPayload): Promise<Event> {
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
        date: data.date,
        ticketTypes: data.ticketTypes,
      })
    );

    const response = await fetch(`http://localhost:5043/api/events`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }
    return response.json();
  },

  async getAllEvents(): Promise<EventPreview[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  },

  async getEventBySlug(slug: string): Promise<Event> {
    const response = await fetch(`${API_URL}/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }
    return response.json();
  },

  async updateEvent(slug: string, eventData: UpdateEventDTO): Promise<Event> {
    const response = await fetch(`${API_URL}/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to update event");
    }
    return response.json();
  },

  async deleteEvent(slug: string): Promise<void> {
    const response = await fetch(`${API_URL}/${slug}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  },

  async searchEvents(searchParams: any): Promise<Event[]> {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(`${API_URL}/search?${queryString}`);
    if (!response.ok) {
      throw new Error("Failed to search events");
    }
    return response.json();
  },

  async getOrganizerEvents(organizerId: number): Promise<Event[]> {
    const response = await fetch(`${API_URL}/organizer/${organizerId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch organizer events");
    }
    return response.json();
  },
};
