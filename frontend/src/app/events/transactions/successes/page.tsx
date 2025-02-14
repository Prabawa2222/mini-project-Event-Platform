import Footer from "@/components/karcis.com/common/Footer";
import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Successes() {
  return (
    <div>
      <NavbarAfterLogin />
      <div className="w-full min-h-screen flex flex-col items-center justify-center mb-[-270px]">
        <div className="w-80 bg-white p-4 rounded-md border border-b-4 border-r-4 border-[#4F4CEE] ">
          <p className="text-center text-4xl font-bold text-[#4F4CEE]">
            Completed!
          </p>
        </div>
        <div className="w-100 mt-2">
          <Image src="/success.png" alt="Success" width={400} height={100} />
        </div>
        <div className="flex flex-col items-center mt-5 gap-2">
          <p className="text-2xl">Tickets have been sent to</p>
          <p className="text-lg text-[#4F4CEE]">your email address</p>
        </div>
        <div className="flex flex-col items-center mt-5 gap-2">
          <Link href="/events">
            <button className="w-full mt-2 py-3 px-6 text-white bg-blue-600 border border-blue-600 rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Explore more events
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center mt-32 gap-10">
          <p className="text-sm">Having trouble receiving the ticket?</p>
          <div className="flex gap-24">
            <p className="text-sm flex gap-2 text-[#4F4CEE] items-center">
              <FaPhoneAlt />
              <span>+62 812-3456-7890</span>
            </p>
            <p className="text-sm flex gap-2 text-[#4F4CEE] items-center">
              <HiOutlineMail className="text-xl" />
              <span>1Bc8o@example.com</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
