import Link from "next/link";
import React from "react";

const FooterCreateEvent: React.FC<{ isDisabled: boolean }> = ({
  isDisabled,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-between items-center p-4 border-t border-gray-300 bg-white px-20">
      <p className="text-gray-700 text-lg">
        <span className="font-bold">Yeay!</span> Tinggal selangkah lagi dan
        event kamu berhasil dibuat.
      </p>
      <Link href="/events">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isDisabled}
        >
          Buat Event Sekarang
        </button>
      </Link>
    </div>
  );
};

export default FooterCreateEvent;
