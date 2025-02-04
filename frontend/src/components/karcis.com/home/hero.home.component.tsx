"use client";
import Image from "next/image";
import SearchBar from "../UI/searchBar";

export default function HomeHero() {
  return (
    <div className="w-full pt-[74px] relative">
      {/* Hero Section */}
      <div className="w-full h-[400px] flex justify-center items-center relative">
        <Image
          src="/hero.png"
          width={2000}
          height={100}
          alt="Hero Image"
          className="absolute object-cover w-full h-full"
        />
        <h1 className="text-[#4F4CEE] font-bold z-10 pb-36 text-6xl text-center">
          Exclusive event, priceless moments
        </h1>
      </div>

      {/* Search Bar Section */}
      <SearchBar />
    </div>
  );
}
