import Image from "next/image";
import Link from "next/link";

export default function NavbarAfterLogin() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="w-full h-[74px] px-20 flex items-center justify-between">
        <div>
          <Link href="/home">
            <Image src="/logo.png" width={170} height={100} alt="Logo" />
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

        <div className="w-[150px] flex items-center gap-4">
          <Image
            src="/profile-default.png"
            alt="User Profile"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-sm font-medium text-gray-800">John Doe</span>
        </div>
      </div>
    </div>
  );
}
