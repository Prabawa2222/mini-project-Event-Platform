"use client";

import Image from "next/image";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Event {
  name: string;
  location: string;
  startDate: string;
  description: string;
  imageUrl?: string;
}

export default function HeroTickets() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/${slug}`
        );
        if (!response.ok) throw new Error("Failed to fetch event");
        const data: Event = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [slug]);

  if (!event) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 md:ml-[120px] ml-4 mt-6 md:mt-0 items-center md:items-start">
      {/* Gambar dengan ukuran responsif */}
      <div className="w-full md:w-[780px] h-[250px] relative">
        <Image
          src={event.imageUrl || "/banner.png"}
          alt={event.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Informasi Event */}
      <div className="w-full md:w-[370px] h-auto flex flex-col text-center md:text-left">
        <h1 className="font-semibold text-2xl mb-4">{event.name}</h1>
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-gray-600">
          <FaMapMarkerAlt />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-gray-600">
          <FaRegCalendarAlt />
          <span>
            {new Date(event.startDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="text-justify mt-3 text-gray-600 px-2 md:px-0">
          {event.description.split(" ").slice(0, 30).join(" ")}
        </p>
      </div>
    </div>
  );
}
