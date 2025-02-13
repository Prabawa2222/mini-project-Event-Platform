"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FormTransactionProps {
  selectedTickets: { [key: string]: number };
}

const FormTransaction: React.FC<FormTransactionProps> = ({
  selectedTickets,
}) => {
  const { slug } = useParams(); // Mengambil slug dari URL
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phoneNumber: "",
  });

  // Cek apakah semua input telah diisi
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceed = () => {
    if (!isFormValid) return;

    router.push(
      `/events/transactions/${slug}/transaction-summary?tickets=${encodeURIComponent(
        JSON.stringify(selectedTickets)
      )}`
    );
  };

  // Konversi selectedTickets ke JSON string agar bisa dikirim sebagai query parameter
  const ticketsQuery = encodeURIComponent(JSON.stringify(selectedTickets));

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      <div>
        <label className="block text-sm">First Name</label>
        <input
          type="text"
          name="firstName"
          placeholder="Budi"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border-2 border-black p-2 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm">Last Name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Yanto"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border-2 border-black p-2 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="budiyanto@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border-2 border-black p-2 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm">Confirm Email Address</label>
        <input
          type="email"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          className="w-full border-2 border-black p-2 rounded-md"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="08212345671"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border-2 border-black p-2 rounded-md"
        />
      </div>

      {/* Tombol Submit */}
      <div className="col-span-2 flex justify-center mt-4">
        <button
          onClick={handleProceed}
          className={`px-6 py-2 text-white rounded-md transition-all duration-300 ${
            isFormValid
              ? "bg-[#4F4CEE] hover:opacity-90 hover:scale-105 hover:shadow-lg"
              : "bg-[#DADAFB] cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default FormTransaction;
