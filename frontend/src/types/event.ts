export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  eventId: number;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  startDate: Date;
  endDate: Date;
  availableSeats: number;
  category: string;
  slug: string;
  organizerId: number;
  deletedAt?: Date;
  ticketTypes: TicketType[];
  organizer?: {
    id: number;
    name: string;
  };
}

export interface EventPreview {
  name: string;
  price: number;
  description: string;
  startDate: Date;
  category: string;
  location: string;
}

export interface CreateEventDto {
  name: string;
  description: string;
  location: string;
  date: string;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[];
  image: File;
}

export interface UpdateEventDTO {
  name?: string;
  description?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  location?: string;
  ticketTypes?: {
    name: string;
    price: number;
    quantity: number;
  }[];
}
