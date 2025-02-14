"use client";

import React, { useEffect, useState } from "react";
import TicketCard from "./ticketCard.component";

export interface Ticket {
  id: number;
  name: string;
  description: string;
  amount: number;
  price: number;
}

const TicketCategory: React.FC<{
  setIsTicketValid: (valid: boolean) => void;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>; // Tambahkan setTickets sebagai prop
  tickets: Ticket[]; // Tambahkan tickets sebagai prop agar state berasal dari parent
}> = ({ setIsTicketValid, setTickets, tickets }) => {
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketAmount, setTicketAmount] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);

  const handleOpen = (ticketType: string) => {
    setSelectedTicket(ticketType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTicket("");
    setTicketName("");
    setTicketDescription("");
    setTicketAmount(0);
    setTicketPrice(0);
  };

  const handleSave = () => {
    const newTicket: Ticket = {
      id: Date.now(),
      name: ticketName,
      description: ticketDescription,
      amount: ticketAmount,
      price: ticketPrice,
    };

    setTickets((prevTickets) => [...prevTickets, newTicket]); // Gunakan state updater dari parent
    handleClose();
  };

  const handleDelete = (id: number) => {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.id !== id)
    );
  };

  useEffect(() => {
    setIsTicketValid(tickets.length > 0);
  }, [tickets, setIsTicketValid]);

  return (
    <div className="p-6 bg-white w-full max-w-4xl mx-auto mt-2 mb-20">
      <div className="text-center font-semibold text-black text-lg mb-4">
        KATEGORI TIKET
      </div>
      <div className="flex items-center gap-4">
        {["Berbayar", "Bayar Sesukamu", "Gratis"].map((ticket) => (
          <div
            key={ticket}
            className="relative flex items-center w-1/3 bg-white text-gray-700 p-6 rounded-xl shadow-lg border hover:bg-blue-500 border-gray-300 group transition"
          >
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-10 w-2 bg-gray-300 rounded-full group-hover:white"></div>
            <div className="flex-1 text-left group-hover:text-white">
              <p className="text-sm">Buat Tiket</p>
              <p className="text-lg font-bold">{ticket}</p>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-400 rounded-full group-hover:border-white"
              onClick={() => handleOpen(ticket)}
            >
              <span className="text-gray-500 text-xl group-hover:text-white">
                +
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-lg font-semibold">
            DETAIL TIKET {selectedTicket.toUpperCase()}
          </h2>
          <div className="space-y-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama Tiket *
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Maksimal 50 karakter"
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Masukkan deskripsi tiket"
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700">
              Jumlah Tiket
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="0"
              value={ticketAmount === 0 ? "" : ticketAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, "");
                setTicketAmount(value === "" ? 0 : Number(value));
              }}
            />

            <label className="block text-sm font-medium text-gray-700">
              Harga
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Rp0"
              value={`Rp. ${ticketPrice}`}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, "");
                setTicketPrice(Number(value));
              }}
            />
            <div className="flex gap-4 mt-4">
              <button
                className={`w-1/2 p-2 rounded transition-all duration-300 ease-in-out ${
                  !ticketName ||
                  !ticketDescription ||
                  !ticketAmount ||
                  !ticketPrice
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#4F4CEE] text-white hover:bg-[#3d3ac7]"
                }`}
                onClick={handleSave}
                disabled={
                  !ticketName ||
                  !ticketDescription ||
                  !ticketAmount ||
                  !ticketPrice
                }
              >
                SIMPAN
              </button>

              <button
                className="w-1/2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                onClick={handleClose}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <div className="mt-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default TicketCategory;
