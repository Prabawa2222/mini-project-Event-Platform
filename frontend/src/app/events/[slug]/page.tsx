"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/karcis.com/common/Footer";
import Navbar from "@/components/karcis.com/common/Navbar";
import Banner from "@/components/karcis.com/events/banner.component";
import BuyTicketCard from "@/components/karcis.com/events/cardbuyTicket.component";
import DetailEvent from "@/components/karcis.com/events/detailEvent.component";
import EventInfo from "@/components/karcis.com/events/eventInfo.component";
import ShareButtons from "@/components/karcis.com/events/socmedShare.component";
import BackButton from "@/components/karcis.com/UI/buttonBack";

interface EventType {
  imageUrl: string;
  price: number;
  name: string;
  location: string;
  startDate: string;
  description: string;
  availableSeats: number;
  category: string;
}

interface Transaction {
  id: number;
  totalPrice: number;
}

export default function GetEventBySlug() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop(); // Ambil slug dari URL
  const [event, setEvent] = useState<EventType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:8000/api/events/${slug}`)
      .then((res) => res.json())
      .then((data: EventType) => setEvent(data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [slug]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="w-[80%] min-h-screen flex mx-auto mt-40 gap-10">
        <div className="w-[5%]">
          <ShareButtons />
        </div>
        <div className="w-[86%]">
          <div className="mb-4">
            <BackButton href="/events" />
          </div>
          <Banner imageUrl={event.imageUrl} />
          <div className="w-[1100px] mt-20 flex justify-between">
            <DetailEvent event={event} />
            <BuyTicketCard
              price={event.price}
              href={`/events/tickets/${slug}`}
            />
          </div>
          <EventInfo event={event} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
