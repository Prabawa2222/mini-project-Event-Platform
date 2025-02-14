import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageSrc: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  isOnline: boolean;
  description: string;
  slug: string; // Tambahkan slug
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

// Helper function to limit description length (5-10 words)
const truncateDescription = (text: string) => {
  const words = text.split(" ");
  return words.slice(0, 10).join(" ") + (words.length > 10 ? "..." : "");
};

const Card: React.FC<CardProps> = ({
  imageSrc,
  title,
  date,
  location,
  price,
  category,
  isOnline,
  description,
  slug, // Gunakan slug dari API
}) => {
  return (
    <div className="p-4">
      <div className="w-full max-w-[320px] bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden cursor-pointer relative">
        {/* Image Section */}
        <div className="relative w-full h-[180px]">
          <Image
            src={imageSrc}
            width={320}
            height={180}
            alt="Event Image"
            className="object-cover w-full h-full rounded-t-lg"
          />
          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
            {category}
          </div>
          {/* Online/Offline Badge */}
          <div
            className={`absolute top-2 right-2 text-xs font-semibold px-3 py-1 rounded-md ${
              isOnline ? "bg-green-500" : "bg-gray-500"
            } text-white`}
          >
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col gap-3 h-[270px]">
          {/* Date Section */}
          <div className="flex flex-col items-start bg-gradient-to-r from-blue-500 to-blue-300 text-white p-2 rounded-md">
            <p className="text-sm font-semibold">{formatDate(date)}</p>
          </div>

          {/* Event Title */}
          <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition-all">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600">
            {truncateDescription(description)}
          </p>

          {/* Location & Price */}
          <div className="flex flex-col gap-4">
            <p className="font-medium text-sm text-gray-700">{location}</p>
            <p className="font-semibold text-lg text-blue-600 text-right">
              {price}
            </p>
          </div>

          {/* View Details Button */}
          <div className="flex-grow flex items-end justify-end mt-2">
            <Link
              href={`/events/${slug}`} // Gunakan slug dari API
              className="text-sm text-blue-500 font-semibold hover:underline"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
