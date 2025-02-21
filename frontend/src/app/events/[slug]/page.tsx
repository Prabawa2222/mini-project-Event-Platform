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
import Image from "next/image";

interface EventType {
  id: number;
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

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
    profilePicture: string | null;
  };
}

export default function GetEventBySlug() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop();
  console.log("Slug from URL:", slug);

  const [event, setEvent] = useState<EventType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`http://localhost:8000/api/events/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Event data:", data); // Debugging

          if (data.ticketTypes && data.ticketTypes.length > 0) {
            const minPrice = Math.min(
              ...data.ticketTypes.map((ticket: any) => ticket.price)
            );
            console.log("Minimum Ticket Price:", minPrice); // Debugging
            data.price = minPrice;
          } else {
            data.price = 0; // Default Gratis jika tidak ada tiket
          }

          setEvent(data);
          return data.id;
        })
        .then((eventId) => {
          if (eventId) {
            fetch(`http://localhost:8000/api/review/event/${eventId}`)
              .then((res) => res.json())
              .then((data) => {
                setReviews(data);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching reviews:", error);
                setLoading(false);
              });
          }
        })
        .catch((error) => console.error("Error fetching event:", error));
    }
  }, [slug]);

  if (!event) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="w-full max-w-[1100px] min-h-screen mx-auto mt-40 px-4 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-[5%] flex md:block justify-center">
          <ShareButtons />
        </div>
        <div className="w-full md:w-[86%]">
          <div className="mb-4">
            <BackButton href="/events" />
          </div>
          <Banner imageUrl={event.imageUrl} />
          <div className="w-full max-w-[1100px] mt-10 md:mt-20 flex flex-col md:flex-row justify-between gap-6">
            <DetailEvent event={event} />
            <BuyTicketCard
              price={event.price}
              href={`/events/tickets/${slug}`}
            />
          </div>
          <EventInfo event={event} />

          {/* ✅ Review Section */}
          <div className="mt-10 p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b py-4">
                  <div className="flex items-center gap-3">
                    {review.user.profilePicture ? (
                      <Image
                        src={review.user.profilePicture}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <div className="flex text-yellow-500">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Belum ada review untuk event ini.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
