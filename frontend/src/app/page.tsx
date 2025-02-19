"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/karcis.com/common/Footer";
import HomeHero from "@/components/karcis.com/home/hero.home.component";
import HotOfferEvent from "@/components/karcis.com/home/hotofferEvent.home.component";
import Navbar from "@/components/karcis.com/common/Navbar";
import ScrollToTop from "@/components/karcis.com/common/scrollTop";
import TopSellingEvent from "@/components/karcis.com/home/topsellingEvent.home.component";
import EventList from "@/components/karcis.com/home/listEvent.home.component";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/events/up-coming`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <HomeHero />
      <EventList title="Upcoming Events" />
      <HotOfferEvent />
      <TopSellingEvent />
      <ScrollToTop />
      <Footer />
    </div>
  );
}
