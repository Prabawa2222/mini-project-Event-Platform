import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import DatePickerComponent from "./datePicker";

export default function SearchBar() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-full flex justify-center">
      <div className="relative flex items-center w-[990px] h-[65px] px-5 border-2 border-black rounded-md bg-white shadow-md focus-within:shadow-[#4F4CEE] focus-within:shadow-2xl focus-within:border-[#4F4CEE]">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by events, name, location, and more"
          className="flex-1 px-4 py-2 outline-none text-black placeholder-gray-400"
        />

        {/* Divider */}
        <div className="w-[1px] h-[40px] bg-gray-300 mx-4"></div>

        {/* Select Date */}
        <DatePickerComponent
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          open={open}
          setOpen={setOpen}
        />

        {/* Search Button */}
        <button className="ml-auto flex items-center gap-2 bg-[#4F4CEE] text-white px-4 py-2 rounded-md hover:bg-[#3d3bce]">
          <FaSearch />
          Search
        </button>
      </div>
    </div>
  );
}
