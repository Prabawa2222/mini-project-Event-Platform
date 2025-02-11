"use client";

import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface CreateEventFormProps {
  setIsEventValid: (valid: boolean) => void;
  setEventData: (data: any) => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  setIsEventValid,
  setEventData,
}) => {
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  useEffect(() => {
    const isValid =
      !!eventName &&
      !!category &&
      !!startDate &&
      !!endDate &&
      !!location &&
      !!description;
    setIsEventValid(isValid);

    setEventData({
      eventName,
      category,
      startDate,
      endDate,
      location,
      description,
      image: selectedFile,
    });
  }, [
    eventName,
    category,
    startDate,
    endDate,
    location,
    description,
    selectedFile,
    setIsEventValid,
    setEventData,
  ]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", eventName);
    formData.append("category", category);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("location", location);
    formData.append("description", description);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const result = await response.json();
      console.log("Event Created:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-[50%] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full h-72 bg-gray-200 flex flex-col items-center justify-center">
        <label htmlFor="imageUpload" className="cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: previewImage
                ? `url(${previewImage})`
                : `url('/your-placeholder-image.png')`,
            }}
          ></div>
          {!previewImage && (
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
        {previewImage && (
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

        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-semibold">
            Tanggal Event*
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
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
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Submit Event
        </button>
      </div>
    </div>
  );
};

export default CreateEventForm;
