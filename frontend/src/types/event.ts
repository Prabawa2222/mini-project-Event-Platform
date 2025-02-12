export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  eventId: number;
  description: string;
}

export interface Review {
  id: number;
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventFormData {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  startDate: string;
  endDate: string;
  imageUrl: string;
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
  reviews?: Review[];
  promotions?: {
    discount: number;
    startDate: string;
    endDate: string;
    maxUses?: number;
  }[];
}

export interface EventDetails extends EventFormData {
  reviews: Review[];
}

export interface EventPreview {
  name: string;
  slug: string;
  price: number;
  description: string;
  startDate: Date;
  category: string;
  location: string;
  deletedAt?: Date;
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
  image?: File;
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

export interface CreateEventPayload {
  organizerId: number;
  name: string;
  description: string;
  location: string;
  startDate?: Date;
  endDate?: Date;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[];
  image?: File;
  category: string;
}
