import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="w-full h-[74px] px-20 flex items-center justify-between">
        <div>
          <Link href="/home">
            <Image src="/logo.png" width={170} height={100} alt="" />
          </Link>
        </div>

        <div className="flex p-4 overflow-x-auto w-full gap-16 md:justify-center items-center">
          <Link href="#" className="text-black text-nowrap">
            Concert
          </Link>
          <Link href="#" className="text-black text-nowrap">
            Arts
          </Link>
          <Link href="#" className="text-black text-nowrap">
            Conference
          </Link>
          <Link href="#" className="text-black text-nowrap">
            Movie
          </Link>
          <Link href="#" className="text-black text-nowrap">
            International
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="w-[85px] h-[45px] p-1 flex items-center justify-center border-[2px] border-[#4F4CEE] rounded-md text-[#4F4CEE] font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="w-[85px] h-[45px] p-1 flex items-center justify-center rounded-md text-white bg-[#4F4CEE] font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
