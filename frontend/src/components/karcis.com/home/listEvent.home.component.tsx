"use client";
import { useState, useEffect } from "react";
import Card from "../UI/cardEvent";
import Link from "next/link";

interface Event {
  imageSrc: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  isOnline: boolean;
  description: string;
  slug: string; // Tambahkan slug
}

export default function EventList({ title = "Upcoming Events" }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/events/up-coming"
        );
        const data = await response.json();
        const formattedEvents = data.map((event: any) => ({
          imageSrc: event.imageUrl || "/events-default.jpg",
          title: event.name,
          date: new Date(event.startDate).toLocaleDateString(),
          location: event.location,
          price: event.price
            ? new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(event.price)
            : "Gratis",
          category: event.category || "General",
          isOnline: false,
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

  return (
    <div className="flex justify-center mt-[170px] my-40">
      <div className="w-[80%] flex flex-col gap-5">
        {/* Header */}
        <div className="w-full h-[40px] flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Link
            href="/events"
            className="text-[13px] text-[#4F4CEE] hover:underline mr-10 pt-5"
          >
            View All
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : (
          <div className="flex gap-5 overflow-x-auto">
            {events.map((event, index) => (
              <Card key={index} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
