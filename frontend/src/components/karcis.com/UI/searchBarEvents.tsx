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
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(query, startDate, endDate);
  };

  return (
    <div className="relative flex justify-center w-full">
      <div className="relative flex items-center w-full max-w-[990px] h-[45px] md:h-[50px] px-4 md:px-5 border-2 border-black rounded-md bg-white shadow-md focus-within:border-[#4F4CEE]">
        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search events, name, location..."
          className="flex-1 px-2 md:px-4 py-1 md:py-2 outline-none text-black placeholder-gray-400 text-sm md:text-base"
        />

        {/* Divider */}
        <div className="hidden md:block w-[1px] h-[40px] bg-gray-300 mx-4"></div>

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
          className="ml-auto flex items-center gap-2 bg-[#4F4CEE] text-white px-3 md:px-4 py-1 md:py-2 rounded-md hover:bg-[#3d3bce] text-sm md:text-base"
          onClick={handleSearchSubmit}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBarEvents;
