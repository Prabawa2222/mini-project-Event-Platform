"use client";

import { useState, useEffect } from "react";
import HeroTransaction from "./heroTrasaction";

const FinalDetailTransaction = () => {
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(500000); // Initial total price
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0); // Discount applied by voucher

  // Load voucher from localStorage when the component mounts
  useEffect(() => {
    const savedVoucherCode = localStorage.getItem("voucherCode");
    if (savedVoucherCode) {
      setVoucherCode(savedVoucherCode);
      applyVoucher(savedVoucherCode);
    }
  }, []);

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
    <div className="w-[471px] h-[500px] flex flex-col gap-3">
      <h1 className="text-xl font-semibold">Event Detail</h1>
      <div className="w-full px-4 flex justify-start">
        <HeroTransaction />
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-1" />

      <h1 className="text-xl font-semibold">Ticket Information</h1>
      <div className="w-full px-4 flex justify-between">
        <p>Ticket Type</p>
        <p className="font-semibold">2 X Paket VIP</p>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-1" />

      <h1 className="text-xl font-semibold">Price Details</h1>
      <div className="w-full px-4 flex justify-between">
        <p>Ticket Price</p>
        <p className="font-semibold">2 X Rp.250.000</p>
      </div>

      {/* Voucher Section */}
      {voucherDiscount > 0 && (
        <div className="w-full px-3 py-2 bg-green-100 rounded-md flex flex-col gap-1 text-xs">
          <label className="font-semibold text-green-700">
            Voucher Applied
          </label>
          <div className="flex justify-between items-center">
            <p className="text-green-700 font-medium">{voucherCode}</p>
            <p className="text-green-700">
              - Rp. {totalPrice * voucherDiscount}
            </p>
          </div>
        </div>
      )}

      <div className="w-full px-4 flex justify-between">
        <p>Admin Fee</p>
        <p className="font-semibold">-</p>
      </div>
      <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-1" />

      <div className="w-full px-4 flex justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">Rp. {finalTotal.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FinalDetailTransaction;
