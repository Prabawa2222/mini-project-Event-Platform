import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBarEvents from "../UI/searchBarEvents";
import { IoMenu, IoClose } from "react-icons/io5";

interface NavbarEventsProps {
  onSearch: (
    query: string,
    startDate: Date | null,
    endDate: Date | null
  ) => void;
}

const NavbarEvents: FC<NavbarEventsProps> = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="w-full h-[74px] px-6 md:px-20 flex items-center justify-center relative">
        {/* Logo */}
        <div className="absolute left-4 md:left-20">
          <Link href="/">
            <Image src="/logo.png" width={150} height={80} alt="Logo" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-[900px]">
          <SearchBarEvents onSearch={onSearch} />
        </div>

        {/* Sign In & Sign Up */}
        <div className="absolute right-4 md:right-20 hidden md:flex gap-4">
          <Link
            href="#"
            className="w-[85px] h-[45px] flex items-center justify-center border-[2px] border-[#4F4CEE] rounded-md text-[#4F4CEE] font-medium"
          >
            Sign In
          </Link>
          <Link
            href="#"
            className="w-[85px] h-[45px] flex items-center justify-center rounded-md text-white bg-[#4F4CEE] font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarEvents;
