"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession
import Navbar from "@/components/karcis.com/common/Navbar";
import FinalDetailTransaction from "@/components/karcis.com/transactions/finalDetailTrasanction.component";
import BackButton from "@/components/karcis.com/UI/buttonBack";

export default function TransactionSummary() {
  const { data: session } = useSession(); // Ambil data session
  const userId = session?.user?.id; // Ambil userId dari session

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const ticketsQuery = searchParams.get("tickets");
  const selectedTickets = ticketsQuery ? JSON.parse(ticketsQuery) : {};
  const { slug } = useParams();

  const [eventData, setEventData] = useState<{
    id: string;
    name: string;
    location: string;
    startDate: string;
    imageUrl: string;
    ticketTypes: { id: any; name: string; price: number }[];
  }>({
    id: "",
    name: "",
    location: "",
    startDate: "",
    imageUrl: "",
    ticketTypes: [],
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/events/${slug}`)
      .then((res) => res.json())
      .then((data) => setEventData(data.event || data))
      .catch((err) => console.error("Failed to fetch event data", err));
  }, [slug]);

  const handlePayment = async () => {
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    if (Object.keys(selectedTickets).length === 0) {
      alert("Invalid ticket selection. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const ticketEntries = Object.entries(selectedTickets)
        .map(([name, quantity]) => {
          const ticket = eventData.ticketTypes.find((t) => t.name === name);
          return ticket ? { ticketTypeId: ticket.id, quantity } : null;
        })
        .filter(
          (ticket): ticket is { ticketTypeId: any; quantity: unknown } =>
            ticket !== null
        );

      if (ticketEntries.length === 0) {
        alert("Invalid ticket selection. Please try again.");
        return;
      }

      const transactions = ticketEntries.map(
        async ({ ticketTypeId, quantity }) => {
          return fetch("http://localhost:8000/api/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              eventId: eventData.id,
              ticketTypeId,
              quantity,
              pointsUsed: 0,
              couponId: null,
              promotionId: null,
            }),
          });
        }
      );

      const results = await Promise.all(transactions);
      const responses = await Promise.all(results.map((res) => res.json()));

      if (results.every((res) => res.ok)) {
        alert("Transaction successfully created!");
      } else {
        alert(
          `Transaction failed: ${responses.map((res) => res.error).join(", ")}`
        );
      }
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Failed to create transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-[80%] min-h-screen flex flex-col items-center justify-center mx-auto mt-28 gap-10">
        <div className="w-[50%] h-[50px] flex items-center gap-10">
          <BackButton href="/events" />
          <span className="text-3xl font-semibold">Transaction Summary</span>
        </div>

        <div className="w-full flex flex-col gap-10 items-center">
          <div className="w-[628px] h-16 bg-[#4F4CEE] flex items-center justify-center bg-opacity-10 p-9">
            <p className="text-base text-[#4F4CEE]">
              Please do the payment on your dashboard!
            </p>
          </div>

          <FinalDetailTransaction
            eventData={eventData}
            selectedTickets={selectedTickets}
          />

          <div className="flex justify-center mt-16">
            <button
              onClick={handlePayment}
              className={`px-10 py-2 text-white rounded-md transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4F4CEE] hover:opacity-90 hover:scale-105 hover:shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
