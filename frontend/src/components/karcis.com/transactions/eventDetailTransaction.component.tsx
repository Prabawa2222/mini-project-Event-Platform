"use client";

import { useState, useEffect } from "react";
import HeroTransaction from "./heroTrasaction";

const EventDetailTransaction = () => {
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(500000); // Initial total price
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0); // Discount applied by voucher

  // Load voucher from localStorage when the component mounts
  useEffect(() => {
    const savedVoucherCode = localStorage.getItem("voucherCode");
    // if (savedVoucherCode) {
    //   setVoucherCode(savedVoucherCode);
    //   applyVoucher(savedVoucherCode);
    // }
  }, []);

  // Handle voucher code input
  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  // Apply voucher discount (example: 10% off for voucher code "DISCOUNT10")
  const applyVoucher = (code: string) => {
    if (code === "DISCOUNT10") {
      setVoucherDiscount(0.1); // 10% discount
    } else {
      setVoucherDiscount(0);
    }
    localStorage.setItem("voucherCode", code); // Save to localStorage
  };

  // Calculate the new total after applying the voucher
  const finalTotal = totalPrice - totalPrice * voucherDiscount;

  return (
    <div className="w-[471px] h-[500px] flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Event Detail</h1>
      <div className="w-full px-4 flex justify-start">
        <HeroTransaction />
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />

      <h1 className="text-xl font-semibold mt-1">Event Detail</h1>
      <div className="w-full px-4 flex justify-between">
        <p>Ticket Type</p>
        <p className="font-semibold">2 X Paket VIP</p>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />

      <h1 className="text-xl font-semibold mt-1">Event Detail</h1>
      <div className="w-full px-4 flex justify-between">
        <p>Ticket Price</p>
        <p className="font-semibold">2 X Rp.250.000</p>
      </div>

      {/* Voucher Section */}
      <div className="w-full px-4 py-4 bg-gray-100 rounded-lg mt-4 flex flex-col gap-2">
        <label className="text-sm font-semibold">Voucher Code</label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={voucherCode}
            onChange={handleVoucherChange}
            placeholder="Enter voucher code"
            className="w-full border-2 border-[#7F7DF3] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F7DF3] placeholder-gray-400"
          />
          <button
            onClick={() => applyVoucher(voucherCode)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Apply
          </button>
        </div>
        {voucherDiscount > 0 && (
          <div className="text-sm text-green-600 mt-2">
            <p>Voucher Applied: - Rp. {totalPrice * voucherDiscount}</p>
          </div>
        )}
      </div>

      <div className="w-full px-4 flex justify-between mt-4">
        <p>Admin Fee</p>
        <p className="font-semibold">-</p>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />

      <div className="w-full px-4 flex justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">Rp. {finalTotal.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default EventDetailTransaction;
