"use client";
import { useState, useEffect } from "react";
import Card from "@/components/karcis.com/UI/cardEvent";
import SkeletonCard from "../UI/skeletonCardEvent";

interface Event {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  isOnline: boolean;
  description: string;
  slug: string;
}

interface ListEventsPageProps {
  selectedCategories: string[];
  selectedLocations: string[];
  priceRange: number[];
  online: boolean;
  searchQuery: string;
  startDate: Date | null;
  endDate: Date | null;
}

export default function ListEventsPage({
  selectedCategories,
  selectedLocations,
  priceRange,
  online,
  searchQuery,
  startDate,
  endDate,
}: ListEventsPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const skeletonCount = 6;

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:8000/api/events/");
        const data = await response.json();

        const formattedEvents = data.map((event: any) => {
          const minPrice = event.ticketTypes?.length
            ? Math.min(...event.ticketTypes.map((ticket: any) => ticket.price))
            : 0;

          return {
            id: event.id,
            imageUrl: event.imageUrl || "/events-default.jpg",
            title: event.name,
            date: new Date(event.startDate).toISOString().split("T")[0],
            location: event.location,
            price: minPrice
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(minPrice)
              : "Gratis",
            category: event.category || "General",
            isOnline: event.isOnline || false,
            description: event.description,
            slug: event.slug,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // **Filtering Data**
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventPrice = parseInt(event.price.replace(/[^\d]/g, ""), 10) || 0;

    const matchesSearchQuery =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());

    const isInDateRange =
      (!startDate || eventDate.getTime() >= startDate.getTime()) &&
      (!endDate || eventDate.getTime() <= endDate.getTime());

    return (
      (selectedCategories.length === 0 ||
        selectedCategories.includes(event.category)) &&
      (selectedLocations.length === 0 ||
        selectedLocations.includes(event.location)) &&
      eventPrice >= priceRange[0] &&
      eventPrice <= priceRange[1] &&
      (online ? event.isOnline : true) &&
      matchesSearchQuery &&
      isInDateRange
    );
  });

  return (
    <div className="flex-1 p-4 sm:p-6 mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">List Events</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card key={`${event.id}-${event.slug}`} {...event} />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              Tidak ada event yang cocok dengan filter yang dipilih.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
