"use client";

import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

interface TicketProps {
  name: string;
  price: number;
  onQuantityChange: (name: string, quantity: number) => void;
}

const TicketCardTransaction: React.FC<{ ticket: TicketProps }> = ({
  ticket,
}) => {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    ticket.onQuantityChange(ticket.name, newQuantity);
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 text-center border border-[#4F4CEE] w-56 transition-all ${
        quantity > 0 ? "border-b-[6px] border-r-4 border-blue-500" : ""
      }`}
    >
      <h2 className="text-xl font-semibold">{ticket.name}</h2>
      <p className="text-lg font-bold mt-4">
        Rp. {ticket.price.toLocaleString()}
      </p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => handleQuantityChange(Math.max(quantity - 1, 0))}
          className="w-8 h-8 flex items-center justify-center border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100"
        >
          <FiMinus />
        </button>
        <span className="text-lg font-medium">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100"
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
};

export default TicketCardTransaction;
