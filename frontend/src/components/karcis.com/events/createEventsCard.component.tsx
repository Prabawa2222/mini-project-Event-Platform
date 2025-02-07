"use client";

import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateString);
  return `${days[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
};

const CreateEventForm: React.FC<{
  setIsEventValid: (valid: boolean) => void;
}> = ({ setIsEventValid }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleImageRemove = () => setImage(null);

  useEffect(() => {
    setIsEventValid(
      !!eventName &&
        !!category &&
        !!startDate &&
        !!endDate &&
        !!location &&
        !!description
    );
  }, [
    eventName,
    category,
    startDate,
    endDate,
    location,
    description,
    setIsEventValid,
  ]);

  return (
    <div className="w-[50%] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full h-72 bg-gray-200 flex flex-col items-center justify-center">
        <label htmlFor="imageUpload" className="cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: image
                ? `url(${image})`
                : `url('/your-placeholder-image.png')`,
            }}
          ></div>
          {!image && (
            <div className="relative flex flex-col items-center">
              <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-md">
                <span className="text-gray-500 text-xl">+</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                Unggah gambar/poster/banner
              </p>
              <p className="text-xs text-gray-500">
                Direkomendasikan 724 x 340px dan tidak lebih dari 2Mb
              </p>
            </div>
          )}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {image && (
          <button
            onClick={handleImageRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
          >
            <FaTrashAlt className="w-6 h-6 text-red-500" />
          </button>
        )}
      </div>
      <div className="p-6">
        <label className="block text-gray-600 text-sm font-semibold">
          Nama Event*
        </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full mt-1 px-4 py-2 border rounded-md"
          placeholder="Masukkan nama event"
        />

        <label className="block mt-4 text-gray-600 text-sm font-semibold">
          Pilih Kategori*
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mt-1 px-4 py-2 border rounded-md"
        >
          <option value="">Pilih Kategori</option>
          <option value="concert">Concert</option>
          <option value="arts">Arts</option>
          <option value="conference">Conference</option>
          <option value="movies">Movies</option>
        </select>

        <div className="mt-4 flex items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/profile-default.png"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700">Ghifarialdhy RN</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-semibold">
            Tanggal Event*
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-2 text-center text-gray-700">
              <span className="text-sm font-semibold">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
              <p className="mt-2 text-sm font-medium">
                {formatDate(startDate)}
              </p>
            </div>
            <div className="border rounded-md p-2 text-center text-gray-700">
              <span className="text-sm font-semibold">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-md mt-2"
              />
              <p className="mt-2 text-sm font-medium">{formatDate(endDate)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-semibold">
            Lokasi
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-semibold">
            Deskripsi Event
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
