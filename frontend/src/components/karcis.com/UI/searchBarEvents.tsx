// searchBarEvents.tsx

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import DatePickerComponent from "./datePicker";

interface SearchBarEventsProps {
  onSearch: (
    query: string,
    startDate: Date | null,
    endDate: Date | null
  ) => void;
}

const SearchBarEvents = ({ onSearch }: SearchBarEventsProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // Local state for search input

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(query, startDate, endDate);
  };

  return (
    <div className="relative flex justify-center mt-20 z-10">
      <div className="relative flex items-center w-[990px] h-[50px] px-5 border-2 border-black rounded-md bg-white shadow-md focus-within:shadow-[#4F4CEE] focus-within:shadow-2xl focus-within:border-[#4F4CEE]">
        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
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
        <button
          className="ml-auto flex items-center gap-2 bg-[#4F4CEE] text-white px-4 py-2 rounded-md hover:bg-[#3d3bce]"
          onClick={handleSearchSubmit} // Trigger search on button click
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBarEvents;
