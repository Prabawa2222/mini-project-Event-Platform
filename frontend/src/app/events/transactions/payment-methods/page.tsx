"use client";

import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";

import PaymentOptions from "@/components/karcis.com/transactions/listPaymentOptions.component";
import BackButton from "@/components/karcis.com/UI/buttonBack";
import { useState } from "react";
import Link from "next/link";
import FinalDetailTransaction from "@/components/karcis.com/transactions/finalDetailTrasanction.component";

export default function PaymentMethods() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const isFormValid = selectedPaymentMethod !== null;

  return (
    <div>
      <NavbarAfterLogin />
      <div className="w-[80%] min-h-screen flex flex-col mx-auto mt-40 gap-10">
        <div className="w-[50%] h-[50px] flex items-center gap-16">
          <BackButton href="/events/transactions" />
          <span className="text-3xl font-semibold">Payment Method</span>
        </div>
        <div className="w-full h-[50px] ml-28 flex flex-col gap-10">
          <div className="w-full h-16 flex gap-[93px]">
            <div className="w-[628px] h-16 bg-[#4F4CEE] flex items-center bg-opacity-10  p-9">
              <p className="w-4/5 text-sm text-[#4F4CEE]">
                E-tickets will be sent to your email address, please make sure
                your email address is correct
              </p>
            </div>
            <div className="flex flex-col gap-10">
              <FinalDetailTransaction />
              {/* Pay Now Button */}
              <div className="col-span-2 flex justify-center">
                <Link href="/events/transactions/payment-processes">
                  <button
                    className={`px-10 py-2 text-white rounded-md transition-all duration-300 ${
                      isFormValid
                        ? "bg-[#4F4CEE] hover:opacity-90 hover:scale-105 hover:shadow-lg"
                        : "bg-[#DADAFB] cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                  >
                    Pay Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-[655px]">
            <PaymentOptions
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
