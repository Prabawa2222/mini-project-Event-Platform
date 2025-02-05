"use client";

import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { formatDate } from "../utils/formatDate";

import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DatePickerComponent({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  open,
  setOpen,
}: DatePickerProps) {
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Handle perubahan tanggal
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setOpen(false);
    }
  };

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Input Select Date */}
      <div
        className="flex-1 flex items-center gap-2 cursor-pointer relative"
        onClick={() => setOpen(true)}
      >
        <span className="text-xl">📅</span>
        <span className={startDate && endDate ? "text-black" : "text-gray-500"}>
          {startDate && endDate
            ? `${formatDate(startDate)} → ${formatDate(endDate)}`
            : "Select date"}
        </span>
      </div>

      {/* Overlay & Dropdown DatePicker */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          ></div>

          {/* Dropdown DatePicker */}
          <div
            ref={datePickerRef}
            className="fixed top-[110px] left-[950px] transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg border rounded-md p-6 z-50 mt-24"
          >
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
            />
          </div>
        </>
      )}
    </>
  );
}
