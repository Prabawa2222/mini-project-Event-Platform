"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Definisikan tipe User
type User = {
  name: string;
  profilePicture: string;
};

export default function Navbar() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/profile?userId=" + session?.user.id,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Gagal mengambil data pengguna");
        const data = await response.json();

        setUser({
          name: data.name || "User",
          profilePicture: data.profilePicture || "/profile-default.png",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    if (session?.user) {
      setUser({
        name: session.user.name || "User",
        profilePicture: session.user.image || "/profile-default.png",
      });
    } else {
      fetchUserProfile();
    }
  }, [session]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="w-full h-[74px] px-6 md:px-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" width={170} height={100} alt="Logo" />
        </Link>

        {/* Menu untuk Desktop & Mobile */}
        <div className="hidden md:flex p-4 gap-16 items-center">
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

        {/* Menu Mobile (Hamburger) */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>

        {/* Dropdown Mobile */}
        {menuOpen && (
          <div className="absolute top-[74px] left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center py-4">
            <Link href="#" className="py-2 text-black">
              Concert
            </Link>
            <Link href="#" className="py-2 text-black">
              Arts
            </Link>
            <Link href="#" className="py-2 text-black">
              Conference
            </Link>
            <Link href="#" className="py-2 text-black">
              Movie
            </Link>
            <Link href="#" className="py-2 text-black">
              International
            </Link>
          </div>
        )}

        {/* Profile/User Info */}
        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Image
                src={user.profilePicture}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="hidden md:block text-sm font-medium text-gray-800">
                {user.name}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                  <Image
                    src={user.profilePicture}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">Member</p>
                  </div>
                </div>

                {/* Menu Items */}
                <Link
                  href="/customer/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex gap-4">
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
        )}
      </div>

      {/* Tombol login/register untuk mobile */}
      {!user && (
        <div className="md:hidden flex justify-center gap-4 py-4 bg-white shadow-md">
          <Link
            href="/login"
            className="w-[85px] h-[45px] flex items-center justify-center border-[2px] border-[#4F4CEE] rounded-md text-[#4F4CEE] font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="w-[85px] h-[45px] flex items-center justify-center rounded-md text-white bg-[#4F4CEE] font-medium"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
