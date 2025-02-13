"use client";

import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import FinalDetailTransaction from "@/components/karcis.com/transactions/finalDetailTrasanction.component";
import BackButton from "@/components/karcis.com/UI/buttonBack";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function TransactionSummary() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const ticketsQuery = searchParams.get("tickets");
  const selectedTickets = ticketsQuery ? JSON.parse(ticketsQuery) : {};
  const { slug } = useParams();

  const [eventData, setEventData] = useState({
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
    console.log("Tickets Query:", ticketsQuery);
    console.log("Parsed selectedTickets:", selectedTickets);

    if (!selectedTickets.id) {
      alert("Invalid ticket selection. Please try again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request with:", {
        userId: 1, // Gantilah dengan user ID yang valid
        eventId: eventData.id,
        ticketTypeId: selectedTickets.id,
        quantity: selectedTickets.quantity || 1,
        pointsUsed: 0,
        couponId: null,
        promotionId: null,
      });

      const response = await fetch("http://localhost:8000/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          eventId: eventData.id,
          ticketTypeId: selectedTickets.id,
          quantity: selectedTickets.quantity || 1,
          pointsUsed: 0,
          couponId: null,
          promotionId: null,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Transaction successfully created!");
      } else {
        alert(`Transaction failed: ${result.error}`);
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
      <NavbarAfterLogin />
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
