"use client";

import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import FinalDetailTransaction from "@/components/karcis.com/transactions/finalDetailTrasanction.component";
import PaymentPlatform from "@/components/karcis.com/transactions/paymentMethod.component";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentProcesses() {
  const [paymentStatus, setPaymentStatus] = useState<string>(
    "Waiting for Payment"
  );
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60 * 60); // 2 hours in seconds
  const [deadline, setDeadline] = useState<string>("");
  const router = useRouter();

  const updateDeadline = () => {
    const now = new Date();
    const deadlineTime = new Date(now.getTime() + 5 * 60 * 60 * 1000); // 2 hours from now
    const hours = deadlineTime.getHours();
    const minutes = deadlineTime.getMinutes();
    const formattedDeadline = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setDeadline(formattedDeadline);
  };

  useEffect(() => {
    updateDeadline(); // Initial deadline calculation

    const interval = setInterval(() => {
      if (paymentStatus === "Waiting for Admin Confirmation") {
        clearInterval(interval); // Stop the countdown if status is "Waiting for Admin Confirmation"
        return;
      }

      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval); // Stop the countdown when time reaches 0
          setPaymentStatus("Payment Time Expired");
          router.push("/events/transactions/successes"); // Redirect to success page
          return 0;
        }
        return prevTime - 1; // Decrease by 1 second
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [paymentStatus, router]); // Add paymentStatus to dependencies to stop interval when status changes

  useEffect(() => {
    // Recalculate deadline and reset the countdown when the page is refreshed
    updateDeadline();
  }, [paymentStatus]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen flex flex-col gap-20">
      <NavbarAfterLogin />
      <div className="flex flex-col items-center">
        <div className="w-[80%] flex flex-col items-center mt-28">
          <h1
            className={`text-3xl font-semibold ${
              paymentStatus === "Waiting for Admin Confirmation"
                ? "text-orange-500"
                : "text-black"
            }`}
          >
            {paymentStatus}
          </h1>

          {/* Dynamically change background color */}
          <div
            className={`w-[628px] h-12 flex items-center justify-center bg-opacity-60 mt-4 ${
              paymentStatus === "Waiting for Admin Confirmation"
                ? "bg-yellow-300 bg-opacity-40"
                : "bg-[#FBDFDF]"
            }`}
          >
            <p
              className={`w-4/5 text-sm text-center ${
                paymentStatus === "Waiting for Admin Confirmation"
                  ? "text-orange-500"
                  : "text-[#EB5757]"
              }`}
            >
              {paymentStatus === "Waiting for Admin Confirmation"
                ? "Please wait for admin confirmation!"
                : `Please complete this payment before ${deadline} WIB`}
            </p>
          </div>
          {/* Show remaining time only if payment status is not "Waiting for Admin Confirmation" */}
          {paymentStatus !== "Waiting for Admin Confirmation" && (
            <div className="mt-2">
              <p className="text-lg font-semibold text-red-600">
                Time Remaining: {formatTime(timeLeft)}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="w-[80%] mx-[165px] flex gap-10">
        <div className="w-[50%]">
          <PaymentPlatform setPaymentStatus={setPaymentStatus} />
        </div>
        <div className="w-[50%]">
          <FinalDetailTransaction />
        </div>
      </div>
    </div>
  );
}
