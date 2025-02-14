"use client";
import { useState, useEffect } from "react";
import Card from "@/components/karcis.com/UI/cardEvent";
import SkeletonCard from "../UI/skeletonCardEvent";

interface Event {
  id: number;
  imageSrc: string;
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
  const skeletonCount = 6; // Menentukan jumlah maksimum skeleton yang tampil

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/events/up-coming"
        );
        const data = await response.json();

        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          imageSrc: event.imageUrl || "/events-default.jpg",
          title: event.name,
          date: new Date(event.startDate).toISOString().split("T")[0],
          location: event.location,
          price: event.price
            ? new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(event.price)
            : "Gratis",
          category: event.category || "General",
          isOnline: event.isOnline || false,
          description: event.description,
          slug: event.slug,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventPrice = parseInt(event.price.replace(/[^\d]/g, ""), 10);

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
    <div className="flex-1 p-6 mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">List Events</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={`${event.id}-${event.slug}`} {...event} />
          ))}
        </div>
      )}
    </div>
  );
}
