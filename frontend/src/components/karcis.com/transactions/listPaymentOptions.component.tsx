"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PaymentOptionsProps {
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>;
}

const PaymentOptions = ({ setSelectedPaymentMethod }: PaymentOptionsProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const optionsVirtualAccount = [
    { id: "bca", label: "BCA Virtual Account", logo: "/bca.png" },
    { id: "bni", label: "BNI Virtual Account", logo: "/bni.png" },
    {
      id: "mandiri",
      label: "Mandiri Virtual Account",
      logo: "/mandiri.png",
    },
  ];

  const optionsEWallet = [
    { id: "gopay", label: "Gopay", logo: "/gopay.png" },
    { id: "ovo", label: "OVO", logo: "/ovo.png" },
    {
      id: "linkaja",
      label: "Link Aja",
      logo: "/link-aja.png",
    },
    {
      id: "shopeepay",
      label: "Shopee Pay",
      logo: "/shopeepay.png",
    },
  ];

  useEffect(() => {
    const savedVoucherCode = localStorage.getItem("voucherCode");
    if (savedVoucherCode) {
      // You can use this voucher code to apply any needed logic
    }
  }, []);

  const handleSelection = (id: string) => {
    setSelected(id);
    setSelectedPaymentMethod(id); // Update the parent component's state
  };

  return (
    <div className="max-w-[630px] bg-white rounded-lg shadow-md p-4 space-y-3 flex flex-col gap-4">
      {/* Virtual Account Section */}
      <h3 className="text-xl font-semibold">Virtual Account</h3>
      {optionsVirtualAccount.map((optionVA) => (
        <label
          key={optionVA.id}
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
            selected === optionVA.id
              ? "border-b-4 border-r-4 border-[#4F4CEE]"
              : "hover:border-b-4 hover:border-r-4 hover:border-[#4F4CEE]"
          }`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="bank"
              value={optionVA.id}
              checked={selected === optionVA.id}
              onChange={() => handleSelection(optionVA.id)}
              className="w-5 h-5 text-[#4F4CEE]"
            />
            <span className="text-gray-700 font-medium">{optionVA.label}</span>
          </div>
          {optionVA.logo && (
            <Image
              src={optionVA.logo}
              alt={optionVA.label}
              width={80}
              height={80}
              className="h-6"
            />
          )}
        </label>
      ))}

      {/* E-Wallet Section Title */}
      <h3 className="text-xl font-semibold">Electronic Money</h3>

      {/* E-Wallet Section */}
      {optionsEWallet.map((optionEW) => (
        <label
          key={optionEW.id}
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
            selected === optionEW.id
              ? "border-b-4 border-r-4 border-[#4F4CEE]"
              : "hover:border-b-4 hover:border-r-4 hover:border-[#4F4CEE]"
          }`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="ewallet"
              value={optionEW.id}
              checked={selected === optionEW.id}
              onChange={() => handleSelection(optionEW.id)}
              className="w-5 h-5 text-[#4F4CEE]"
            />
            <span className="text-gray-700 font-medium">{optionEW.label}</span>
          </div>
          {optionEW.logo && (
            <Image
              src={optionEW.logo}
              alt={optionEW.label}
              width={75}
              height={75}
              className="h-6"
            />
          )}
        </label>
      ))}
    </div>
  );
};

export default PaymentOptions;
