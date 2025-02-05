import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBarEvents from "../UI/searchBarEvents";

// Menambahkan tipe properti yang benar
interface NavbarEventsProps {
  onSearch: (
    query: string,
    startDate: Date | null,
    endDate: Date | null
  ) => void;
}

const NavbarEvents: FC<NavbarEventsProps> = ({ onSearch }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="w-full h-[74px] px-20 flex items-center justify-between">
        <div className="relative z-999">
          <Link href="/home">
            <Image src="/logo.png" width={170} height={100} alt="" />
          </Link>
        </div>

        <div className="flex mb-20 overflow-x-auto w-full gap-16 md:justify-center items-center">
          <SearchBarEvents onSearch={onSearch} /> {/* Pass the onSearch prop */}
        </div>

        <div className="flex gap-4">
          <Link
            href="#"
            className="w-[85px] h-[45px] p-1 flex items-center justify-center border-[2px] border-[#4F4CEE] rounded-md text-[#4F4CEE] font-medium"
          >
            Sign In
          </Link>
          <Link
            href="#"
            className="w-[85px] h-[45px] p-1 flex items-center justify-center rounded-md text-white bg-[#4F4CEE] font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarEvents;
