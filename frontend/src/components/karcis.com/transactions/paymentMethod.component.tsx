"use client";

import React, { useState } from "react";
import { CloudUpload } from "lucide-react";
import Image from "next/image";

interface PaymentPlatformProps {
  setPaymentStatus: React.Dispatch<React.SetStateAction<string>>; // Function to change payment status
}

const PaymentPlatform = ({ setPaymentStatus }: PaymentPlatformProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileSubmit = () => {
    if (file) {
      // Change the payment status to "Waiting for Admin Confirmation"
      setPaymentStatus("Waiting for Admin Confirmation");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Payment Method:</h2>
        <Image
          src="/ovo.png"
          alt="OVO"
          width={75}
          height={75}
          className="h-6 mt-2"
        />

        <h3 className="mt-4 text-lg font-semibold">How to pay with OVO?</h3>
        <ol className="mt-2 text-sm list-decimal list-inside space-y-1">
          <li>Upload bukti pembayaran.</li>
          <li>Klik kirim notifikasi OVO.</li>
          <li>Buka notifikasi dari OVO di ponsel anda.</li>
          <li>Masukkan PIN anda.</li>
          <li>Klik bayar.</li>
        </ol>

        <label className="block mt-6 text-sm font-semibold">
          Upload Bukti Pembayaran
        </label>

        <div
          className="w-full mt-2 p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <CloudUpload className="w-10 h-10 text-gray-500" />
          <p className="mt-2 text-sm text-gray-500">
            {file ? file.name : "Klik untuk mengunggah atau seret file ke sini"}
          </p>
        </div>

        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          className={`w-full mt-4 py-2 rounded-md font-semibold ${
            file
              ? "bg-purple-600 text-white cursor-pointer"
              : "bg-purple-200 text-purple-500 cursor-not-allowed"
          }`}
          disabled={!file}
          onClick={handleFileSubmit} // Handle file submission
        >
          Kirim bukti pembayaran
        </button>

        <button className="w-full mt-2 text-blue-600 border border-blue-600 py-2 rounded-md font-semibold">
          Cek status pembayaran
        </button>
      </div>
    </div>
  );
};

export default PaymentPlatform;
