"use client";

import { useState, useEffect } from "react";
import Card from "../UI/cardEvent";
import Link from "next/link";
import SkeletonCard from "../UI/skeletonCardEvent";

interface Event {
  imageUrl: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  description: string;
  slug: string;
}

export default function EventList({ title = "Upcoming Events" }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:8000/api/events");
        const data = await response.json();

        const formattedEvents = data.map((event: any) => ({
          imageUrl: event.imageUrl || "/events-default.jpg",
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
    <div className="flex justify-center mt-20 md:mt-[170px] my-20 md:my-40">
      <div className="w-full px-4 md:w-[80%] md:px-0 flex flex-col gap-5">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <Link
            href="/events"
            className="text-sm md:text-[13px] text-[#4F4CEE] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Skeleton saat loading */}
        {loading ? (
          <div className="flex justify-center">
            <SkeletonCard />
          </div>
        ) : (
          // Container dengan overflow untuk scrolling di mobile
          <div className="flex gap-5 overflow-x-auto md:overflow-visible whitespace-nowrap scrollbar-hide">
            {events.map((event) => (
              <Card key={event.slug} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
